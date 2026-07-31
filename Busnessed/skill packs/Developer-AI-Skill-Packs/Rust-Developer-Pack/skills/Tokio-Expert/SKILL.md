---
name: "Tokio-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Tokio expert skill for async runtime, tasks, channels, I/O, timers, structured concurrency, and tracing integration."
purpose: "Provides comprehensive guidance on Tokio async runtime, including task spawning and management, async primitives (channels, mutexes, barriers), I/O operations, timer and interval handling, structured concurrency patterns, backpressure strategies, and observability with tracing."
---

## Capabilities

1. Configure and select Tokio runtime flavors (multi_thread vs current_thread) for different workloads.
2. Spawn and manage tasks with JoinSet, JoinHandle, and structured concurrency patterns.
3. Use async channel primitives: oneshot, mpsc, broadcast, watch.
4. Implement async I/O with AsyncRead, AsyncWrite, TcpListener, TcpStream, and framing.
5. Work with timers, delays, intervals, and timeouts.
6. Use the select! macro for multiplexing async operations.
7. Implement graceful shutdown patterns with cancellation tokens.
8. Apply backpressure strategies with bounded channels and semaphores.
9. Handle blocking operations with tokio::task::spawn_blocking.
10. Use async file I/O (tokio::fs) for non-blocking filesystem operations.
11. Leverage tokio::sync primitives: Semaphore, Barrier, Notify, RwLock, Mutex.
12. Integrate tracing for async context propagation and Tokio Console debugging.

## Limitations

1. Cannot execute async code directly — provides design and implementation guidance only.
2. Limited to stable Tokio APIs (no unstable or experimental features).
3. Cannot diagnose runtime-specific performance issues without profiling data.
4. Async cancellation safety must be verified by the user.
5. Does not cover async-std, smol, or other async runtimes.

## Required Tools

- Tokio (crates.io) at least 1.36+
- tracing crate for instrumentation
- tokio-console for runtime debugging
- cargo-expand for debugging async macro expansion
- Rust compiler with async support (1.75+)

## Execution Workflow

1. Assess the async workload characteristics (I/O-bound, CPU-bound, mixed).
2. Choose runtime flavor: multi_thread for mixed workloads, current_thread for I/O-only.
3. Design task hierarchy for structured concurrency.
4. Select appropriate channel types based on communication pattern.
5. Implement I/O with async readers/writers and framing protocols.
6. Add graceful shutdown with CancellationToken and signals.
7. Apply backpressure with bounded channels and Semaphore.
8. Wrap blocking CPU work with spawn_blocking.
9. Instrument with tracing spans and events.
10. Test cancellation safety and task lifecycle.
11. Benchmark and profile with Tokio Console.
12. Review for common async pitfalls (holding Mutex across await, large futures).

## Decision Tree

1. **Is the task CPU-bound?**
   - YES → Use tokio::task::spawn_blocking.
   - NO → Use tokio::spawn.

2. **Is ordered processing required?**
   - YES → Use mpsc channel (unbounded or bounded).
   - NO → Use broadcast or watch for fan-out.

3. **Is there a single response expected?**
   - YES → Use oneshot channel.
   - NO → Use mpsc or broadcast.

4. **Is backpressure needed?**
   - YES → Use bounded channels with capacity limits and Semaphore.
   - NO → Use unbounded channels (risk of memory exhaustion).

5. **Is graceful shutdown required?**
   - YES → Implement CancellationToken pattern with select!.
   - NO → Simple task cancellation on drop.

6. **Is shared state needed?**
   - YES → Use tokio::sync::Mutex (not std::sync::Mutex across .await).
   - NO → Pass data through channels.

## Review Checklist

- [ ] Runtime flavor matches workload characteristics.
- [ ] No std::sync::Mutex held across .await points.
- [ ] Channel types correct for communication pattern.
- [ ] Bounded channels have appropriate capacity.
- [ ] spawn_blocking used for CPU-heavy or blocking I/O.
- [ ] select! handles all branches (including cancellation).
- [ ] Cancellation tokens propagate correctly to child tasks.
- [ ] Task error handling (JoinHandle::await? or explicit handling).
- [ ] Backpressure mechanisms in place for bounded channels.
- [ ] File I/O uses tokio::fs, not std::fs.
- [ ] Tracing spans have correct parent-child relationships.
- [ ] Timer usage appropriate (sleep, interval, timeout).

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Blocking the runtime | CPU-bound work on async tasks | Move to spawn_blocking |
| Deadlock in async code | Mutex held across await | Use tokio::sync::Mutex or restructure |
| select! always picking one branch | Ready futures prioritized | Add biases or restructure select branches |
| Channel send errors (Closed) | Receiver dropped early | Check task lifecycle ordering |
| Tasks not completing | Missing CancellationToken propagation | Pass token to all spawned tasks |
| High memory usage | Unbounded channels growing | Switch to bounded channels |
| Timer not firing | Runtime not ticking | Ensure runtime is running (block_on) |
| Tokio Console empty | Instrumentation not enabled | Add tracing-subscriber with console layer |

## Best Practices

1. Prefer bounded channels to prevent unbounded memory growth.
2. Use JoinSet for managing dynamic task groups.
3. Avoid holding a MutexGuard across .await — use tokio::sync::Mutex.
4. Use tokio::select! for timeout and cancellation handling.
5. Buffer I/O with BufReader/BufWriter for performance.
6. Use CancellationToken for coordinated shutdown.
7. Spawn blocking operations on dedicated thread pool.
8. Instrument with tracing for observability.
9. Prefer AsyncRead/AsyncWrite traits over raw read/write.
10. Use tokio::io::copy or tokio::io::copy_buf for streaming.

## Anti-Patterns

1. **Blocking the event loop**: Calling std::thread::sleep or blocking I/O in async tasks.
2. **Held Mutex across await**: Holding std::sync::MutexGuard across .await.
3. **Unbounded channel explosion**: Using unbounded channels without size limits.
4. **Ignoring JoinHandle errors**: Not checking task result for panics.
5. **select! starvation**: One branch always ready, starving others.
6. **Missing cancellation**: Tasks not responding to shutdown signals.
7. **Giant futures**: Single large future blocking other tasks.
8. **Sync mutex in async**: Using std::sync::Mutex where tokio::sync::Mutex is needed.

## References

Tokio Documentation: https://docs.rs/tokio/latest/tokio/
Tokio Tutorial: https://tokio.rs/tokio/tutorial
Tokio Mini-Redis: https://github.com/tokio-rs/mini-redis
Tokio Console: https://github.com/tokio-rs/console
Tracing: https://docs.rs/tracing/latest/tracing/
