# Snippets — Rust-Memory-Optimization

## 1. Check Type Size

```rust
println!("size: {}", std::mem::size_of::<MyType>());
println!("align: {}", std::mem::align_of::<MyType>());
```

**Usage**: Print the size and alignment of any type. Use during development to understand layout.

## 2. Field Ordering for Minimal Padding

```rust
// Before (24 bytes): c: u8, a: u64, b: u32
// After (16 bytes):  a: u64, b: u32, c: u8
```

**Usage**: Reorder struct fields from largest to smallest alignment to minimize padding.

## 3. Box Large Enum Variants

```rust
enum Message {
    Small,
    Large(Box<BigData>),
}
```

**Usage**: Box large variants to reduce overall enum size. Downside: heap allocation for that variant.

## 4. Niche Optimization with NonZero

```rust
use std::num::NonZeroUsize;

// Option<NonZeroUsize> is 8 bytes (not 16)
// Option<usize> is 16 bytes (usize + discriminant)
```

**Usage**: Use NonZero types to enable niche optimization. Option<NonZeroUsize> uses 0 as the None discriminant.

## 5. SmallVec for Small Collections

```rust
use smallvec::SmallVec;

// Up to 4 elements inline, no heap allocation
let mut v: SmallVec<[u32; 4]> = SmallVec::new();
v.push(1);
v.push(2);
```

**Usage**: Stack-allocate small collections. Only spills to heap when exceeding inline capacity.

## 6. Box<str> vs String

```rust
// String: 24 bytes (ptr, len, cap)
// Box<str>: 16 bytes (ptr, len)

let boxed: Box<str> = "hello".to_string().into_boxed_str();
```

**Usage**: Use Box<str> for immutable strings. Saves 8 bytes versus String (no capacity field).

## 7. HashMap with FxHasher

```rust
use rustc_hash::FxHashMap;

let mut map: FxHashMap<String, i32> = FxHashMap::default();
map.insert("key".into(), 42);
```

**Usage**: FxHash is faster than the default SipHash for non-DoS-sensitive maps. Use hashbrown for Swiss-table performance.

## 8. Arena Allocation

```rust
use bumpalo::Bump;

let arena = Bump::new();
let x = arena.alloc(42);
let y = arena.alloc(String::from("hello"));
// All deallocated when arena is dropped or reset
```

**Usage**: Fast O(1) allocation for many short-lived objects. Reset is O(1) as well.

## 9. Pre-Allocation with Capacity

```rust
let mut vec = Vec::with_capacity(1000);
for i in 0..1000 {
    vec.push(i); // No reallocation
}
```

**Usage**: Pre-allocate when the approximate size is known. Avoids repeated reallocation and copying.

## 10. SoA Layout for Cache Efficiency

```rust
// AoS: Vec<Entity> — each Entity has x, y, health, active
// Iterating over x only loads all fields into cache (wasteful)

// SoA: struct { x: Vec<f32>, y: Vec<f32>, ... }
// Iterating over x loads only x data into cache
```

**Usage**: Separate fields into individual arrays for better cache locality when iterating over specific fields.

## 11. Memory-Mapped File

```rust
use memmap2::Mmap;

let file = std::fs::File::open("large.bin").unwrap();
let mmap = unsafe { Mmap::map(&file).unwrap() };
let bytes: &[u8] = &mmap;
```

**Usage**: Map files into memory for zero-copy access. Avoids read() syscall and buffering overhead.

## 12. Offset-of Macro

```rust
let offset = std::mem::offset_of!(MyStruct, my_field);
println!("field at offset {offset}");
```

**Usage**: Get the byte offset of a struct field. Useful for understanding layout and for manual serialization.

## 13. Reusing Allocations

```rust
let mut buffer = String::new();
for chunk in data.chunks(1024) {
    buffer.clear();
    buffer.push_str(chunk);
    process(&buffer);
}
```

**Usage**: Reuse a buffer by clearing instead of creating new allocations each iteration.

## 14. Inline Array with ArrayVec

```rust
use arrayvec::ArrayVec;

let mut arr: ArrayVec<u32, 8> = ArrayVec::new();
arr.push(1);
arr.push(2);
// No heap allocation, fixed stack storage of 8 elements
```

**Usage**: Fixed-capacity stack-based array. Panics on overflow instead of reallocating.

## 15. repr(align) for Cache Line Padding

```rust
#[repr(align(64))]
struct CacheLineAligned {
    data: [u8; 64],
}
```

**Usage**: Align data to cache line boundaries to prevent false sharing between threads.
