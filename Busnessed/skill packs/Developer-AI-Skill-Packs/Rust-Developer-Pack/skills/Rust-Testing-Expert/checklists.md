# Checklists — Rust-Testing-Expert

## Pre-Flight Checklist

- [ ] Testing strategy documented (unit, integration, doc, property, fuzz)
- [ ] Test organization plan decided
- [ ] Mocking framework chosen (if needed)
- [ ] Property-based testing tools chosen (proptest/quickcheck)
- [ ] Coverage tool selected (tarpaulin/llvm-cov/grcov)
- [ ] CI pipeline configured for test execution
- [ ] Test database strategy decided (if applicable)
- [ ] Test timeout values considered

## Implementation Checklist

- [ ] Unit tests for all public functions
- [ ] Unit tests for internal helper functions
- [ ] Error paths tested (invalid input, edge cases)
- [ ] Integration tests for main workflows
- [ ] Doc tests for public API (compile and pass)
- [ ] Parametrized tests for multi-input scenarios
- [ ] Mock tests for external dependencies
- [ ] Property-based tests for invariants
- [ ] Fuzz targets for input parsing
- [ ] Tests for feature-gated code (all feature combinations)
- [ ] #[should_panic] tests for documented panics
- [ ] #[ignore] for slow tests with tracking issue

## Testing Checklist

- [ ] All tests pass (cargo test --all-features)
- [ ] Doc tests pass (cargo test --doc)
- [ ] No flaky tests (run 3 times in CI)
- [ ] Test coverage meets threshold
- [ ] Fuzz tests run for minimum time without crashes
- [ ] Test isolation (no shared state between tests)
- [ ] Async tests don't hang
- [ ] Test output is readable (meaningful failure messages)
- [ ] Mock expectations are correct (call count, argument matching)
- [ ] Property-based test shrinking produces minimal failing cases

## Release Checklist

- [ ] Tests run in CI before release
- [ ] Coverage report reviewed
- [ ] Fuzz tests run on release candidate
- [ ] Performance tests (benchmarks) reviewed
- [ ] Regression tests added for all fixed bugs
- [ ] Test suite execution time acceptable
- [ ] Documentation examples tested
- [ ] Feature flag combinations tested
- [ ] Cross-platform tests pass (if applicable)
- [ ] Test configuration documented

## Maintenance Checklist

- [ ] Tests updated for new features
- [ ] Tests updated for refactored code
- [ ] Old tests removed for removed features
- [ ] Fuzz corpora updated regularly
- [ ] Mock expectations reviewed for API changes
- [ ] Coverage trends tracked over time
- [ ] Flaky tests fixed promptly
- [ ] Test tooling versions updated
