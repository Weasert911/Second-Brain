# Templates — Clap-CLI-Expert

## Template 1: Basic CLI Struct

```rust
use clap::Parser;

#[derive(Parser)]
#[command(name = "{{app_name}}", version, about = "{{description}}")]
pub struct Cli {
    /// {{help_text}}
    pub {{arg_name}}: {{arg_type}},

    /// {{help_text}}
    #[arg(short, long, default_value = "{{default}}")]
    pub {{opt_name}}: {{opt_type}},
}
```

## Template 2: CLI with Subcommands

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "{{app_name}}", version, about = "{{description}}")]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// {{command1_description}}
    {{Command1}} {
        /// {{arg_help}}
        {{arg_name}}: {{arg_type}},
    },
    /// {{command2_description}}
    {{Command2}} {
        #[arg(short, long)]
        {{flag_name}}: bool,
    },
}
```

## Template 3: Reusable Args Group

```rust
use clap::Args;

#[derive(Debug, Args)]
pub struct {{GroupName}} {
    /// {{help}}
    #[arg(short, long, default_value = "{{default}}")]
    pub {{field1}}: {{type1}},

    /// {{help}}
    #[arg(short, long)]
    pub {{field2}}: Option<{{type2}}>,
}

// Use as: #[command(flatten)] pub {{group_name}}: {{GroupName}}
```

## Template 4: ValueEnum

```rust
use clap::ValueEnum;

#[derive(Debug, Clone, ValueEnum)]
pub enum {{EnumName}} {
    /// {{variant1_help}}
    {{Variant1}},
    /// {{variant2_help}}
    {{Variant2}},
}

// Use as: #[arg(short, long, value_enum, default_value_t = {{EnumName}}::Variant1)]
```

## Template 5: Validation with value_parser

```rust
use std::ops::RangeInclusive;

#[derive(Parser)]
pub struct Cli {
    /// Port number (1024-65535)
    #[arg(short, long, value_parser = clap::value_parser!(u16).range(1024..))]
    pub port: u16,

    /// URL pattern (must start with https://)
    #[arg(short, long, value_parser = regex_url)]
    pub url: String,
}

fn regex_url(s: &str) -> Result<String, String> {
    if s.starts_with("https://") {
        Ok(s.to_string())
    } else {
        Err("URL must start with https://".to_string())
    }
}
```

## Template 6: Completions Generation

```rust
use clap::Command;
use clap_complete::{generate, Shell};
use std::io;

pub fn print_completions(shell: Shell, cmd: &mut Command) {
    generate(shell, cmd, "{{app_name}}", &mut io::stdout());
}

// Usage in CLI subcommand:
// Commands::Completions { shell } => print_completions(shell, &mut Cli::command()),
```

## Template 7: Environment Variable Fallback

```rust
use clap::Parser;

#[derive(Parser)]
pub struct Cli {
    /// API key (can also be set via {{ENV_VAR}})
    #[arg(short, long, env = "{{ENV_VAR}}", hide_env_values = true)]
    pub api_key: String,

    /// Log level
    #[arg(long, env = "{{ENV_VAR2}}", default_value = "info")]
    pub log_level: String,
}
```

## Template 8: Argument Conflicts and Requires

```rust
use clap::Parser;

#[derive(Parser)]
pub struct Cli {
    /// Input file
    pub input: String,

    /// Output file (cannot use with --in-place)
    #[arg(short, long, conflicts_with = "in_place")]
    pub output: Option<String>,

    /// Edit file in place (cannot use with --output)
    #[arg(short, long, conflicts_with = "output")]
    pub in_place: bool,

    /// Force operation (requires --output or --in-place)
    #[arg(short, long, requires = "output")]
    pub force: bool,
}
```
