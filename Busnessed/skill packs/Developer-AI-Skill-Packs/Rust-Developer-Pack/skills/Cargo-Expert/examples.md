# Examples — Cargo-Expert

## Beginner: Basic Cargo.toml with Features

```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"
rust-version = "1.75"
description = "A sample project"
license = "MIT"

[dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["full"], optional = true }
reqwest = { version = "0.12", optional = true }

[features]
default = []
server = ["tokio", "reqwest"]
web-client = ["reqwest"]
```

**Explanation**: Features enable optional functionality. Default features are empty to minimize dependency bloat. The `server` feature enables both tokio and reqwest.

## Intermediate: Workspace with Shared Dependencies

```toml
# workspace/Cargo.toml
[workspace]
members = ["crates/core", "crates/cli", "crates/web"]
resolver = "2"

[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
thiserror = "2"
anyhow = "1"
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
reqwest = { version = "0.12", features = ["json"] }

[workspace.package]
edition = "2021"
rust-version = "1.75"
authors = ["My Team"]
license = "MIT"

[workspace.lints.clippy]
all = { level = "warn", priority = -1 }
pedantic = { level = "warn", priority = -1 }
```

```toml
# crates/core/Cargo.toml
[package]
name = "my-core"
version.workspace = true
edition.workspace = true
rust-version.workspace = true
license.workspace = true

[dependencies]
serde.workspace = true
thiserror.workspace = true
```

**Explanation**: Workspace dependencies centralize version management. All member crates inherit settings from workspace. `.workspace = true` references the workspace-level definition.

## Advanced: Build Script with Code Generation

```rust
// build.rs
use std::env;
use std::fs;
use std::path::Path;

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=src/api_definitions.txt");

    let out_dir = env::var("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("generated_api.rs");

    let definitions = fs::read_to_string("src/api_definitions.txt")
        .expect("Failed to read API definitions");

    let mut code = String::from(
        "// Auto-generated. Do not edit manually.\n"
    );

    for line in definitions.lines() {
        if let Some((name, endpoint)) = line.split_once('=') {
            let name = name.trim();
            let endpoint = endpoint.trim().trim_matches('"');
            code.push_str(&format!(
                r#"
pub mod {} {{
    pub const ENDPOINT: &str = {:#?};
    pub async fn fetch(client: &reqwest::Client) -> Result<String, reqwest::Error> {{
        let resp = client.get(ENDPOINT).send().await?;
        resp.text().await
    }}
}}
"#, name, endpoint
            ));
        }
    }

    fs::write(dest_path, code).expect("Failed to write generated code");
}
```

**Explanation**: Build scripts in `build.rs` generate code at compile time, write to `$OUT_DIR`, and use `include!` macro to incorporate generated source. The `cargo:rerun-if-changed` directives ensure incremental rebuilds work correctly.

## Production: Multi-Profile Configuration

```toml
[profile.dev]
opt-level = 0
debug = 1
incremental = true
codegen-units = 256

[profile.release]
opt-level = 3
debug = false
incremental = false
lto = "fat"
codegen-units = 1
strip = "symbols"
panic = "abort"

[profile.bench]
inherits = "release"
debug = 2
lto = "thin"

[profile.small]
inherits = "release"
opt-level = "z"
lto = "fat"
codegen-units = 1
strip = true
panic = "abort"

[features]
default = ["std"]
std = []
no-std = []
```

```toml
# .cargo/config.toml
[target.x86_64-pc-windows-msvc]
linker = "rust-lld"

[target.x86_64-unknown-linux-gnu]
linker = "clang"

[target.wasm32-unknown-unknown]
runner = "wasm-bindgen-test-runner"

[alias]
bw = "build --release"
ts = "test --all-features"
cw = "clippy -- -D warnings"
```

**Explanation**: Custom profiles (like `small`) optimize for binary size. The `.cargo/config.toml` centralizes per-target linker settings and command aliases.
