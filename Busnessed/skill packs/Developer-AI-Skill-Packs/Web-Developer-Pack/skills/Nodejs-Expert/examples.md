# Nodejs-Expert Examples

## Beginner: File Processing with Streams

**Description**: Read a large CSV file, process rows, and write results using streams.

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

const transformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const line = chunk.toString();
    const rows = line.split('\n').filter(Boolean).map(row => {
      const [name, email, age] = row.split(',');
      return { name, email, age: parseInt(age, 10) };
    });

    const filtered = rows.filter(r => r.age >= 18);
    const output = filtered.map(r =>
      `${r.name},${r.email},${r.age}\n`
    ).join('');

    callback(null, output);
  },
});

async function processFile(inputPath, outputPath) {
  try {
    await pipeline(
      createReadStream(inputPath),
      transformStream,
      createGzip(),
      createWriteStream(outputPath)
    );
    console.log(`File processed: ${outputPath}`);
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}

processFile('input.csv', 'output.csv.gz');
```

**Explanation**: This demonstrates streaming pipeline with error handling, Transform stream for CSV parsing, compression with Gzip, and the Promise-based pipeline API for proper cleanup.

## Intermediate: Worker Thread for Image Processing

**Description**: Offload image resizing to a worker thread for non-blocking operation.

```js
// main.js
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resizeImage(inputPath, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, 'imageWorker.js'), {
      workerData: { inputPath, outputPath, width, height },
    });

    worker.on('message', (result) => {
      if (result.success) resolve(result.outputPath);
      else reject(new Error(result.error));
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
}

async function processBatch(images) {
  const results = await Promise.allSettled(
    images.map(img => resizeImage(img.input, img.output, 800, 600))
  );

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`Image ${i + 1} processed: ${result.value}`);
    } else {
      console.error(`Image ${i + 1} failed: ${result.reason}`);
    }
  });
}

// imageWorker.js
import { parentPort, workerData } from 'node:worker_threads';
import sharp from 'sharp';

async function process() {
  try {
    const { inputPath, outputPath, width, height } = workerData;
    await sharp(inputPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    parentPort.postMessage({ success: true, outputPath });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

process();
```

**Explanation**: This shows Worker Thread pattern for CPU-intensive image processing, Promise-based wrapper for worker communication, error handling across thread boundaries, and batch processing with Promise.allSettled.

## Advanced: Cluster Mode HTTP Server with Graceful Shutdown

**Description**: Production HTTP server with cluster, health checks, and graceful shutdown.

```js
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import { createServer } from './server.js';
import { createLogger } from './logger.js';

const logger = createLogger();
const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running`);

  const workers = new Set();

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers.add(worker);

    worker.on('message', (msg) => {
      if (msg.type === 'health') {
        logger.info(`Health check from worker ${worker.process.pid}`);
      }
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died (${signal || code})`);
    workers.delete(worker);
    logger.info('Starting replacement worker...');
    cluster.fork();
  });

  const shutdown = () => {
    logger.info('Primary shutting down...');
    for (const worker of workers) {
      worker.send('shutdown');
    }
    setTimeout(() => process.exit(0), 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
} else {
  const server = createServer();

  server.listen(3000, () => {
    logger.info(`Worker ${process.pid} started on port 3000`);
  });

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      logger.info(`Worker ${process.pid} shutting down...`);
      server.close(() => {
        logger.info(`Worker ${process.pid} closed`);
        process.exit(0);
      });
    }
  });

  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'Uncaught exception');
    server.close(() => process.exit(1));
  });

  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled rejection');
  });
}

// server.js
import http from 'node:http';

export function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      }));
      return;
    }

    if (req.url === '/ready') {
      res.writeHead(200);
      res.end('ready');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Handled by worker ${process.pid}\n`);
  });
}
```

**Explanation**: This production example demonstrates cluster primary/worker pattern with auto-restart on worker death, graceful shutdown with SIGTERM propagation to workers, health/readiness endpoints for orchestration, memory usage reporting, and signal handling for both primary and worker processes.

## Production: Event-Driven Data Pipeline

**Description**: An event-driven ETL pipeline with backpressure, logging, and error recovery.

```js
import { EventEmitter } from 'node:events';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

class DataPipeline extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.stats = { processed: 0, errors: 0, skipped: 0 };
    this.setMaxListeners(20);
  }

  addTransform(transformFn, name = 'unnamed') {
    this.on('transform', async (data) => {
      try {
        const result = await transformFn(data);
        if (result !== null) {
          this.stats.processed++;
          this.emit('data', result);
        } else {
          this.stats.skipped++;
        }
      } catch (err) {
        this.stats.errors++;
        this.emit('error', new Error(`Transform ${name} failed: ${err.message}`));
      }
    });
    return this;
  }

  async run(inputPath, outputPath) {
    this.emit('start', { inputPath, outputPath });

    const transformStream = new Transform({
      objectMode: true,
      highWaterMark: 16,
      transform(chunk, encoding, callback) {
        this.emit('transform', chunk);
        callback();
      },
    });

    try {
      await pipeline(
        createReadStream(inputPath, { encoding: 'utf-8' }),
        transformStream,
        createWriteStream(outputPath)
      );
      this.emit('complete', this.stats);
    } catch (err) {
      this.emit('pipelineError', err);
      throw err;
    }
  }
}

// Usage
const pipeline = new DataPipeline();

pipeline.addTransform(async (row) => {
  const parsed = JSON.parse(row.toString());
  return parsed.status === 'active' ? parsed : null;
}, 'filter-active');

pipeline.addTransform(async (data) => {
  return { ...data, processedAt: new Date().toISOString() };
}, 'add-timestamp');

pipeline.on('start', ({ inputPath }) => console.log(`Processing ${inputPath}`));
pipeline.on('complete', (stats) => console.log(`Done: ${JSON.stringify(stats)}`));
pipeline.on('error', (err) => console.error(`Transform error: ${err.message}`));

await pipeline.run('input.jsonl', 'output.jsonl');
```

**Explanation**: This production pattern uses EventEmitter for a plugin-style pipeline architecture, Transform streams with highWaterMark for backpressure control, statistics tracking through the pipeline, error isolation per transform stage, and composable transformation functions.
