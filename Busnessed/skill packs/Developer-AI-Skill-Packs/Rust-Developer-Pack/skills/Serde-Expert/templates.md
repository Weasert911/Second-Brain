# Templates — Serde-Expert

## Template 1: Basic Struct with Renaming

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "{{case_strategy}}")]
pub struct {{StructName}} {
    pub {{field1}}: {{type1}},
    #[serde(rename = "{{field_name_override}}")]
    pub {{field2}}: {{type2}},
    #[serde(skip_serializing_if = "Option::is_none")]
    pub {{optional_field}}: Option<{{type3}}>,
    #[serde(default)]
    pub {{default_field}}: {{type4}},
}
```

## Template 2: Internally Tagged Enum

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "{{tag_field}}")]
pub enum {{EnumName}} {
    {{Variant1}} {
        {{variant1_fields}}
    },
    {{Variant2}} {
        {{variant2_fields}}
    },
}
```

## Template 3: Custom Serialization Module

```rust
pub mod {{module_name}}_serde {
    use serde::{Deserialize, Deserializer, Serialize, Serializer};
    use super::*;

    pub fn serialize<S: Serializer>(value: &{{TargetType}}, serializer: S) -> Result<S::Ok, S::Error> {
        let output = format!("{{}}", value); // custom format
        serializer.serialize_str(&output)
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(deserializer: D) -> Result<{{TargetType}}, D::Error> {
        let s = String::deserialize(deserializer)?;
        s.parse().map_err(serde::de::Error::custom)
    }
}
```

## Template 4: Zero-Copy Struct

```rust
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(Debug, Serialize, Deserialize)]
pub struct {{StructName}}<'a> {
    pub id: u64,
    #[serde(borrow)]
    pub name: Cow<'a, str>,
    pub tags: Vec<&'a str>,
}
```

## Template 5: Flattened Struct

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct {{Base}} {
    pub id: u64,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct {{Extended}} {
    #[serde(flatten)]
    pub base: {{Base}},
    pub extra_field: String,
}
// JSON: {"id": 1, "name": "foo", "extra_field": "bar"}
```

## Template 6: Untagged Enum

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum {{EnumName}} {
    {{SimpleVariant}}({{SimpleType}}),
    {{ComplexVariant}} { {{fields}} },
}
```

## Template 7: Transparent Newtype

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(transparent)]
pub struct {{NewType}}(pub {{InnerType}});
// Serializes as the inner type directly, without wrapper object
```

## Template 8: Container with deny_unknown_fields

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct {{StrictStruct}} {
    pub {{field1}}: {{type1}},
    pub {{field2}}: {{type2}},
}
// Any unknown field in input will cause a deserialization error
```
