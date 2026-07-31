# Snippets — Cargo-Expert

## 1. Workspace Dependency Declaration

```toml
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

**Usage**: Define shared dependency versions in workspace root all member crates can reference.

## 2. Feature with dep: Prefix

```toml
[features]
default = ["std"]
std = ["dep:std_compat"]
async = ["dep:tokio", "dep:futures"]
```

**Usage**: `dep:` prefix prevents Cargo from creating implicit feature flags from optional deps.

## 3. Profile for Minimal Binary Size

```toml
[profile.release]
opt-level = "z"
lto = "fat"
codegen-units = 1
strip = "symbols"
panic = "abort"
```

**Usage**: Reduces binary size for deployment. Use `opt-level = "z"` for size optimization.

## 4. Build Script Rerun Directives

```rust
fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=src/schema.proto");
    println!("cargo:rerun-if-env-changed=PROFILE");
}
```

**Usage**: Prevents unnecessary rebuilds by telling Cargo exactly which inputs affect the build script.

## 5. Conditional Compilation with cfg

```rust
#[cfg(target_os = "linux")]
fn platform_init() { /* linux-specific */ }

#[cfg(not(target_os = "linux"))]
fn platform_init() { /* fallback */ }

#[cfg(feature = "cuda")]
mod cuda_backend;
```

**Usage**: cfg attributes gate code to specific platforms or features.

## 6. Target-Specific Dependencies

```toml
[target.'cfg(target_os = "linux")'.dependencies]
inotify = "0.10"

[target.'cfg(target_os = "windows")'.dependencies]
windows-sys = "0.52"
```

**Usage**: Dependencies only compiled for specific targets, reducing build time on others.

## 7. Alias Commands

```toml
# .cargo/config.toml
[alias]
bw = "build --release"
ct = "clippy --tests -- -D warnings"
wt = "watch -x test"
```

**Usage**: Define shortcuts for frequently used cargo commands.

## 8. Artifact Dependencies

```toml
[dependencies]
my-build-tool = { version = "1", artifact = "bin" }

[build-dependencies]
codegen = { version = "2", artifact = "bin" }
```

**Usage**: Use a crate as a binary tool at build time without linking it as a library (unstable).

## 9. Dependency Patching

```toml
[patch.crates-io]
serde = { git = "https://github.com/serde-rs/serde.git", branch = "fix-issue-1234" }
```

**Usage**: Override a dependency with a local fork or git commit for testing fixes.

## 10. Binary Target Declaration

```toml
[[bin]]
name = "server"
path = "src/bin/server.rs"
required-features = ["server"]

[[bin]]
name = "client"
path = "src/bin/client.rs"
required-features = ["client"]
```

**Usage**: Multiple binary targets with feature-gated availability.

## 11. Vendor Dependencies

```bash
cargo vendor --versioned-dirs
# Then use in .cargo/config.toml:
# [source.crates-io]
# replace-with = "vendored-sources"
# [source.vendored-sources]
# directory = "vendor"
```

**Usage**: Vendor all dependencies for offline builds and CI reproducibility.

## 12. Workspace Member with Custom Profile

```toml
[profile.release]
inherits = "release"
opt-level = 3

# Per-package override
[profile.release.package.my-crate]
opt-level = 2
```

**Usage**: Override optimization on a per-crate basis within a workspace.

## 13. Version Bump Command

```bash
# Patch bump
cargo bump patch

# Minor bump
cargo bump minor

# Major bump
cargo bump major
```

**Usage**: Bump semantic version using cargo-bump or cargo-release.

## 14. Dependency Tree Inspection

```bash
# Show full dependency tree
cargo tree

# Show why a specific dependency is included
cargo tree -i serde

# Show features enabled for a crate
cargo tree -e features -i tokio
```

**Usage**: Debug which crates pull in what dependencies and features.

## 15. Audit and Outdated Check

```bash
# Check for security vulnerabilities
cargo audit

# Check for outdated dependencies
cargo outdated

# Check for license issues
cargo deny check licenses
```

**Usage**: Run as part of CI to maintain dependency hygiene.
