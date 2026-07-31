# Nodejs-Expert Templates

## Template 1: Express Server with Graceful Shutdown

**Name**: `express-server-template`
**Description**: Express server setup with graceful shutdown, health checks, and error handling.

```js
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || {{port}};

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready' });
});

// {{routePrefix}} routes
import {{routesModule}} from './routes/{{routesFile}}';
app.use('/api/{{routePrefix}}', {{routesModule}});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, {{shutdownTimeout}});
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
```

**Usage Notes**: Replace `{{port}}` (e.g., `3000`), `{{routePrefix}}` (e.g., `users`), `{{routesModule}}` (e.g., `userRoutes`), `{{routesFile}}` (e.g., `userRoutes.js`), `{{shutdownTimeout}}` (e.g., `10000`).

## Template 2: Worker Thread Pool

**Name**: `worker-pool-template`
**Description**: A reusable worker thread pool for parallel CPU-intensive tasks.

```js
import { Worker } from 'node:worker_threads';
import { cpus } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WorkerPool {
  constructor(workerFile, poolSize = cpus().length) {
    this.workerFile = join(__dirname, workerFile);
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.activeCount = 0;

    for (let i = 0; i < poolSize; i++) {
      this.createWorker();
    }
  }

  createWorker() {
    const worker = new Worker(this.workerFile);
    worker.isAvailable = true;
    worker.on('message', (result) => {
      worker.isAvailable = true;
      this.activeCount--;
      if (worker.currentTask) {
        worker.currentTask.resolve(result);
        worker.currentTask = null;
      }
      this.processQueue();
    });
    worker.on('error', (err) => {
      worker.isAvailable = true;
      this.activeCount--;
      if (worker.currentTask) {
        worker.currentTask.reject(err);
        worker.currentTask = null;
      }
      this.createWorker();
    });
    this.workers.push(worker);
  }

  exec(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  processQueue() {
    if (this.queue.length === 0) return;
    const availableWorker = this.workers.find(w => w.isAvailable);
    if (!availableWorker) return;

    availableWorker.isAvailable = false;
    this.activeCount++;
    const task = this.queue.shift();
    availableWorker.currentTask = task;
    availableWorker.postMessage(task.data);
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.queue = [];
  }
}

export default WorkerPool;
```

**Usage Notes**: The worker file should listen for `message` events and post results back. Replace poolSize default if a different concurrency is desired.

## Template 3: Structured Logger

**Name**: `logger-template`
**Description**: Structured JSON logger with log levels and serialization.

```js
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.name = options.name || 'app';
  }

  shouldLog(level) {
    return levels[level] <= levels[this.level];
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      name: this.name,
      message,
      pid: process.pid,
      ...meta,
    });
  }

  error(message, meta) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message, meta) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message, meta) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  debug(message, meta) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, meta));
    }
  }

  child(bindings) {
    const child = new Logger({ level: this.level, name: this.name });
    child.formatMessage = (level, message, meta) => {
      return this.formatMessage(level, message, { ...bindings, ...meta });
    };
    return child;
  }
}

export default Logger;
```

**Usage Notes**: Customize log levels as needed. Use `child()` for request-scoped loggers with correlation IDs. Send output to stdout/stderr for containerized environments.

## Template 4: Configuration Loader with Validation

**Name**: `config-template`
**Description**: Environment variable configuration loader with validation.

```js
import 'dotenv/config';

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new ConfigError(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name, defaultValue) {
  return process.env[name] || defaultValue;
}

const config = Object.freeze({
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: parseInt(optionalEnv('PORT', '{{defaultPort}}'), 10),
  HOST: optionalEnv('HOST', '0.0.0.0'),

  DATABASE_URL: requireEnv('DATABASE_URL'),
  REDIS_URL: optionalEnv('REDIS_URL', null),

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),

  LOG_LEVEL: optionalEnv('LOG_LEVEL', 'info'),
  LOG_FORMAT: optionalEnv('LOG_FORMAT', 'json'),

  CORS_ORIGIN: optionalEnv('CORS_ORIGIN', '*'),

  RATE_LIMIT_WINDOW_MS: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '{{rateLimitWindow}}'), 10),
  RATE_LIMIT_MAX: parseInt(optionalEnv('RATE_LIMIT_MAX', '{{rateLimitMax}}'), 10),

  isProduction: () => config.NODE_ENV === 'production',
  isDevelopment: () => config.NODE_ENV === 'development',
  isTest: () => config.NODE_ENV === 'test',
});

export default config;
```

**Usage Notes**: Replace `{{defaultPort}}` (e.g., `3000`), `{{rateLimitWindow}}` (e.g., `900000`), `{{rateLimitMax}}` (e.g., `100`). Add all required environment variables with `requireEnv`, optional ones with `optionalEnv`.

