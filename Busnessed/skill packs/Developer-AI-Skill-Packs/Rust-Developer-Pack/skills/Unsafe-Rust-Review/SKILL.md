---
name: "Unsafe-Rust-Review"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Unsafe Rust review expert skill for raw pointers, FFI, undefined behavior detection, Miri, and soundness verification."
purpose: "Provides authoritative guidance on writing and reviewing unsafe Rust code, including raw pointer operations, FFI boundaries, undefined behavior categories, soundness verification using Miri, and the Stacked Borrows and Tree Borrows models."
---

## Capabilities

1. Analyze and review unsafe code for soundness and safety invariant violations.
2. Use raw pointer types (*const T, *mut T) and pointer operations (offset, add, sub, read, write).
3. Create and manage slices from raw pointers safely.
4. Design FFI boundaries with extern "C", repr(C), and proper calling conventions.
5. Implement manual lifetime management with PhantomData.
6. Distinguish between safety invariants and correctness invariants.
7. Identify undefined behavior categories: data races, aliasing violations, provenance issues.
8. Use Miri to detect undefined behavior in unsafe code.
9. Apply the Stacked Borrows model for aliasing verification.
10. Apply the Tree Borrows model as an alternative alias model.
11. Use soundness verification checklists for unsafe abstractions.
12. Implement custom allocator interfaces and unsafe trait implementations.

## Limitations

1. Cannot execute unsafe code — provides review and analysis guidance.
2. Soundness proofs require human review; automated tools (Miri) complement but don't replace it.
3. Limited to stable Miri/Stacked Borrows behavior; nightly models may differ.
4. FFI guidance limited to common patterns; platform-specific quirks require expert review.

## Required Tools

- Miri (rustup +nightly component add miri)
- Stacked Borrows model (default in Miri)
- Tree Borrows model (opt-in in Miri)
- cargo-expand for macro inspection
- Compiler warnings and clippy
- Sanitizers (ASan, LSan, TSan, UBSan) for additional UB detection

## Execution Workflow

1. Identify the unsafe block and its safety contract.
2. Understand what safety invariants the unsafe block relies on.
3. Document the safety preconditions with // SAFETY: comments.
4. Verify pointer provenance and aliasing rules.
5. Check lifetime bounds with PhantomData markers.
6. For FFI: verify repr(C), extern "C", null pointer handling.
7. Run Miri on test cases that exercise the unsafe code.
8. Address any Miri-reported violations.
9. Review for common UB categories: use-after-free, double-free, out-of-bounds.
10. Verify that the public safe API cannot trigger UB.
11. Check that drop implementations are safe (no double-free, no leaked resources).
12. Document remaining safety assumptions.
13. Review for concurrency safety (Send + Sync bounds).
14. Sign off on soundness or identify required fixes.

## Decision Tree

1. **Is the unsafe code in a public API?**
   - YES → Must be sound for all safe inputs. Document preconditions.
   - NO → Internal usage with documented invariants.

2. **Is FFI involved?**
   - YES → Check repr(C), extern "C", proper size/alignment, null handling.
   - NO → Pure Rust unsafe.

3. **Are raw pointers used?**
   - YES → Verify provenance, aliasing, no use-after-free, proper alignment.
   - NO → Only unsafe traits or calls.

4. **Is the code doing allocation?**
   - YES → Check GlobalAlloc contract, alignment, deallocation, no double-free.
   - NO → Standard allocation patterns.

5. **Is concurrency involved?**
   - YES → Ensure Send + Sync correctness, no data races.
   - NO → Single-threaded safety is sufficient.

6. **Can Miri test the code?**
   - YES → Run Miri with comprehensive test cases.
   - NO → Manual review is critical.

## Review Checklist

