# References — Serde-Expert

## Official Documentation

- [Serde Website](https://serde.rs/) — comprehensive guide and attribute reference
- [Serde API Docs](https://docs.rs/serde/latest/serde/) — full API reference
- [Serde JSON](https://docs.rs/serde_json/latest/serde_json/) — JSON format support
- [Serde YAML](https://docs.rs/serde_yaml/latest/serde_yaml/) — YAML format support
- [Bincode](https://docs.rs/bincode/latest/bincode/) — binary format
- [MessagePack](https://docs.rs/rmp-serde/latest/rmp_serde/) — MsgPack format
- [Serde Attributes](https://serde.rs/attributes.html) — complete attribute reference
- [Serde Field Attrs](https://serde.rs/field-attrs.html) — per-field attributes
- [Serde Enum Attrs](https://serde.rs/enum-attrs.html) — enum attributes

## Key Terms

1. **Serialize**: A trait for converting Rust types to a data format.
2. **Deserialize**: A trait for converting from a data format to Rust types.
3. **Serializer**: A trait for writing data to an output format.
4. **Deserializer**: A trait for reading data from an input format.
5. **Zero-Copy Deserialization**: Borrowing data from the input buffer instead of allocating.
6. **Tagged Enum**: Enum serialized with a tag field to identify the variant.
7. **Externally Tagged**: Default — `{"Variant": {...}}`.
8. **Internally Tagged**: `{"tag": "Variant", ...}` — tag inside the content.
9. **Adjacently Tagged**: `{"tag": "Variant", "content": {...}}` — tag and content separate.
10. **Untagged**: `{...}` — no tag, determined by field uniqueness.
11. **Flatten**: Merge nested struct fields into the parent.
12. **Transparent**: Serialize newtype wrapper as the inner type.
13. **Borrow**: Indicate that a field borrows from the deserialization input.
14. **Human Readable**: Formats like JSON/YAML that are meant to be read.
15. **Non-Human Readable**: Binary formats like Bincode/MsgPack.

## Architecture Notes

Serde works through a two-layer architecture: data model types (Serializer/Deserializer traits) and format implementations (serde_json, bincode, etc.). The derive macros generate implementations that call Serializer/Deserializer methods. Custom implementations directly implement the traits for full control. Zero-copy is achieved by using `Cow<'de, str>` and `#[serde(borrow)]` to borrow string data from the deserializer's input lifetime.

## Key APIs

- `#[derive(Serialize, Deserialize)]` — automatic implementation
- `serde_json::to_string`, `serde_json::from_str` — JSON I/O
- `serde_json::to_value`, `serde_json::from_value` — JSON Value interop
- `serde_yaml::to_string`, `serde_yaml::from_str` — YAML I/O
- `bincode::serialize`, `bincode::deserialize` — binary I/O
- `rmp_serde::to_vec`, `rmp_serde::from_slice` — MsgPack I/O
- `Serializer` trait: `serialize_bool`, `serialize_str`, `serialize_seq`, etc.
- `Deserializer` trait: `deserialize_bool`, `deserialize_str`, `deserialize_seq`, etc.
- `Deserialize<'de>` lifetime parameter for zero-copy

## Conventions

- Derive Serialize and Deserialize on all data types exposed at API boundaries.
- Use `#[serde(rename_all = "camelCase")]` for REST APIs.
- Use `#[serde(deny_unknown_fields)]` for strict validation in v2+ schemas.
- Use `#[serde(tag = "type")]` for internally tagged enums in JSON APIs.
- Module-level serde implementations go in `serde.rs` or `serde/` directory.

## Project Structure

```
serialization_project/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── types.rs           # data types with serde derives
│   ├── serde.rs           # custom serializer/deserializer modules
│   ├── formats/
│   │   ├── mod.rs
│   │   ├── json.rs        # JSON-specific config
│   │   └── binary.rs      # binary format config
│   └── compat.rs          # backward compatibility shims
├── tests/
│   └── roundtrip.rs       # round-trip serialization tests
└── benches/
    └── serde_bench.rs     # serialization benchmarks
```
