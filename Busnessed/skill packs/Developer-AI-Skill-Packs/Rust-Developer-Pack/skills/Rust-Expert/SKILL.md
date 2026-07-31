---
name: "Rust-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Rust expert skill for core language, ownership, lifetimes, generics, traits, error handling, macros, async, unsafe, and FFI guidance."
purpose: "Provides authoritative guidance on idiomatic Rust programming, deep ownership/lifetime semantics, trait-based generics, error handling patterns, macro metaprogramming, async/await, unsafe code boundaries, and FFI design."
---

## Capabilities

1. Analyze and explain ownership, borrowing, and lifetime annotations with NLL (non-lexical lifetimes) semantics.
2. Design generic types and functions with trait bounds, associated types, generic parameters, and where clauses.
3. Implement trait objects with dyn syntax, object safety, and trait upcasting.
4. Construct error handling flows using Result, Option, anyhow, thiserror, and custom error types.
5. Write declarative macros (macro_rules!) and procedural macros (derive, attribute, function-like).
6. Design async/await concurrency patterns including JoinSet, select!, and structured concurrency.
7. Apply smart pointers appropriately: Box, Rc, Arc, Cell, RefCell, Mutex, RwLock.
8. Implement unsafe code with raw pointers, FFI bindings, and no_std environments safely.
9. Architect Cargo workspace projects with module visibility, re-exports, and feature flags.
10. Navigate Rust edition differences (2015, 2018, 2021, 2024) and migration strategies.
11. Apply common Rust design patterns: builder, newtype, RAII, typestate, and visitor.
12. Optimize iterator chains with adapters, closures, and lazy evaluation techniques.

## Limitations

1. Cannot execute or compile Rust code directly — provides design and review only.
2. Does not replace human review for soundness-critical unsafe code.
3. May not reflect nightly-only features or unstable APIs without explicit notice.
4. Limited knowledge of very new or obscure third-party crate APIs beyond the standard library and major ecosystem crates.
5. Cannot guarantee correctness of complex procedural macro output without testing.

## Required Tools

- Rust compiler (rustc) 1.75+ with Cargo
- clippy for linting
- rustfmt for formatting
- rust-analyzer for IDE integration
- Miri for unsafe code checking
- cargo-expand for macro debugging

## Execution Workflow

1. Parse the user's Rust code or design question.
2. Identify the relevant Rust concept area (ownership, traits, macros, async, unsafe, etc.).
3. Retrieve applicable language rules from the Rust Reference and Edition Guide.
4. Consider the user's Rust edition and toolchain version.
5. Analyze code for correctness, safety, and idiomatic usage.
6. Identify potential lifetime issues or borrowing conflicts.
7. Check trait bounds for completeness and object safety.
8. Evaluate error handling completeness (no unwrap() in production paths).
9. Review macro expansion safety and hygiene considerations.
10. For unsafe code: verify safety invariants, preconditions, and postconditions.
11. Suggest refactoring with idiomatic patterns and best practices.
12. Provide alternative approaches with trade-off analysis.
13. Generate example code with proper documentation and tests.
14. Summarize key takeaway and actionable recommendations.

## Decision Tree

1. **Is the code compiling?**
   - YES → Check for warnings, clippy lints, and idiomatic improvements.
   - NO → Isolate the first error. Is it a lifetime issue? → Apply lifetime elision or explicit annotations. Is it a trait bound issue? → Add/relax bounds with where clauses. Is it an ownership conflict? → Restructure with borrowing or cloning.

2. **Is performance critical?**
   - YES → Prefer stack allocation, avoid unnecessary cloning, use &str over String, minimize allocations.
   - NO → Optimize for readability and maintainability. Use .to_owned() or .clone() freely.

3. **Is the code safe?**
   - YES → Ensure no unsafe blocks are hidden.
   - NO → Identify which unsafe superpower is needed. Justify with safety comments // SAFETY:.

4. **Is concurrency involved?**
   - YES → Prefer Arc over Rc, use Mutex/RwLock for shared state, favor channels for message passing.
   - NO → No action needed.

5. **Is async needed?**
   - YES → Choose Tokio or async-std runtime. Structure with tasks, channels, and select!.
   - NO → Prefer synchronous code for simplicity.

