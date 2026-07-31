# Examples — Serde-Expert

## Beginner: Basic Serialization

```rust
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Debug, Serialize, Deserialize)]
struct User {
    id: u64,
    name: String,
    email: String,
    active: bool,
}

fn main() {
    let user = User {
        id: 1,
        name: "Alice".to_string(),
        email: "alice@example.com".to_string(),
        active: true,
    };

    let json = serde_json::to_string_pretty(&user).unwrap();
    println!("{json}");

    let decoded: User = serde_json::from_str(&json).unwrap();
    assert_eq!(user.id, decoded.id);
}
```

**Explanation**: Basic derive-based serialization with JSON. The `#[derive(Serialize, Deserialize)]` macros generate all necessary implementations.

## Intermediate: Enum Tagging Strategies

```rust
use serde::{Deserialize, Serialize};

// Default: Externally tagged
#[derive(Serialize, Deserialize, Debug)]
enum Message1 { Text(String), Image { url: String, size: u32 } }
// JSON: {"Text": "hello"} or {"Image": {"url": "...", "size": 100}}

// Internally tagged
#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
enum Message2 { Text(String), Image { url: String, size: u32 } }
// JSON: {"type": "Text", "content": "hello"}

// Adjacently tagged
#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type", content = "data")]
enum Message3 { Text(String), Image { url: String, size: u32 } }
// JSON: {"type": "Text", "data": "hello"}

// Untagged
#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
enum Message4 { Text(String), Image { url: String, size: u32 } }
// JSON: "hello" or {"url": "...", "size": 100}
```

**Explanation**: Choose enum tagging strategy based on the desired JSON structure. Externally tagged is default; internally tagged is more natural for API JSON; untagged is flexible but must be unambiguous.

## Advanced: Custom Serialization Module

```rust
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::fmt;

#[derive(Debug, Clone)]
struct Date {
    year: u16,
    month: u8,
    day: u8,
}

impl fmt::Display for Date {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:04}-{:02}-{:02}", self.year, self.month, self.day)
    }
}

impl std::str::FromStr for Date {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = s.split('-').collect();
        if parts.len() != 3 { return Err("invalid format".into()); }
        Ok(Date {
            year: parts[0].parse().map_err(|_| "invalid year".to_string())?,
            month: parts[1].parse().map_err(|_| "invalid month".to_string())?,
            day: parts[2].parse().map_err(|_| "invalid day".to_string())?,
        })
    }
}

mod date_serde {
    use super::*;

    pub fn serialize<S: Serializer>(date: &Date, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(&date.to_string())
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(deserializer: D) -> Result<Date, D::Error> {
        let s = String::deserialize(deserializer)?;
        s.parse().map_err(serde::de::Error::custom)
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct Event {
    name: String,
    #[serde(with = "date_serde")]
    date: Date,
}

fn main() {
    let event = Event { name: "Birthday".into(), date: Date { year: 2026, month: 7, day: 5 } };
    let json = serde_json::to_string_pretty(&event).unwrap();
    println!("{json}");
    let decoded: Event = serde_json::from_str(&json).unwrap();
    println!("{decoded:?}");
}
```

**Explanation**: Custom `serde(with = "...")` module for types that need special serialization. The module provides `serialize` and `deserialize` functions called by the derived implementation.

## Production: Zero-Copy Deserialization

```rust
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(Serialize, Deserialize, Debug)]
struct LogEntry<'a> {
    timestamp: u64,
    level: &'a str,         // borrows from input
    #[serde(borrow)]
    message: Cow<'a, str>,  // borrows when possible, owns when needed
}

fn main() {
    let data = r#"{"timestamp": 12345, "level": "INFO", "message": "Server started"}"#;

    // Zero-copy deserialization — no allocation for level or message
    let entry: LogEntry = serde_json::from_str(data).unwrap();
    println!("Level: {}, Message: {}", entry.level, entry.message);

    // entry borrows from `data` — data must outlive entry
    drop(data);
    // println!("{}", entry.level); // would fail to compile — data dropped
}
```

**Explanation**: Zero-copy deserialization uses `&'de str` and `Cow<'de, str>` to borrow string data from the input buffer, avoiding allocations. The input must outlive the deserialized data.
