# References — Rust-Memory-Optimization

## Official Documentation

- [Rust Type Layout Reference](https://doc.rust-lang.org/reference/type-layout.html) — official layout docs
- [Rust Performance Book](https://nnethercote.github.io/perf-book/) — optimization guide
- [Rust std::mem](https://doc.rust-lang.org/std/mem/index.html) — size_of, align_of, etc.
- [Rust std::alloc](https://doc.rust-lang.org/std/alloc/index.html) — custom allocators
- [dhat](https://docs.rs/dhat/latest/dhat/) — heap profiling
- [bumpalo](https://docs.rs/bumpalo/latest/bumpalo/) — bump allocator
- [typed-arena](https://docs.rs/typed-arena/latest/typed_arena/) — typed arena
- [hashbrown](https://docs.rs/hashbrown/latest/hashbrown/) — Swiss-table hashmap
- [smallvec](https://docs.rs/smallvec/latest/smallvec/) — small vector optimization
- [memmap2](https://docs.rs/memmap2/latest/memmap2/) — memory-mapped files
- [Nick Nethercote's Blog](https://nnethercote.github.io/) — Rust optimization articles

## Key Terms

1. **repr(Rust)**: Default Rust struct layout — fields may be reordered.
2. **repr(C)**: C-compatible layout — fields in declaration order.
3. **repr(packed)**: Remove padding bytes (may cause misalignment).
4. **repr(align(n))**: Force alignment to at least n bytes.
5. **Niche Optimization**: Using invalid bit patterns for enum discriminants.
6. **Cache Line**: 64-byte block of memory cached by CPU.
7. **False Sharing**: Multiple threads writing to the same cache line.
8. **AoS**: Array of Structs (default Rust layout).
9. **SoA**: Struct of Arrays (cache-friendly for SIMD).
10. **Arena**: A contiguous memory region for many allocations.
11. **Bump Allocator**: Arena that increments a pointer (fast, no free).
12. **Memory-Mapped File**: File mapped into virtual memory address space.
13. **Swiss Table**: Hash table design used by hashbrown.
14. **Slab Allocation**: Pre-allocated array of fixed-size slots.
15. **Small Vector Optimization**: Inline storage for small vectors (SmallVec).

## Architecture Notes

Rust's default layout (repr(Rust)) is undefined and compiler-chosen for optimization. repr(C) follows the C struct layout rules. Enum discriminants use niche optimization: if a variant has an invalid bit pattern (e.g., `NonZeroUsize` cannot be zero), that pattern is used as the discriminant for `Option<T>`, saving 8 bytes. Cache effects dominate modern CPU performance; a cache miss costs ~100-200 cycles vs ~5 for a register access.

## Key APIs

- `std::mem::{size_of, align_of, size_of_val, align_of_val, offset_of}` — layout introspection
- `std::mem::{ManuallyDrop, MaybeUninit, forget, replace, swap}` — memory manipulation
- `std::alloc::{GlobalAlloc, Layout, alloc, dealloc, realloc}` — allocator interface
- `std::collections::HashMap` vs `hashbrown::HashMap` — hash map
- `smallvec::SmallVec<T, N>` — inline storage vector
- `arrayvec::ArrayVec<T, N>` — fixed-capacity array-based vector
- `bumpalo::Bump` — bump allocator
- `typed_arena::Arena<T>` — typed arena allocator
- `slab::Slab<T>` — pre-allocated pool
- `memmap2::Mmap` — memory-mapped files

## Conventions

- Field ordering: largest alignment first, then descending
- Enum sizes: Box large variants to reduce enum size
- Container selection: SmallVec for N < 32, Vec for larger
- Capacity hints: always use `with_capacity` when approximate size is known
- Allocator: use std allocator for general use, arena for hot paths

## Project Structure

```
memory_optimized_project/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── layout.rs         # type layout optimizations
│   ├── containers.rs     # container selection and usage
│   ├── allocators.rs     # custom allocator implementations
│   ├── arena.rs          # arena allocation patterns
│   ├── cache.rs          # cache-friendly data structures
│   └── profile.rs        # memory profiling setup
├── profiler/             # profiling scripts
│   ├── dhat.sh
│   └── perf_cache.sh
└── benchmarks/
    └── memory_bench.rs
```
