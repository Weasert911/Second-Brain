# Examples — Rust-Benchmarking

## Beginner: Basic Criterion Benchmark

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn bench_fibonacci(c: &mut Criterion) {
    c.bench_function("fibonacci 20", |b| b.iter(|| fibonacci(black_box(20))));
}

criterion_group!(benches, bench_fibonacci);
criterion_main!(benches);
```

**Explanation**: Basic benchmark with `black_box` to prevent dead-code elimination. `bench_function` runs the closure multiple times and measures the time.

## Intermediate: Parameterized Comparison

```rust
use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion, BenchmarkGroup};

fn sort_std(mut data: Vec<i32>) -> Vec<i32> { data.sort(); data }
fn sort_custom(mut data: Vec<i32>) -> Vec<i32> { data.sort_by(|a, b| a.cmp(b)); data }

fn bench_sorts(c: &mut Criterion) {
    let mut group: BenchmarkGroup<_> = c.benchmark_group("sort");

    for size in [100, 1000, 10000] {
        let input: Vec<i32> = (0..size).map(|_| rand::random()).collect();

        group.bench_with_input(BenchmarkId::new("std", size), &input, |b, data| {
            b.iter(|| sort_std(black_box(data.clone())));
        });

        group.bench_with_input(BenchmarkId::new("custom", size), &input, |b, data| {
            b.iter(|| sort_custom(black_box(data.clone())));
        });
    }

    group.finish();
}

criterion_group!(benches, bench_sorts);
criterion_main!(benches);
```

**Explanation**: Comparison benchmarks with multiple input sizes. Criterion automatically generates comparison charts with confidence intervals.

## Advanced: Allocation Profiling with dhat

```rust
// In main.rs or a dedicated binary:
use dhat::{Dhat, DhatAlloc};

#[global_allocator]
static ALLOC: DhatAlloc = DhatAlloc;

fn main() {
    let _dhat = Dhat::start_heap_profiling();

    let mut v = Vec::new();
    for i in 0..10_000 {
        v.push(format!("item_{i}"));
    }
    println!("Allocated {} items", v.len());

    let stats = dhat::HeapStats::get();
    println!("Total bytes: {}", stats.total_bytes);
    println!("Total allocations: {}", stats.total_blocks);
    println!("Max bytes at once: {}", stats.max_bytes);
}

// Run with: cargo run --features dhat
// Then use dhat/dhat-heap.json with dhat viewer
```

**Explanation**: dhat replaces the global allocator to track all heap allocations. Start heap profiling, run the code, then analyze the JSON output with the dhat viewer.
