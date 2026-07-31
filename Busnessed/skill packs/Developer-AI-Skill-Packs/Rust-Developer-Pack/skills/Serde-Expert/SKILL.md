---
name: "Serde-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Serde expert skill for serialization, derive macros, custom implementations, format handling, and zero-copy deserialization."
purpose: "Provides comprehensive guidance on the Serde serialization framework, including derive macros, attribute configuration, custom Serialize/Deserialize implementations, multiple data format support, zero-copy techniques, and best practices for robust data interchange."
---

## Capabilities

1. Derive Serialize and Deserialize with attribute configuration (rename, skip, flatten, tag, untagged).
2. Implement custom Serialize and Deserialize traits for complex types.
3. Use serde_json for JSON serialization/deserialization with pretty printing and raw values.
4. Use serde_yaml, serde_bincode, serde_msgpack for alternative formats.
5. Apply zero-copy deserialization with #[serde(borrow)] and Cow<str>.
6. Configure enum representations: internally tagged, externally tagged, adjacently tagged, untagged.
7. Manage field renaming strategies (camelCase, PascalCase, snake_case, kebab-case).
8. Use skip_serializing_if, default, with, and other field attributes.
9. Handle optional fields with Option and default values.
10. Implement custom serialization modules with serde(with = "...") attribute.
11. Distinguish between human_readable and binary format behaviors in custom ser/de.
12. Work with container attributes like deny_unknown_fields, transparent, and remote.

## Limitations

1. Cannot execute serialization — provides design and implementation guidance only.
2. Does not cover all third-party crate formats beyond major ones (JSON, YAML, Bincode, MsgPack).
3. Custom Serialize/Deserialize implementations must be tested by the user for correctness.
4. Zero-copy deserialization requires understanding of data lifetime management.

## Required Tools

- serde crate with derive feature
- serde_json for JSON
- serde_yaml for YAML
- serde_bincode for binary
- serde_msgpack for MessagePack
- cargo-expand for debugging serde derive macro output

## Execution Workflow

1. Analyze the data structure and its serialization requirements.
2. Choose data format(s) JSON, YAML, Bincode, MsgPack, or custom.
3. Apply #[derive(Serialize, Deserialize)] with appropriate attributes.
4. Configure field renaming for format compatibility (e.g., camelCase for JavaScript).
5. Handle optional and default values with Option and #[serde(default)].
6. Design enum representation strategy (tagged, untagged, adjacently tagged).
7. Implement custom serialization for types that need special handling.
8. Apply zero-copy deserialization for performance-critical paths.
9. Test round-trip serialization/deserialization.
10. Benchmark with different formats and configurations.
11. Handle versioning and backward compatibility.
12. Review for security: denial of service via deeply nested input.

## Decision Tree

1. **Is the data human-readable?**
   - YES → Use JSON or YAML.
   - NO → Use Bincode or MsgPack for binary.

2. **Is performance critical?**
   - YES → Use Bincode (fastest), consider zero-copy with #[serde(borrow)].
   - NO → JSON is fine for most use cases.

3. **Are enums part of the schema?**
   - YES → Choose tagging strategy (externally tagged default, internally for JSON, adjacently for flexibility).
   - NO → Simple struct serialization.

4. **Is backward compatibility needed?**
   - YES → Use #[serde(default)] for new fields, #[serde(deny_unknown_fields)] only on new versions.
   - NO → Strict schema is fine.

5. **Does the type need custom serialization?**
   - YES → Implement Serialize and/or Deserialize manually.
   - NO → Derive macros suffice.

6. **Is data borrowed from the input?**
   - YES → Use Cow<str> with #[serde(borrow)] for zero-copy.
   - NO → Owned types (String) are simpler.

## Review Checklist

- [ ] All types implement Serialize and/or Deserialize as needed.
- [ ] Field attributes match the data format requirements.
- [ ] Enum tagging strategy is correct for the use case.
- [ ] Optional fields use Option<T> or #[serde(default)].
- [ ] Renaming attributes are consistent across the schema.
- [ ] Custom ser/de implementations are correct and handle errors.
- [ ] Zero-copy deserialization uses #[serde(borrow)] and Cow<str>.
- [ ] deny_unknown_fields is used appropriately (strict parsing vs forward compat).
- [ ] #[serde(transparent)] used for newtype wrappers.
- [ ] serde(with = "...") module paths are correct.
- [ ] Round-trip tests pass for all formats used.
- [ ] Large inputs are handled (depth limit, size limits).

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "missing field" error | Deserialize expects required field | Add #[serde(default)] on the field |
| "unknown field" error | deny_unknown_fields enabled | Remove attribute or add the field |
| Enum deserialization fails | Tagging strategy mismatch | Check tag attribute on enum |
| Lifetime error with zero-copy | Missing #[serde(borrow)] | Add borrow attribute to the field |
| Custom deserializer called unexpectedly | Wrong type mapping | Debug with eprintln or tracing |
| Recursive serialization overflow | Self-referencing types | Use Box for indirection |
| YAML deserialization wrong | YAML aliases not supported | Disable aliases in serde_yaml |
| Binary format incompatible | Endianness or version mismatch | Document format version and endianness |

## Best Practices

1. Always derive both Serialize and Deserialize unless read-only or write-only.
2. Use #[serde(default = "path")] for fields with non-Default defaults.
3. Prefer #[serde(rename_all = "camelCase")] for JSON APIs consumed by JavaScript.
4. Use #[serde(transparent)] for newtype wrappers to flatten serialization.
5. Use #[serde(untagged)] for enums where variant is determined by data content.
6. Test round-trip: serialize then deserialize and assert_eq.
7. Set serde_json recursion_depth_limit to prevent stack overflow.
8. Use #[serde(skip_serializing_if = "Option::is_none")] for sparse output.
9. Document serialization format and versioning strategy.
10. Use serde(with = "...") to reuse serialization logic across types.

## Anti-Patterns

1. **Missing default for optional fields**: Required fields that are often absent.
2. **Wrong tagging strategy**: Externally tagged enums in JSON causing ugly output.
3. **Overriding rename_all manually**: Redundant per-field rename when container attribute suffices.
4. **Unnecessary zero-copy**: Using Cow<str> when the data is short-lived anyway.
5. **Ignoring serde_json's arbitrary_precision**: Losing precision for large numbers.
6. **No round-trip tests**: Assuming serialization/deserialization is symmetric.
7. **Exposing internal types**: Serializing internal-only fields that shouldn't be in the schema.
8. **Deeply nested serialization**: Causing stack overflow on untrusted input.
9. **Unsafe serde implementations**: Using unsafe where safe alternatives exist.

## References

Serde Documentation: https://serde.rs/
Serde API Docs: https://docs.rs/serde/latest/serde/
Serde JSON Docs: https://docs.rs/serde_json/latest/serde_json/
Serde YAML Docs: https://docs.rs/serde_yaml/latest/serde_yaml/
Serde Bincode Docs: https://docs.rs/bincode/latest/bincode/
Serde Attributes: https://serde.rs/attributes.html
Serde Field Attributes: https://serde.rs/field-attrs.html
Serde Enum Attributes: https://serde.rs/enum-attrs.html
