# Checklists — Rust-Benchmarking

## Pre-Flight Checklist

- [ ] Performance-critical code paths identified
- [ ] Criterion.rs added to dev-dependencies
- [ ] Benchmark environment configured (idle machine, performance governor)
- [ ] CPU scaling disabled (performance governor)
- [ ] ASLR considered (disabled for consistent results)
- [ ] Compiler optimization level set (release profile)
- [ ] Profiling tools installed (perf/samply/valgrind)
- [ ] dhat heap profiling plan outlined

## Implementation Checklist

- [ ] Benchmarks use black_box for inputs and results
- [ ] Setup and teardown not measured (use iter_batched if needed)
- [ ] Multiple input sizes tested
- [ ] Comparison benchmarks for alternative implementations
- [ ] Baseline results saved
- [ ] Throughput measured for bulk operations
- [ ] Iteration count and measurement time appropriate
- [ ] Benchmark names are descriptive
- [ ] Benchmarks organized in groups by feature
- [ ] All benchmarks compile and run without errors

## Testing Checklist

- [ ] Benchmarks produce consistent results across runs
- [ ] Statistical analysis shows tight confidence intervals
- [ ] Comparison results have significance testing
- [ ] Flamegraphs show expected hot functions
- [ ] dhat allocations match expectations
- [ ] No unexpected allocations in hot paths
- [ ] Cache misses reasonable for workload
- [ ] Instruction count matches expectations
- [ ] Manual optimization verified by benchmark improvement
- [ ] Benchmarks run on CI (not on every commit, but nightly)

## Release Checklist

- [ ] Baseline stored for release comparison
- [ ] Performance regression check in CI
- [ ] Release binary optimized (LTO, codegen-units, target-cpu)
- [ ] Benchmark results documented
- [ ] Optimization changes validated with before/after comparison
- [ ] Documentation updated with performance characteristics
- [ ] Benchmark artifacts cleaned (target/criterion/)
- [ ] Release notes include performance changes

## Maintenance Checklist

- [ ] Benchmarks updated when code changes
- [ ] Criterion.rs version checked for updates
- [ ] Baseline baselines re-saved after compiler updates
- [ ] New features benchmarked before merge
- [ ] Regression alerts investigated promptly
- [ ] Profiling tools version compatibility checked
- [ ] Benchmarking methodology reviewed periodically
- [ ] Test environment documented (CPU, RAM, OS, Rust version)
