# References — Cargo-Expert

## Official Documentation

- [The Cargo Book](https://doc.rust-lang.org/cargo/) — comprehensive Cargo guide
- [Cargo Reference: Manifest](https://doc.rust-lang.org/cargo/reference/manifest.html) — Cargo.toml specification
- [Cargo Reference: Features](https://doc.rust-lang.org/cargo/reference/features.html) — feature flag system
- [Cargo Reference: Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html) — build profiles
- [Cargo Reference: Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html) — workspace management
- [Cargo Reference: Build Scripts](https://doc.rust-lang.org/cargo/reference/build-scripts.html) — build.rs guide
- [Cargo Reference: Config](https://doc.rust-lang.org/cargo/reference/config.html) — .cargo/config.toml
- [Cargo Reference: Resolver](https://doc.rust-lang.org/cargo/reference/resolver.html) — dependency resolution
- [Cargo CLI](https://doc.rust-lang.org/cargo/commands/) — all cargo subcommands

## Key Terms

1. **Crate**: A package in Cargo terminology.
2. **Workspace**: A collection of crates sharing a Cargo.lock.
3. **Feature Flag**: A conditional compilation toggle defined in Cargo.toml.
4. **Profile**: A set of compiler optimization settings.
5. **Resolver**: Algorithm for selecting dependency versions.
6. **SemVer**: Semantic Versioning for dependency resolution.
7. **Build Script**: A Rust script (build.rs) run before the crate compiles.
8. **Target**: The architecture/OS being compiled for (e.g., x86_64-pc-windows-msvc).
9. **Artifact Dependency**: A dependency that provides a binary used at build time.
10. **Feature Unification**: Cargo merges feature flags across the dependency graph.
11. **MSRV**: Minimum Supported Rust Version.
12. **LTO**: Link-Time Optimization.
13. **Codegen Units**: Parallel compilation units; more units = faster compile, slower code.
14. **Vendoring**: Copying dependencies into the repository.
15. **Sccache**: Shared Compilation Cache — caches compiled artifacts across projects.

## Architecture Notes

Cargo's dependency resolver v2/v3 handles feature flag unification more correctly than v1. Features are additive: enabling a feature from any crate in the graph enables it globally. Workspaces ensure a single Cargo.lock across all member crates, preventing version drift. Build scripts run before the crate they belong to and can emit cargo: directives to influence compilation.

## Key APIs

- `cargo build`, `cargo check`, `cargo test`, `cargo bench` — core commands
- `cargo clippy`, `cargo fmt` — quality tools
- `cargo doc`, `cargo publish` — documentation and publishing
- `cargo add`, `cargo remove`, `cargo upgrade` — dependency management
- `cargo tree`, `cargo deny`, `cargo audit` — dependency analysis
- `build.rs`: `cargo:rustc-link-lib=`, `cargo:rustc-link-search=`, `cargo:rerun-if-changed=`
- `.cargo/config.toml`: `[target.*]`, `[alias]`, `[registries]`

## Conventions

- Dependencies in `[dependencies]`, dev-only in `[dev-dependencies]`, build-only in `[build-dependencies]`
- Feature flags named with snake_case
- Default features should be minimal
- Use `dep:` prefix in features to avoid implicit feature creation
- Workspace `[workspace.dependencies]` for shared dependency versions
- Binary size optimization: `opt-level = "z"`, `lto = "fat"`, `codegen-units = 1`, `strip = true`

## Project Structure

```
workspace/
├── Cargo.toml            # workspace root
├── Cargo.lock            # shared lockfile
├── crates/
│   ├── core/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       └── lib.rs
│   ├── cli/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       └── main.rs
│   └── web/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs
├── .cargo/
│   └── config.toml       # shared config
└── build.rs              # optional root build script
```
