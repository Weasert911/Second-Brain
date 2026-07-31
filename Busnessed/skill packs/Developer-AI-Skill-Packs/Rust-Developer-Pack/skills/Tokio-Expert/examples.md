# Examples — Tokio-Expert

## Beginner: Basic Async TCP Echo Server

```rust
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;

    loop {
        let (socket, addr) = listener.accept().await?;
        println!("New connection from: {addr}");

        tokio::spawn(async move {
            let (reader, mut writer) = socket.into_split();
            let mut lines = BufReader::new(reader).lines();

            while let Some(line) = lines.next_line().await.unwrap_or(None) {
                writer.write_all(format!("echo: {line}\n").as_bytes()).await.unwrap();
            }
        });
    }
}
```

**Explanation**: Simple TCP echo server using Tokio. Each connection gets a spawned task. Uses BufReader for line-based I/O and into_split for simultaneous read/write.

## Intermediate: Graceful Shutdown with CancellationToken

```rust
use tokio::signal;
use tokio::sync::CancellationToken;
use tokio_util::sync::CancellationToken;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cancel = CancellationToken::new();

    let server_handle = tokio::spawn(serve(cancel.clone()));

    // Wait for Ctrl+C
    signal::ctrl_c().await?;
    println!("Shutting down...");
    cancel.cancel();

    // Wait for server to finish
    server_handle.await??;
    println!("Server stopped.");
    Ok(())
}

async fn serve(cancel: CancellationToken) -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;

    loop {
        tokio::select! {
            result = listener.accept() => {
                let (socket, _) = result?;
                tokio::spawn(handle_connection(socket));
            }
            _ = cancel.cancelled() => {
                println!("Server shutting down");
                return Ok(());
            }
        }
    }
}

async fn handle_connection(_socket: tokio::net::TcpStream) {
    // handle the connection
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
}
```

**Explanation**: Uses CancellationToken for cooperative graceful shutdown. The server waits for Ctrl+C, then cancels all tasks. The select! macro listens for both new connections and cancellation.

## Advanced: Producer-Consumer with Backpressure

```rust
use tokio::sync::Semaphore;
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let semaphore = Semaphore::new(10);  // max 10 concurrent operations
    let (tx, mut rx) = mpsc::channel::<String>(100);

    let consumer = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            println!("Processing: {msg}");
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        }
    });

    let producer = tokio::spawn(async move {
        for i in 0..1000 {
            let permit = semaphore.acquire().await.unwrap();
            let msg = format!("Message {i}");
            if tx.send(msg).await.is_err() {
                break;
            }
            drop(permit);
        }
    });

    let _ = tokio::join!(producer, consumer);
}
```

**Explanation**: Semaphore limits concurrent producers to 10, preventing overwhelming the system. Bounded channel (capacity 100) provides backpressure when the consumer is slow.

## Production: Structured Concurrency with JoinSet

```rust
use tokio::net::TcpListener;
use tokio::task::JoinSet;
use tokio_util::sync::CancellationToken;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;
    let cancel = CancellationToken::new();
    let mut workers: JoinSet<Result<(), std::io::Error>> = JoinSet::new();

    // Spawn a worker for each connection
    loop {
        tokio::select! {
            result = listener.accept() => {
                let (stream, addr) = result?;
                workers.spawn(handle_client(stream, addr));
            }
            Some(result) = workers.join_next() => {
                match result {
                    Ok(Ok(())) => {},
                    Ok(Err(e)) => eprintln!("Worker error: {e}"),
                    Err(e) => eprintln!("Worker panicked: {e}"),
                }
            }
            _ = cancel.cancelled() => {
                workers.shutdown().await;
                break;
            }
        }
    }
    Ok(())
}

async fn handle_client(
    mut stream: tokio::net::TcpStream,
    addr: std::net::SocketAddr,
) -> Result<(), std::io::Error> {
    println!("Handling {addr}");
    let mut buf = [0u8; 1024];
    loop {
        let n = stream.read(&mut buf).await?;
        if n == 0 { break; }
        stream.write_all(&buf[..n]).await?;
    }
    println!("Done with {addr}");
    Ok(())
}

/// Helper extension trait (minimal re-implementation without tokio_util)
trait Read: tokio::io::AsyncRead + Unpin {}
impl Read for tokio::net::TcpStream {}
```

**Explanation**: JoinSet manages a dynamic set of spawned tasks. `join_next()` gives results as tasks complete, preventing unbounded growth. `shutdown().await` cancels all remaining tasks.
