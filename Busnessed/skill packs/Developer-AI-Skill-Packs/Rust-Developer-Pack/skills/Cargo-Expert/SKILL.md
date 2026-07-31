---
name: "Cargo-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Cargo expert skill for build system, dependency management, workspaces, features, profiles, cross-compilation, and build scripts."
purpose: "Provides comprehensive guidance on Cargo build system configuration, dependency management strategies, feature flag design, workspace organization, cross-compilation setup, and build script development."
---

## Capabilities

1. Configure Cargo.toml with dependencies from crates.io, git, path, and workspace sources.
2. Design feature flag hierarchies with unification semantics and implied dependencies.
3. Configure profiles (dev, release, custom) with optimization levels, debug info, LTO, and codegen-units.
4. Architect multi-crate workspaces with shared dependencies and inter-crate paths.
5. Write build.rs scripts for code generation, native library linking, and conditional compilation.
6. Implement conditional compilation with cfg, cfg_attr, and target-specific settings.
7. Set up cross-compilation toolchains for various targets (wasm, ARM, x86_64).
8. Use Cargo subcommands: clippy, fmt, doc, test, bench, add, remove, update, tree.
9. Manage artifact dependencies for build-time tools.
10. Configure resolver v2/v3 for improved dependency resolution.
11. Set up registry authentication for private registries.
12. Use cargo vendor for vendoring dependencies and sccache for build caching.

## Limitations

1. Cannot execute Cargo commands directly — provides configuration and command guidance only.
2. May not reflect very new Cargo nightly features until stable.
3. Cannot debug native linking issues without user-provided error output.
4. Limited knowledge of platform-specific build quirks beyond major targets.

## Required Tools

- Rust toolchain (rustc, cargo) 1.75+
- cargo-edit (add, remove, upgrade) — built-in since Rust 1.68
- cargo-watch for development workflows
- cargo-deny or cargo-audit for security auditing
- sccache for build caching
- Cross-compilation toolchains (rustup target add)

## Execution Workflow

1. Understand the project structure and build requirements.
2. Determine workspace vs single-crate architecture.
3. Identify all dependencies and their version requirements.
4. Design feature flags with clear naming and documentation.
5. Configure profiles matching development and release needs.
6. Set up conditional compilation for platform-specific code.
7. Write or review build.rs for code generation or native linking.
8. Configure cross-compilation targets and toolchains.
9. Verify dependency resolution with cargo tree.
10. Check for duplicate dependencies and version conflicts.
11. Apply lints with clippy and enforce with CI.
12. Set up binary caching and vendoring for CI reproducibility.
13. Generate documentation with cargo doc.
14. Benchmark and profile release builds.

## Decision Tree

1. **Is the project multi-crate?**
   - YES → Use Cargo workspace with shared Cargo.lock.
   - NO → Single crate with organized modules.

2. **Are there optional dependencies?**
   - YES → Use feature flags; prefer features that enable dependencies.
   - NO → All dependencies are mandatory.

3. **Is cross-compilation needed?**
   - YES → Install target toolchain, configure .cargo/config.toml.
   - NO → Default native compilation is sufficient.

4. **Are build-time tools needed?**
   - YES → Use artifact dependencies or build-dependencies.
   - NO → No build.rs needed.

5. **Is binary size critical?**
   - YES → Enable LTO, optimize for size, use strip = true.
   - NO → Default release profile is fine.

6. **Is CI reproducibility important?**
   - YES → Use cargo vendor or cargo fetch with cached dependencies.
   - NO → Fetch from registry on each build.

## Review Checklist

- [ ] Cargo.toml has correct edition, version, and metadata fields.
- [ ] Dependencies specify MSRV-compatible version ranges.
- [ ] Feature flags are documented with descriptions.
- [ ] Default features are minimal.
- [ ] Workspace members are correctly listed.
- [ ] Profile settings are appropriate for the project.
- [ ] build.rs handles errors gracefully (returns CargoError).
- [ ] cfg attributes cover all target OS/arch combinations as needed.
- [ ] Resolver v2/v3 is explicitly set (Cargo 2024 defaults to v3).
- [ ] cargo tree shows no unexpected duplicate versions.
- [ ] cargo clippy -- -D warnings passes.
- [ ] cargo audit shows no known vulnerabilities.
- [ ] cargo test --all-features passes.
- [ ] Cross-compile targets are documented.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Multiple matching crates with different versions | Dependency version conflicts | Update conflicting deps, use [patch] section |
| Build script error: linker not found | Missing cross-compilation linker | Install cross-linker or configure .cargo/config.toml |
| Feature `foo` not recognized | Typo in feature name | Check feature names in Cargo.toml |
| The package `foo` depends on `bar` with multiple versions | Transitive dependency conflict | Run cargo tree -i bar to identify sources |
| `cargo build` is very slow | No incremental compilation or sccache | Enable sccache, check codegen-units |
| Cross-compile target not found | Target not installed | `rustup target add <target>` |
| Dependency resolution takes too long | Large dependency tree or resolver v1 | Use resolver v2/v3, minimize dependencies |
| Build script re-runs every time | Build script changes detected | Use cargo:rerun-if-changed directives |

## Best Practices

1. Keep default features minimal to avoid pulling in unnecessary dependencies.
2. Use workspace dependencies to share version numbers across crates.
3. Add `edition = "2021"` (or 2024) and `resolver = "2"` (or "3").
4. Use `[lints]` table in Cargo.toml for workspace-level clippy configuration.
5. Document public feature flags with descriptions in Cargo.toml.
6. Use `cargo add` instead of manually editing Cargo.toml.
7. Pin MSRV in Cargo.toml with `rust-version` field.
8. Use `[patch]` for overriding dependencies during development.
9. Add `[profile.release]` with `lto = "fat"` for release builds.
10. Use `cargo tree -e features` to debug feature flag interactions.

## Anti-Patterns

1. **Feature flag spaghetti**: Unnecessarily complex feature dependency chains.
2. **Missing default-features = false**: Accidentally pulling optional features from dependencies.
3. **Over-versioned dependencies**: Pinning exact versions unnecessarily.
4. **Under-specified MSRV**: Not declaring the minimum supported Rust version.
5. **Ignoring cargo audit**: Deploying with known vulnerable dependencies.
6. **Build script logorrhea**: Printing too much from build.rs.
7. **Cross-compilation without testing**: Assuming cross builds work without testing.
8. **Workspace version sprawl**: Different crates using different versions of the same dependency.

## References

Cargo Book: https://doc.rust-lang.org/cargo/
Cargo Reference: https://doc.rust-lang.org/cargo/reference/
Features Examples: https://doc.rust-lang.org/cargo/reference/features.html
Build Scripts: https://doc.rust-lang.org/cargo/reference/build-scripts.html
Cross Compilation: https://rust-lang.github.io/rustup/cross-compilation.html
