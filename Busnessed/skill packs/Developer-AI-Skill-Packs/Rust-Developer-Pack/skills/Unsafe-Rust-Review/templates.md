# Templates — Unsafe-Rust-Review

## Template 1: Unsafe Block with SAFETY Comment

```rust
// SAFETY: {{precondition1}}, {{precondition2}}, {{precondition3}}
unsafe {
    {{unsafe_operation}}
}
```

## Template 2: Safe Wrapper around FFI

```rust
mod ffi {
    extern "C" {
        pub fn {{ffi_function}}({{params}}) -> {{return_type}};
    }
}

/// {{documentation}}
///
/// # Safety
///
/// {{safety_preconditions}}
pub unsafe fn {{safe_wrapper}}({{safe_params}}) -> {{safe_return}} {
    // SAFETY: {{preconditions_met}}
    unsafe { ffi::{{ffi_function}}({{ffi_args}}) }
}
```

## Template 3: Custom Allocator

```rust
use std::alloc::{GlobalAlloc, Layout};

pub struct {{AllocatorName}};

unsafe impl GlobalAlloc for {{AllocatorName}} {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        // SAFETY: layout must have non-zero size
        unsafe { std::alloc::alloc(layout) }
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        // SAFETY: ptr must have been allocated with this layout
        unsafe { std::alloc::dealloc(ptr, layout) }
    }
}

#[global_allocator]
static ALLOC: {{AllocatorName}} = {{AllocatorName}};
```

## Template 4: PhantomData for Ownership

```rust
use std::marker::PhantomData;

pub struct {{OwningType}}<T> {
    ptr: *mut T,
    _ownership: PhantomData<T>,
    _send_sync: PhantomData<{{SendSyncMarker}}>,
}

impl<T> {{OwningType}}<T> {
    pub fn new(value: T) -> Self {
        {{OwningType}} {
            ptr: Box::into_raw(Box::new(value)),
            _ownership: PhantomData,
            _send_sync: PhantomData,
        }
    }
}

impl<T> Drop for {{OwningType}}<T> {
    fn drop(&mut self) {
        // SAFETY: ptr was created by Box::into_raw, so it owns a T
        unsafe { drop(Box::from_raw(self.ptr)) }
    }
}
```

## Template 5: Slice from Raw Parts

```rust
use std::slice;

pub unsafe fn {{create_slice}}<'a, T>(ptr: *const T, len: usize) -> &'a [T] {
    // SAFETY: {{preconditions}}
    // - ptr must be valid and aligned for len elements
    // - ptr must be non-null
    // - The memory must not be mutated during the lifetime 'a
    unsafe { slice::from_raw_parts(ptr, len) }
}
```

## Template 6: MaybeUninit Pattern

```rust
use std::mem::MaybeUninit;

pub fn {{initialize_later}}() -> {{OutputType}} {
    let mut uninit: MaybeUninit<{{OutputType}}> = MaybeUninit::uninit();

    // Initialize the value
    unsafe {
        uninit.as_mut_ptr().write({{initial_value}});
    }

    // SAFETY: The value is now fully initialized
    unsafe { uninit.assume_init() }
}
```

## Template 7: Unsafe Trait Implementation

```rust
/// # Safety
///
/// Implementors must guarantee:
/// - {{guarantee1}}
/// - {{guarantee2}}
pub unsafe trait {{UnsafeTrait}} {
    fn {{method}}(&self) -> {{return_type}};
}

unsafe impl {{UnsafeTrait}} for {{ConcreteType}} {
    fn {{method}}(&self) -> {{return_type}} {
        {{implementation}}
    }
}
```

## Template 8: FFI with Callback

```rust
extern "C" {
    fn {{register_callback}}(cb: extern "C" fn({{arg_type}}) -> {{return_type}});
}

unsafe extern "C" fn {{callback_wrapper}}(arg: {{arg_type}}) -> {{return_type}} {
    // SAFETY: {{callback_safety}}
    {{callback_body}}
}

pub fn {{safe_register}}() {
    // SAFETY: {{justification}}
    unsafe { {{register_callback}}({{callback_wrapper}}) };
}
```
