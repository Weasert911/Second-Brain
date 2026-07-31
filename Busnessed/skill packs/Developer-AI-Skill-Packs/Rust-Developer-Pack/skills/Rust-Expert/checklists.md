# Checklists — Rust-Expert

## Pre-Flight Checklist

- [ ] Rust toolchain version confirmed (rustc --version)
- [ ] Cargo.toml configured with correct edition and dependencies
- [ ] IDE/tooling supports rust-analyzer
- [ ] Workspace structure decided (single crate vs workspace)
- [ ] Edition migration path understood (if upgrading)
- [ ] Minimum supported Rust version (MSRV) defined
- [ ] Lint config: clippy, rustfmt, and deny(missing_docs) considered
- [ ] Logging/tracing strategy decided
- [ ] Error type strategy chosen (thiserror for libs, anyhow for apps)
- [ ] Feature flags planned for optional functionality

## Implementation Checklist

- [ ] Public API has doc comments with examples
- [ ] Error types implement std::error::Error and are Send + Sync
- [ ] Functions return Result for fallible operations, not panics
- [ ] Unsafe blocks have // SAFETY: comments
- [ ] Trait objects use dyn keyword (no bare trait syntax)
- [ ] Generic functions have appropriate trait bounds
- [ ] Associated types used where return type depends on implementation
- [ ] Clone implemented only for semantically cloneable types
- [ ] PartialEq/Eq/Hash implementations are consistent
- [ ] Default implementations provided where meaningful
- [ ] Iterator implementations are lazy (no collect() internally)
- [ ] Smart pointers chosen correctly (Box, Rc, Arc, Cell, RefCell)
- [ ] Send + Sync bounds correct for thread-safe types

## Testing Checklist

- [ ] Unit tests for all public functions (#[test])
- [ ] Error paths tested (Err results, not just Ok)
- [ ] Edge cases covered: empty inputs, boundary values, null pointers
- [ ] Property-based tests for critical invariants
- [ ] Doc tests (```rust in doc comments) compile and pass
- [ ] Unsafe code validated with Miri (cargo +nightly miri test)
- [ ] Concurrency tests with loom (if applicable)
- [ ] Regression tests for previously fixed bugs
- [ ] Test files organized: unit tests in src/, integration in tests/
- [ ] cargo test --all-features passes
- [ ] cargo clippy -- -D warnings passes
- [ ] Test coverage measured (cargo tarpaulin or cargo llvm-cov)

## Release Checklist

- [ ] Version bumped in Cargo.toml (semver)
- [ ] CHANGELOG.md updated
- [ ] All dependencies updated to latest compatible versions
- [ ] MSRV checked against all dependencies
- [ ] cargo publish --dry-run succeeds
- [ ] Documentation built (cargo doc --no-deps)
- [ ] README.md examples updated
- [ ] Breaking changes documented in migration guide
- [ ] Feature flags documented
- [ ] License and copyright headers verified
- [ ] CI pipeline green (tests, lint, build, coverage)

## Maintenance Checklist

- [ ] Dependencies regularly audited (cargo audit)
- [ ] Outdated dependencies checked (cargo outdated)
- [ ] Clippy warnings suppressed only with #[allow] and reason comment
- [ ] Deprecated APIs tracked and migration planned
- [ ] Edition upgrades evaluated each release cycle
- [ ] Performance benchmarks tracked over time
- [ ] Security vulnerabilities monitored via RustSec advisory database
- [ ] API surface reviewed for accidental pub exports
