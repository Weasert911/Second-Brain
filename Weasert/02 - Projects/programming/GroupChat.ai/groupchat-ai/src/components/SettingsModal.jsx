import { useState, useEffect, useCallback } from 'react';
import { PROVIDER_IDS, PROVIDER_META, getProviderMeta } from '../providers/registry';
import {
  getProfiles, saveProfiles, getActiveProfile, setActiveProfile,
  createProfile, deleteProfile,
  setActiveProviderForProfile,
} from '../providers/index';
import { listModels as backendListModels, saveProviderKey, listProviders as backendListProviders } from '../utils/backendApi';
import { rateLimiter, SPEED_PRESETS } from '../utils/rateLimiter';
import { requestQueue } from '../utils/queue';

const STATUS_LABELS = {
  connected: { text: 'Connected', color: '#7CC87C' },
  disconnected: { text: 'Disconnected', color: '#E05454' },
  invalid_key: { text: 'Invalid Key', color: '#E05454' },
  rate_limited: { text: 'Rate Limited', color: '#E07C54' },
  error: { text: 'Provider Error', color: '#E05454' },
  no_key: { text: 'No API Key', color: '#666666' },
  checking: { text: 'Checking...', color: '#666666' },
  backend: { text: 'Stored on server', color: '#7CC87C' },
};

const THEMES = {
  dark: { name: 'Midnight', bg: '#0D0D0D', surface: '#111111', bubble: '#141414', input: '#1A1A1A', border: '#222222', border2: '#2A2A2A', accent: '#C8FF00' },
  midnight_blue: { name: 'Deep Ocean', bg: '#0A0E14', surface: '#0D1117', bubble: '#131922', input: '#161B22', border: '#1C2333', border2: '#252D3A', accent: '#58A6FF' },
  forest: { name: 'Forest', bg: '#0D0F0D', surface: '#111311', bubble: '#141814', input: '#1A1C1A', border: '#1E261E', border2: '#263026', accent: '#4ADE80' },
  amber: { name: 'Warm Dark', bg: '#0F0D0A', surface: '#13110D', bubble: '#181510', input: '#1C1914', border: '#262015', border2: '#302A1E', accent: '#FBBF24' },
  rose: { name: 'Rose', bg: '#0F0A0D', surface: '#130D11', bubble: '#181014', input: '#1C1418', border: '#261520', border2: '#301E2A', accent: '#FB7185' },
  slate: { name: 'Slate', bg: '#0B0D0F', surface: '#0F1114', bubble: '#13161A', input: '#171A1E', border: '#1E2228', border2: '#262B33', accent: '#94A3B8' },
};

