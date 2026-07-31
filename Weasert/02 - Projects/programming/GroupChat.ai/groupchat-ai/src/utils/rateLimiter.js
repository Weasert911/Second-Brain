// Rate limiter with sliding window counters

const STORAGE_PREFIX = 'groupchat_';

function store(key, val) { localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(val)); }
function read(key) { try { return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${key}`)); } catch { return null; } }

// ---- Speed presets ----

export const SPEED_PRESETS = {
  very_slow: { label: 'Very Slow', minDelay: 8000, maxDelay: 12000, description: '~1 msg per 10s' },
  slow: { label: 'Slow', minDelay: 4000, maxDelay: 6000, description: '~1 msg per 5s' },
  normal: { label: 'Normal', minDelay: 1500, maxDelay: 2500, description: '~1 msg per 2s' },
  fast: { label: 'Fast', minDelay: 700, maxDelay: 1200, description: '~1 msg per 1s' },
  very_fast: { label: 'Very Fast', minDelay: 200, maxDelay: 500, description: 'ASAP' },
  custom: { label: 'Custom', minDelay: 2000, maxDelay: 2000, description: 'User-defined' },
};

// ---- Default limits ----

const DEFAULT_GLOBAL_LIMITS = {
  rps: 5,
  rpm: 100,
  rph: 5000,
  tpm: 200000,
  tpd: 2000000,
};

const DEFAULT_AGENT_LIMITS = {
  maxMessagesPerMinute: 5,
};

// ---- Rate Limiter Class ----

class RateLimiter {
  constructor() {
    this.windows = new Map(); // key -> { timestamps: [], tokens: [] }
    this.limits = read('rate_limits') || { global: DEFAULT_GLOBAL_LIMITS, providers: {}, models: {}, agents: {} };
    this.speed = read('debate_speed') || 'normal';
    this.customDelay = read('custom_delay') || 2000;
    this.tokenBudgets = read('token_budgets') || {
      perDebate: null,
      perDay: 500000,
      perMonth: 10000000,
    };
    this.metrics = {
      rpm: 0,
      tpm: 0,
      activeAgents: 0,
      queueSize: 0,
      estimatedCost: 0,
      tokensUsedToday: read('tokens_today') || 0,
      tokensUsedMonth: read('tokens_month') || 0,
      tokensUsedDebate: 0,
      requestsToday: read('requests_today') || 0,
    };
    this.emergencyStopped = false;
    this.warningThresholds = { soft1: 0.8, soft2: 0.9, hard: 1.0 };

    // Clean up old window entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  // Get or create a sliding window
  getWindow(key) {
    if (!this.windows.has(key)) {
      this.windows.set(key, { timestamps: [], tokens: [] });
    }
    return this.windows.get(key);
  }

  // Clean old entries
  cleanup() {
    const now = Date.now();
    for (const [, window] of this.windows) {
      window.timestamps = window.timestamps.filter(t => now - t < 3600000);
      window.tokens = window.tokens.filter(t => now - t.timestamp < 3600000);
    }
  }

  // Check if a request is allowed
  canMakeRequest(providerId, agentId, model) {
    if (this.emergencyStopped) return { allowed: false, reason: 'Emergency stop active', waitMs: 0 };

    const now = Date.now();
    const globalLimits = this.limits.global;

    // Global RPM check
    const globalWindow = this.getWindow('global');
    const globalRpm = globalWindow.timestamps.filter(t => now - t < 60000).length;
    if (globalRpm >= globalLimits.rpm) {
      const oldest = Math.min(...globalWindow.timestamps.filter(t => now - t < 60000));
      return { allowed: false, reason: 'Global RPM limit', waitMs: 60000 - (now - oldest) };
    }

    // Global TPD check
    if (this.metrics.tokensUsedToday >= globalLimits.tpd) {
      return { allowed: false, reason: 'Daily token budget exhausted', waitMs: 0 };
    }

    // Provider RPM check
    if (providerId) {
      const providerLimit = this.getProviderLimit(providerId, 'rpm') || 500;
      const providerWindow = this.getWindow(`provider:${providerId}`);
      const providerRpm = providerWindow.timestamps.filter(t => now - t < 60000).length;
      if (providerRpm >= providerLimit) {
        const oldest = Math.min(...providerWindow.timestamps.filter(t => now - t < 60000));
        return { allowed: false, reason: `Provider ${providerId} RPM limit`, waitMs: 60000 - (now - oldest) };
      }
    }

    // Model RPM check
    if (model) {
      const modelLimit = this.getModelLimit(model, 'rpm') || 200;
      const modelWindow = this.getWindow(`model:${model}`);
      const modelRpm = modelWindow.timestamps.filter(t => now - t < 60000).length;
      if (modelRpm >= modelLimit) {
        const oldest = Math.min(...modelWindow.timestamps.filter(t => now - t < 60000));
        return { allowed: false, reason: `Model ${model} RPM limit`, waitMs: 60000 - (now - oldest) };
      }
    }

    // Agent RPM check
    if (agentId) {
      const agentLimit = this.getAgentLimit(agentId, 'maxMessagesPerMinute') || DEFAULT_AGENT_LIMITS.maxMessagesPerMinute;
      const agentWindow = this.getWindow(`agent:${agentId}`);
      const agentRpm = agentWindow.timestamps.filter(t => now - t < 60000).length;
      if (agentRpm >= agentLimit) {
        const oldest = Math.min(...agentWindow.timestamps.filter(t => now - t < 60000));
        return { allowed: false, reason: `Agent ${agentId} RPM limit`, waitMs: 60000 - (now - oldest) };
      }
    }

    return { allowed: true, reason: null, waitMs: 0 };
  }

  // Record a request
  recordRequest(providerId, agentId, model, tokens = 0) {
    const now = Date.now();

    this.getWindow('global').timestamps.push(now);
    if (providerId) this.getWindow(`provider:${providerId}`).timestamps.push(now);
    if (model) this.getWindow(`model:${model}`).timestamps.push(now);
    if (agentId) this.getWindow(`agent:${agentId}`).timestamps.push(now);

    if (tokens > 0) {
      this.getWindow('global').tokens.push({ timestamp: now, count: tokens });
      this.metrics.tokensUsedToday += tokens;
      this.metrics.tokensUsedMonth += tokens;
      this.metrics.tokensUsedDebate += tokens;
      store('tokens_today', this.metrics.tokensUsedToday);
      store('tokens_month', this.metrics.tokensUsedMonth);
    }

    this.metrics.requestsToday++;
    store('requests_today', this.metrics.requestsToday);
  }

  // Get delay based on speed preset
  getDelay() {
    const preset = SPEED_PRESETS[this.speed] || SPEED_PRESETS.normal;
    if (this.speed === 'custom') {
      const base = this.customDelay;
      const jitter = base * 0.15;
      return base + (Math.random() * 2 - 1) * jitter;
    }
    const range = preset.maxDelay - preset.minDelay;
    return preset.minDelay + Math.random() * range;
  }

  // Settings
  setSpeed(speed) {
    this.speed = speed;
    store('debate_speed', speed);
  }

  setCustomDelay(ms) {
    this.customDelay = ms;
    store('custom_delay', ms);
  }

  getSpeed() { return this.speed; }
  getCustomDelay() { return this.customDelay; }

  // Limits
  setGlobalLimits(limits) {
    this.limits.global = { ...DEFAULT_GLOBAL_LIMITS, ...limits };
    store('rate_limits', this.limits);
  }

  getGlobalLimits() { return this.limits.global; }

  setProviderLimit(providerId, key, value) {
    if (!this.limits.providers[providerId]) this.limits.providers[providerId] = {};
    this.limits.providers[providerId][key] = value;
    store('rate_limits', this.limits);
  }

  getProviderLimit(providerId, key) {
    return this.limits.providers[providerId]?.[key];
  }

  setModelLimit(model, key, value) {
    if (!this.limits.models[model]) this.limits.models[model] = {};
    this.limits.models[model][key] = value;
    store('rate_limits', this.limits);
  }

  getModelLimit(model, key) {
    return this.limits.models[model]?.[key];
  }

  setAgentLimit(agentId, key, value) {
    if (!this.limits.agents[agentId]) this.limits.agents[agentId] = {};
    this.limits.agents[agentId][key] = value;
    store('rate_limits', this.limits);
  }

  getAgentLimit(agentId, key) {
    return this.limits.agents[agentId]?.[key];
  }

  // Token budgets
  setTokenBudgets(budgets) {
    this.tokenBudgets = budgets;
    store('token_budgets', budgets);
  }

  getTokenBudgets() { return this.tokenBudgets; }

  resetDebateTokens() { this.metrics.tokensUsedDebate = 0; }

  // Metrics
  getMetrics() {
    const now = Date.now();
    const globalWindow = this.getWindow('global');

    this.metrics.rpm = globalWindow.timestamps.filter(t => now - t < 60000).length;
    this.metrics.tpm = globalWindow.tokens
      .filter(t => now - t.timestamp < 60000)
      .reduce((sum, t) => sum + t.count, 0);

    return { ...this.metrics };
  }

  // Budget warnings
  getBudgetWarnings() {
    const warnings = [];
    const budgets = this.tokenBudgets;

    if (budgets.perDay) {
      const usage = this.metrics.tokensUsedToday / budgets.perDay;
      if (usage >= this.warningThresholds.hard) warnings.push({ level: 'hard', message: 'Daily budget exhausted', type: 'daily' });
      else if (usage >= this.warningThresholds.soft2) warnings.push({ level: 'soft2', message: '90% of daily budget used', type: 'daily' });
      else if (usage >= this.warningThresholds.soft1) warnings.push({ level: 'soft1', message: '80% of daily budget used', type: 'daily' });
    }

    if (budgets.perMonth) {
      const usage = this.metrics.tokensUsedMonth / budgets.perMonth;
      if (usage >= this.warningThresholds.hard) warnings.push({ level: 'hard', message: 'Monthly budget exhausted', type: 'monthly' });
      else if (usage >= this.warningThresholds.soft2) warnings.push({ level: 'soft2', message: '90% of monthly budget used', type: 'monthly' });
      else if (usage >= this.warningThresholds.soft1) warnings.push({ level: 'soft1', message: '80% of monthly budget used', type: 'monthly' });
    }

    return warnings;
  }

  // Emergency stop
  emergencyStop() { this.emergencyStopped = true; }
  emergencyResume() { this.emergencyStopped = false; }
  isEmergencyStopped() { return this.emergencyStopped; }

  // Reset daily counters (call on day change)
  resetDaily() {
    this.metrics.tokensUsedToday = 0;
    this.metrics.requestsToday = 0;
    store('tokens_today', 0);
    store('requests_today', 0);
  }

  // Reset monthly
  resetMonthly() {
    this.metrics.tokensUsedMonth = 0;
    store('tokens_month', 0);
  }
}

export const rateLimiter = new RateLimiter();
