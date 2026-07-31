import { getProviderMeta, PROVIDER_IDS } from './registry';

const STORAGE_PREFIX = 'groupchat_';

function store(key, val) { localStorage.setItem(`${STORAGE_PREFIX}${key}`, val); }
function read(key) { return localStorage.getItem(`${STORAGE_PREFIX}${key}`) || ''; }

export function getActiveProfile() { return read('active_profile') || 'default'; }
export function setActiveProfile(p) { store('active_profile', p); }

export function getProfiles() {
  try { return JSON.parse(read('profiles')) || { default: { name: 'Default', providers: {} } }; }
  catch { return { default: { name: 'Default', providers: {} } }; }
}

export function saveProfiles(profiles) { store('profiles', JSON.stringify(profiles)); }

export function getActiveProviderConfig() {
  const profile = getActiveProfile();
  const profiles = getProfiles();
  const p = profiles[profile];
  if (!p) return null;
  const providerId = p.activeProvider || null;
  if (!providerId) return null;
  return {
    providerId,
    apiKey: p.providers?.[providerId]?.apiKey || '',
    endpoint: p.providers?.[providerId]?.endpoint || '',
    model: p.providers?.[providerId]?.model || '',
    fallback: p.providers?.[providerId]?.fallback || null,
  };
}

export function setActiveProviderForProfile(profileId, providerId, config) {
  const profiles = getProfiles();
  if (!profiles[profileId]) profiles[profileId] = { name: profileId, providers: {} };
  profiles[profileId].activeProvider = providerId;
  profiles[profileId].providers[providerId] = {
    apiKey: config.apiKey || '',
    endpoint: config.endpoint || '',
    model: config.model || '',
    fallback: config.fallback || null,
  };
  saveProfiles(profiles);
}

export function createProfile(id, name) {
  const profiles = getProfiles();
  profiles[id] = { name, providers: {} };
  saveProfiles(profiles);
}

export function deleteProfile(id) {
  if (id === 'default') return;
  const profiles = getProfiles();
  delete profiles[id];
  saveProfiles(profiles);
  if (getActiveProfile() === id) setActiveProfile('default');
}

function buildEndpoint(providerId, customEndpoint) {
  const meta = getProviderMeta(providerId);
  let base = customEndpoint || meta.defaultEndpoint;
  base = base.replace(/\/+$/, '').replace(/\/v1$/, '');
  return base;
}

// ---- Model discovery ----

async function fetchModelsOpenAICompatible(endpoint, apiKey) {
  const base = endpoint.replace(/\/+$/, '').replace(/\/v1$/, '');
  try {
    const res = await fetch(`${base}/v1/models`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map(m => ({
      id: m.id,
      name: m.id,
      contextWindow: m.context_length || null,
    }));
  } catch { return []; }
}

async function fetchModelsOllama(endpoint) {
  const base = endpoint || 'http://localhost:11434';
  try {
    const res = await fetch(`${base}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(m => ({
      id: m.name,
      name: m.name,
      contextWindow: null,
    }));
  } catch { return []; }
}

async function fetchModelsGoogle(apiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(m => ({
      id: m.name.replace('models/', ''),
      name: m.displayName || m.name.replace('models/', ''),
      contextWindow: m.inputTokenLimit || null,
    }));
  } catch { return []; }
}

export async function listModels(providerId, apiKey, endpoint) {
  const meta = getProviderMeta(providerId);

  if (providerId === PROVIDER_IDS.ANTHROPIC) return [];
  if (providerId === PROVIDER_IDS.GOOGLE) return fetchModelsGoogle(apiKey);
  if (providerId === PROVIDER_IDS.OLLAMA) return fetchModelsOllama(endpoint || meta.defaultEndpoint);
  if (meta.isOpenAICompatible || providerId === PROVIDER_IDS.CUSTOM) {
    const base = buildEndpoint(providerId, endpoint);
    return fetchModelsOpenAICompatible(base, apiKey);
  }
  return [];
}

// ---- Health check ----

export async function healthCheck(providerId, apiKey, endpoint) {
  const meta = getProviderMeta(providerId);

  if (!meta.requiresKey && !apiKey) {
    try {
      const base = endpoint || meta.defaultEndpoint;
      const res = await fetch(base, { method: 'GET', signal: AbortSignal.timeout(3000) });
      return res.ok ? 'connected' : 'error';
    } catch { return 'disconnected'; }
  }
  if (!apiKey) return 'no_key';

  try {
    if (providerId === PROVIDER_IDS.ANTHROPIC) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: meta.defaultModel,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      });
      if (res.status === 401) return 'invalid_key';
      if (res.status === 429) return 'rate_limited';
      return res.ok ? 'connected' : 'error';
    }

    if (providerId === PROVIDER_IDS.GOOGLE) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (res.status === 400 || res.status === 403) return 'invalid_key';
      return res.ok ? 'connected' : 'error';
    }

    const base = buildEndpoint(providerId, endpoint);
    const res = await fetch(`${base}/v1/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 401) return 'invalid_key';
    if (res.status === 429) return 'rate_limited';
    return res.ok ? 'connected' : 'error';
  } catch { return 'disconnected'; }
}

// ---- Streaming ----

export async function* streamChat(providerId, apiKey, endpoint, model, systemPrompt, userMessage) {
  const meta = getProviderMeta(providerId);

  if (providerId === PROVIDER_IDS.ANTHROPIC) {
    yield* streamAnthropic(apiKey, model || meta.defaultModel, systemPrompt, userMessage);
    return;
  }

  if (providerId === PROVIDER_IDS.GOOGLE) {
    yield* streamGoogle(apiKey, model || meta.defaultModel, systemPrompt, userMessage);
    return;
  }

  const base = buildEndpoint(providerId, endpoint);
  yield* streamOpenAICompatible(base, apiKey, model || meta.defaultModel, systemPrompt, userMessage);
}

async function* streamAnthropic(apiKey, model, systemPrompt, userMessage) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Anthropic error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta') yield parsed.delta?.text || '';
        } catch {}
      }
    }
  }
}

async function* streamGoogle(apiKey, model, systemPrompt, userMessage) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch {}
      }
    }
  }
}

async function* streamOpenAICompatible(base, apiKey, model, systemPrompt, userMessage) {
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {}
      }
    }
  }
}

// ---- Non-streaming chat ----

export async function chat(providerId, apiKey, endpoint, model, systemPrompt, userMessage, maxTokens = 1000) {
  const meta = getProviderMeta(providerId);

  if (providerId === PROVIDER_IDS.ANTHROPIC) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model || meta.defaultModel,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
    const data = await res.json();
    return data.content[0].text;
  }

  if (providerId === PROVIDER_IDS.GOOGLE) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model || meta.defaultModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
        }),
      }
    );
    if (!res.ok) throw new Error(`Google error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  const base = buildEndpoint(providerId, endpoint);
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: model || meta.defaultModel,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}
