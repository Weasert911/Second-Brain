# Nodejs-Expert Snippets

## Snippet 1: Event Loop Phase Measurement

```js
function measureEventLoopLag() {
  const start = Date.now();
  setImmediate(() => {
    const lag = Date.now() - start;
    console.log(`Event loop lag: ${lag}ms`);
  });
}
```

**When to use**: Monitor event loop health in production. High lag (>50ms) indicates blocked event loop.

## Snippet 2: Pipeline with Multiple Transforms

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';

const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

const addTimestamp = new Transform({
  transform(chunk, encoding, callback) {
    const line = chunk.toString();
    callback(null, `[${new Date().toISOString()}] ${line}`);
  },
});

await pipeline(
  createReadStream('input.txt'),
  uppercase,
  addTimestamp,
  createWriteStream('output.txt')
);
```

**When to use**: Chained data transformations with proper cleanup and backpressure handling.

## Snippet 3: Graceful Shutdown Handler

```js
function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    console.log(`${signal} received. Starting graceful shutdown...`);

    server.close(() => {
      console.log('Server connections closed');
      process.exit(0);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    shutdown('uncaughtException');
  });
}
```

**When to use**: Every production Node.js server to ensure clean shutdown and prevent data loss.

## Snippet 4: Environment Variable Validation

```js
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
```

**When to use**: Application startup to validate all required environment variables exist and are correctly formatted.

## Snippet 5: Memory Usage Reporter

```js
function logMemoryUsage() {
  const used = process.memoryUsage();
  const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  console.log({
    rss: formatMB(used.rss),
    heapTotal: formatMB(used.heapTotal),
    heapUsed: formatMB(used.heapUsed),
    external: formatMB(used.external),
    arrayBuffers: formatMB(used.arrayBuffers || 0),
  });
}

setInterval(logMemoryUsage, 30000).unref();
```

**When to use**: Monitor memory trends in development and production. Set interval with .unref() to not block process exit.

## Snippet 6: Worker Thread with Progress Reporting

```js
// main.js
import { Worker } from 'node:worker_threads';

const worker = new Worker('./worker.js');
worker.on('message', (msg) => {
  if (msg.type === 'progress') {
    console.log(`Progress: ${msg.percent}%`);
  } else if (msg.type === 'result') {
    console.log('Complete:', msg.data);
  }
});
worker.postMessage({ task: 'process-data', items: 1000 });

// worker.js
import { parentPort } from 'node:worker_threads';

parentPort.on('message', async ({ task, items }) => {
  for (let i = 0; i < items; i++) {
    await doWork();
    if (i % 100 === 0) {
      parentPort.postMessage({
        type: 'progress',
        percent: Math.round((i / items) * 100),
      });
    }
  }
  parentPort.postMessage({ type: 'result', data: 'done' });
});
```

**When to use**: Long-running worker tasks where you need feedback on progress to update UI or logs.

## Snippet 7: Retry with Exponential Backoff

```js
async function retry(fn, options = {}) {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000 } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      const jitter = Math.random() * 1000;
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay + jitter}ms...`);
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}

await retry(() => fetch('https://api.example.com/data'), {
  maxRetries: 5,
  baseDelay: 500,
});
```

**When to use**: Network calls to unreliable services, database connections, or any operation that may transiently fail.

## Snippet 8: Directory Tree Walk

```js
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else {
      yield fullPath;
    }
  }
}

for await (const file of walkDir('./src')) {
  console.log(file);
}
```

**When to use**: Recursive file processing, build tools, static site generators, or code analysis.

## Snippet 9: Timeout Wrapper for Async Operations

```js
function withTimeout(promise, ms, errorMessage = 'Operation timed out') {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeout]);
}

await withTimeout(
  fetch('https://api.example.com/slow-endpoint'),
  5000,
  'API request timed out after 5s'
);
```

**When to use**: External API calls, database queries, or any async operation that could hang indefinitely.

## Snippet 10: Buffer to Stream Conversion

```js
import { Readable } from 'node:stream';

function bufferToStream(buffer) {
  return Readable.from(buffer);
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

const stream = bufferToStream(Buffer.from('Hello World'));
const backToBuffer = await streamToBuffer(stream);
```

**When to use**: When you need to interface between buffer-based APIs and stream-based APIs.

## Snippet 11: Automatic Restart with File Watching

```js
import { watch } from 'node:fs/promises';
import { spawn } from 'node:child_process';

async function devServer(entryPoint) {
  let child = spawn('node', [entryPoint], { stdio: 'inherit' });

  const watcher = watch('./src', { recursive: true });
  for await (const event of watcher) {
    if (event.filename.endsWith('.js')) {
      console.log(`Change detected: ${event.filename}`);
      child.kill('SIGTERM');
      await new Promise(r => setTimeout(r, 500));
      child = spawn('node', [entryPoint], { stdio: 'inherit' });
    }
  }
}

devServer('src/index.js');
```

**When to use**: Lightweight development server restart without nodemon dependency.

## Snippet 12: Promise Pool with Concurrency Limit

```js
async function promisePool(tasks, concurrency) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);

    if (concurrency <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

const tasks = Array.from({ length: 20 }, (_, i) =>
  () => fetch(`https://api.example.com/page/${i + 1}`)
);

const responses = await promisePool(tasks, 5);
```

**When to use**: Rate-limited API calls, batch processing, or any operation that needs controlled concurrency.

## Snippet 13: Custom Error Classes

```js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

throw new NotFoundError('User');
```

**When to use**: Structured error handling with distinct types for different failure modes, enabling proper error middleware responses.

## Snippet 14: System Information Reporter

```js
import { cpus, totalmem, freemem, hostname, platform, release, uptime } from 'node:os';
import { version } from 'node:process';

function systemInfo() {
  return {
    hostname: hostname(),
    platform: platform(),
    release: release(),
    uptime: uptime(),
    nodeVersion: version,
    cpus: cpus().length,
    cpuModel: cpus()[0].model,
    totalMemory: `${(totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    freeMemory: `${(freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    memoryUsage: process.memoryUsage(),
    pid: process.pid,
    cwd: process.cwd(),
  };
}

console.log(systemInfo());
```

**When to use**: Health check endpoints, debugging, diagnostic reports.

## Snippet 15: Async Generator Pagination

```js
async function* paginate(url, options = {}) {
  const { pageSize = 100, maxPages = Infinity } = options;
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= maxPages) {
    const response = await fetch(`${url}?page=${page}&limit=${pageSize}`);
    const data = await response.json();
    yield data.items;
    hasMore = data.items.length === pageSize;
    page++;
  }
}

for await (const batch of paginate('https://api.example.com/users', { pageSize: 50 })) {
  for (const user of batch) {
    console.log(user.name);
  }
}
```

**When to use**: Paginated API consumption where you need to process items as pages arrive.