## Template 5: File Watcher

**Name**: `file-watcher-template`
**Description**: Watch files for changes and execute callbacks.

```js
import { watch } from 'node:fs';
import { EventEmitter } from 'node:events';
import { extname } from 'node:path';

class FileWatcher extends EventEmitter {
  constructor(options = {}) {
    super();
    this.watchedFiles = new Map();
    this.debounceMs = options.debounceMs || {{debounceMs}};
    this.extensions = options.extensions || ['{{extension}}'];
  }

  add(filePath) {
    const ext = extname(filePath);
    if (!this.extensions.includes(ext)) {
      console.warn(`Extension ${ext} not in watch list`);
      return;
    }

    if (this.watchedFiles.has(filePath)) return;

    const debouncedHandler = this.debounce((eventType) => {
      this.emit('change', { filePath, eventType });
      this.emit('change:' + filePath, eventType);
    }, this.debounceMs);

    const watcher = watch(filePath, (eventType) => {
      debouncedHandler(eventType);
    });

    this.watchedFiles.set(filePath, watcher);
    console.log(`Watching: ${filePath}`);
  }

  remove(filePath) {
    const watcher = this.watchedFiles.get(filePath);
    if (watcher) {
      watcher.close();
      this.watchedFiles.delete(filePath);
    }
  }

  debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  close() {
    for (const [path, watcher] of this.watchedFiles) {
      watcher.close();
    }
    this.watchedFiles.clear();
  }
}

export default FileWatcher;
```

**Usage Notes**: Replace `{{debounceMs}}` (e.g., `300`), `{{extension}}` (e.g., `.js`, `.ts`). Listen for 'change' events. Use for live reload, log monitoring, or config hot-reload.

## Template 6: Process Manager Script

**Name**: `process-manager-template`
**Description**: PM2 ecosystem configuration for production deployment.

```js
module.exports = {
  apps: [{
    name: '{{appName}}',
    script: './{{entryFile}}',
    instances: '{{instances}}',
    exec_mode: '{{execMode}}',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    max_memory_restart: '{{maxMemory}}',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/{{appName}}-error.log',
    out_file: './logs/{{appName}}-out.log',
    merge_logs: true,
    watch: false,
    max_restarts: {{maxRestarts}},
    restart_delay: {{restartDelay}},
    autorestart: true,
    kill_timeout: {{killTimeout}},
    listen_timeout: {{listenTimeout}},
    health_check_url: '/health',
  }],
};
```

**Usage Notes**: Replace `{{appName}}`, `{{entryFile}}` (e.g., `src/index.js`), `{{instances}}` (e.g., `max` or number), `{{execMode}}` (e.g., `cluster` or `fork`), `{{maxMemory}}` (e.g., `500M`), `{{maxRestarts}}` (e.g., `10`), `{{restartDelay}}` (e.g., `4000`), `{{killTimeout}}` (e.g., `5000`), `{{listenTimeout}}` (e.g., `3000`).

## Template 7: Async Handler Wrapper

**Name**: `async-handler-template`
**Description**: Wrap async route handlers for Express/Fastify to catch errors automatically.

```js
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
import { asyncHandler } from './utils/asyncHandler.js';

app.get('/api/{{resource}}', asyncHandler(async (req, res) => {
  const data = await fetchData(req.params.id);
  res.json(data);
}));
```

**Usage Notes**: Replace `{{resource}}` with the route resource name. Use with any Express route handler that uses async/await to avoid try/catch repetition.

## Template 8: Event Emitter Service

**Name**: `event-emitter-template`
**Description**: Typed event emitter service for application events.

```js
import { EventEmitter } from 'node:events';

class {{ServiceName}}Service extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners({{maxListeners}});
  }

  async {{actionMethod}}(data) {
    try {
      this.emit('before:{{action}}', data);
      const result = await this.process(data);
      this.emit('after:{{action}}', { data, result });
      return result;
    } catch (err) {
      this.emit('error:{{action}}', { data, err });
      throw err;
    }
  }

  async process(data) {
    // Implementation
    return data;
  }
}

export default {{ServiceName}}Service;

// Usage
const service = new {{ServiceName}}Service();
service.on('before:{{action}}', (data) => console.log('Processing:', data));
service.on('after:{{action}}', ({ result }) => console.log('Result:', result));
service.on('error:{{action}}', ({ err }) => console.error('Error:', err));
```

**Usage Notes**: Replace `{{ServiceName}}` (e.g., `Order`, `Notification`), `{{actionMethod}}` (e.g., `createOrder`), `{{action}}` (e.g., `create`), `{{maxListeners}}` (e.g., `20`). Use for extensible service architecture with plugin support.
