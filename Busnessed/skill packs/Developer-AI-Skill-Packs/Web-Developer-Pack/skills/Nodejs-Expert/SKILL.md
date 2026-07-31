---
name: "Nodejs-Expert"
version: "1.0.0"
domain: "Web Development"
activation_description: "Load this skill when building server-side JavaScript applications, debugging Node.js processes, optimizing async code, or working with file systems, streams, and worker threads"
purpose: "Provides comprehensive guidance for building production-ready Node.js applications with proper async patterns, error handling, performance optimization, and system integration"
---

## Capabilities

1. Master the Node.js event loop phases (timers, poll, check, close) and microtask vs macrotask execution order
2. Implement all stream types (Readable, Writable, Transform, Duplex) with backpressure handling and piping
3. Manipulate binary data with Buffer, TypedArrays, and DataView for efficient data processing
4. Offload CPU-intensive work to Worker Threads with proper communication patterns
5. Scale across CPU cores using Cluster module with load balancing strategies
6. Apply async patterns effectively: callbacks, Promises, async/await, EventEmitter, and async generators
7. Implement comprehensive error handling with try/catch, domains, uncaughtException, and unhandledRejection
8. Perform file system operations with fs/promises, streams, and file descriptors
9. Manage packages with npm, yarn, pnpm, npx, and understand dependency resolution
10. Build applications using ESM (import/export) and CJS (require/module.exports) with interop patterns
11. Understand Node.js module resolution algorithm and module caching
12. Implement process management with PM2, nodemon, signals, and graceful shutdown
13. Debug Node.js applications with --inspect, Chrome DevTools, and heap snapshots
14. Configure environment variables with dotenv, cross-env, and OS-level configuration

## Limitations

1. Does not cover Deno or Bun runtime specifics
2. Cannot replace deep knowledge of C++ addons or native Node.js extensions (N-API)
3. Performance profiling requires system-level knowledge (CPU profiling, heap dumps, GC tuning)
4. Does not cover full DevOps deployment (Docker, CI/CD, monitoring stacks)
5. Large-scale distributed systems patterns (microservices, message queues) are not covered in depth
6. Does not include framework-specific Node.js patterns for Express, Koa, Fastify (separate skills)

## Required Tools