function SettingsModal({ onClose }) {
  const [profiles, setProfiles] = useState({});
  const [activeProfile, setActiveProfileState] = useState('default');
  const [selectedProvider, setSelectedProvider] = useState(PROVIDER_IDS.GROQ);
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [model, setModel] = useState('');
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [status, setStatus] = useState('no_key');
  const [saved, setSaved] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [tab, setTab] = useState('provider');
  const [backendSaved, setBackendSaved] = useState(false);

  // Rate limit state
  const [speed, setSpeedState] = useState(rateLimiter.getSpeed());
  const [customDelay, setCustomDelayState] = useState(rateLimiter.getCustomDelay());
  const [budgets, setBudgetsState] = useState(rateLimiter.getTokenBudgets());
  const [metrics, setMetrics] = useState(rateLimiter.getMetrics());
  const [warnings, setWarnings] = useState([]);
  const [emergencyStopped, setEmergencyStopped] = useState(false);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('groupchat_theme') || 'dark');

  const meta = getProviderMeta(selectedProvider);

  useEffect(() => {
    setProfiles(getProfiles());
    setActiveProfileState(getActiveProfile());
  }, []);

  useEffect(() => {
    const prof = profiles[activeProfile];
    if (!prof) return;
    const pid = prof.activeProvider || PROVIDER_IDS.GROQ;
    setSelectedProvider(pid);
    const cfg = prof.providers?.[pid] || {};
    setApiKey(cfg.apiKey || '');
    setEndpoint(cfg.endpoint || '');
    setModel(cfg.model || '');
  }, [activeProfile, profiles]);

  const fetchModels = useCallback(async () => {
    if (!meta.modelsEndpoint && selectedProvider !== PROVIDER_IDS.OLLAMA && selectedProvider !== PROVIDER_IDS.LMSTUDIO) {
      setModels([]);
      return;
    }
    setModelsLoading(true);
    try {
      const result = await backendListModels(selectedProvider);
      setModels(result.models || []);
    } catch { setModels([]); }
    setModelsLoading(false);
  }, [selectedProvider, meta]);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  const runHealthCheck = useCallback(async () => {
    // Check if we have a key in backend
    try {
      const providers = await backendListProviders();
      const hasKey = providers.some(p => p.provider === selectedProvider);
      if (hasKey) {
        setStatus('backend');
      } else {
        setStatus('no_key');
      }
    } catch {
      setStatus('disconnected');
    }
  }, [selectedProvider]);

  useEffect(() => { runHealthCheck(); }, [selectedProvider]);

  // Metrics polling
  useEffect(() => {
    if (tab !== 'rate_limits') return;
    const interval = setInterval(() => {
      setMetrics(rateLimiter.getMetrics());
      setWarnings(rateLimiter.getBudgetWarnings());
      setEmergencyStopped(rateLimiter.isEmergencyStopped());
    }, 1000);
    return () => clearInterval(interval);
  }, [tab]);

  const handleSave = async () => {
    // Save to backend
    try {
      if (apiKey) {
        await saveProviderKey(selectedProvider, apiKey, endpoint || undefined, model || undefined);
        setBackendSaved(true);
        setTimeout(() => setBackendSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save to backend:', err);
    }

    // Also save to localStorage as fallback
    setActiveProviderForProfile(activeProfile, selectedProvider, { apiKey, endpoint, model });
    setProfiles(getProfiles());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProviderChange = (pid) => {
    setSelectedProvider(pid);
    const prof = profiles[activeProfile];
    const cfg = prof?.providers?.[pid] || {};
    setApiKey(cfg.apiKey || '');
    setEndpoint(cfg.endpoint || '');
    setModel(cfg.model || '');
  };

  const handleNewProfile = () => {
    if (!newProfileName.trim()) return;
    const id = newProfileName.trim().toLowerCase().replace(/\s+/g, '_');
    createProfile(id, newProfileName.trim());
    setProfiles(getProfiles());
    setActiveProfileState(id);
    setNewProfileName('');
    setShowNewProfile(false);
  };

  const handleDeleteProfile = (id) => {
    deleteProfile(id);
    setProfiles(getProfiles());
    setActiveProfileState(getActiveProfile());
  };

  const handleSpeedChange = (s) => {
    setSpeedState(s);
    rateLimiter.setSpeed(s);
  };

  const handleCustomDelayChange = (ms) => {
    setCustomDelayState(ms);
    rateLimiter.setCustomDelay(ms);
  };

  const handleBudgetChange = (key, val) => {
    const newBudgets = { ...budgets, [key]: val || null };
    setBudgetsState(newBudgets);
    rateLimiter.setTokenBudgets(newBudgets);
  };

  const handleEmergencyToggle = () => {
    if (emergencyStopped) {
      rateLimiter.emergencyResume();
      setEmergencyStopped(false);
    } else {
      rateLimiter.emergencyStop();
      setEmergencyStopped(true);
      requestQueue.clear();
    }
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('groupchat_theme', themeId);
    const t = THEMES[themeId];
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    root.style.setProperty('--t-bg', t.bg);
    root.style.setProperty('--t-surface', t.surface);
    root.style.setProperty('--t-bubble', t.bubble);
    root.style.setProperty('--t-input', t.input || t.surface);
    root.style.setProperty('--t-border', t.border);
    root.style.setProperty('--t-border2', t.border2 || t.border);
    root.style.setProperty('--t-accent', t.accent);
    document.body.style.backgroundColor = t.bg;
  };

  const formatTokens = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const providerGroups = [
    { label: 'Cloud', ids: [PROVIDER_IDS.ANTHROPIC, PROVIDER_IDS.OPENAI, PROVIDER_IDS.GOOGLE, PROVIDER_IDS.MISTRAL, PROVIDER_IDS.COHERE, PROVIDER_IDS.XAI] },
    { label: 'Aggregators', ids: [PROVIDER_IDS.OPENROUTER, PROVIDER_IDS.GROQ, PROVIDER_IDS.DEEPSEEK, PROVIDER_IDS.TOGETHER, PROVIDER_IDS.FIREWORKS, PROVIDER_IDS.PERPLEXITY] },
    { label: 'Local', ids: [PROVIDER_IDS.OLLAMA, PROVIDER_IDS.LMSTUDIO] },
    { label: 'Other', ids: [PROVIDER_IDS.AZURE, PROVIDER_IDS.CUSTOM] },
  ];

  const tabs = [
    { id: 'provider', label: 'Provider' },
    { id: 'profiles', label: 'Profiles' },
    { id: 'rate_limits', label: 'Rate Limits' },
    { id: 'themes', label: 'Themes' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111111] border border-[#222222] rounded-lg w-[640px] max-w-[95vw] max-h-[90vh] flex flex-col">

        <div className="px-5 py-4 border-b border-[#222222] flex items-center justify-between shrink-0">
          <span className="font-mono text-base text-[#E8E8E8]">Settings</span>
          <button onClick={onClose} className="text-[#666666] hover:text-[#E8E8E8] text-xl">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#222222] shrink-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-mono border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-[#C8FF00] text-[#C8FF00]'
                  : 'border-transparent text-[#666666] hover:text-[#B0B0B0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ---- PROVIDER TAB ---- */}
          {tab === 'provider' && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#666666] font-mono uppercase tracking-wide">Profile</label>
                <select
                  value={activeProfile}
                  onChange={(e) => setActiveProfileState(e.target.value)}
                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] focus:outline-none"
                >
                  {Object.entries(profiles).map(([id, p]) => (
                    <option key={id} value={id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#666666] font-mono mb-2 uppercase tracking-wide">Provider</label>
                {providerGroups.map(group => (
                  <div key={group.label} className="mb-3">
                    <div className="text-[10px] text-[#444444] font-mono uppercase tracking-wider mb-1.5">{group.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.ids.map(pid => (
                        <button
                          key={pid}
                          onClick={() => handleProviderChange(pid)}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                            selectedProvider === pid
                              ? 'bg-[#1A1A1A] border-[#C8FF00] text-[#C8FF00]'
                              : 'bg-[#111111] border-[#222222] text-[#666666] hover:bg-[#1A1A1A]'
                          }`}
                        >
                          {PROVIDER_META[pid].name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_LABELS[status]?.color || '#666' }} />
                <span className="text-xs font-mono" style={{ color: STATUS_LABELS[status]?.color || '#666' }}>
                  {STATUS_LABELS[status]?.text || status}
                </span>
                <button onClick={runHealthCheck} className="text-[10px] text-[#666666] hover:text-[#B0B0B0] ml-1">Refresh</button>
              </div>

              {meta.requiresEndpoint && (
                <div>
                  <label className="block text-xs text-[#666666] font-mono mb-2 uppercase tracking-wide">Base URL</label>
                  <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)}
                    placeholder={meta.defaultEndpoint || 'http://localhost:1234'}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A] font-mono" />
                </div>
              )}

              {meta.requiresKey && (
                <div>
                  <label className="block text-xs text-[#666666] font-mono mb-2 uppercase tracking-wide">API Key</label>
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                    placeholder={meta.apiKeyPlaceholder}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A] font-mono" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[#666666] font-mono uppercase tracking-wide">Model</label>
                  <button onClick={fetchModels} className="text-[10px] text-[#666666] hover:text-[#C8FF00] font-mono">
                    {modelsLoading ? 'Loading...' : 'Refresh Models'}
                  </button>
                </div>
                {models.length > 0 ? (
                  <select value={model} onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] focus:outline-none font-mono">
                    <option value="">Default: {meta.defaultModel}</option>
                    {models.map(m => (
                      <option key={m.id} value={m.id}>{m.name} {m.context_window ? `(${Math.round(m.context_window/1000)}k)` : ''}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" value={model} onChange={(e) => setModel(e.target.value)}
                    placeholder={meta.defaultModel}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A] font-mono" />
                )}
              </div>
            </>
          )}

          {/* ---- PROFILES TAB ---- */}
          {tab === 'profiles' && (
            <>
              <div className="space-y-2">
                {Object.entries(profiles).map(([id, p]) => (
                  <div key={id} className={`flex items-center justify-between p-3 rounded border ${
                    activeProfile === id ? 'bg-[#1A1A1A] border-[#C8FF00]' : 'bg-[#111111] border-[#222222]'
                  }`}>
                    <div>
                      <div className="text-sm text-[#E8E8E8]">{p.name}</div>
                      <div className="text-xs text-[#666666]">{p.activeProvider ? PROVIDER_META[p.activeProvider]?.name : 'No provider'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeProfile === id && <span className="text-[10px] text-[#C8FF00] font-mono">ACTIVE</span>}
                      {id !== 'default' && (
                        <button onClick={() => handleDeleteProfile(id)} className="text-[#666666] hover:text-[#E05454] text-xs">×</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {showNewProfile ? (
                <div className="flex gap-2">
                  <input type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNewProfile()} placeholder="Profile name"
                    className="flex-1 px-4 py-2.5 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none" autoFocus />
                  <button onClick={handleNewProfile} className="px-4 py-2.5 bg-[#C8FF00] text-[#0D0D0D] text-sm rounded font-medium">Add</button>
                  <button onClick={() => setShowNewProfile(false)} className="px-4 py-2.5 text-sm text-[#666666]">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setShowNewProfile(true)}
                  className="w-full py-2.5 border border-dashed border-[#2A2A2A] rounded text-sm text-[#666666] hover:border-[#444444] hover:text-[#B0B0B0]">+ New Profile</button>
              )}
            </>
          )}

          {/* ---- RATE LIMITS TAB ---- */}
          {tab === 'rate_limits' && (
            <>
              {warnings.length > 0 && (
                <div className="space-y-1">
                  {warnings.map((w, i) => (
                    <div key={i} className={`text-xs px-3 py-1.5 rounded ${
                      w.level === 'hard' ? 'bg-[#1A1010] text-[#E05454] border border-[#E05454]' :
                      w.level === 'soft2' ? 'bg-[#1A1510] text-[#E07C54] border border-[#E07C54]' :
                      'bg-[#1A1510] text-[#E07C54]'
                    }`}>{w.message}</div>
                  ))}
                </div>
              )}

              <div>
                <div className="text-xs text-[#666666] font-mono mb-2 uppercase tracking-wide">Debate Speed</div>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(SPEED_PRESETS).map(([key, preset]) => (
                    <button key={key} onClick={() => handleSpeedChange(key)}
                      className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                        speed === key ? 'bg-[#1A1A1A] border-[#C8FF00] text-[#C8FF00]' : 'bg-[#111111] border-[#222222] text-[#666666] hover:bg-[#1A1A1A]'
                      }`}>{preset.label}</button>
                  ))}
                </div>
                {speed === 'custom' && (
                  <div className="mt-2 flex items-center gap-3">
                    <input type="range" min="500" max="15000" step="100" value={customDelay}
                      onChange={(e) => handleCustomDelayChange(Number(e.target.value))} className="flex-1 h-1 accent-[#C8FF00]" />
                    <span className="text-xs text-[#B0B0B0] font-mono w-14 text-right">{(customDelay / 1000).toFixed(1)}s</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#0D0D0D] rounded border border-[#222222]">
                  <div className="text-[10px] text-[#666666] font-mono mb-1">RPM</div>
                  <div className="text-lg text-[#E8E8E8] font-mono">{metrics.rpm}</div>
                </div>
                <div className="p-3 bg-[#0D0D0D] rounded border border-[#222222]">
                  <div className="text-[10px] text-[#666666] font-mono mb-1">TPM</div>
                  <div className="text-lg text-[#E8E8E8] font-mono">{formatTokens(metrics.tpm)}</div>
                </div>
                <div className="p-3 bg-[#0D0D0D] rounded border border-[#222222]">
                  <div className="text-[10px] text-[#666666] font-mono mb-1">Queue</div>
                  <div className="text-lg text-[#E8E8E8] font-mono">{requestQueue.getQueueSize()}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-[#666666] font-mono mb-2 uppercase tracking-wide">Token Budgets</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#B0B0B0]">Daily</span>
                      <span className="text-xs text-[#666666] font-mono">{formatTokens(metrics.tokensUsedToday)} / {formatTokens(budgets.perDay || 500000)}</span>
                    </div>
                    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min(100, (metrics.tokensUsedToday / (budgets.perDay || 500000)) * 100)}%`,
                        backgroundColor: metrics.tokensUsedToday / (budgets.perDay || 500000) > 0.9 ? '#E05454' : metrics.tokensUsedToday / (budgets.perDay || 500000) > 0.8 ? '#E07C54' : '#C8FF00',
                      }} />
                    </div>
                    <input type="number" value={budgets.perDay || ''} onChange={(e) => handleBudgetChange('perDay', Number(e.target.value) || null)}
                      placeholder="500000" className="w-full mt-1 px-3 py-1.5 bg-[#1A1A1A] border border-[#222222] rounded text-xs text-[#E8E8E8] font-mono focus:outline-none" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#B0B0B0]">Monthly</span>
                      <span className="text-xs text-[#666666] font-mono">{formatTokens(metrics.tokensUsedMonth)} / {formatTokens(budgets.perMonth || 10000000)}</span>
                    </div>
                    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min(100, (metrics.tokensUsedMonth / (budgets.perMonth || 10000000)) * 100)}%`,
                        backgroundColor: metrics.tokensUsedMonth / (budgets.perMonth || 10000000) > 0.9 ? '#E05454' : metrics.tokensUsedMonth / (budgets.perMonth || 10000000) > 0.8 ? '#E07C54' : '#C8FF00',
                      }} />
                    </div>
                    <input type="number" value={budgets.perMonth || ''} onChange={(e) => handleBudgetChange('perMonth', Number(e.target.value) || null)}
                      placeholder="10000000" className="w-full mt-1 px-3 py-1.5 bg-[#1A1A1A] border border-[#222222] rounded text-xs text-[#E8E8E8] font-mono focus:outline-none" />
                  </div>
                </div>
              </div>

              <button onClick={handleEmergencyToggle}
                className={`w-full py-2.5 text-sm rounded border font-mono transition-colors ${
                  emergencyStopped ? 'bg-[#1A1010] border-[#E05454] text-[#E05454]' : 'bg-[#111111] border-[#222222] text-[#666666] hover:border-[#E05454] hover:text-[#E05454]'
                }`}>{emergencyStopped ? 'RESUME ALL' : 'EMERGENCY STOP'}</button>
            </>
          )}

          {/* ---- THEMES TAB ---- */}
          {tab === 'themes' && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(THEMES).map(([id, theme]) => (
                <button key={id} onClick={() => handleThemeChange(id)}
                  className={`p-4 rounded border text-left transition-colors ${
                    currentTheme === id ? 'border-[#C8FF00]' : 'border-[#222222] hover:border-[#2A2A2A]'
                  }`}
                  style={{ backgroundColor: theme.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: theme.accent }} />
                    <span className="text-sm font-mono" style={{ color: theme.accent }}>{theme.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }} />
                    <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }} />
                    <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: theme.bubble, border: `1px solid ${theme.border}` }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#222222] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-[#666666] hover:text-[#E8E8E8]">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-[#C8FF00] text-[#0D0D0D] text-sm font-medium rounded hover:bg-[#B8E600]">
            {backendSaved ? 'Saved to Server!' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
