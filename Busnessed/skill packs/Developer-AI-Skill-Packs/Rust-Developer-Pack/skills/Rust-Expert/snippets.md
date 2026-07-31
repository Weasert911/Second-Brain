# Snippets — Rust-Expert

## 1. Safe Result Unwrapping with Context

```rust
use anyhow::{Context, Result};

fn process(path: &str) -> Result<()> {
    let data = std::fs::read_to_string(path)
        .with_context(|| format!("Failed to read {path}"))?;
    Ok(())
}
```

**Usage**: Replace bare `.unwrap()` with `.context()` or `.with_context()` from anyhow for actionable error messages.

## 2. Custom Error Type with thiserror

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error("validation: {field}: {msg}")]
    Validation { field: String, msg: String },
    #[error(transparent)]
    Io(#[from] std::io::Error),
}
```

**Usage**: Define library error types with thiserror derive macro for automatic Display and Error impl.

## 3. Builder with Validation

```rust
#[derive(Default)]
pub struct ConfigBuilder {
    timeout: Option<u64>,
    retries: u32,
}

impl ConfigBuilder {
    pub fn timeout(mut self, secs: u64) -> Self { self.timeout = Some(secs); self }
    pub fn retries(mut self, n: u32) -> Self { self.retries = n; self }
    pub fn build(self) -> Result<Config, &'static str> {
        Ok(Config { timeout: self.timeout.ok_or("timeout required")?, retries: self.retries })
    }
}
```

**Usage**: Enforce required fields at compile-time via build() validation returning Result.

## 4. Typestate Transition

```rust
struct Active;
struct Inactive;
struct Machine<S>(std::marker::PhantomData<S>);

impl Machine<Inactive> {
    pub fn new() -> Self { Machine(std::marker::PhantomData) }
    pub fn start(self) -> Machine<Active> { Machine(std::marker::PhantomData) }
}

impl Machine<Active> {
    pub fn stop(self) -> Machine<Inactive> { Machine(std::marker::PhantomData) }
    pub fn process(&self) { println!("Processing..."); }
}
```

**Usage**: Encode state machine transitions in the type system. Invalid calls become compile errors.

## 5. Iterator Chain

```rust
let result: Vec<_> = items.iter()
    .filter(|x| x.is_valid())
    .map(|x| x.transform())
    .flat_map(|x| x.expand())
    .collect();
```

**Usage**: Compose lazy transformations. Each adapter is zero-cost; the entire chain is optimized together.

## 6. Smart Pointer Selection

```rust
// Single owner, heap allocated
let boxed: Box<dyn Trait> = Box::new(ConcreteType);

// Shared ownership, single-threaded
let shared: Rc<RefCell<T>> = Rc::new(RefCell::new(value));

// Shared ownership, multi-threaded
let shared: Arc<Mutex<T>> = Arc::new(Mutex::new(value));

// Shared read, single writer
let shared: Arc<RwLock<T>> = Arc::new(RwLock::new(value));
```

**Usage**: Choose the right smart pointer based on ownership and threading requirements.

## 7. Lazy Static

```rust
use std::sync::LazyLock;

static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    Config::load().expect("Failed to load config")
});
```

**Usage**: Initialize global state lazily at first access (stable in Rust 1.80+).

## 8. Pin + Self-Referential Struct

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

#[derive(Debug)]
struct SelfReferential {
    data: String,
    ptr: *const String,
    _pin: PhantomPinned,
}

impl SelfReferential {
    fn new(data: String) -> Self {
        Self { ptr: std::ptr::null(), data, _pin: PhantomPinned }
    }

    fn init(self: Pin<&mut Self>) {
        let this = unsafe { self.get_unchecked_mut() };
        this.ptr = &this.data as *const String;
    }
}
```

**Usage**: Self-referential structs require Pin to guarantee address stability. Use PhantomPinned to disable Unpin.

## 9. FFI Safe Wrapper

```rust
mod ffi {
    extern "C" {
        pub fn compute(input: i32) -> i32;
    }
}

pub fn safe_compute(input: i32) -> i32 {
    unsafe { ffi::compute(input) }
}
```

**Usage**: Wrap extern "C" functions in safe Rust functions. Unsafe blocks should be minimal and justified.

## 10. no_std Entry Point

```rust
#![no_std]
#![no_main]

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_: &PanicInfo) -> ! { loop {} }

#[no_mangle]
pub extern "C" fn _start() -> ! { loop {} }
```

**Usage**: Embedded or kernel development without the standard library. Replace std with core.

## 11. Procedural Macro Skeleton

```rust
use proc_macro::TokenStream;

#[proc_macro_derive(MyTrait)]
pub fn my_trait_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let gen = quote::quote! {
        impl MyTrait for #name {
            fn method(&self) { println!("implemented!"); }
        }
    };
    gen.into()
}
```

**Usage**: Derive macros use syn for parsing and quote for code generation.

## 12. Cow for Borrowed or Owned

```rust
use std::borrow::Cow;

fn format_name<'a>(first: &'a str, last: &'a str) -> Cow<'a, str> {
    if first.is_empty() || last.is_empty() {
        Cow::Owned(format!("{first} {last}").trim().to_string())
    } else {
        Cow::Borrowed(/* pre-formatted */)
    }
}
```

**Usage**: Cow returns a reference when possible, owned when modification is needed.

## 13. Drop Guard with ScopeGuard

```rust
use std::ops::{Deref, DerefMut};

struct ScopeGuard<F: FnMut()>(Option<F>);

impl<F: FnMut()> Drop for ScopeGuard<F> {
    fn drop(&mut self) {
        if let Some(mut f) = self.0.take() { f(); }
    }
}

fn defer<F: FnMut()>(f: F) -> ScopeGuard<F> { ScopeGuard(Some(f)) }
```

**Usage**: Execute cleanup code when scope exits, similar to Go's defer.
