# Checklists — Unsafe-Rust-Review

## Pre-Flight Checklist

- [ ] Miri installed (rustup +nightly component add miri)
- [ ] Unsafe code identified and separated from safe code
- [ ] Safety invariants documented
- [ ] Test cases cover all unsafe operations
- [ ] Stacked Borrows model understood
- [ ] Strict provenance rules understood
- [ ] Sanitizers available for additional checking
- [ ] Reviewer has unsafe Rust experience

## Implementation Checklist

- [ ] Every unsafe block has a // SAFETY: comment
- [ ] Unsafe functions document # Safety in doc comments
- [ ] Unsafe traits document what implementors must guarantee
- [ ] unsafe blocks are as small as possible
- [ ] Pointer provenance is preserved (no int-to-ptr casts without valid provenance)
- [ ] Alignment requirements are checked
- [ ] NonNull used when pointer must be non-null
- [ ] PhantomData correctly models ownership and variance
- [ ] MaybeUninit used for uninitialized memory (not mem::uninitialized)
- [ ] repr(C) on all FFI-shared types
- [ ] extern "C" uses correct calling convention
- [ ] Drop implementations properly clean up resources

## Testing Checklist

- [ ] Miri passes on all test cases (cargo +nightly miri test)
- [ ] Address sanitizer passes
- [ ] Thread sanitizer passes for concurrent code
- [ ] Leak sanitizer passes
- [ ] Test cases cover: valid inputs, edge cases, invalid inputs (documented panics)
- [ ] Stress tests for allocation/deallocation patterns
- [ ] Concurrency tests for Send + Sync types
- [ ] Zero-sized types handled correctly
- [ ] Large allocations handled
- [ ] FFI tests with mock C libraries

## Release Checklist

- [ ] All Miri warnings resolved
- [ ] All sanitizer warnings resolved
- [ ] Soundness proof documented
- [ ] Safety preconditions documented in public API
- [ ] # Safety sections complete for all unsafe functions/traits
- [ ] Safety invariants tested with Miri
- [ ] Known limitations documented
- [ ] FFI compatibility verified (platform-specific)
- [ ] no_std compatibility tested (if applicable)
- [ ] Regression tests for previously fixed UB

## Maintenance Checklist

- [ ] Miri run after each change to unsafe code
- [ ] Toolchain updates checked for Miri compatibility
- [ ] New Rust versions reviewed for changed UB rules
- [ ] Stacked Borrows / Tree Borrows model updates tracked
- [ ] Strict provenance migration tracked
- [ ] Dependency updates checked for unsafe code fixes
- [ ] Soundness documentation kept current
- [ ] Unsafe code reviewed annually
