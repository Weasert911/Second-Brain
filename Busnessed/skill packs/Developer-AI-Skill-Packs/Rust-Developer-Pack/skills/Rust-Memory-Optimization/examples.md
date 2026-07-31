# Examples — Rust-Memory-Optimization

## Beginner: Measuring Type Sizes

```rust
use std::mem::{size_of, align_of};

struct Unoptimized {
    c: u8,      // 1 byte + 7 padding
    a: u64,     // 8 bytes
    b: u32,     // 4 bytes + 4 padding
    // Total: 24 bytes
}

#[repr(C)]
struct Optimized {
    a: u64,     // 8 bytes
    b: u32,     // 4 bytes
    c: u8,      // 1 byte + 3 padding
    // Total: 16 bytes
}

fn main() {
    println!("Unoptimized: {}", size_of::<Unoptimized>());
    println!("Optimized: {}", size_of::<Optimized>());
    println!("Alignment: {}", align_of::<Optimized>());
}
```

**Explanation**: Field reordering from largest to smallest alignment reduces padding. The optimized struct is 16 bytes vs 24 for the unoptimized version.

## Intermediate: SmallVec vs Vec

```rust
use smallvec::SmallVec;

fn process_data() {
    // Vec allocates on the heap even for small sizes
    let mut vec: Vec<u32> = Vec::new();
    vec.push(1);
    vec.push(2);
    vec.push(3);

    // SmallVec stores up to 4 elements inline, no heap allocation
    let mut small: SmallVec<[u32; 4]> = SmallVec::new();
    small.push(1);
    small.push(2);
    small.push(3);

    println!("Vec size: {}", std::mem::size_of::<Vec<u32>>());        // 24 bytes
    println!("SmallVec size: {}", std::mem::size_of::<SmallVec<[u32; 4]>>()); // 40 bytes (24 + 16 inline)
    // SmallVec is larger but avoids heap allocation for small sizes
}
```

**Explanation**: SmallVec stores elements inline up to the specified capacity (4 here) before spilling to heap. This eliminates allocation for small collections at the cost of increased stack size.

## Advanced: Arena Allocation and SoA Conversion

```rust
use bumpalo::Bump;

// AoS (Array of Structs) — poor cache behavior
#[derive(Debug)]
struct ParticleAoS {
    x: f32, y: f32, z: f32,
    vx: f32, vy: f32, vz: f32,
    mass: f32,
    // Padding: 4 bytes
    // Total: 32 bytes per particle
}

// SoA (Struct of Arrays) — cache-friendly for per-field iteration
struct ParticlesSoA {
    x: Vec<f32>,
    y: Vec<f32>,
    z: Vec<f32>,
    vx: Vec<f32>,
    vy: Vec<f32>,
    vz: Vec<f32>,
    mass: Vec<f32>,
}

impl ParticlesSoA {
    fn update_positions(&mut self, dt: f32) {
        // Only accesses x, y, z, vx, vy, vz — cache efficient
        for i in 0..self.x.len() {
            self.x[i] += self.vx[i] * dt;
            self.y[i] += self.vy[i] * dt;
            self.z[i] += self.vz[i] * dt;
        }
    }
}

fn arena_allocation_example() {
    let arena = Bump::new();

    // Allocate many objects in the arena
    let objects: Vec<&mut Object> = (0..1000)
        .map(|_| arena.alloc(Object::new()))
        .collect();

    // All objects live until arena is dropped — no per-object deallocation
    // Arena reset is O(1)
    drop(arena);
}

struct Object { data: [u8; 64] }

impl Object {
    fn new() -> Self { Object { data: [0u8; 64] } }
}

fn main() {
    arena_allocation_example();
    println!("SoA is cache-friendly for field-wise iteration");
}
```

**Explanation**: SoA layout improves cache performance when iterating over specific fields. Arena allocation (bumpalo) provides O(1) allocation and O(1) deallocation (all at once) for short-lived objects.
