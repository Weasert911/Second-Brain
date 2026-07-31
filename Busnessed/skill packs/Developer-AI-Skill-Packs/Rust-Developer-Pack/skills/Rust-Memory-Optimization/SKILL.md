---
name: "Rust-Memory-Optimization"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Rust memory optimization expert skill for memory layout, allocators, cache efficiency, arena allocation, and memory profiling."
purpose: "Provides comprehensive guidance on optimizing memory usage in Rust applications, including type layout optimization, allocator selection, cache-friendly data structures, arena allocation strategies, and memory profiling techniques."
---

## Capabilities

1. Analyze and optimize memory layout of Rust types using repr(Rust), repr(C), repr(packed), repr(align).
2. Measure and optimize size_of and align_of for structs and enums.
3. Apply niche optimization for enum discriminants (Option<NonZeroUsize>, etc.).
4. Choose between Box, Rc, and Arc based on memory and performance trade-offs.
5. Implement memory pooling and arena allocation with typed-arena, bumpalo, and slab.
6. Select appropriate container types: Vec vs SmallVec vs ArrayVec.
7. Optimize string storage: String vs Box<str> vs &str based on use case.
8. Optimize HashMap with hashbrown and FnvHasher.
9. Implement custom allocators with GlobalAlloc and std::alloc.
10. Use memory-mapped files with memmap2 for efficient file I/O.
11. Design cache-friendly data structures (SoA vs AoS, field reordering).
12. Avoid unnecessary allocations with String::reserve, capacity management, and reuse.

## Limitations

1. Cannot execute or profile memory usage directly — provides analysis and recommendations.
2. Platform-specific memory behavior (cache line size, page size) varies.
3. Custom allocator implementation requires unsafe code review.

## Required Tools

- Rust compiler with optimization reports
- std::mem::{size_of, align_of, size_of_val}
- dhat for heap profiling
- cargo-show-asm for assembly inspection
- Linux perf stat with cache events
- DHAT and Massif (valgrind tools)
- memmap2 crate for memory-mapped files

## Execution Workflow

1. Profile current memory usage with dhat or Massif.
2. Identify largest allocations and hot allocation sites.
3. Measure current type sizes (size_of::<T>()).
4. Optimize struct layout by reordering fields (largest to smallest).
5. Apply repr attributes (repr(C), repr(packed), repr(align)).
6. Apply niche optimization (use NonZero, NonNull where applicable).
7. Choose optimal containers (SmallVec, ArrayVec, hashbrown).
8. Implement arena allocation for short-lived objects.
9. Optimize string handling (Box<str> for static strings).
10. Apply SoA conversion for hot loops.
11. Add capacity hints (reserve, with_capacity).
12. Re-profile and compare results.
13. Document memory characteristics.

## Decision Tree

1. **Is the type frequently allocated?**
   - YES → Minimize size, consider arena allocation.
   - NO → Size is less critical.

2. **Is the type part of a hot loop?**
   - YES → Optimize for cache efficiency (SoA, field reordering).
   - NO → Default layout is fine.

3. **Are allocations a bottleneck?**
   - YES → Use arena allocator (bumpalo, typed-arena), pre-allocate.
   - NO → Standard allocator is fine.

4. **Is the container size bounded?**
   - YES → Use ArrayVec or SmallVec instead of Vec.
   - NO → Use Vec with capacity hints.

5. **Are strings immutable or static?**
   - Static → Use &'static str or Box<str>.
   - Mutable → Use String with reserve.

6. **Is the HashMap performance critical?**
   - YES → Use hashbrown with custom hasher (fxhash).
   - NO → Default std HashMap is fine.

## Review Checklist

- [ ] Struct fields ordered from largest to smallest alignment.
- [ ] Enum discriminants use niche optimization where possible.
- [ ] Box chosen over Rc/Arc for unique ownership.
- [ ] SmallVec/ArrayVec used instead of Vec for small fixed-size collections.
- [ ] Box<str> considered over String for immutable strings.
- [ ] HashMap uses hashbrown or fnv for performance.
- [ ] Capacity hints provided (with_capacity, reserve).
- [ ] SoA layout considered for hot loops with struct-of-arrays.
- [ ] Arena allocation used for many short-lived objects.
- [ ] Custom allocator used when standard allocator is insufficient.
- [ ] Memory-mapped files used for large file reads.
- [ ] dhat profiling shows no unexpected allocations.
- [ ] type sizes reviewed (no unexpectedly large types).
- [ ] Drop order and memory leak checks.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Large enum size | Many variants with different sizes | Box large variants, use niche optimization |
| Unexpected allocations | Vec/String growing dynamically | Pre-allocate with reserve/with_capacity |
| HashMap slow | Poor hash function, high collision | Use hashbrown with good hasher |
| Cache misses in hot loop | Random memory access, AoS layout | Use SoA, prefetch, linear access patterns |
| Memory grows unbounded | Vec without cap, arena without reset | Set capacity limits, reset arenas |
| Fragmentation | Many allocations of varying sizes | Use arena allocator, slab allocation |
| Stack overflow | Large stack-allocated type | Box the type to move to heap |
| dhat shows many small allocs | String/Vec reallocation | Pre-allocate, use SmallVec |

## Best Practices

1. Measure before optimizing — profile with dhat or a profiler.
2. Use `size_of` and `align_of` to understand type sizes.
3. Order struct fields from largest alignment to smallest.
4. Use `Box<str>` for immutable strings over String (saves 8 bytes).
5. Use `SmallVec` for collections with a small expected size.
6. Pre-allocate with `Vec::with_capacity` when the size is known.
7. Use arena allocators for batch allocations with the same lifetime.
8. Convert AoS to SoA for data-intensive hot loops.
9. Use `NonZero*` and `NonNull` to enable niche optimization in Option.
10. Use `#[repr(align(64))]` for types sharing cache lines across threads.
11. Minimally: use `#[derive(Default)]` and avoid `Option` where `Default` suffices.
12. Avoid `Vec<Option<T>>` when `Vec<T>` with sentinel values works.

## Anti-Patterns

1. **Premature optimization**: Optimizing memory without profiling first.
2. **Not measuring**: Guessing the source of memory pressure.
3. **Overusing Box**: Boxing small types that fit in registers.
4. **Giant enums**: Many huge variants when boxing large variants would help.
5. **Excessive cloning**: Cloning large data when references suffice.
6. **Missing capacity hints**: Growing Vec/String one element at a time.
7. **Cache line sharing**: False sharing between thread-local data on same cache line.
8. **Box<[T]> vs Vec confusion**: Box<[T]> is 2 words, Vec is 3 words.
9. **repr(packed) misalignment**: Forgetting alignment leads to UB on some platforms.

## References

Rust Reference — Type Layout: https://doc.rust-lang.org/reference/type-layout.html
Rust Performance Book: https://nnethercote.github.io/perf-book/
dhat: https://docs.rs/dhat/latest/dhat/
bumpalo: https://docs.rs/bumpalo/latest/bumpalo/
typed-arena: https://docs.rs/typed-arena/latest/typed_arena/
hashbrown: https://docs.rs/hashbrown/latest/hashbrown/
smallvec: https://docs.rs/smallvec/latest/smallvec/
memmap2: https://docs.rs/memmap2/latest/memmap2/
Nick Nethercote's Blog: https://nnethercote.github.io/
