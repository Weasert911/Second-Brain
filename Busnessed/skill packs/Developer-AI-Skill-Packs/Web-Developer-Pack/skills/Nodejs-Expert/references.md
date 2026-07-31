# Nodejs-Expert References

## Official Documentation

- **Node.js Docs**: https://nodejs.org/en/docs - Complete API reference, guides, and deprecation notices
- **Event Loop Guide**: https://nodejs.org/en/guides/event-loop-timers-and-nexttick - In-depth event loop explanation
- **Streams Guide**: https://nodejs.org/en/learn/manipulating-files/streams - Stream types, backpressure, and piping
- **Worker Threads**: https://nodejs.org/api/worker_threads.html - Multithreading for CPU-intensive work
- **Cluster Module**: https://nodejs.org/api/cluster.html - Multi-core scaling documentation
- **ESM vs CJS**: https://nodejs.org/api/esm.html - Module system interop and migration guide
- **Debugging Guide**: https://nodejs.org/en/learn/getting-started/debugging - Inspector, Chrome DevTools
- **npm Docs**: https://docs.npmjs.com/ - Package management, scripts, workspaces
- **PM2 Docs**: https://pm2.keymetrics.io/docs/usage/quick-start/ - Process management, clustering, monitoring

## Terminology

1. **Event Loop**: Mechanism that handles asynchronous callbacks and I/O operations in phases
2. **Microtask**: Tasks executed after each macrotask (Promise.then, queueMicrotask, process.nextTick)
3. **Macrotask**: Tasks from event loop phases (timers, I/O callbacks, setImmediate)
4. **Buffer**: Raw binary data allocation outside V8 heap for efficient data handling
5. **Stream**: Abstract interface for reading/writing data in chunks with backpressure
6. **Backpressure**: Mechanism that slows data production when consumer can't keep up
7. **Worker Thread**: Isolated JavaScript thread with its own V8 instance for parallel execution
8. **Cluster**: Multiple Node.js processes sharing server ports for load distribution
9. **EventEmitter**: Pattern for emitting named events and attaching listeners
10. **libuv**: C library that provides the event loop, async I/O, and thread pool
11. **V8**: JavaScript engine that compiles and executes JavaScript in Node.js
12. **N-API**: Native API for building C/C++ addons that work across Node.js versions
13. **Module Resolution**: Algorithm Node.js uses to find modules (require.resolve)
14. **CommonJS**: Module system using require() and module.exports
15. **ESM**: ECMAScript module system using import and export statements

## Architecture Notes

- Node.js runs a single thread for JavaScript execution; all concurrent I/O is handled by libuv's thread pool
- The event loop has phases: timers → pending callbacks → idle/prepare → poll → check → close
- Microtasks (Promise, nextTick) are processed between each phase
- Worker threads each have their own event loop and V8 instance, sharing memory via SharedArrayBuffer
- Cluster master process distributes connections to worker processes using round-robin (default on Linux)
- Streams implement the EventEmitter interface and emit 'data', 'end', 'error', 'finish', 'close' events
- The module system caches modules after first require; singleton pattern by default
- process.env provides access to environment variables; mutation affects the current process
- Error-first callbacks (err, result) are a Node.js convention for async operations

## Key APIs

- `fs.promises.readFile/writeFile/readdir/unlink/stat` - Async file operations
- `fs.createReadStream/createWriteStream` - Streaming file I/O
- `stream.Readable.from(iterable)` - Create readable stream from iterable
- `stream.pipeline(source, transform, destination, callback)` - Stream piping with cleanup
- `stream.finished(stream, callback)` - Detect stream completion/error
- `worker_threads.Worker` - Create worker for CPU-intensive tasks
- `worker_threads.parentPort.postMessage(data)` - Send data from worker
- `cluster.fork()` - Fork worker process in cluster mode
- `buffer.Buffer.from(data, encoding)` - Create buffer from data
- `buffer.Buffer.alloc(size)` - Allocate zero-filled buffer
- `child_process.spawn(command, args)` - Spawn child process
- `process.on('uncaughtException', handler)` - Catch uncaught exceptions
- `process.on('unhandledRejection', handler)` - Catch unhandled promise rejections
- `setImmediate(callback)` - Execute callback after I/O callbacks
- `process.nextTick(callback)` - Execute callback before next event loop phase
- `performance.now()` - High-resolution timestamp for profiling

## Conventions

- **File naming**: kebab-case for modules (`file-utils.js`), PascalCase for classes (`UserService.js`)
- **Exports**: Named exports for utilities, default export for main class/function
- **Error handling**: Create custom error classes extending Error with statusCode
- **Async patterns**: async/await for Promises, pipeline for streams, EventEmitter for events
- **Configuration**: Load env vars at startup with validation, freeze config object
- **Logging**: Structured JSON logging with severity levels, correlation IDs
- **Module organization**: Entry point at root, logic in lib/ or src/, tests in __tests__/
- **Script naming**: start, dev, build, test, lint, type-check as npm scripts

## Project Structure Recommendation

```
my-node-app/
  src/
    index.js           # Entry point
    app.js             # Application setup
    config/
      index.js         # Configuration loader
      env.js           # Environment variable validation
    lib/
      logger.js        # Structured logging
      errors.js        # Custom error classes
    services/
      userService.js
      authService.js
    middleware/
      errorHandler.js
      auth.js
    routes/
      userRoutes.js
      authRoutes.js
    utils/
      asyncHandler.js
      validators.js
    workers/
      imageProcessor.js
      dataExporter.js
  __tests__/
    services/
      userService.test.js
    integration/
      api.test.js
  scripts/
    seed.js
    migrate.js
  package.json
  .env.example
  .eslintrc.js
  Dockerfile
```