- [ ] Every unsafe block has a // SAFETY: comment explaining preconditions.
- [ ] Safety invariants are documented at the function/module level.
- [ ] Pointer provenance is correct (no pointer from integer without valid provenance).
- [ ] No out-of-bounds memory access (offset, add, indexing).
- [ ] No use-after-free or dangling pointer access.
- [ ] Alignment requirements are satisfied.
- [ ] Miri reports no UB (cargo +nightly miri test).
- [ ] Stacked Borrows retagging is correct (no invalid retag).
- [ ] PhantomData correctly represents ownership/lifetime relationships.
- [ ] Send and Sync implementations are correct.
- [ ] FFI types use repr(C) and have correct size/alignment.
- [ ] extern "C" uses correct ABI for the target platform.
- [ ] Null pointer checks on returned FFI pointers.
- [ ] Drop implementations don't introduce UB.
- [ ] Panic safety: unsafe code is not exposed to panics without cleanup.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Miri reports "no item in borrow stack" | Stacked Borrows violation | Check aliasing, use raw ptr correctly |
| Miri reports "using uninitialized data" | Reading memory without initialization | Use MaybeUninit<T> |
| Segfault in FFI code | Wrong ABI or repr(C) layout | Verify type layout with #[repr(C)] |
| Double-free | Drop called twice | Track ownership with PhantomData |
| Data race in Miri test | Missing Send/Sync bounds | Add appropriate bounds |
| Pointer provenance error | Ptr from integer cast | Use strict provenance APIs |
| Stacked Borrows tag conflict | Mutable reference and raw pointer alias | Don't alias &mut with raw ptr |
> Miri reports "this should be retagged" | Incorrect retagging | Ensure pointer is properly retagged |
| Thread sanitizer detects data race | Concurrent access without sync | Add Mutex or atomic operations |

## Best Practices

1. Keep unsafe blocks as small as possible — prefer safe abstractions.
2. Always document safety invariants with // SAFETY: comments.
3. Run Miri on all code containing unsafe blocks.
4. Use strict provenance APIs (`ptr::from_raw_parts`, `ptr::addr_of!`).
5. Prefer `NonNull<T>` over `*mut T` when a pointer must be non-null.
6. Use `MaybeUninit<T>` for uninitialized memory.
7. Use `PhantomData` to encode ownership and variance relationships.
8. Validate FFI function pointers are non-null before calling.
9. Test unsafe code with Miri, sanitizers, and stress tests.
10. Have unsafe code reviewed by another Rust expert.
11. Use `#![deny(unsafe_op_in_unsafe_fn)]` to enforce explicit unsafe blocks.
12. Document the safety model in the module-level documentation.

## Anti-Patterns

1. **Unsafety in public API**: Exposing unsafe functions without clear safety docs.
2. **Missing SAFETY comments**: No explanation of what makes the unsafe code correct.
3. **Overly large unsafe blocks**: Including safe operations in unsafe blocks.
4. **Ignoring Miri warnings**: Running code that Miri flags as UB.
5. **Assume 64-bit pointers**: Hardcoding pointer sizes.
6. **Not handling OOM**: Assuming allocation always succeeds.
7. **Forgetting about Drop**: Leaking resources or double-free.
8. **Exposing internal layout**: Relying on repr(Rust) layout in unsafe code.

## References

Rustonomicon: https://doc.rust-lang.org/nomicon/
Unsafe Code Guidelines: https://rust-lang.github.io/unsafe-code-guidelines/
Rust Reference: Unsafe: https://doc.rust-lang.org/reference/unsafe-keyword.html
Stacked Borrows: https://github.com/rust-lang/unsafe-code-guidelines/blob/master/wip/stacked-borrows.md
Tree Borrows: https://perso.crans.org/vanille/tree-borrows/
Miri: https://github.com/rust-lang/miri
Strict Provenance: https://doc.rust-lang.org/std/ptr/index.html#strict-provenance
Rust RFC 2582 (unsafe blocks in unsafe fn): https://rust-lang.github.io/rfcs/2582-unsafe-operations-in-unsafe-fns.html
