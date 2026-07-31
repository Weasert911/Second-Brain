# Snippets — Serde-Expert

## 1. Basic Struct Derive

```rust
#[derive(Serialize, Deserialize, Debug)]
struct Config {
    host: String,
    port: u16,
    debug: bool,
}
```

**Usage**: Default serialization uses struct field names as-is (snake_case by default).

## 2. Rename All Fields

```rust
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct User { user_id: u64, user_name: String }
// JSON: {"userId": 1, "userName": "Alice"}
```

**Usage**: Transform all field names using the given case convention. Supports lower_case, UPPER_CASE, camelCase, PascalCase, kebab-case, SCREAMING-KEBAB-CASE.

## 3. Skip Optional Fields

```rust
#[derive(Serialize, Deserialize)]
struct Response {
    data: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}
```

**Usage**: Skip None optional fields in serialized output. Keeps JSON clean.

## 4. Default Value

```rust
#[derive(Serialize, Deserialize)]
struct Config {
    #[serde(default = "default_timeout")]
    timeout_secs: u64,
}

fn default_timeout() -> u64 { 30 }
```

**Usage**: Provide a default value when field is missing in input. Can use `#[serde(default)]` for Default trait.

## 5. Flatten Nested Struct

```rust
#[derive(Serialize, Deserialize)]
struct PaginatedResponse {
    #[serde(flatten)]
    pagination: Pagination,
    data: Vec<Item>,
}
// JSON: {"page": 1, "per_page": 10, "data": [...]}
```

**Usage**: Flatten inner struct fields into the parent serialization.

## 6. Internally Tagged Enum

```rust
#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
enum Message {
    Text { content: String },
    Image { url: String, size: u32 },
}
// JSON: {"type": "Text", "content": "hello"}
```

**Usage**: Use `tag` attribute to put the variant identifier inside the content object.

## 7. Transparent Newtype

```rust
#[derive(Serialize, Deserialize, Debug)]
#[serde(transparent)]
struct UserId(u64);
// Serializes as just the u64 number, not {"UserId": 123}
```

**Usage**: Newtype wrappers serialize as their inner type without extra wrapping.

## 8. Custom Serialization with Module

```rust
#[derive(Serialize, Deserialize)]
struct Event {
    name: String,
    #[serde(with = "hex_serde")]
    data: Vec<u8>,
}

mod hex_serde {
    use serde::{Serialize, Deserialize, Serializer, Deserializer};
    pub fn serialize<S: Serializer>(data: &[u8], s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&hex::encode(data))
    }
    pub fn deserialize<'de, D: Deserializer<'de>>(d: D) -> Result<Vec<u8>, D::Error> {
        let s = String::deserialize(d)?;
        hex::decode(&s).map_err(serde::de::Error::custom)
    }
}
```

**Usage**: The `serde(with = "...")` attribute references a module with `serialize` and `deserialize` functions.

## 9. Untagged Enum

```rust
#[derive(Serialize, Deserialize)]
#[serde(untagged)]
enum Value { Text(String), Number(f64) }
// JSON: "hello" or 42.0 (no tag wrapper)
```

**Usage**: Untagged enums serialize without a variant tag. Deserialization tries each variant in order.

## 10. Zero-Copy with Cow

```rust
#[derive(Serialize, Deserialize)]
struct LogEntry<'a> {
    level: &'a str,
    #[serde(borrow)]
    message: Cow<'a, str>,
}
```

**Usage**: Borrow string data from the input buffer. Cow falls back to owned when borrowing isn't possible.

## 11. JSON Value for Dynamic Data

```rust
use serde_json::Value;

fn handle_dynamic(data: &str) {
    let value: Value = serde_json::from_str(data).unwrap();
    if let Some(name) = value.get("name").and_then(|v| v.as_str()) {
        println!("Name: {name}");
    }
}
```

**Usage**: `serde_json::Value` is an enum representing any JSON value. Useful for partially dynamic schemas.

## 12. Adjacently Tagged Enum

```rust
#[derive(Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
enum Message { Text { content: String }, Image { url: String } }
// JSON: {"type": "Text", "payload": {"content": "hello"}}
```

**Usage**: Tag and content are separate fields in the JSON object. Useful for OpenAPI-style schemas.

## 13. Human Readable Check in Custom Serde

```rust
fn serialize<S: Serializer>(value: &MyType, serializer: S) -> Result<S::Ok, S::Error> {
    if serializer.is_human_readable() {
        serializer.serialize_str(&value.to_string())
    } else {
        // binary format
        let bytes: [u8; 8] = value.to_be_bytes();
        serializer.serialize_bytes(&bytes)
    }
}
```

**Usage**: `is_human_readable()` lets you choose format based on whether the serializer is human-readable (JSON, YAML) or binary (Bincode, MsgPack).

## 14. Skip Deserializing

```rust
#[derive(Deserialize)]
struct Input {
    value: String,
    #[serde(skip_deserializing)]
    computed: u64,
}
```

**Usage**: Skip a field during deserialization. Useful for computed fields.

## 15. Deny Unknown Fields

```rust
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct StrictConfig { host: String, port: u16 }
// Rejects any extra fields in the JSON
```

**Usage**: Reject unknown fields during deserialization. Use for strict schema validation on v2+ APIs.
