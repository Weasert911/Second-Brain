# References — Rust-Testing-Expert

## Official Documentation

- [Rust Testing Book Chapter](https://doc.rust-lang.org/book/ch11-00-testing.html) — testing introduction
- [Rust Testing Reference](https://doc.rust-lang.org/reference/attributes/testing.html) — test attribute reference
- [Rust RFC 1990](https://rust-lang.github.io/rfcs/1990-extern-abs.html) — test framework design
- [rstest Docs](https://docs.rs/rstest/latest/rstest/) — parametrized tests
- [mockall Docs](https://docs.rs/mockall/latest/mockall/) — mocking framework
- [proptest Docs](https://docs.rs/proptest/latest/proptest/) — property-based testing
- [quickcheck Docs](https://docs.rs/quickcheck/latest/quickcheck/) — property-based testing
- [cargo-fuzz Book](https://rust-fuzz.github.io/book/) — fuzz testing
- [cargo-tarpaulin Docs](https://docs.rs/cargo-tarpaulin/latest/cargo_tarpaulin/) — code coverage
- [cargo-nextest](https://nexte.st/) — next-generation test runner

## Key Terms

1. **Unit Test**: Tests individual functions in isolation.
2. **Integration Test**: Tests how multiple modules work together.
3. **Doc Test**: Tests embedded in documentation comments.
4. **Test Module**: A `mod tests { ... }` with `#[cfg(test)]` attribute.
5. **Assertion**: A macro that verifies a condition (assert_eq!, assert!).
6. **Parametrized Test**: A test that runs with multiple inputs.
7. **Property-Based Test**: A test that checks invariants across random inputs.
8. **Mock**: A fake implementation used to test interactions.
9. **Fuzz Test**: A test that feeds random data to find crashes.
10. **Code Coverage**: A metric of how much code is exercised by tests.
11. **Fixture**: Shared setup code for tests.
12. **Flaky Test**: A test that sometimes passes and sometimes fails.
13. **Regression Test**: A test that verifies a previously fixed bug stays fixed.
14. **Golden File Test**: A test comparing output to a reference file.
15. **Smoke Test**: A basic test that the system runs without crashing.

## Architecture Notes

Rust's built-in test framework uses the `#[test]` attribute to mark test functions. Tests are compiled with `--test` and run by the test harness. The `cfg(test)` attribute conditionally compiles test code. Integration tests go in the `tests/` directory and are compiled as separate crates. Doc tests are extracted from `///` comments and run as separate tests.

## Key APIs

- `#[test]`, `#[tokio::test]`, `#[rstest]` — test function attributes
- `assert_eq!(left, right)`, `assert_ne!(left, right)` — equality assertions
- `assert_matches!(value, pattern)` — pattern matching assertion
- `#[should_panic(expected = "...")]` — expected panic tests
- `#[ignore]` — skip test by default
- `#[cfg(test)]` — conditional compilation
- `mockall::#[automock]` — auto-generate mocks for traits
- `proptest::proptest! { ... }` — property-based test macro
- `quickcheck::QuickCheck` — quickcheck test runner

## Conventions

- Test module at bottom of file: `#[cfg(test)] mod tests { use super::*; ... }`
- Test function naming: `fn test_<scenario>()` or `fn <fn_name>_<condition>()`
- Integration tests: one file per module/feature in `tests/`
- Doc tests: in `///` comments as `/// ```rust` code blocks
- Mock traits: `#[mockall::automock]` on trait definition
- Coarse test grouping: `cargo test <pattern>` for filtering

## Project Structure

```
tested_project/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── user.rs
│   └── utils.rs
├── tests/
│   ├── common/
│   │   └── mod.rs      # shared test helpers
│   ├── user_tests.rs
│   └── integration.rs
├── examples/
│   └── demo.rs
├── fuzz/
│   └── targets/
│       └── fuzz_target_1.rs
└── benches/
    └── bench.rs
```
