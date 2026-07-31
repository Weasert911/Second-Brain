# Checklists — Rust-Memory-Optimization

## Pre-Flight Checklist

- [ ] Current memory usage measured (dhat, Massif, or RSS)
- [ ] Hot allocation sites identified
- [ ] Type sizes checked (size_of::<T>())
- [ ] Target memory budget defined
- [ ] Profiling tools installed and configured
- [ ] Baseline benchmarks established

## Implementation Checklist

- [ ] Struct fields ordered by decreasing alignment
- [ ] repr(packed) applied only where misalignment is acceptable
- [ ] repr(align(n)) used for cache-line padding to avoid false sharing
- [ ] Enum niche optimization utilized (NonZero*, NonNull)
- [ ] Box used for large enum variants
- [ ] SmallVec/ArrayVec for bounded collections
- [ ] Box<str> considered for immutable strings
- [ ] HashMap uses hashbrown or fxhash
- [ ] Vec provided with capacity hints (with_capacity, reserve)
- [ ] Arena allocation for short-lived objects
- [ ] SoA layout for hot loop data
- [ ] Memory-mapped files for large reads

## Testing Checklist

- [ ] Type sizes verified (no regressions)
- [ ] Allocations counted (dhat block count)
- [ ] Peak memory usage measured
- [ ] Cache misses measured (perf stat -e cache-misses)
- [ ] Hot loop performance compared before/after
- [ ] Allocation patterns tested (no excessive reallocation)
- [ ] Object lifetimes verified (no use-after-free with arenas)
- [ ] SoA correctness (indices match across arrays)
- [ ] HashMap resize behavior tested
- [ ] Custom allocator safety verified (Miri)

## Release Checklist

- [ ] Final memory usage within budget
- [ ] Allocation counts acceptable
- [ ] Cache miss rate acceptable
- [ ] Performance benchmarks show improvement
- [ ] Profiling data documented for future reference
- [ ] Custom allocators reviewed for safety
- [ ] No unexpected memory regressions
- [ ] Memory usage scales linearly with input size
- [ ] Memory fragmentation acceptable
- [ ] Release profile optimizations enabled (LTO, etc.)

## Maintenance Checklist

- [ ] Memory usage tracked over time
- [ ] dhat profiling run on major changes
- [ ] Type sizes checked after refactoring
- [ ] Container choices reviewed for new use cases
- [ ] Arena allocation lifetimes reviewed
- [ ] HashMap hasher performance re-evaluated
- [ ] Cache behavior checked for new architectures
- [ ] Dependencies updated for allocator crates