6. **Does the design need extensibility?**
   - YES → Use trait objects or enums with visitor pattern.
   - NO → Concrete types are simpler.

## Review Checklist

- [ ] All functions have appropriate return types (Result/Option for fallible operations).
- [ ] No unnecessary .unwrap() or .expect() in production code paths.
- [ ] Lifetime annotations are correct and minimal (prefer elision).
- [ ] Trait bounds are complete — no missing where clauses.
- [ ] Trait objects are object-safe and use dyn keyword.
- [ ] Pattern matching is exhaustive with wildcard arms where appropriate.
- [ ] Error types implement std::error::Error and are Send + Sync.
- [ ] Smart pointer choice is appropriate (Rc vs Arc, RefCell vs Mutex).
- [ ] Procmacro output is hygienic and respects span information.
- [ ] Unsafe code has // SAFETY: comments explaining invariants.
- [ ] Module visibility is correct (pub, pub(crate), pub(super)).
- [ ] Iterator chains use adapters effectively (map, filter, fold, collect).
- [ ] Clone is implemented only when semantically meaningful.
- [ ] Drop has no unexpected side effects.
- [ ] FFI functions use repr(C) and correct calling conventions.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| cannot borrow `x` as mutable more than once | Aliased mutable references | Restructure to eliminate aliasing, or use RefCell for runtime borrow checking |
| cannot return value referencing local variable | Lifetime of return value tied to local scope | Return owned value, use Cow, or adjust lifetimes |
| the trait `FnOnce` is not implemented | Closure captures move semantics incorrectly | Add move keyword or adjust captured variable ownership |
| overflow evaluating the requirement | Recursive trait bound | Add indirection (Box<T>) or restructure types |
| cannot be used as a trait object because `Sized` is not implemented | Trait requires Self: Sized | Add ?Sized bound or avoid trait objects |
| expected closure, found a different closure | Each closure has unique type | Use Box<dyn Fn...> or generic parameter |
| mismatched types: expected &T, found &mut T | Immutability constraint | Change function signature or use RefCell |
> mismatched types: expected &T, found &mut T | Immutability constraint | Change function signature or use RefCell |
| higher-ranked lifetime error | Complex lifetime relationships | Use lifetime bounds or restructure function signatures |
| cannot call non-const fn in const contexts | Non-const function called at compile time | Mark function const or use const-compatible alternatives |

## Best Practices

1. Favor iterator adapters over explicit loops when processing collections.
2. Use `thiserror` for library error types and `anyhow` for application-level errors.
3. Prefer `#[derive(Debug, Clone, PartialEq)]` over manual implementations.
4. Use `cargo clippy` and `cargo fmt` as part of CI pipeline.
5. Write documentation comments (`///` and `//!`) with examples.
6. Use `pub(crate)` visibility to minimize public API surface.
7. Implement `From` and `TryFrom` for type conversions.
8. Use `newtype` pattern with `Deref` for type safety without boilerplate.
9. Prefer `enum` with `match` over boolean flags for state representation.
10. Use `cow` (Clone on Write) for functions that sometimes need ownership.
11. Add `#[must_use]` to functions returning Result or important values.
12. Use `cfg` and `cfg_attr` for platform-specific code.

## Anti-Patterns

1. **Panic-driven error handling**: Using `.unwrap()` or `.expect()` in library code.
2. **Over-optimization**: Premature use of unsafe or complex lifetime tricks.
3. **Ticket mutex**: Holding a MutexGuard across an await point.
4. **Borrow-checker fighting**: Using Rc<RefCell<T>> when a simpler design exists.
5. **Trait object overuse**: Using Box<dyn Trait> when generics suffice.
6. **Stringly-typed APIs**: Using String when an enum or newtype is appropriate.
7. **Procedural macro spaghetti**: Writing complex proc macros that could be declarative.
8. **Missing cfg guards**: Assuming platform-specific APIs are available everywhere.

## References

Rust Reference: https://doc.rust-lang.org/reference/
Rust Book: https://doc.rust-lang.org/book/
Edition Guide: https://doc.rust-lang.org/edition-guide/
Rust by Example: https://doc.rust-lang.org/stable/rust-by-example/
Rust API Guidelines: https://rust-lang.github.io/api-guidelines/
Rust Design Patterns: https://rust-unofficial.github.io/patterns/
