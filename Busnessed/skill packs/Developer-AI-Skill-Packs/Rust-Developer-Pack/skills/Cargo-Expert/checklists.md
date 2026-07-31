# Checklists — Cargo-Expert

## Pre-Flight Checklist

- [ ] Cargo.toml [package] section complete (name, version, edition, rust-version, license, description)
- [ ] Workspace defined if multi-crate project
- [ ] Resolver version explicitly set (v2 or v3)
- [ ] Feature flags planned with documentation
- [ ] Default features minimal (empty if possible)
- [ ] MSRV defined in rust-version field
- [ ] CI toolchain version matches MSRV constraint
- [ ] .cargo/config.toml created for project-specific settings
- [ ] Git repository initialized with .gitignore for target/

## Implementation Checklist

- [ ] workspace.dependencies declared for shared deps
- [ ] version.workspace = true used in member crates
- [ ] dep: prefix used in features to prevent implicit feature flags
- [ ] Build scripts emit rerun-if-changed for all relevant files
- [ ] Build scripts handle error cases (unwrap only for infallible operations)
- [ ] Target-specific dependencies use [target.'cfg(...)'.dependencies]
- [ ] [lints] table configured for workspace-wide clippy settings
- [ ] Optional dependencies have corresponding feature flags
- [ ] cfg directives cover all relevant platforms
- [ ] cargo check --all-features succeeds

## Testing Checklist

- [ ] cargo test --workspace runs all tests
- [ ] cargo test --all-features includes optional feature tests
- [ ] Build script tests (if applicable)
- [ ] Cross-compilation tested (cargo build --target <target>)
- [ ] Features tested independently (cargo test --no-default-features)
- [ ] cargo clippy --workspace -- -D warnings passes
- [ ] cargo fmt --check passes
- [ ] cargo doc --no-deps succeeds with no warnings

## Release Checklist

- [ ] Version bumped per semver
- [ ] CHANGELOG.md updated
- [ ] cargo publish --dry-run succeeds
- [ ] All dependencies updated to latest compatible versions
- [ ] Documentation built and reviewed
- [ ] cargo audit passes
- [ ] cargo deny check passes
- [ ] Binary size reviewed (cargo build --release && ls -lh target/release/)
- [ ] Feature flag matrix tested
- [ ] License files included

## Maintenance Checklist

- [ ] cargo outdated run quarterly
- [ ] Dependencies audited for security (cargo audit weekly in CI)
- [ ] MSRV updated as needed
- [ ] Edition upgrades evaluated each cycle
- [ ] Toolchain version pinned in rust-toolchain.toml
- [ ] Build cache cleared periodically (cargo clean)
- [ ] sccache statistics reviewed
- [ ] Dependency graph reviewed for unnecessary duplicates
