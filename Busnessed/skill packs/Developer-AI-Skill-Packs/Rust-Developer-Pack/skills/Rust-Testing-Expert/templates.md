# Templates — Rust-Testing-Expert

## Template 1: Unit Test Module

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_{{scenario}}() {
        let result = {{function}}({{args}});
        assert_eq!(result, {{expected}});
    }

    #[test]
    fn test_{{edge_case}}() {
        let result = {{function}}({{edge_input}});
        assert!(result.{{property}}());
    }
}
```

## Template 2: Parametrized Test with rstest

```rust
use rstest::rstest;

#[rstest]
#[case({{input1}}, {{expected1}})]
#[case({{input2}}, {{expected2}})]
#[case({{input3}}, {{expected3}})]
fn test_{{name}}(#[case] input: {{InputType}}, #[case] expected: {{OutputType}}) {
    let result = {{function}}(input);
    assert_eq!(result, expected);
}
```

## Template 3: Mock Trait with mockall

```rust
#[mockall::automock]
pub trait {{TraitName}} {
    fn {{method}}(&self, {{arg}}: {{ArgType}}) -> {{ReturnType}};
}

#[test]
fn test_with_mock() {
    let mut mock = Mock{{TraitName}}::new();
    mock.expect_{{method}}()
        .with(eq({{expected_arg}}))
        .times(1)
        .returning(|_| {{return_value}});

    let result = {{function_under_test}}(&mock, {{input}});
    assert_eq!(result, {{expected_result}});
}
```

## Template 4: Property-Based Test with proptest

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_{{invariant}}({{param}}: {{Type}}) {
        // Given {{param}} (random)
        let result = {{function}}({{param}});
        // The invariant should always hold
        prop_assert!(result.{{property}}());
    }
}
```

## Template 5: Async Test

```rust
#[tokio::test]
async fn test_{{name}}() {
    let result = {{async_function}}().await;
    assert!(result.is_ok());
    assert_eq!(result.unwrap(), {{expected}});
}
```

## Template 6: Test Fixture

```rust
pub struct {{FixtureName}} {
    pub {{field}}: {{FieldType}},
}

impl {{FixtureName}} {
    pub fn new() -> Self {
        Self { {{field}}: {{setup_value}} }
    }
}

impl Drop for {{FixtureName}} {
    fn drop(&mut self) {
        // Cleanup resources
    }
}

#[test]
fn test_with_fixture() {
    let fixture = {{FixtureName}}::new();
    // Use fixture
}
```

## Template 7: Integration Test

```rust
// tests/integration.rs
use {{crate_name}};

#[test]
fn test_full_workflow() {
    // Setup
    let result = {{workflow_function}}({{args}});
    assert!(result.is_ok());

    // Verify
    let data = result.unwrap();
    assert_eq!(data.{{field}}, {{expected}});
}
```

## Template 8: Doc Test

```rust
/// {{description}}
///
/// # Examples
///
/// ```
/// use {{crate_name}}::{{function}};
///
/// let result = {{function}}({{example_input}});
/// assert_eq!(result, {{example_output}});
/// ```
pub fn {{function}}(input: {{InputType}}) -> {{OutputType}} {
    todo!()
}
```
