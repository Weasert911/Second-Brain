# Snippets — Unsafe-Rust-Review

## 1. SAFETY Comment Pattern

```rust
// SAFETY: `ptr` is non-null, properly aligned, and dereferenceable for `T`
unsafe { *ptr = value; }
```

**Usage**: Every unsafe block must have a preceding // SAFETY: comment explaining why it's safe.

## 2. Creating a Slice from Raw Pointer

```rust
let slice: &[u8] = unsafe { slice::from_raw_parts(ptr, len) };
```

**Usage**: Create a slice from a pointer and length. Safety: ptr must be valid for len elements.

## 3. NonNull for Non-Zero Pointers

```rust
use std::ptr::NonNull;

let ptr = NonNull::new(raw_ptr).expect("ptr must not be null");
```

**Usage**: Use NonNull to encode non-null guarantee in the type system. Never raw *mut T for non-nullable pointers.

## 4. PhantomData for Ownership

```rust
struct MyBox<T> {
    ptr: *mut T,
    _marker: PhantomData<T>,
}
```

**Usage**: PhantomData<T> tells the compiler that MyBox owns a T, affecting drop check and variance.

## 5. MaybeUninit for Uninitialized Memory

```rust
let mut value = MaybeUninit::<String>::uninit();
unsafe { value.as_mut_ptr().write("hello".to_string()); }
let initialized = unsafe { value.assume_init() };
```

**Usage**: Use MaybeUninit (not mem::uninitialized) for uninitialized memory. Call assume_init only when fully initialized.

## 6. Transmute (Use with Extreme Care)

```rust
let bits: u32 = unsafe { transmute::<f32, u32>(3.14) };
```

**Usage**: Reinterpret bytes as another type. Both types must have the same size. Prefer safer alternatives when available.

## 7. FFI String Conversion

```rust
let c_str = CString::new(rust_str).unwrap();
let ptr = c_str.as_ptr();
// Pass ptr to C function
```

**Usage**: CString creates a null-terminated C string. The pointer is valid until CString is dropped.

## 8. Null Pointer Check for FFI

```rust
let result = unsafe { ffi::some_function() };
if result.is_null() {
    return Err("function returned null");
}
```

**Usage**: Always check FFI return values for null. Convert to NonNull or error.

## 9. Pointer Offset Calculation

```rust
unsafe { ptr.add(index).read() }
// vs
unsafe { ptr.offset(index as isize).read() }
```

**Usage**: `add` takes usize (forward only) and is preferred. `offset` takes isize (forward/backward). Both must stay within allocation bounds.

## 10. Drop in Place

```rust
unsafe { ptr::drop_in_place(ptr.as_ptr()) }
```

**Usage**: Call the destructor of a value at the given pointer without deallocating the memory.

## 11. Manual Allocation and Deallocation

```rust
let layout = Layout::new::<u64>();
let ptr = unsafe { alloc::alloc(layout) as *mut u64 };
unsafe { ptr::write(ptr, 42); }
// ... use ptr ...
unsafe { ptr::drop_in_place(ptr); alloc::dealloc(ptr as *mut u8, layout); }
```

**Usage**: Manual memory management. Every alloc must be paired with a dealloc of the same layout.

## 12. Strict Provenance Cast

```rust
let addr: usize = ptr.addr();
let new_ptr = ptr::from_exposed_addr::<T>(addr); // exposed provenance
// Prefer: ptr::from_raw_parts(ptr::null(), addr) with proper provenance
```

**Usage**: Strict provenance limits int-to-ptr casts. Use `with_addr` or `map_addr` instead.

## 13. Send + Sync for Unsafe Types

```rust
unsafe impl Send for MyType {}
unsafe impl Sync for MyType {}
```

**Usage**: Implementing Send/Sync manually for types containing raw pointers. Must be justified in SAFETY comment.

## 14. repr(C) for FFI

```rust
#[repr(C)]
struct FFIStruct { x: i32, y: f64 }
```

**Usage**: Guarantee C-compatible layout without Rust's reordering. Required for all types passed across FFI.

## 15. Running Miri

```bash
cargo +nightly miri test
cargo +nightly miri run --example test_ffi
```

**Usage**: Miri interprets the MIR and detects UB. Run on all code containing unsafe blocks.
