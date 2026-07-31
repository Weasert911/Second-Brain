# References — Rust-Expert

## Official Documentation

- [The Rust Reference](https://doc.rust-lang.org/reference/) — definitive language specification
- [The Rust Book](https://doc.rust-lang.org/book/) — comprehensive introduction
- [Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/) — learn through annotated examples
- [Rust Edition Guide](https://doc.rust-lang.org/edition-guide/) — migration between editions
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/) — API design recommendations
- [Rustonomicon](https://doc.rust-lang.org/nomicon/) — unsafe Rust deep dive
- [Rust Reference: Unsafe](https://doc.rust-lang.org/reference/unsafe-keyword.html)
- [The Rust RFC Book](https://rust-lang.github.io/rfcs/) — language design decisions

## Key Terms

1. **Ownership**: Each value has exactly one owner at any time.
2. **Borrowing**: References to a value without transferring ownership.
3. **Lifetime**: The scope during which a reference is valid.
4. **NLL**: Non-Lexical Lifetimes — the borrow checker uses control-flow analysis.
5. **Trait**: A set of methods that types can implement.
6. **Trait Object**: A pointer to any type implementing a trait (`dyn Trait`).
7. **Generic**: A type or function parameterized over types.
8. **Associated Type**: A type placeholder within a trait definition.
9. **Object Safety**: Restrictions on traits usable as trait objects.
10. **Macro Hygiene**: Macro expansions respect the call site's scope.
11. **Monomorphization**: Generic functions are compiled for each concrete type.
12. **Zero-Cost Abstraction**: Abstractions compile down to efficient machine code.
13. **RAII**: Resource Acquisition Is Initialization — destructors run at scope exit.
14. **Send/Sync**: Marker traits for thread safety.
15. **UB**: Undefined Behavior — the compiler assumes this never occurs.

## Architecture Notes

Rust's type system enforces memory safety and thread safety at compile time. The borrow checker operates on MIR (Mid-level IR) and uses NLL to track reference validity. Trait resolution is done through a unification-based type inference system. The macro system operates at the AST level, with declarative macros (macro_rules!) providing pattern matching and procedural macros operating on token streams.

## Key APIs

- `std::ops::{Deref, DerefMut}` — smart pointer forwarding
- `std::borrow::Cow` — clone-on-write
- `std::cell::{Cell, RefCell, UnsafeCell}` — interior mutability
- `std::rc::{Rc, Weak}` — reference counting (single-threaded)
- `std::sync::{Arc, Mutex, RwLock}` — thread-safe synchronization
- `std::mem::{ManuallyDrop, MaybeUninit, forget, swap, replace}` — manual memory
- `std::pin::Pin` — pinning guarantees
- `std::marker::{PhantomData, Send, Sync}` — type-level markers
- `proc_macro::{TokenStream, TokenTree, Ident, Literal, Group, Delimiter, Span}` — proc macro API

## Conventions

- Types: `PascalCase` — `struct MyType`, `enum MyEnum`
- Functions/Methods: `snake_case` — `fn do_something()`
- Constants: `SCREAMING_SNAKE_CASE` — `const MAX_SIZE: usize`
- Macros: `snake_case!` — `vec![], println!()`
- Modules: `snake_case` — `mod my_module`
- Crate names: `snake_case`, hyphens in Cargo.toml converted to underscores in code
- Error types: append `Error` — `ParseError`, `ValidationError`
- Getter methods: same as field name (no `get_` prefix)
- Builder methods: `fn set_*() -> &mut Self`, `fn with_*(mut self) -> Self`

## Project Structure

```
my_crate/
├── Cargo.toml
├── src/
│   ├── main.rs          # binary entry point (or lib.rs for library)
│   ├── lib.rs           # library root
│   ├── module/
│   │   ├── mod.rs
│   │   └── sub_module.rs
│   └── bin/             # multiple binaries
│       ├── my_bin1.rs
│       └── my_bin2.rs
├── tests/               # integration tests
│   └── integration_test.rs
├── examples/            # example binaries
│   └── example1.rs
├── benches/             # benchmarks
│   └── bench1.rs
└── build.rs             # build script
```
