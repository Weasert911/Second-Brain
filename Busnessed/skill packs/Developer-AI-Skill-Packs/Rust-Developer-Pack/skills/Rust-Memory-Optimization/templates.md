# Templates — Rust-Memory-Optimization

## Template 1: Optimized Struct Layout

```rust
// Order fields from largest alignment to smallest
#[repr(C)] // optional: if you need deterministic layout
struct {{StructName}} {
    large_field: {{TypeAlign8}},  // 8-byte aligned
    medium_field: {{TypeAlign4}},  // 4-byte aligned
    small_field: {{TypeAlign2}},  // 2-byte aligned
    tiny_field: {{TypeAlign1}},   // 1-byte aligned
    // After reordering, padding is minimized
}
```

## Template 2: SmallVec for Bounded Collections

```rust
use smallvec::SmallVec;

fn {{function}}() -> SmallVec<[{{ElementType}}; {{N}}]> {
    let mut vec = SmallVec::new();
    for i in 0..{{expected_max}} {
        vec.push({{value}});
    }
    vec
}
```

## Template 3: Arena Allocation

```rust
use {{arena_crate}}::{{arena_type}};

pub struct {{Processor}} {
    arena: {{arena_type}},
}

impl {{Processor}} {
    pub fn new() -> Self {
        Self { arena: {{arena_type}}::new() }
    }

    pub fn process(&mut self, data: &[{{InputType}}]) {
        for item in data {
            let obj = self.arena.alloc({{ObjectType}}::new(item));
            {{process_logic}}
        }
        self.arena.reset(); // O(1) deallocation
    }
}
```

## Template 4: HashMap with FxHasher

```rust
use hashbrown::HashMap;
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;

// Using fxhash for faster hashing (not DoS-resistant)
use rustc_hash::FxHashMap;

pub type {{MapName}} = FxHashMap<{{KeyType}}, {{ValueType}}>;

pub fn {{function}}() -> {{MapName}} {
    let mut map = {{MapName}}::default();
    map.insert({{key}}, {{value}});
    map
}
```

## Template 5: Box<str> for Immutable Strings

```rust
pub fn {{create_static_string}}(input: &str) -> Box<str> {
    input.to_string().into_boxed_str()
    // Box<str> is 16 bytes (2 words), String is 24 bytes (3 words)
}

pub fn {{collect_strings}}(items: &[&str]) -> Vec<Box<str>> {
    items.iter().map(|&s| s.to_string().into_boxed_str()).collect()
}
```

## Template 6: SoA Conversion

```rust
// Before (AoS):
// struct Entity { x: f32, y: f32, health: u32, active: bool }

// After (SoA):
pub struct {{EntityCollection}} {
    pub x: Vec<f32>,
    pub y: Vec<f32>,
    pub health: Vec<u32>,
    pub active: Vec<bool>,
}

impl {{EntityCollection}} {
    pub fn new(capacity: usize) -> Self {
        Self {
            x: Vec::with_capacity(capacity),
            y: Vec::with_capacity(capacity),
            health: Vec::with_capacity(capacity),
            active: Vec::with_capacity(capacity),
        }
    }

    pub fn update_positions(&mut self) {
        for i in 0..self.x.len() {
            self.x[i] += 1.0; // only touch x and y, not health/active
        }
    }
}
```

## Template 7: Pre-Allocation with Capacity

```rust
pub fn {{process_batch}}(source: impl Iterator<Item = {{ItemType}}>) -> Vec<{{ItemType}}> {
    let (lower, upper) = source.size_hint();
    let capacity = upper.unwrap_or(lower);

    let mut results = Vec::with_capacity(capacity);
    for item in source {
        results.push({{transform}}(item));
    }
    results
}
```

## Template 8: Memory-Mapped File Reading

```rust
use memmap2::Mmap;

pub fn {{read_large_file}}(path: &str) -> Result<&[u8], std::io::Error> {
    let file = std::fs::File::open(path)?;
    let mmap = unsafe { Mmap::map(&file)? };
    Ok(&mmap[..]) // mmap must outlive the reference
}

pub fn {{process_large_file}}(path: &str) -> Result<u64, std::io::Error> {
    let mmap = unsafe { Mmap::map(&std::fs::File::open(path)?)? };
    Ok(mmap.iter().map(|&b| b as u64).sum())
}
```
