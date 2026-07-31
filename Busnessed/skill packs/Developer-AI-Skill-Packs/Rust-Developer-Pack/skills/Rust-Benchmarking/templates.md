# Templates — Rust-Benchmarking

## Template 1: Basic Benchmark

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn {{bench_name}}(c: &mut Criterion) {
    c.bench_function("{{name}}", |b| {
        b.iter(|| {{function}}(black_box({{input}})))
    });
}

criterion_group!(benches, {{bench_name}});
criterion_main!(benches);
```

## Template 2: Parameterized Benchmark

```rust
use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion};

fn {{bench_name}}(c: &mut Criterion) {
    let mut group = c.benchmark_group("{{group_name}}");

    for size in [{{sizes}}] {
        let input = {{setup}}(size);

        group.bench_with_input(BenchmarkId::new("{{label}}", size), &input, |b, data| {
            b.iter(|| {{function}}(black_box(data.clone())));
        });
    }

    group.finish();
}
```

## Template 3: Comparison Benchmark

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn {{bench_name}}(c: &mut Criterion) {
    let mut group = c.benchmark_group("{{group_name}}");

    let input = {{setup_input}}();

    group.bench_function("{{impl1_name}}", |b| {
        b.iter(|| {{impl1}}(black_box(input.clone())))
    });

    group.bench_function("{{impl2_name}}", |b| {
        b.iter(|| {{impl2}}(black_box(input.clone())))
    });

    group.finish();
}
```

## Template 4: Allocation Profiling with dhat

```rust
// In src/bin/profile.rs or src/main.rs with feature flag
#[cfg(feature = "dhat-heap")]
#[global_allocator]
static ALLOC: dhat::DhatAlloc = dhat::DhatAlloc;

fn main() {
    #[cfg(feature = "dhat-heap")]
    let _dhat = dhat::Dhat::start_heap_profiling();

    {{profiled_code}}

    #[cfg(feature = "dhat-heap")]
    {
        let stats = dhat::HeapStats::get();
        eprintln!("Total bytes:  {}", stats.total_bytes);
        eprintln!("Total blocks: {}", stats.total_blocks);
        eprintln!("Max bytes:    {}", stats.max_bytes);
    }
}
```

## Template 5: Flamegraph Invocation

```bash
# Generate flamegraph from benchmark
cargo flamegraph --bench {{bench_name}} -- --bench

# Or with perf directly:
perf record --call-graph dwarf target/release/{{binary}}
perf script | inferno-fold | inferno-flamegraph > flamegraph.svg
```

## Template 6: Baseline Comparison

```rust
use criterion::{criterion_group, criterion_main, Criterion};

fn bench_function(c: &mut Criterion) {
    c.bench_function("{{name}}", |b| b.iter(|| {{function}}(black_box({{input}}))));
}

// Save baseline:
// cargo bench -- --save-baseline {{baseline_name}}

// Compare:
// cargo bench -- --baseline {{baseline_name}}
```

## Template 7: Custom Benchmark Setup

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion, BatchSize};

fn {{bench_name}}(c: &mut Criterion) {
    c.bench_function("{{name}}", |b| {
        b.iter_batched(
            || {{setup_for_each_iteration}}(),
            |data| {{function}}(black_box(data)),
            BatchSize::SmallInput,
        )
    });
}
```

## Template 8: Throughput Measurement

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion, Throughput};

fn {{bench_name}}(c: &mut Criterion) {
    let data = vec![0u8; {{byte_size}}];
    let mut group = c.benchmark_group("{{group}}");
    group.throughput(Throughput::Bytes({{byte_size}} as u64));

    group.bench_function("{{name}}", |b| {
        b.iter(|| {{process}}(black_box(&data)))
    });

    group.finish();
}
```
