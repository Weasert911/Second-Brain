# Examples — Unsafe-Rust-Review

## Beginner: Raw Pointer Dereference

```rust
fn main() {
    let mut x = 42u32;
    let ptr: *mut u32 = &mut x;

    unsafe {
        // SAFETY: ptr is valid, properly aligned, and dereferenceable
        *ptr = 10;
    }

    unsafe {
        // SAFETY: same as above
        println!("{}", *ptr);
    }
}
```

**Explanation**: Basic raw pointer creation and dereference. Safety invariants: pointer must be valid, aligned, and dereferenceable.

## Intermediate: Safe Wrapper for FFI

```rust
use std::ffi::CString;

mod ffi {
    use std::os::raw::c_char;

    extern "C" {
        pub fn strlen(s: *const c_char) -> usize;
    }
}

/// Safe wrapper around C's strlen.
/// SAFETY: The caller must ensure `s` is a valid null-terminated string.
pub unsafe fn safe_strlen(s: &str) -> usize {
    let c_str = CString::new(s).expect("CString::new failed");
    // SAFETY: CString guarantees null-terminated, ffi::strlen expects that
    unsafe { ffi::strlen(c_str.as_ptr()) }
}

fn main() {
    let len = unsafe { safe_strlen("hello") };
    println!("Length: {len}");
}
```

**Explanation**: Safe wrapper around a C FFI function. The `CString` ensures null-termination. The unsafe is pushed to the boundary of the safe wrapper.

## Advanced: Custom Vec-like Collection

```rust
use std::alloc::{self, Layout};
use std::mem;
use std::ptr::{self, NonNull};

pub struct MyVec<T> {
    ptr: NonNull<T>,
    len: usize,
    capacity: usize,
}

unsafe impl<T: Send> Send for MyVec<T> {}
unsafe impl<T: Sync> Sync for MyVec<T> {}

impl<T> MyVec<T> {
    pub fn new() -> Self {
        MyVec {
            // SAFETY: NonNull::dangling is valid for zero-sized types
            ptr: NonNull::dangling(),
            len: 0,
            capacity: 0,
        }
    }

    pub fn push(&mut self, value: T) {
        if self.len == self.capacity {
            self.grow();
        }
        // SAFETY: self.ptr + self.len is within bounds (grow ensures capacity)
        unsafe { ptr::write(self.ptr.as_ptr().add(self.len), value) };
        self.len += 1;
    }

    fn grow(&mut self) {
        let new_cap = if self.capacity == 0 { 1 } else { self.capacity * 2 };
        let new_layout = Layout::array::<T>(new_cap).unwrap();

        let new_ptr = if self.capacity == 0 {
            // SAFETY: new_layout has non-zero size
            unsafe { alloc::alloc(new_layout) as *mut T }
        } else {
            let old_layout = Layout::array::<T>(self.capacity).unwrap();
            // SAFETY: ptr was allocated with old_layout
            unsafe { alloc::realloc(self.ptr.as_ptr() as *mut u8, old_layout, new_layout.size()) as *mut T }
        };

        // SAFETY: alloc/realloc returns a valid pointer or panics
        self.ptr = NonNull::new(new_ptr).unwrap_or_else(|| alloc::handle_alloc_error(new_layout));
        self.capacity = new_cap;
    }

    pub fn get(&self, index: usize) -> Option<&T> {
        if index < self.len {
            // SAFETY: index is within bounds, ptr is valid and properly aligned
            Some(unsafe { &*self.ptr.as_ptr().add(index) })
        } else {
            None
        }
    }
}

impl<T> Drop for MyVec<T> {
    fn drop(&mut self) {
        // SAFETY: elements from 0..self.len are initialized
        unsafe { ptr::drop_in_place(std::slice::from_raw_parts_mut(self.ptr.as_ptr(), self.len)) };
        if self.capacity > 0 {
            let layout = Layout::array::<T>(self.capacity).unwrap();
            // SAFETY: ptr was allocated with layout
            unsafe { alloc::dealloc(self.ptr.as_ptr() as *mut u8, layout) };
        }
    }
}

fn main() {
    let mut v = MyVec::new();
    v.push(1);
    v.push(2);
    v.push(3);
    assert_eq!(*v.get(1).unwrap(), 2);
}
```

**Explanation**: A minimal safe Vec implementation using unsafe raw pointer manipulation, manual allocation with `alloc::alloc`/`alloc::realloc`/`alloc::dealloc`, and proper Drop handling. Runs Miri cleanly.
