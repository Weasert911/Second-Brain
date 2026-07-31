---
name: "Rust-Benchmarking"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Rust benchmarking expert skill for Criterion.rs, profiling, flamegraphs, memory allocation analysis, and statistical performance measurement."
purpose: "Provides comprehensive guidance on performance measurement and optimization in Rust, including microbenchmarking with Criterion.rs, allocation profiling with dhat, flamegraph generation, profiler integration, and statistical analysis of benchmark results."
---

## Capabilities

1. Write and run benchmarks with Criterion.rs including parameterized benchmarks and comparison groups.
2. Perform statistical analysis of benchmark results (mean, median, standard deviation, outliers).
3. Compare multiple implementations side by side with statistical significance.
4. Use black_box to prevent dead-code elimination in benchmarks.
5. Configure benchmark profiles and compiler optimization settings.
6. Profile memory allocations with dhat for allocation counting and heap profiling.
7. Generate flamegraphs with cargo-flamegraph and perf.
8. Integrate with profilers: perf, samply, DHAT, cachegrind.
9. Analyze instruction counts and CPU cache performance.
10. Set up benchmark environment controls (CPU frequency scaling, ASLR).
11. Avoid common microbenchmarking pitfalls.
12. Track benchmark results over time for regression detection.

## Limitations

1. Cannot run benchmarks or profiling tools — provides guidance and analysis.
2. Profiling tools are platform-specific (perf on Linux, Instruments on macOS, ETW on Windows).
3. Microbenchmark results may not reflect real-world performance.
4. Does not cover distributed systems or network benchmarking.

## Required Tools

- Criterion.rs crate for benchmarking
- dhat crate for heap profiling
- cargo-flamegraph for flamegraph generation
- perf (Linux) / samply (cross-platform) for profiling
- valgrind (cachegrind, callgrind) for cache analysis
- hyperfine for CLI benchmarking

## Execution Workflow

1. Identify performance-critical code paths.
2. Design benchmarks that measure realistic workloads.
3. Write Criterion.rs benchmarks with parameterized inputs.
4. Run benchmarks with `cargo bench` to collect baseline.
5. Apply compiler optimizations (LTO, codegen-units, target-cpu).
6. Profile with perf/samply to identify hotspots.
7. Generate flamegraphs for visual hotspot analysis.
8. Profile memory allocations with dhat.
9. Analyze cache behavior with cachegrind.
10. Implement optimizations based on profiling data.
11. Re-run benchmarks to measure improvement.
12. Compare before/after with statistical analysis.
13. Track in CI for regression detection.

## Decision Tree

1. **Is the code CPU-bound?**
   - YES → Use Criterion.rs for timing benchmarks, perf for hotspots.
   - NO → Check for I/O, memory allocation, or lock contention.

2. **Is allocation a concern?**
   - YES → Use dhat for allocation profiling and counting.
   - NO → Focus on CPU profiling.

3. **Are there multiple implementations?**
   - YES → Use Criterion comparison groups for A/B testing.
   - NO → Single implementation measurement.

4. **Is the benchmark environment stable?**
   - YES → Use default Criterion settings.
   - NO → Increase iterations, use warm-up, disable CPU scaling.

5. **Is regression detection needed?**
   - YES → Save baseline JSON and compare in CI.
   - NO → Ad-hoc benchmarks suffice.

6. **Is cache performance relevant?**
   - YES → Use cachegrind or perf stat -e cache-misses.
   - NO → Timing and allocation profiling enough.

## Review Checklist

- [ ] Benchmarks use realistic input sizes (not just pathological cases).
- [ ] black_box used to prevent dead-code elimination.
- [ ] Benchmark setup and teardown are not measured.
- [ ] Compiler optimizations are representative of release builds.
- [ ] Statistical analysis considers noise and outliers.
- [ ] Allocation profiling identifies unexpected allocations.
- [ ] Flamegraphs verify hotspot identification.
- [ ] Benchmark comparisons include confidence intervals.
- [ ] Baseline results saved for regression comparison.
- [ ] Environment factors documented (CPU, OS, Rust version).
- [ ] Benchmarks are reproducible (fixed seed, no external dependencies).
- [ ] Optimization changes validated with benchmarks.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Benchmark shows zero time | Dead code elimination | Add black_box() around inputs and results |
| High variance in results | System noise, CPU scaling | Disable turbo boost, set CPU governor to performance |
| Profiler shows no symbols | Debug symbols stripped | Build with debug = 1 in profile |
| Flamegraph missing frames | Wrong perf invocation | Use --call-graph dwarf for Rust |
| dhat shows unexpected allocations | String/vec resizing | Pre-allocate with reserve() |
| Criterion comparison "not significant" | Too few samples | Increase measurement time or sample count |
| Cachegrind slow | Large codebase | Profile specific functions, not entire program |
| Benchmark different from production | Synthetic workload | Validate benchmarks against production profiles |

## Best Practices

1. Always use `black_box` for benchmark inputs and results.
2. Warm up before measuring (Criterion handles this automatically).
3. Measure realistic workloads, not microbenchmarks of trivial operations.
4. Use parameterized benchmarks to test multiple input sizes.
5. Save baseline results and compare in CI.
6. Profile before optimizing — don't guess hotspots.
7. Measure allocations separately from CPU time.
8. Run benchmarks on idle machines for consistent results.
9. Compile with the same profile as release builds.
10. Use `cargo bench -- --profile-time <secs>` for flamegraph + benchmark.
11. Document benchmark methodology for reproducibility.
12. Track results over time to catch regressions early.

## Anti-Patterns

1. **Benchmarking debug builds**: Results are not representative.
2. **Microbenchmarking I/O**: I/O benchmarks should measure realistic throughput.
3. **Ignoring compiler optimizations**: Compiler may optimize away the benchmarked code.
4. **Over-optimizing**: Spending time optimizing code that's not a bottleneck.
5. **Single input size**: Results may not generalize.
6. **No statistical analysis**: Mean alone doesn't capture variance.
7. **Manual timing loops**: Use Criterion instead of std::time::Instant.
8. **Profiling without benchmarks**: Hotspots without context are misleading.

## References

Criterion.rs Guide: https://docs.rs/criterion/latest/criterion/
Criterion.rs Book: https://bheisler.github.io/criterion.rs/book/
dhat Docs: https://docs.rs/dhat/latest/dhat/
cargo-flamegraph: https://github.com/flamegraph-rs/flamegraph
perf Wiki: https://perf.wiki.kernel.org/
samply: https://github.com/mstange/samply
Valgrind: https://valgrind.org/
Rust Performance Book: https://nnethercote.github.io/perf-book/