- Node.js 18+ (LTS recommended)
- npm/pnpm/yarn
- Code editor with Node.js debugging support (VS Code)
- Chrome DevTools for Node.js debugging (chrome://inspect)
- Process manager (PM2 for production)
- nodemon for development auto-restart
- ESLint with Node.js plugin
- Clinic.js or 0x for performance profiling

## Execution Workflow

1. Determine module system (ESM for new projects, CJS for legacy compatibility)
2. Set up project with package.json, scripts, and dependency management
3. Configure environment variables with .env files and validation (Zod/envalid)
4. Implement core logic using appropriate async patterns (Promises, async/await, streams)
5. Add error handling at application boundaries with proper error types
6. Set up file system operations with fs/promises for async I/O
7. Implement streaming for large data processing with backpressure handling
8. Offload CPU-intensive operations to Worker Threads
9. Configure clustering for multi-core utilization in production
10. Implement graceful shutdown handling SIGTERM, SIGINT signals
11. Set up logging with pino, winston, or similar structured logger
12. Add health check endpoints for monitoring and orchestration
13. Configure process-level error handling (uncaughtException, unhandledRejection)
14. Implement caching and performance optimization strategies
15. Build and test production deployment

## Decision Tree

1. **Module system?** → New project → ESM (type: module) → Legacy project → CJS (require) → Mixed → Use .mjs/.cjs extensions
2. **Async pattern?** → Sequential operations → async/await → Parallel operations → Promise.all → Stream processing → Pipe-based streams → Event-driven → EventEmitter → CPU-heavy → Worker Threads
3. **Error handling?** → Application code → try/catch async functions → Express middleware → Error-handling middleware → Uncaught exceptions → process.on('uncaughtException') → Unhandled rejections → process.on('unhandledRejection')
4. **Performance issue?** → Blocking event loop → Refactor to async → CPU-bound → Worker Threads → I/O-bound → Streams + backpressure → Memory leak → Heap snapshot analysis → Slow queries → Caching + connection pooling
5. **Data size?** → Small files → fs.readFile → Large files → fs.createReadStream + pipeline → Database results → Cursor/stream → Real-time data → Transform stream
6. **Deployment?** → Development → nodemon → Single process → node app.js → Multi-core → PM2 cluster mode → Container → Docker + orchestration
7. **Debugging?** → Basic → console.log + inspector → Step through → VS Code debugger → Memory issues → heapdump + Chrome DevTools → Performance → Clinic.js flamegraph

## Review Checklist

- [ ] Module system consistent (no mixing of require and import without proper interop)
- [ ] All async operations have proper error handling with try/catch
- [ ] Event listeners cleaned up to prevent memory leaks
- [ ] Streams have error handlers and use pipeline over pipe
- [ ] File descriptors and database connections properly closed
- [ ] Graceful shutdown handles in-flight requests and cleanup
- [ ] Environment variables validated before application starts
- [ ] Sensitive data (passwords, tokens) not logged or exposed
- [ ] Worker Threads used for CPU-intensive operations, not I/O
- [ ] Package.json scripts defined for development and production
- [ ] Dependencies pinned with exact versions in production
- [ ] No blocking synchronous operations in the main event loop
- [ ] Process uncaughtException and unhandledRejection handlers configured
- [ ] Buffer encoding specified explicitly (utf-8, base64, hex)
- [ ] Module circular dependencies avoided

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Event loop blocked | Synchronous CPU-heavy operation | Move to Worker Thread; break into chunks with setImmediate |
| Memory leak | Growing listeners or retained references | Use heap snapshot; check EventEmitter listeners count |
| ECONNRESET errors | TCP connection closed abruptly | Add retry logic; check keep-alive settings |
| EMFILE error | Too many open file descriptors | Increase ulimit; close streams properly; use file pool |
| Port already in use | Process not properly killed | Kill process with taskkill/fkill; use port in use detection |
| Module not found | Path resolution issue | Check import/require paths; verify package.json exports |
| Worker thread crash | Unhandled error in worker | Add try/catch in worker; handle worker.on('error') |
| High memory usage | Large data kept in memory | Use streams; implement pagination; use Buffer pool |
| Circular dependency | Modules requiring each other | Refactor shared logic into separate module; use lazy require |
| npm install failing | Version conflicts or network | Clear cache; use --legacy-peer-deps; check registry |

## Best Practices

1. Always use async/await for async code; avoid raw Promise chains
2. Use pipeline() for streams instead of .pipe() for proper cleanup
3. Handle all errors with specific error types (not just generic Error)
4. Use fs/promises API instead of callback-based fs methods
5. Prefer ESM for new projects; use .mjs for mixed projects
6. Validate environment variables at startup with a schema
7. Implement proper shutdown sequence (SIGTERM → stop accepting → drain → close)
8. Use worker_threads for CPU-intensive tasks (image processing, data transformation)
9. Use cluster for multi-core HTTP servers in production
10. Pin dependency versions in package.json for reproducible builds
11. Use structured logging (JSON format) for production log aggregation
12. Implement health checks (/health, /ready, /live endpoints)
13. Set max listeners on EventEmitters to detect memory leaks
14. Use node --inspect for debugging; don't leave inspector enabled in production

## Anti-Patterns

1. Using synchronous fs operations (readFileSync, writeFileSync) in server code
2. Not handling promise rejections (unhandledRejection without handler)
3. Creating deep callback nests (callback hell) instead of using async/await
4. Ignoring backpressure when writing to streams
5. Starting worker threads for I/O operations (defeats purpose)
6. Modifying require.cache or module._compile for hot reloading
7. Using process.exit() without cleanup (use graceful shutdown)
8. Returning raw Error objects in API responses (expose internals)
9. Storing secrets in code (use environment variables or secret manager)
10. Using console.log for production logging (use structured logger)

## References

See companion files for detailed references, examples, templates, checklists, and code snippets.
