# References — Rust-Benchmarking

## Official Documentation

- [Criterion.rs Guide](https://docs.rs/criterion/latest/criterion/) — benchmarking library
- [Criterion.rs Book](https://bheisler.github.io/criterion.rs/book/) — comprehensive guide
- [dhat Docs](https://docs.rs/dhat/latest/dhat/) — heap profiling
- [cargo-flamegraph](https://github.com/flamegraph-rs/flamegraph) — flamegraph tool
- [perf](https://perf.wiki.kernel.org/) — Linux profiling
- [samply](https://github.com/mstange/samply) — cross-platform profiler
- [Valgrind](https://valgrind.org/) — cachegrind, callgrind, massif
- [Rust Performance Book](https://nnethercote.github.io/perf-book/) — Rust optimization guide
- [Hyperfine](https://github.com/sharkdp/hyperfine) — CLI benchmarking

## Key Terms

1. **Microbenchmark**: Measuring the performance of a small code unit.
2. **Throughput**: Work completed per unit time.
3. **Latency**: Time to complete a single operation.
4. **Statistical Significance**: Confidence that the result difference is not noise.
5. **Confidence Interval**: A range that likely contains the true value.
6. **Outlier**: A data point significantly different from others.
7. **Warm-up**: Running code before measurement to stabilize CPU cache and JIT.
8. **Black Box**: A function that prevents compiler optimization of inputs/results.
9. **Flamegraph**: A visualization of stack traces showing time spent.
10. **Allocation Profile**: Tracking heap allocations over time.
11. **Cache Miss**: When data is not in CPU cache, causing a stall.
12. **Branch Prediction**: CPU predicting which branch will be taken.
13. **Instruction Count**: Number of CPU instructions executed.
14. **Dead Code Elimination**: Compiler removing unused code (must be prevented).
15. **Regression**: A performance decrease after a change.

## Architecture Notes

Criterion.rs handles warm-up, measurement, and statistical analysis automatically. It uses linear regression to measure throughput and latency. Benchmarks are compiled as separate binaries. The `black_box` function is a compiler fence that prevents optimizations on its argument. dhat uses a global allocator override to track allocations. Flamegraphs are SVG files showing stack trace samples as horizontal bars.

## Key APIs

- `criterion::Criterion::bench_function(id, |b| b.iter(|| ...))` — basic benchmark
- `criterion::BenchmarkGroup` — parameterized benchmarks
- `criterion::black_box(val)` — prevent dead-code elimination
- `criterion::BenchmarkId::new(name, param)` — parameterized naming
- `criterion::criterion_group!`, `criterion_main!` — entry points
- `dhat::Heap` — heap profiling
- `dhat::DhatAlloc` — global allocator for dhat
- `#[global_allocator]` with dhat

## Conventions

- Benchmarks in `benches/` directory
- One file per benchmark group
- File naming: `my_benchmark.rs`
- Criterion configuration in `criterion_main!` or `Criterion::default().configure_from_args()`
- Baseline results stored in `target/criterion/`

## Project Structure

```
benchmarked_project/
├── Cargo.toml           # [dev-dependencies] criterion, dhat
├── benches/
│   ├── my_benchmark.rs  # criterion benchmark
│   ├── sort_bench.rs    # comparison benchmarks
│   └── allocation.rs    # dhat allocation profiling
├── src/
│   └── lib.rs
├── profiler/            # profiling scripts
│   ├── flamegraph.sh
│   └── perf_record.sh
└── target/
    └── criterion/       # results and reports
```
