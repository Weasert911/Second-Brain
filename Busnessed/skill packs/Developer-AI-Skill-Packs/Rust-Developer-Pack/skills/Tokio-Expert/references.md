# References — Tokio-Expert

## Official Documentation

- [Tokio API Docs](https://docs.rs/tokio/latest/tokio/) — complete API reference
- [Tokio Tutorial](https://tokio.rs/tokio/tutorial) — step-by-step async guide
- [Tokio Blog](https://tokio.rs/blog/) — deep dives and best practices
- [Mini-Redis](https://github.com/tokio-rs/mini-redis) — reference Tokio application
- [Tokio Console](https://github.com/tokio-rs/console) — runtime debugger
- [Tracing Docs](https://docs.rs/tracing/latest/tracing/) — async instrumentation
- [Async Book](https://rust-lang.github.io/async-book/) — async Rust fundamentals

## Key Terms

1. **Runtime**: The executor driving async tasks (multi_thread or current_thread).
2. **Task**: A unit of work spawned on the runtime.
3. **JoinHandle**: A handle to await on a spawned task's result.
4. **JoinSet**: A collection of JoinHandles for managing dynamic tasks.
5. **Channel**: An async communication primitive (oneshot, mpsc, broadcast, watch).
6. **CancellationToken**: A cooperative cancellation mechanism.
7. **Backpressure**: A mechanism to slow down producers when consumers are overwhelmed.
8. **Structured Concurrency**: Task hierarchy where parent tasks manage child lifetimes.
9. **Waker**: A callback that signals a task can make progress.
10. **Reactor**: The I/O event loop driving async operations.
11. **Current Thread Runtime**: Single-threaded executor for I/O-only workloads.
12. **Multi-thread Runtime**: Work-stealing executor for mixed workloads.
13. **select!**: Macro for awaiting multiple async operations simultaneously.
14. **spawn_blocking**: Offload blocking work to a dedicated thread pool.
15. **Tokio Console**: Real-time async runtime inspector.

## Architecture Notes

Tokio uses a work-stealing scheduler for the multi-thread runtime. Each worker thread has its own local task queue, and idle workers steal tasks from busy workers. The reactor (I/O driver) uses epoll (Linux), kqueue (macOS), or I/O completion ports (Windows) for event notification. Wakers are used to notify the executor when a task can make progress after I/O events complete.

## Key APIs

- `tokio::runtime::{Runtime, Builder}` — runtime creation
- `tokio::task::{spawn, spawn_blocking, yield_now, JoinHandle, JoinSet}` — task management
- `tokio::sync::{oneshot, mpsc, broadcast, watch, Mutex, RwLock, Semaphore, Barrier, Notify}` — sync
- `tokio::net::{TcpListener, TcpStream, UdpSocket, UnixListener, UnixStream}` — networking
- `tokio::io::{AsyncRead, AsyncWrite, AsyncBufRead, BufReader, BufWriter}` — I/O traits
- `tokio::time::{sleep, timeout, interval, Instant, Duration}` — time
- `tokio::fs::{File, read, write, create_dir, remove_file}` — async filesystem
- `tokio::signal::ctrl_c` — OS signal handling
- `tokio::select!` — concurrent operation multiplexing

## Conventions

- Variables with async behavior: suffix with `_task`, `_handle`, `_rx`, `_tx`
- Channel naming: `(tx, rx)` for sender/receiver pairs
- CancellationToken: `cancel_token`, `child_token`
- JoinSet items processed in a loop: `while let Some(res) = join_set.join_next().await`
- select! branches ordered by priority (first ready wins without bias)

## Project Structure

```
async_project/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── server.rs          # listener and connection handling
│   ├── handler.rs         # per-connection handler
│   ├── state.rs           # application state (Arc<AppState>)
│   ├── shutdown.rs        # graceful shutdown logic
│   └── telemetry.rs       # tracing setup
├── tests/
│   └── integration.rs
└── examples/
    └── echo_server.rs
```
