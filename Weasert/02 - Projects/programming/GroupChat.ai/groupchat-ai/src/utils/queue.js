import { rateLimiter } from './rateLimiter';

// Request queue with priority, retry, and backoff

class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.activeRequests = 0;
    this.maxConcurrent = 3;
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    const metrics = {
      queueSize: this.queue.length,
      activeAgents: this.activeRequests,
    };
    this.listeners.forEach(fn => fn(metrics));
  }

  // Add request to queue
  enqueue(request) {
    return new Promise((resolve, reject) => {
      const entry = {
        id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        providerId: request.providerId,
        agentId: request.agentId,
        model: request.model,
        fn: request.fn, // async function to execute
        priority: request.priority || 0,
        retryCount: 0,
        maxRetries: request.maxRetries || 3,
        resolve,
        reject,
        enqueuedAt: Date.now(),
        status: 'queued',
      };

      // Insert by priority (higher = first)
      const idx = this.queue.findIndex(q => q.priority < entry.priority);
      if (idx >= 0) {
        this.queue.splice(idx, 0, entry);
      } else {
        this.queue.push(entry);
      }

      this.notify();
      this.process();
    });
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const entry = this.queue.shift();
      entry.status = 'processing';
      this.activeRequests++;
      this.notify();

      // Check rate limits before executing
      const check = rateLimiter.canMakeRequest(entry.providerId, entry.agentId, entry.model);
      if (!check.allowed) {
        if (check.waitMs > 0 && entry.retryCount < entry.maxRetries) {
          // Wait and re-queue
          entry.retryCount++;
          entry.status = 'waiting';
          this.activeRequests--;
          this.notify();

          await sleep(Math.min(check.waitMs, 5000));
          this.queue.unshift(entry);
          continue;
        } else {
          entry.status = 'failed';
          this.activeRequests--;
          entry.reject(new Error(check.reason));
          this.notify();
          continue;
        }
      }

      try {
        const result = await this.executeWithBackoff(entry);
        entry.status = 'completed';
        entry.resolve(result);
      } catch (err) {
        entry.status = 'failed';
        entry.reject(err);
      }

      this.activeRequests--;
      this.notify();
    }

    this.processing = false;
  }

  async executeWithBackoff(entry) {
    let lastError;

    for (let attempt = 0; attempt <= entry.maxRetries; attempt++) {
      try {
        const result = await entry.fn();
        // Record successful request
        rateLimiter.recordRequest(entry.providerId, entry.agentId, entry.model, result?.tokens || 0);
        return result;
      } catch (err) {
        lastError = err;
        entry.retryCount = attempt + 1;

        // Check if it's a rate limit error (429)
        const is429 = err.message?.includes('429') || err.message?.includes('rate') || err.message?.includes('Rate');
        if (is429 && attempt < entry.maxRetries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
          await sleep(backoffMs);
          continue;
        }

        // Non-retryable error
        throw err;
      }
    }

    throw lastError;
  }

  clear() {
    this.queue.forEach(entry => {
      entry.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.notify();
  }

  getQueueSize() { return this.queue.length; }
  getActiveCount() { return this.activeRequests; }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const requestQueue = new RequestQueue();
