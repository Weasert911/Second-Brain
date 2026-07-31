const API_BASE = "/api";

let authToken = localStorage.getItem("gc_token") || null;

export function setAuthToken(token) {
  authToken = token;
  localStorage.setItem("gc_token", token);
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem("gc_token");
}

function headers() {
  const h = { "Content-Type": "application/json" };
  if (authToken) h["Authorization"] = `Bearer ${authToken}`;
  return h;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Auth
export async function register(username, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setAuthToken(data.token);
  return data;
}

export async function login(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setAuthToken(data.token);
  return data;
}

export async function getMe() {
  return request("/auth/me");
}

// Providers
export async function listProviders() {
  return request("/providers");
}

export async function saveProviderKey(provider, api_key, endpoint, model) {
  return request("/providers", {
    method: "POST",
    body: JSON.stringify({ provider, api_key, endpoint, model }),
  });
}

export async function deleteProviderKey(provider) {
  return request(`/providers/${provider}`, { method: "DELETE" });
}

// Models
export async function listModels(provider) {
  return request(`/models/${provider}`);
}

// Debate
export function streamDebate(
  topic,
  mode,
  agents,
  speed_ms,
  max_turns,
  onEvent,
) {
  const controller = new AbortController();

  fetch(`${API_BASE}/debate/stream`, {
    method: "POST",
    headers: headers(),
    signal: controller.signal,
    body: JSON.stringify({ topic, mode, agents, speed_ms, max_turns }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        onEvent({ type: "error", message: body.detail || "Stream failed" });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.trim()) {
            try {
              onEvent(JSON.parse(line));
            } catch (e) {}
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        onEvent({ type: "error", message: err.message });
      }
    });

  return controller;
}

export async function continueDebate(debate_id, user_message) {
  return request("/debate/continue", {
    method: "POST",
    body: JSON.stringify({ debate_id, user_message }),
  });
}

export async function chat(system, messages, temperature = 0.7) {
  const config = JSON.parse(
    localStorage.getItem("groupchat_providers") || "{}",
  );
  const activeProfile = JSON.parse(
    localStorage.getItem("groupchat_active_profile") || '"default"',
  );
  const profiles = JSON.parse(
    localStorage.getItem("groupchat_profiles") || "{}",
  );
  const profile = profiles[activeProfile] || {};
  const provider = profile.activeProvider || "anthropic";
  const providerConfig =
    config[provider] || profile.providers?.[provider] || {};

  if (!providerConfig.apiKey) {
    throw new Error("No API key configured");
  }

  let base_url = providerConfig.endpoint || getProviderBaseUrl(provider);
  const api_key = providerConfig.apiKey;
  const model = providerConfig.model || getProviderDefaultModel(provider);

  if (provider === "anthropic") {
    const res = await fetch(`${base_url}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system,
        messages,
        temperature,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  } else if (provider === "google") {
    const url = `${base_url}/v1beta/models/${model}:generateContent?key=${api_key}`;
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: system }] },
        generationConfig: { temperature },
      }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else {
    if (!base_url.endsWith("/v1") && !base_url.includes("/v1/"))
      base_url += "/v1";
    const res = await fetch(`${base_url}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        temperature,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }
}

function getProviderBaseUrl(provider) {
  const urls = {
    anthropic: "https://api.anthropic.com",
    openai: "https://api.openai.com",
    groq: "https://api.groq.com/openai",
    openrouter: "https://openrouter.ai/api",
    google: "https://generativelanguage.googleapis.com",
    mistral: "https://api.mistral.ai",
    deepseek: "https://api.deepseek.com",
    together: "https://api.together.xyz",
    fireworks: "https://api.fireworks.ai",
    ollama: "http://localhost:11434",
    lmstudio: "http://localhost:1234",
  };
  return urls[provider] || "";
}

function getProviderDefaultModel(provider) {
  const models = {
    anthropic: "claude-sonnet-4-20250514",
    openai: "gpt-4o",
    groq: "llama-3.3-70b-versatile",
    openrouter: "anthropic/claude-sonnet-4",
    google: "gemini-2.0-flash",
    mistral: "mistral-large-latest",
    deepseek: "deepseek-chat",
    together: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    fireworks: "accounts/fireworks/models/llama-v3p3-70b-instruct",
    ollama: "llama3.1",
    lmstudio: "",
  };
  return models[provider] || "";
}
