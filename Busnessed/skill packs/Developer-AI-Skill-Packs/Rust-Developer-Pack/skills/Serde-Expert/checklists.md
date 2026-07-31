# Checklists — Serde-Expert

## Pre-Flight Checklist

- [ ] serde and one or more format crates added to Cargo.toml
- [ ] Data format(s) chosen based on requirements
- [ ] Enum tagging strategy decided
- [ ] Field renaming strategy decided (snake_case, camelCase, etc.)
- [ ] Optional vs required fields identified
- [ ] Default values for optional fields planned
- [ ] Backward compatibility strategy defined
- [ ] Zero-copy vs owned data decision made

## Implementation Checklist

- [ ] All public types derive Serialize and/or Deserialize
- [ ] Field attributes match data format requirements
- [ ] Enum variants have correct tagging attributes
- [ ] Optional fields use Option<T> or #[serde(default)]
- [ ] #[serde(skip_serializing_if)] used where appropriate
- [ ] Custom ser/de modules implement both serialize and deserialize
- [ ] Zero-copy uses #[serde(borrow)] with Cow<str>
- [ ] deny_unknown_fields on structs that should reject unknown keys
- [ ] Renaming consistent across the schema
- [ ] #[serde(transparent)] used for newtype wrappers
- [ ] serde_json::Value used for dynamic/untyped data

## Testing Checklist

- [ ] Round-trip test: serialize then deserialize, assert_eq
- [ ] All enum variants round-trip correctly
- [ ] Missing optional fields deserialize to None/default
- [ ] Unknown fields rejected or ignored as intended
- [ ] Edge cases: empty strings, zero values, null bytes
- [ ] Large inputs tested for performance
- [ ] Deeply nested structures handle recursion limit
- [ ] Different formats produce compatible data

## Release Checklist

- [ ] Versioned schema — wire format documented
- [ ] Backward compatibility verified
- [ ] serde_json arbitrary_precision configured for large numbers
- [ ] Binary format endianness documented
- [ ] Recursion depth limits set for untrusted input
- [ ] Performance benchmarks reviewed
- [ ] Serialization size overhead acceptable
- [ ] Error messages helpful for debugging

## Maintenance Checklist

- [ ] New fields added with #[serde(default)] for backward compat
- [ ] Deprecated fields handled with #[serde(skip)]
- [ ] Schema changes versioned
- [ ] Format version negotiated (e.g., accept header)
- [ ] Binary format migration documented
- [ ] Dependencies updated for serde and format crates
- [ ] Benchmarks re-run after changes
- [ ] Third-party integrations tested
