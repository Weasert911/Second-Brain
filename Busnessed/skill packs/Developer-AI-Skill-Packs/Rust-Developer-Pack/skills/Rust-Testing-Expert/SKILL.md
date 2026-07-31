---
name: "Rust-Testing-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Rust testing expert skill for unit tests, integration tests, mocking, property-based testing, fuzzing, and code coverage."
purpose: "Provides comprehensive guidance on testing Rust applications, including unit and integration tests, test organization, mocking frameworks, property-based testing, fuzz testing, code coverage analysis, and CI integration for quality assurance."
---

## Capabilities

1. Write and organize unit tests (#[test]) and integration tests (tests/ directory).
2. Structure test modules with mod tests and cfg(test) conditional compilation.
3. Use assertion macros: assert_eq!, assert_ne!, assert_matches!, custom messages.
4. Apply test attributes: should_panic, ignore, timeout.
5. Implement parametrized tests with rstest.
6. Create test fixtures and shared setup code.
7. Mock external dependencies with mockall.
8. Write property-based tests with proptest and quickcheck.
9. Implement fuzz tests with cargo-fuzz.
10. Measure code coverage with tarpaulin, grcov, or cargo-llvm-cov.
11. Write and run doc tests (```rust in documentation comments).
12. Test async code with tokio::test and async test support.
13. Manage test databases with isolated test transactions.
14. Integrate testing into CI pipelines.

## Limitations

1. Cannot run tests — provides design and implementation guidance only.
2. Does not cover test infrastructure (CI server configuration) beyond general patterns.
3. Mocking frameworks beyond mockall mentioned only in general terms.
4. Code coverage tools vary by platform.

## Required Tools

- Rust test framework (built-in)
- rstest for parametrized tests
- mockall for mocking
- proptest or quickcheck for property-based testing
- cargo-fuzz for fuzz testing
- cargo-tarpaulin, cargo-llvm-cov, or grcov for coverage
- cargo-nextest for parallel test execution (optional)

## Execution Workflow

1. Analyze the code structure for testability.
2. Decide on test organization: unit tests in src/, integration tests in tests/.
3. Write unit tests for each function/module with edge cases.
4. Write integration tests for API endpoints and workflows.
5. Add doc tests for public API documentation.
6. Add property-based tests for functions with logical invariants.
7. Mock external dependencies (database, network, filesystem).
8. Write fuzz tests for input parsing functions.
9. Measure code coverage and add tests for uncovered paths.
10. Set up CI pipeline for automated test execution.
11. Review test quality: are tests meaningful, not just covering happy paths?
12. Maintain test performance (slow tests flagged with ignore).

## Decision Tree

1. **Is the function pure (no side effects)?**
   - YES → Unit tests with assert_eq! and property-based tests.
   - NO → Integration tests with mocked dependencies.

2. **Does the function interact with external services?**
   - YES → Use mockall or test doubles.
   - NO → Direct unit tests.

3. **Is the function input/output or transformation?**
   - Transformation → Property-based tests for invariants.
   - I/O → Integration tests with controlled environments.

4. **Is the code async?**
   - YES → Use tokio::test or async-std::test.
   - NO → Standard #[test].

5. **Is the function part of the public API?**
   - YES → Add doc tests with usage examples.
   - NO → Internal unit tests.

6. **Is parsing or validation involved?**
   - YES → Add fuzz tests with cargo-fuzz.
   - NO → Standard tests suffice.

## Review Checklist

- [ ] Unit tests cover all public functions.
- [ ] Edge cases tested: empty input, zero values, null, large inputs.
- [ ] Error paths tested (Err results, panics with should_panic).
- [ ] Integration tests cover main user workflows.
- [ ] Doc tests compile and pass.
- [ ] Property-based tests check invariants.
- [ ] Mocked tests verify interaction behavior.
- [ ] Fuzz tests run without crashes.
- [ ] Code coverage meets project threshold (>80% recommended).
- [ ] Tests are deterministic (no flaky tests).
- [ ] Tests run in CI pipeline.
- [ ] Test organization follows project conventions.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Test flaky | Shared state or timing dependency | Isolate tests, avoid time-based assertions |
| Mock not matching | Wrong expected call count | Use `.times(1)` or `.times(..)` for flexible matching |
| Doc test fails | Code in doc comment out of date | Run `cargo test --doc` to verify |
| Test takes too long | Setup in every test | Use test fixtures or lazy_static |
| Coverage too low | Missing edge case tests | Add tests for error paths and boundary values |
| Fuzz test slow | Complex input space | Reduce input size, use timeouts |
| Integration test DB conflicts | Tests share database | Use transaction rollback per test |
| Parametrized test maintenance | Too many test cases | Use proptest instead of manual case lists |

## Best Practices

1. Organize unit tests in a `tests` module inside each source file (mod tests).
2. Use `#[cfg(test)]` to exclude test code from release builds.
3. Write tests for both success and failure paths.
4. Use meaningful test function names describing the scenario.
5. Keep tests independent — no shared mutable state.
6. Use `assert_matches!` for pattern assertions over raw assert_eq!.
7. Mark slow tests with `#[ignore]` and run them separately.
8. Use `rstest` for cases where the same logic tests multiple inputs.
9. Aim for >80% code coverage with meaningful tests.
10. Run `cargo test --all-features` to test all feature combinations.

## Anti-Patterns

1. **Testing implementation details**: Tests that break on refactoring.
2. **No negative tests**: Only testing happy paths.
3. **Flaky tests**: Non-deterministic tests that sometimes fail.
4. **Giant test functions**: Testing too much in one test.
5. **Mock everything**: Over-mocking leads to brittle tests.
6. **Ignoring slow tests**: Slow tests should be optimized, not just ignored.
7. **No CI test run**: Tests not automated in pipeline.
8. **Testing the framework**: Not your code (e.g., testing serde derive correctness).

## References

Rust Testing Book: https://doc.rust-lang.org/book/ch11-00-testing.html
Rust Testing Reference: https://doc.rust-lang.org/reference/attributes/testing.html
rstest: https://docs.rs/rstest/latest/rstest/
mockall: https://docs.rs/mockall/latest/mockall/
proptest: https://docs.rs/proptest/latest/proptest/
quickcheck: https://docs.rs/quickcheck/latest/quickcheck/
cargo-fuzz: https://rust-fuzz.github.io/book/cargo-fuzz.html
cargo-tarpaulin: https://docs.rs/cargo-tarpaulin/latest/cargo_tarpaulin/
cargo-llvm-cov: https://docs.rs/cargo-llvm-cov/latest/cargo_llvm_cov/
cargo-nextest: https://nexte.st/
