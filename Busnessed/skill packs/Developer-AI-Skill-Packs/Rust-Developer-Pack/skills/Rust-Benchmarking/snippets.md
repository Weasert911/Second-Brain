# Snippets — Rust-Benchmarking

## 1. Basic Criterion Benchmark

```rust
c.bench_function("my_function", |b| {
    b.iter(|| my_function(black_box(input)))
});
```

**Usage**: The `b.iter()` closure is measured. `black_box` prevents optimization of the input.

## 2. Parameterized Benchmark Group

```rust
let mut group = c.benchmark_group("sort");
for size in [100, 1000] {
    group.bench_with_input(BenchmarkId::new("std", size), &data, |b, d| {
        b.iter(|| std_sort(black_box(d.clone())));
    });
}
group.finish();
```

**Usage**: Test multiple input sizes in a group. Criterion generates comparison charts.

## 3. Comparison with Significance Test

```rust
group.bench_function("impl_a", |b| b.iter(|| impl_a(black_box(&data))));
group.bench_function("impl_b", |b| b.iter(|| impl_b(black_box(&data))));
```

**Usage**: Put both implementations in the same group. Criterion shows relative speed with confidence intervals.

## 4. Using black_box

```rust
use criterion::black_box;

let result = black_box(my_function(black_box(input)));
// Prevents compiler from optimizing away input preparation or result usage
```

**Usage**: Wrap both inputs and results to prevent dead-code elimination.

## 5. Batch Size Control

```rust
b.iter_batched(
    || expensive_setup(),
    |data| process(black_box(data)),
    BatchSize::SmallInput,
);
```

**Usage**: `iter_batched` separates setup from measurement. Choose `BatchSize` based on setup cost.

## 6. Throughput Measurement

```rust
group.throughput(Throughput::Bytes(data.len() as u64));
group.bench_function("process", |b| b.iter(|| process(black_box(&data))));
```

**Usage**: Report throughput (bytes/second, elements/second) alongside timing.

## 7. Custom Configuration

```rust
let mut c = Criterion::default()
    .sample_size(100)
    .measurement_time(Duration::from_secs(10))
    .warm_up_time(Duration::from_secs(3));
```

**Usage**: Increase sample size or measurement time for noisy benchmarks.

## 8. dhat Heap Profiling Setup

```rust
#[global_allocator]
static ALLOC: dhat::DhatAlloc = dhat::DhatAlloc;

fn main() {
    let _dhat = dhat::Dhat::start_heap_profiling();
    // code to profile
}
```

**Usage**: Replace global allocator with dhat. Run once, then analyze the generated JSON file.

## 9. Flamegraph Generation

```bash
cargo flamegraph --bin my_binary -- --my-args
# Creates flamegraph.svg in current directory
```

**Usage**: Run your binary under flamegraph recording. Open SVG in browser to explore hot functions.

## 10. Perf Profiling

```bash
perf record --call-graph dwarf target/release/my_binary
perf report --hierarchy
```

**Usage**: perf records stack samples. Use `--call-graph dwarf` for Rust symbol resolution.

## 11. Hyperfine for CLI Benchmarks

```bash
hyperfine --warmup 5 'my_tool --input file.txt' 'my_tool_v2 --input file.txt'
```

**Usage**: Benchmark CLI tools with warm-up and statistical analysis.

## 12. Baseline Comparison in CI

```bash
# Save baseline
cargo bench -- --save-baseline main

# Compare against baseline after changes
cargo bench -- --baseline main
```

**Usage**: Save a baseline on main branch, compare feature branches against it.

## 13. Preventing Allocations in Hot Paths

```rust
fn process_batch(data: &[u8]) {
    let mut buffer = Vec::with_capacity(data.len()); // pre-allocate
    for chunk in data.chunks(64) {
        buffer.clear();
        buffer.extend_from_slice(chunk);
        // process buffer
    }
}
```

**Usage**: Pre-allocate and reuse buffers to avoid repeated allocations in hot loops.

## 14. Compiler Optimization Flags

```toml
[profile.release]
lto = "fat"
codegen-units = 1
target-cpu = "native"
```

**Usage**: Enable LTO, reduce codegen units, and target native CPU for maximum performance.
