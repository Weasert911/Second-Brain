# References — Unsafe-Rust-Review

## Official Documentation

- [Rustonomicon](https://doc.rust-lang.org/nomicon/) — the dark arts of unsafe Rust
- [Unsafe Code Guidelines](https://rust-lang.github.io/unsafe-code-guidelines/) — WG reference
- [Rust Reference: Unsafe](https://doc.rust-lang.org/reference/unsafe-keyword.html) — language reference
- [Stacked Borrows Paper](https://github.com/rust-lang/unsafe-code-guidelines/blob/master/wip/stacked-borrows.md)
- [Tree Borrows](https://perso.crans.org/vanille/tree-borrows/) — alias model
- [Miri](https://github.com/rust-lang/miri) — UB detection
- [Strict Provenance](https://doc.rust-lang.org/std/ptr/index.html#strict-provenance) — pointer provenance
- [Rust RFC 2582](https://rust-lang.github.io/rfcs/2582-unsafe-operations-in-unsafe-fns.html) — unsafe ops in unsafe fns
- [Rust RFC 3323](https://rust-lang.github.io/rfcs/3323-strict-provenance.html) — strict provenance
- [Thread Sanitizer](https://doc.rust-lang.org/beta/unstable-book/compiler-flags/sanitizer.html) — data race detection
- [Address Sanitizer](https://doc.rust-lang.org/beta/unstable-book/compiler-flags/sanitizer.html) — memory error detection

## Key Terms

1. **Unsafe Superpowers**: Dereference raw pointer, call unsafe function, access mutable static, implement unsafe trait.
2. **Raw Pointer**: `*const T` or `*mut T` — a pointer without Rust's safety guarantees.
3. **Provenance**: The set of memory locations a pointer is allowed to access.
4. **Strict Provenance**: A model where pointers carry their original provenance.
5. **Stacked Borrows**: A model for determining when pointer accesses are valid.
6. **Tree Borrows**: An alternative aliasing model to Stacked Borrows.
7. **Safety Invariant**: A condition that must hold for safe code to be sound.
8. **Correctness Invariant**: A condition that must hold for the code to produce correct results.
9. **Undefined Behavior**: Behavior that the compiler assumes never occurs.
10. **Data Race**: Unsynchronized concurrent access to memory.
11. **Aliasing Violation**: Accessing memory through a pointer that violates aliasing rules.
12. **Use-After-Free**: Accessing memory after it has been deallocated.
13. **PhantomData**: A zero-sized type used to express ownership/lifetime relationships.
14. **repr(C)**: A type layout guaranteed to match C ABI.
15. **MaybeUninit**: A type for representing potentially uninitialized memory.

## Architecture Notes

Unsafe Rust provides five superpowers that are normally checked by the compiler. The safety of unsafe code depends on invariants that cannot be checked automatically. Miri interprets Rust's MIR to detect UB at runtime. Stacked Borrows models the validity of pointer accesses as a stack of borrows. Strict provenance adds rules about how pointers can be created and used.

## Key APIs

- `std::ptr::{read, write, swap, replace, drop_in_place}` — raw pointer operations
- `std::ptr::{null, null_mut, NonNull, from_raw_parts, addr_of, addr_of_mut}` — pointer utilities
- `std::mem::{MaybeUninit, ManuallyDrop, forget, transmute, transmute_copy}` — unsafe memory ops
- `std::slice::{from_raw_parts, from_raw_parts_mut}` — slice creation from pointers
- `std::alloc::{alloc, dealloc, realloc, Layout, GlobalAlloc}` — manual memory management
- `std::marker::PhantomData` — type-level ownership encoding
- `std::ffi::{CStr, CString, OsStr, OsString}` — FFI string types
- `std::os::raw::{c_char, c_int, c_void, c_long}` — C type aliases

## Conventions

- SAFETY comments: `// SAFETY: <preconditions>` before each unsafe block
- Unsafe functions document: `/// # Safety`, `///` Preconditions for calling this function
- Unsafe traits document: what implementors must guarantee
- PhantomData placed in struct fields to model ownership
- repr(C) on all types shared across FFI
- NonNull preferred over raw pointers when pointer must be non-null

## Project Structure

```
unsafe_project/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── ffi/
│   │   ├── mod.rs         # FFI function declarations
│   │   ├── bindings.rs    # raw C bindings
│   │   └── safe_wrapper.rs # safe wrappers around unsafe FFI
│   ├── alloc.rs           # custom allocator
│   ├── ptr.rs             # raw pointer utilities
│   └── unsafe_traits.rs   # unsafe trait implementations
├── tests/
│   └── unsafe_tests.rs    # test unsafe code with Miri
└── miri.sh                # Miri test script
```
