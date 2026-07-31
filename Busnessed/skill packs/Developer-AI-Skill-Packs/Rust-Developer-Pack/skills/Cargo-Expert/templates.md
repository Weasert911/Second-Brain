# Templates — Cargo-Expert

## Template 1: Workspace Root Cargo.toml

```toml
[workspace]
resolver = "{{resolver_version}}"
members = [
    "crates/{{crate1}}",
    "crates/{{crate2}}",
]
default-members = ["crates/{{default_crate}}"]

[workspace.package]
edition = "{{edition}}"
rust-version = "{{msrv}}"
license = "{{license}}"
authors = ["{{author}}"]

[workspace.dependencies]
{{dependency1}} = "{{version1}}"
{{dependency2}} = { version = "{{version2}}", features = ["{{feature}}"] }

[workspace.lints.clippy]
all = { level = "warn", priority = -1 }
pedantic = { level = "warn", priority = -1 }
```

## Template 2: Crate with Conditional Features

```toml
[package]
name = "{{crate_name}}"
version.workspace = true
edition.workspace = true

[features]
default = ["std"]
std = []
{{feature1}} = ["dep:{{optional_dep}}"]
{{feature2}} = ["{{feature1}}", "dep:{{other_dep}}"]
full = ["{{feature1}}", "{{feature2}}"]

[dependencies]
{{dep1}} = { version = "{{v1}}", optional = true }
{{dep2}} = { version = "{{v2}}", features = ["derive"] }

[target.'cfg(target_os = "linux")'.dependencies]
{{linux_dep}} = "{{lv}}"

[dev-dependencies]
{{test_dep}} = "{{tv}}"
```

## Template 3: Build Script

```rust
use std::{env, fs, path::Path};

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed={{input_file}}");

    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap();
    let out_dir = env::var("OUT_DIR").unwrap();
    let dest = Path::new(&out_dir).join("{{output_name}}");

    let mut code = String::from("// Auto-generated\n");
    code.push_str(&format!("pub const TARGET_OS: &str = {target_os:#?};\n"));
    {{generation_logic}}

    fs::write(&dest, code).unwrap();
}
```

## Template 4: Cross-Compilation Config

```toml
# .cargo/config.toml

[target.{{target_triple}}]
linker = "{{linker_path}}"
runner = "{{runner_command}}"
rustflags = ["-C", "link-arg=-{{link_arg}}"]

[target.'cfg(all(target_os = "{{os}}", target_arch = "{{arch}}"))']
rustflags = ["-C", "target-feature={{feature}}"]

[env]
{{VAR_NAME}} = "{{value}}"

[alias]
{{alias_name}} = "{{subcommand}}"
```

## Template 5: Profile Configuration

```toml
[profile.{{profile_name}}]
inherits = "{{base_profile}}"
opt-level = {{opt_level}}
debug = {{debug_level}}
lto = "{{lto_mode}}"
codegen-units = {{codegen_units}}
strip = {{strip_setting}}
panic = "{{panic_strategy}}"
incremental = {{incremental}}
```

## Template 6: Binary Crate with Multiple Targets

```toml
[package]
name = "{{app_name}}"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "{{bin1}}"
path = "src/bin/{{bin1}}.rs"

[[bin]]
name = "{{bin2}}"
path = "src/bin/{{bin2}}.rs"

[dependencies]
clap = { version = "4", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
```

## Template 7: Feature Flag with Dependency Injection

```toml
[package]
name = "{{crate_name}}"

[features]
default = ["native"]
native = ["dep:crypto-native"]
wasm = ["dep:crypto-wasm"]

[dependencies]
crypto-native = { version = "1", optional = true, package = "openssl" }
crypto-wasm = { version = "1", optional = true, package = "rust-crypto-wasm" }
```

```rust
#[cfg(feature = "native")]
use crypto_native as crypto_impl;
#[cfg(feature = "wasm")]
use crypto_wasm as crypto_impl;

pub use crypto_impl::hash;
```

## Template 8: Dependency Patching

```toml
# Override dependency sources for development or security patches
[patch.crates-io]
{{crate_name}} = {{patch_source}}
# {{patch_source}} examples:
# git = "https://github.com/user/repo.git" branch = "fix"
# path = "../local-fork"
```

```toml
# Or use [replace] (deprecated, prefer [patch]):
# [replace]
# "{{crate}}:{{version}}" = { path = "{{local_path}}" }
```
