# Examples — Rust-Testing-Expert

## Beginner: Unit Tests and Doc Tests

```rust
/// Adds two numbers together.
///
/// # Examples
/// ```
/// use my_crate::add;
/// assert_eq!(add(2, 3), 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 { a + b }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_positive() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_add_negative() {
        assert_eq!(add(-1, -2), -3);
    }

    #[test]
    fn test_add_zero() {
        assert_eq!(add(0, 5), 5);
    }
}
```

**Explanation**: Unit tests in a `#[cfg(test)]` module. Doc tests in `///` comments are run with `cargo test --doc`.

## Intermediate: Parametrized Tests with rstest and Mocking

```rust
use rstest::rstest;

#[rstest]
#[case(0, true)]
#[case(1, false)]
#[case(2, true)]
fn test_is_even(#[case] input: u32, #[case] expected: bool) {
    assert_eq!(is_even(input), expected);
}

// With mockall
#[mockall::automock]
trait Database {
    fn get_user(&self, id: u32) -> Option<String>;
}

fn greet_user(db: &impl Database, id: u32) -> String {
    match db.get_user(id) {
        Some(name) => format!("Hello, {name}!"),
        None => "User not found".to_string(),
    }
}

#[test]
fn test_greet_user_found() {
    let mut mock = MockDatabase::new();
    mock.expect_get_user().with(eq(1)).returning(|_| Some("Alice".into()));
    assert_eq!(greet_user(&mock, 1), "Hello, Alice!");
}

#[test]
fn test_greet_user_not_found() {
    let mut mock = MockDatabase::new();
    mock.expect_get_user().with(eq(99)).returning(|_| None);
    assert_eq!(greet_user(&mock, 99), "User not found");
}

fn is_even(n: u32) -> bool { n % 2 == 0 }
```

**Explanation**: `rstest` provides parametrized test cases with `#[case]`. Mockall generates mock implementations from trait definitions with `#[automock]`.

## Advanced: Property-Based Testing and Fuzzing

```rust
use proptest::prelude::*;

// Property: reversing a string twice gives the original
proptest! {
    #[test]
    fn reverse_twice_is_identity(s: String) {
        let reversed: String = s.chars().rev().collect();
        let double_reversed: String = reversed.chars().rev().collect();
        assert_eq!(s, double_reversed);
    }

    #[test]
    fn sorted_list_is_sorted(mut vec: Vec<i32>) {
        vec.sort();
        for window in vec.windows(2) {
            assert!(window[0] <= window[1]);
        }
    }
}

// Fuzz target (in fuzz/fuzz_targets/fuzz_target_1.rs):
// #![no_main]
// use libfuzzer_sys::fuzz_target;
// fuzz_target!(|data: &[u8]| {
//     if let Ok(s) = std::str::from_utf8(data) {
//         let _ = my_parser::parse(s);
//     }
// });

// Async test
#[tokio::test]
async fn test_async_fetch() {
    let result = async_fetch_data().await;
    assert!(result.is_ok());
}

async fn async_fetch_data() -> Result<String, String> {
    Ok("data".to_string())
}
```

**Explanation**: Property-based tests with proptest generate random inputs and check invariants. Fuzz tests with cargo-fuzz feed random bytes to find crashes. Async tests use `#[tokio::test]`.
