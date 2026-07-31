import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import RightPanel from "./components/RightPanel";
import SettingsModal from "./components/SettingsModal";
import AuthModal from "./components/AuthModal";
import { DEFAULT_AGENTS, DEBATE_MODES } from "./utils/constants";
import { saveDebate, loadDebates, generateDebateId } from "./utils/storage";
import { streamDebate, chat, listModels } from "./utils/backendApi";
import { getAgentColor } from "./utils/helpers";
import { rateLimiter } from "./utils/rateLimiter";

function App() {
  const [debates, setDebates] = useState(loadDebates());
  const [currentDebateId, setCurrentDebateId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([...DEFAULT_AGENTS]);
  const [mode, setMode] = useState(DEBATE_MODES.Discussion);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [topic, setTopic] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("gc_token"),
  );
  const [typingAgent, setTypingAgent] = useState(null);
  const [conclusion, setConclusion] = useState(null);
  const [summary, setSummary] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const loopRef = useRef(false);
  const currentAgentIndexRef = useRef(0);
  const messagesRef = useRef(messages);
  const isPausedRef = useRef(isPaused);
  const agentsRef = useRef(agents);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  // Apply saved theme on load
  useEffect(() => {
    const saved = localStorage.getItem("groupchat_theme") || "dark";
    const THEMES = {
      dark: {
        bg: "#0D0D0D",
        surface: "#111111",
        bubble: "#141414",
        input: "#1A1A1A",
        border: "#222222",
        border2: "#2A2A2A",
        accent: "#C8FF00",
      },
      midnight_blue: {
        bg: "#0A0E14",
        surface: "#0D1117",
        bubble: "#131922",
        input: "#161B22",
        border: "#1C2333",
        border2: "#252D3A",
        accent: "#58A6FF",
      },
      forest: {
        bg: "#0D0F0D",
        surface: "#111311",
        bubble: "#141814",
        input: "#1A1C1A",
        border: "#1E261E",
        border2: "#263026",
        accent: "#4ADE80",
      },
      amber: {
        bg: "#0F0D0A",
        surface: "#13110D",
        bubble: "#181510",
        input: "#1C1914",
        border: "#262015",
        border2: "#302A1E",
        accent: "#FBBF24",
      },
      rose: {
        bg: "#0F0A0D",
        surface: "#130D11",
        bubble: "#181014",
        input: "#1C1418",
        border: "#261520",
        border2: "#301E2A",
        accent: "#FB7185",
      },
      slate: {
        bg: "#0B0D0F",
        surface: "#0F1114",
        bubble: "#13161A",
        input: "#171A1E",
        border: "#1E2228",
        border2: "#262B33",
        accent: "#94A3B8",
      },
    };
    const t = THEMES[saved];
    if (t) {
      const root = document.documentElement;
      root.setAttribute("data-theme", saved);
      root.style.setProperty("--t-bg", t.bg);
      root.style.setProperty("--t-surface", t.surface);
      root.style.setProperty("--t-bubble", t.bubble);
      root.style.setProperty("--t-input", t.input);
      root.style.setProperty("--t-border", t.border);
      root.style.setProperty("--t-border2", t.border2);
      root.style.setProperty("--t-accent", t.accent);
      document.body.style.backgroundColor = t.bg;
    }
  }, []);

  const persistDebate = useCallback(
    (msgs, agts, md, tp, conc) => {
      if (!currentDebateId) return;
      saveDebate({
        id: currentDebateId,
        title: tp || "Untitled Debate",
        timestamp: startTime || Date.now(),
        agents: agts,
        messages: msgs,
        mode: md,
        conclusion: conc,
      });
      setDebates(loadDebates());
    },
    [currentDebateId, startTime],
  );

  const startDebateLoop = useCallback(async () => {
    if (loopRef.current) return;
    loopRef.current = true;

    while (loopRef.current && !isPausedRef.current) {
      if (rateLimiter.isEmergencyStopped()) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            agentId: "system",
            sender: "System",
            color: "#E05454",
            content: "Emergency stop activated. Debate paused.",
            timestamp: Date.now(),
            streaming: false,
          },
        ]);
        loopRef.current = false;
        break;
      }

      const currentMessages = messagesRef.current;
      if (currentMessages.length >= 20) {
        loopRef.current = false;
        break;
      }

      const agent =
        agentsRef.current[
          currentAgentIndexRef.current % agentsRef.current.length
        ];
      currentAgentIndexRef.current++;

      const check = rateLimiter.canMakeRequest(null, agent.id, null);
      if (!check.allowed) {
        if (check.waitMs > 0 && check.waitMs < 60000) {
          await new Promise((r) => setTimeout(r, Math.min(check.waitMs, 3000)));
          currentAgentIndexRef.current--;
          continue;
        }
        if (currentAgentIndexRef.current < agentsRef.current.length * 2)
          continue;
        loopRef.current = false;
        break;
      }

      setTypingAgent(agent.id);

      const historyStr = currentMessages
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");
      let responseText = "";

      try {
        // Use backend streaming
        const profiles = JSON.parse(
          localStorage.getItem("groupchat_profiles") || "{}",
        );
        const activeProfile = JSON.parse(
          localStorage.getItem("groupchat_active_profile") || '"default"',
        );
        const profile = profiles[activeProfile] || {};
        const provider =
          agent.provider || profile.activeProvider || "anthropic";
        const model = agent.model || "";
        const systemPrompt = `You are ${agent.name}, a debater with the following personality: ${agent.personality}\nYou are discussing: ${topic}\nMode: ${mode}\n\nRules:\n- Keep responses under 3 sentences\n- Never repeat a point already made\n- Engage with what others said\n- Do NOT use any markdown formatting\n\nConversation so far:\n${historyStr}`;

        const messages = [
          { role: "user", content: `Continue the discussion about: ${topic}` },
        ];

        // Backend streaming not implemented for individual agents yet, fall back to direct
        // TODO: Implement individual agent streaming through backend
        for await (const chunk of streamAgentResponseDirect(
          provider,
          model,
          systemPrompt,
          messages,
        )) {
          responseText += chunk;
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.agentId === agent.id && lastMsg.streaming) {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: responseText },
              ];
            }
            return [
              ...prev,
              {
                id: `msg_${Date.now()}`,
                agentId: agent.id,
                sender: agent.name,
                color: agent.color,
                content: responseText,
                timestamp: Date.now(),
                streaming: true,
              },
            ];
          });
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.agentId === agent.id && m.streaming
              ? { ...m, streaming: false }
              : m,
          ),
        );

        rateLimiter.recordRequest(
          null,
          agent.id,
          null,
          Math.ceil(responseText.length / 4),
        );
      } catch (err) {
        console.error("Agent error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            agentId: "system",
            sender: "System",
            color: "#666666",
            content: `Error: ${err.message}`,
            timestamp: Date.now(),
            streaming: false,
          },
        ]);
        if (err.message?.includes("429") || err.message?.includes("rate")) {
          await new Promise((r) => setTimeout(r, 10000));
        }
        loopRef.current = false;
        break;
      }

      setTypingAgent(null);
      if (loopRef.current && !isPausedRef.current) {
        await new Promise((resolve) =>
          setTimeout(resolve, rateLimiter.getDelay()),
        );
      }
    }
    setIsRunning(false);
  }, [topic, mode]);

  useEffect(() => {
    if (isRunning && !isPaused) startDebateLoop();
    return () => {
      loopRef.current = false;
    };
  }, [isRunning, isPaused, startDebateLoop]);

  useEffect(() => {
    if (currentDebateId && messages.length > 0)
      persistDebate(messages, agents, mode, topic, conclusion);
  }, [messages, currentDebateId]);

  const handleNewDebate = () => {
    setCurrentDebateId(generateDebateId());
    setMessages([]);
    setAgents([...DEFAULT_AGENTS]);
    setMode(DEBATE_MODES.Discussion);
    setIsRunning(false);
    setIsPaused(false);
    setTopic("");
    setConclusion(null);
    setSummary(null);
    setStartTime(Date.now());
    rateLimiter.resetDebateTokens();
  };

  const handleStartDebate = (debateTopic) => {
    if (!debateTopic.trim()) return;
    setTopic(debateTopic);
    setStartTime(Date.now());
    setIsRunning(true);
    setIsPaused(false);
    currentAgentIndexRef.current = 0;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
    } else {
      setIsPaused(true);
      loopRef.current = false;
    }
  };

  const handleStop = () => {
    if (abortController) abortController.abort();
    loopRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleConclude = async () => {
    loopRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    try {
      const messageHistory = messages
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");
      const systemPrompt = `You are a debate moderator concluding a panel discussion. Topic: ${topic}. Panelists: ${agents.map((a) => `${a.name} (${a.role})`).join(", ")}`;
      const userMsg = `Here is the full debate conversation:\n\n${messageHistory}\n\nProvide a conclusion in this format:\n\nRecommendation: [1-2 sentences]\nWhy:\n- [Point 1]\n- [Point 2]\nRisks:\n- [Risk 1]\nConfidence: [Low/Medium/High]`;

      const result = await chat(systemPrompt, [
        { role: "user", content: userMsg },
      ]);
      setConclusion(result);
      persistDebate(messages, agents, mode, topic, result);
    } catch (err) {
      console.error("Conclusion error:", err);
    }
  };

  const handleSummary = async () => {
    try {
      const messageHistory = messages
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");
      const result = await chat(
        "You are a debate summarizer. Provide a concise bullet-point summary.",
        [
          {
            role: "user",
            content: `Topic: ${topic}\n\n${messageHistory}\n\nSummarize key points.`,
          },
        ],
      );
      setSummary(result);
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  const handleSummonAgent = (role) => {
    if (agents.find((a) => a.name === role)) return;
    setAgents((prev) => [
      ...prev,
      {
        id: role.toLowerCase(),
        name: role,
        role: "Summoned Expert",
        color: getAgentColor(role),
        personality: "Expert in their field",
        focus: role,
        model: null,
        isCustom: true,
      },
    ]);
    currentAgentIndexRef.current = agents.length;
  };

  const handleUpdateAgent = (agentId, updates) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, ...updates } : a)),
    );
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        agentId: "user",
        sender: "You",
        color: "#C8FF00",
        content: userMessage,
        timestamp: Date.now(),
        streaming: false,
      },
    ]);
    setUserMessage("");
    if (!isRunning && !isPaused) setIsRunning(true);
  };

  const handleLoadDebate = (debate) => {
    setCurrentDebateId(debate.id);
    setMessages(debate.messages);
    setAgents(debate.agents);
    setMode(debate.mode);
    setTopic(debate.title);
    setConclusion(debate.conclusion || null);
    setStartTime(debate.timestamp);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleDeleteDebate = (id) => {
    if (currentDebateId === id) handleNewDebate();
    setDebates((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAuth = (token) => {
    localStorage.setItem("gc_token", token);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("gc_token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-[var(--dynamic-bg,#0D0D0D)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">GroupChat AI</h1>
          <p className="text-gray-400 mb-6">Sign in to start debating</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-[var(--dynamic-accent,#C8FF00)] text-black px-6 py-2 rounded font-medium"
          >
            Sign In
          </button>
          {showAuth && (
            <AuthModal onAuth={handleAuth} onClose={() => setShowAuth(false)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--dynamic-bg,#0D0D0D)] overflow-hidden">
      <Sidebar
        debates={debates}
        currentDebateId={currentDebateId}
        onNewDebate={handleNewDebate}
        onSelectDebate={handleLoadDebate}
        onDeleteDebate={handleDeleteDebate}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
      />

      <ChatArea
        messages={messages}
        topic={topic}
        mode={mode}
        agents={agents}
        isRunning={isRunning}
        isPaused={isPaused}
        typingAgent={typingAgent}
        conclusion={conclusion}
        summary={summary}
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        onSendMessage={handleSendMessage}
        onStartDebate={handleStartDebate}
        onPauseResume={handlePauseResume}
        onStop={handleStop}
        onConclude={handleConclude}
        onSummary={handleSummary}
        startTime={startTime}
      />

      <RightPanel
        agents={agents}
        mode={mode}
        setMode={setMode}
        onSummonAgent={handleSummonAgent}
        typingAgent={typingAgent}
      />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// Direct provider streaming (temporary until backend handles individual agent streams)
async function* streamAgentResponseDirect(provider, model, system, messages) {
  // Read from groupchat_profiles (same structure the SettingsModal writes to)
  const activeProfile = JSON.parse(
    localStorage.getItem("groupchat_active_profile") || '"default"',
  );
  const profiles = JSON.parse(
    localStorage.getItem("groupchat_profiles") || "{}",
  );
  const profile = profiles[activeProfile] || {};
  const providerConfig = profile.providers?.[provider] || {};
  if (!providerConfig?.apiKey) {
    throw new Error(
      `No API key configured for ${provider}. Open Settings to add one.`,
    );
  }

  let base_url = providerConfig.endpoint || getProviderBaseUrl(provider);
  const api_key = providerConfig.apiKey;
  const resolved_model =
    model || providerConfig.model || getProviderDefaultModel(provider);

  if (provider === "anthropic") {
    const headers = {
      "x-api-key": api_key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    };
    const res = await fetch(`${base_url}/v1/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: resolved_model,
        max_tokens: 1024,
        system,
        messages,
        stream: true,
      }),
    });
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
        if (line.startsWith("data: ")) {
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "content_block_delta" && event.delta?.text) {
              yield event.delta.text;
            }
          } catch {}
        }
      }
    }
  } else if (provider === "google") {
    const url = `${base_url}/v1beta/models/${resolved_model}:streamGenerateContent?alt=sse&key=${api_key}`;
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
      }),
    });
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
        if (line.startsWith("data: ")) {
          try {
            const event = JSON.parse(line.slice(6));
            if (event.candidates?.[0]?.content?.parts?.[0]?.text)
              yield event.candidates[0].content.parts[0].text;
          } catch {}
        }
      }
    }
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
        model: resolved_model,
        messages: [{ role: "system", content: system }, ...messages],
        stream: true,
      }),
    });
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
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const chunk = JSON.parse(data);
            if (chunk.choices?.[0]?.delta?.content)
              yield chunk.choices[0].delta.content;
          } catch {}
        }
      }
    }
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

export default App;
