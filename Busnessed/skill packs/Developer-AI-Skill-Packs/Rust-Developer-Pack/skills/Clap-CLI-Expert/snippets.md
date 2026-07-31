# Snippets — Clap-CLI-Expert

## 1. Basic Parser

```rust
#[derive(Parser)]
#[command(name = "my-app", version, about = "Description")]
struct Cli {
    input: String,
    #[arg(short, long)]
    verbose: bool,
}
```

**Usage**: Derive `Parser` on the top-level struct. Use positional fields and `#[arg(short, long)]` for options.

## 2. Subcommand Enum

```rust
#[derive(Subcommand)]
enum Command {
    Start { #[arg(short, long)] daemon: bool },
    Stop,
    Status,
}
```

**Usage**: Each variant is a subcommand. Variant fields become the subcommand's arguments.

## 3. ValueEnum for Enums

```rust
#[derive(ValueEnum, Clone)]
enum Color { Red, Green, Blue }
// Usage: --color red | --color green | --color blue
```

**Usage**: Automatically parse string values into enum variants. Case-insensitive matching.

## 4. Default Values

```rust
#[arg(short, long, default_value_t = 8080)]
port: u16,

#[arg(short, long, default_value = "config.toml")]
config: String,
```

**Usage**: Provide default values for optional arguments. `default_value_t` for typed defaults.

## 5. Environment Variable Fallback

```rust
#[arg(short, long, env = "DATABASE_URL")]
database_url: String,
```

**Usage**: Read from environment variable if not provided on command line. CLI argument takes precedence.

## 6. Validation with Range

```rust
#[arg(short, long, value_parser = clap::value_parser!(u16).range(1..=65535))]
port: u16,
```

**Usage**: Restrict numeric values to a range. Invalid values produce clear error messages.

## 7. Argument Conflicts

```rust
#[arg(long, conflicts_with = "output")]
in_place: bool,

#[arg(short, long, conflicts_with = "in_place")]
output: Option<String>,
```

**Usage**: Mark arguments as mutually exclusive. Using both produces a clear error.

## 8. Required Argument Groups

```rust
#[arg(short, long, group = "mode")]
read: bool,

#[arg(short, long, group = "mode")]
write: bool,
```

**Usage**: Define groups with `group` attribute. Use `required = true` on the group in the `#[command()]` attribute.

## 9. Count Action for Verbosity

```rust
#[arg(short, long, action = clap::ArgAction::Count)]
verbose: u8,
// Usage: -v, -vv, -vvv
```

**Usage**: Count flag occurrences for verbosity levels without manual parsing.

## 10. Flatten Reusable Args

```rust
#[derive(Args)]
struct OutputArgs {
    #[arg(short, long)]
    output: Option<String>,
    #[arg(short, long)]
    format: Option<String>,
}

#[derive(Parser)]
struct Cli {
    #[command(flatten)]
    output: OutputArgs,
}
```

**Usage**: Reuse argument groups across multiple subcommands or parsers.

## 11. Shell Completions

```rust
fn gen_completions(shell: clap_complete::Shell) {
    let mut cmd = Cli::command();
    clap_complete::generate(shell, &mut cmd, "my-app", &mut std::io::stdout());
}
```

**Usage**: Generate shell completion scripts for bash, zsh, fish, PowerShell.

## 12. Custom Error on Parse Failure

```rust
fn main() {
    if let Err(e) = Cli::try_parse() {
        e.exit(); // prints error and exits with code
    }
}
```

**Usage**: Use `try_parse` instead of `parse` to handle errors gracefully if needed.

## 13. Hide Arguments from Help

```rust
#[arg(short, long, hide = true)]
internal_flag: bool,
```

**Usage**: Hide internal or deprecated arguments from help text display.

## 14. Long Help Text

```rust
#[derive(Parser)]
#[command(name = "tool", long_about = "A very long and detailed description\nof what this tool does")]
struct Cli {}
```

**Usage**: `long_about` provides extended help shown with `--help` (vs short `about` for `-h`).

## 15. Subcommand Required

```rust
#[derive(Parser)]
#[command(subcommand_required = true, arg_required_else_help = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}
```

**Usage**: Require a subcommand to be specified. Shows help if no subcommand is given.
