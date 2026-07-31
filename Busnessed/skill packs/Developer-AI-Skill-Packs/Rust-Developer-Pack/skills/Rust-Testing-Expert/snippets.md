# Snippets — Rust-Testing-Expert

## 1. Basic Unit Test

```rust
#[test]
fn test_addition() {
    assert_eq!(add(2, 2), 4);
}
```

**Usage**: Mark test functions with `#[test]`. Use `assert_eq!`, `assert_ne!`, `assert!` for expectations.

## 2. Test with Expected Panic

```rust
#[test]
#[should_panic(expected = "index out of bounds")]
fn test_out_of_bounds() {
    let v = vec![1, 2, 3];
    v[10];
}
```

**Usage**: Verify that a function panics as expected. The `expected` parameter (optional) checks the panic message.

## 3. Ignored Test

```rust
#[test]
#[ignore = "slow: requires network access"]
fn test_network_call() {
    // ...
}
```

**Usage**: Skip slow or environment-dependent tests by default. Run with `cargo test -- --ignored`.

## 4. Parametrized Test with rstest

```rust
#[rstest]
#[case(1, 1, 2)]
#[case(0, 0, 0)]
#[case(-1, 1, 0)]
fn test_add(#[case] a: i32, #[case] b: i32, #[case] expected: i32) {
    assert_eq!(a + b, expected);
}
```

**Usage**: Run the same test logic with multiple input/output pairs.

## 5. Mock with mockall

```rust
#[mockall::automock]
trait Notifier {
    fn send(&self, msg: &str);
}

#[test]
fn test_notification() {
    let mut mock = MockNotifier::new();
    mock.expect_send().with(eq("alert")).times(1).returning(|_| ());
    notify(&mock, "alert");
}
```

**Usage**: Create mock implementations of traits. Use `expect_*` to set expectations on calls.

## 6. Property-Based Test with proptest

```rust
proptest! {
    #[test]
    fn test_sort_stable(mut v: Vec<i32>) {
        let original = v.clone();
        v.sort();
        assert_eq!(v.len(), original.len());
        assert!(v.windows(2).all(|w| w[0] <= w[1]));
    }
}
```

**Usage**: Test invariants across random inputs. proptest shrinks failing cases to minimal reproducers.

## 7. Doc Test

```rust
/// Returns the maximum of two values.
/// ```
/// assert_eq!(my_crate::max(3, 5), 5);
/// ```
pub fn max<T: Ord>(a: T, b: T) -> T { std::cmp::max(a, b) }
```

**Usage**: Doc tests ensure public API examples stay in sync with implementation.

## 8. Async Test with Tokio

```rust
#[tokio::test]
async fn test_async_op() {
    let result = async_compute().await;
    assert_eq!(result, 42);
}
```

**Usage**: Test async functions using `#[tokio::test]` which provides a Tokio runtime.

## 9. Integration Test

```rust
// tests/integration_test.rs
use my_crate::Config;

#[test]
fn test_config_parsing() {
    let config = Config::from_str("key=value").unwrap();
    assert_eq!(config.get("key"), Some("value"));
}
```

**Usage**: Integration tests in `tests/` directory test the crate as an external consumer.

## 10. Test Fixture with Setup

```rust
fn setup_test_db() -> TempDb {
    let db = TempDb::new();
    db.seed();
    db
}

#[test]
fn test_db_query() {
    let db = setup_test_db();
    assert_eq!(db.query("test"), vec!["result"]);
}
```

**Usage**: Use helper functions for reusable test setup.

## 11. Assert with Custom Message

```rust
#[test]
fn test_with_message() {
    let result = process_data(&[]);
    assert!(result.is_ok(), "Processing empty data should succeed, got: {result:?}");
}
```

**Usage**: Add custom failure messages for better debugging.

## 12. Conditional Test Compilation

```rust
#[cfg(feature = "cuda")]
#[test]
fn test_cuda_kernel() {
    // only tested when "cuda" feature is enabled
}
```

**Usage**: Gate tests behind feature flags for platform-specific functionality.

## 13. Test Timeout

```rust
#[test]
#[timeout(5000)]
fn test_slow_operation() {
    // will fail if takes more than 5 seconds
}
```

**Usage**: Set a timeout to prevent hanging tests.
