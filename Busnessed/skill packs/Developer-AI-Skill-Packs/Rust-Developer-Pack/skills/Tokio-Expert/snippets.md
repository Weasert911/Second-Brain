# Snippets — Tokio-Expert

## 1. Tokio Main Macro

```rust
#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    println!("Running on multi-threaded runtime");
}
```

**Usage**: Attribute macro to set up the Tokio runtime. Choose `multi_thread` for mixed workloads or `current_thread` for I/O-only.

## 2. Spawn with JoinHandle

```rust
let handle = tokio::spawn(async {
    // async work
    42
});

let result = handle.await.unwrap();
println!("Result: {result}");
```

**Usage**: `spawn` runs a future concurrently. Await the `JoinHandle` to get the result.

## 3. Oneshot Channel

```rust
let (tx, rx) = tokio::sync::oneshot::channel();

tokio::spawn(async move {
    tx.send("hello").unwrap();
});

let msg = rx.await.unwrap();
println!("Got: {msg}");
```

**Usage**: One-shot channel for a single response. Perfect for request-response patterns.

## 4. MPSC Channel with Bounded Capacity

```rust
let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(32);

tokio::spawn(async move {
    while let Some(msg) = rx.recv().await {
        println!("Received: {msg}");
    }
});

tx.send("data".to_string()).await.unwrap();
```

**Usage**: Multi-producer, single-consumer channel. Bounded capacity provides backpressure.

## 5. Broadcast Channel

```rust
let (tx, _) = tokio::sync::broadcast::channel::<String>(16);
let mut rx1 = tx.subscribe();
let mut rx2 = tx.subscribe();

tx.send("broadcast".to_string()).unwrap();
assert_eq!(rx1.recv().await.unwrap(), "broadcast");
assert_eq!(rx2.recv().await.unwrap(), "broadcast");
```

**Usage**: Fan-out pattern where all receivers get every message.

## 6. select! Macro

```rust
tokio::select! {
    val = async_op1() => { handle1(val) },
    val = async_op2() => { handle2(val) },
    _ = tokio::time::sleep(Duration::from_secs(5)) => { timeout_action() },
}
```

**Usage**: Wait on multiple async operations. The first one to complete wins.

## 7. Timeout Wrapper

```rust
use tokio::time::{timeout, Duration};

async fn fetch_with_timeout() -> Result<String, &'static str> {
    match timeout(Duration::from_secs(5), fetch_data()).await {
        Ok(Ok(data)) => Ok(data),
        Ok(Err(_)) => Err("fetch failed"),
        Err(_) => Err("timeout"),
    }
}
```

**Usage**: Wrap any async operation with a timeout using tokio::time::timeout.

## 8. spawn_blocking for CPU Work

```rust
let result = tokio::task::spawn_blocking(|| {
    // CPU-intensive synchronous work
    compute_primes(100_000)
}).await.unwrap();
```

**Usage**: Offload CPU-bound work to a dedicated blocking thread pool to avoid starving async tasks.

## 9. Interval for Periodic Tasks

```rust
use tokio::time::{interval, Duration};

let mut ticker = interval(Duration::from_secs(1));
ticker.tick().await; // skip first immediate tick

loop {
    ticker.tick().await;
    // runs every second
    println!("Tick");
}
```

**Usage**: Execute code on a fixed interval. The first `tick()` call completes immediately.

## 10. CancellationToken Pattern

```rust
use tokio_util::sync::CancellationToken;

let token = CancellationToken::new();
let child = token.child_token();

let task = tokio::spawn(async move {
    tokio::select! {
        _ = child.cancelled() => println!("Cancelled"),
        _ = do_work() => println!("Completed"),
    }
});

token.cancel();
task.await.unwrap();
```

**Usage**: Cooperative cancellation. Child tokens are derived from parent. Cancelling the parent cancels all children.

## 11. Async File Read/Write

```rust
use tokio::fs::File;
use tokio::io::AsyncReadExt;

let mut f = File::open("data.bin").await.unwrap();
let mut buffer = Vec::new();
f.read_to_end(&mut buffer).await.unwrap();
```

**Usage**: Non-blocking file I/O. Uses a thread pool internally but presents async API.

## 12. TcpListener with Backpressure

```rust
use tokio::sync::Semaphore;

let sem = Arc::new(Semaphore::new(100)); // max 100 concurrent
let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();

loop {
    let permit = sem.clone().acquire_owned().await.unwrap();
    let (socket, addr) = listener.accept().await.unwrap();
    tokio::spawn(async move {
        let _permit = permit;
        handle(socket, addr).await;
    });
}
```

**Usage**: Limit concurrent connections using a Semaphore owned-permit pattern.

## 13. Graceful Shutdown with Signal

```rust
use tokio::signal;

#[tokio::main]
async fn main() {
    // Main work...
    signal::ctrl_c().await.unwrap();
    println!("Shutting down gracefully");
    // cleanup logic
}
```

**Usage**: Wait for Ctrl+C or SIGTERM before shutting down.
