# Examples — Rust-Expert

## Beginner: Error Handling with Result

```rust
use std::fs;
use std::io::{self, Read};
use std::path::Path;

fn read_file_to_string(path: impl AsRef<Path>) -> io::Result<String> {
    let mut file = fs::File::open(path.as_ref())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn process_file(path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let data = read_file_to_string(path)?;
    println!("File contains {} bytes", data.len());
    Ok(())
}

fn main() {
    if let Err(e) = process_file("example.txt") {
        eprintln!("Error: {e}");
        std::process::exit(1);
    }
}
```

**Explanation**: Uses `?` operator for ergonomic error propagation, `impl AsRef<Path>` for flexible argument types, and `Box<dyn Error>` for heterogeneous error types in application code.

## Intermediate: Builder Pattern with Typestate

```rust
#[derive(Debug, Clone, PartialEq)]
pub struct Pizza {
    pub size: PizzaSize,
    pub cheese: bool,
    pub pepperoni: bool,
    pub mushrooms: bool,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PizzaSize { Small, Medium, Large }

pub struct PizzaBuilder {
    size: Option<PizzaSize>,
    cheese: bool,
    pepperoni: bool,
    mushrooms: bool,
}

impl PizzaBuilder {
    pub fn new() -> Self { Self { size: None, cheese: false, pepperoni: false, mushrooms: false } }

    pub fn size(mut self, size: PizzaSize) -> Self { self.size = Some(size); self }
    pub fn cheese(mut self) -> Self { self.cheese = true; self }
    pub fn pepperoni(mut self) -> Self { self.pepperoni = true; self }
    pub fn mushrooms(mut self) -> Self { self.mushrooms = true; self }

    pub fn build(self) -> Result<Pizza, &'static str> {
        let size = self.size.ok_or("Size is required")?;
        Ok(Pizza { size, cheese: self.cheese, pepperoni: self.pepperoni, mushrooms: self.mushrooms })
    }
}

fn main() {
    let pizza = PizzaBuilder::new()
        .size(PizzaSize::Large)
        .cheese()
        .pepperoni()
        .build()
        .unwrap();
    println!("{:?}", pizza);
}
```

**Explanation**: The builder pattern provides a fluent API for constructing complex objects. Each method consumes and returns `self`, allowing method chaining. The `build` method validates required fields and returns a `Result`.

## Advanced: Typestate Pattern for Safe State Machines

```rust
pub struct Door<State> { _phantom: std::marker::PhantomData<State> }
pub struct Open;
pub struct Closed;
pub struct Locked;

impl Door<Closed> {
    pub fn new() -> Self { Self { _phantom: std::marker::PhantomData } }
    pub fn open(self) -> Door<Open> { Door { _phantom: std::marker::PhantomData } }
    pub fn lock(self) -> Door<Locked> { Door { _phantom: std::marker::PhantomData } }
}

impl Door<Open> {
    pub fn close(self) -> Door<Closed> { Door { _phantom: std::marker::PhantomData } }
}

impl Door<Locked> {
    pub fn unlock(self) -> Door<Closed> { Door { _phantom: std::marker::PhantomData } }
}

fn main() {
    let door = Door::new();
    // door.open().open(); // COMPILE ERROR — Open doesn't have open()
    let door = door.open().close().lock();
    // door.open(); // COMPILE ERROR — Locked doesn't have open()
    let door = door.unlock().open().close();
}
```

**Explanation**: The typestate pattern encodes state transitions in the type system. Invalid state transitions become compile-time errors. This eliminates runtime state checking and makes illegal states unrepresentable.

## Production: Async Web Service with Error Handling

```rust
use std::sync::Arc;
use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;
use tokio::sync::RwLock;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    id: u64,
    name: String,
    email: String,
}

#[derive(Debug, Default)]
pub struct AppState {
    users: RwLock<Vec<User>>,
}

impl AppState {
    async fn add_user(&self, user: User) {
        self.users.write().await.push(user);
    }

    async fn list_users(&self) -> Vec<User> {
        self.users.read().await.clone()
    }
}

pub async fn run_server(addr: &str) -> Result<()> {
    let state = Arc::new(AppState::default());
    let listener = TcpListener::bind(addr).await?;
    println!("Server running on {addr}");

    loop {
        let (socket, _) = listener.accept().await?;
        let state = state.clone();
        tokio::spawn(async move {
            if let Err(e) = handle_connection(socket, state).await {
                eprintln!("Connection error: {e:?}");
            }
        });
    }
}

async fn handle_connection(
    socket: tokio::net::TcpStream,
    state: Arc<AppState>,
) -> Result<()> {
    use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
    let (reader, mut writer) = socket.into_split();
    let mut lines = BufReader::new(reader).lines();

    while let Some(line) = lines.next_line().await? {
        if line.trim().is_empty() {
            writer.write_all(b"OK\n").await?;
        } else {
            let user: User = serde_json::from_str(&line)
                .context("Failed to parse user JSON")?;
            state.add_user(user).await;
            writer.write_all(b"User added\n").await?;
        }
    }
    Ok(())
}
```

**Explanation**: A production-grade async TCP server using Tokio with Arc<RwLock<>> for shared state, anyhow for error context, serde for JSON parsing, and structured concurrency with tokio::spawn.
