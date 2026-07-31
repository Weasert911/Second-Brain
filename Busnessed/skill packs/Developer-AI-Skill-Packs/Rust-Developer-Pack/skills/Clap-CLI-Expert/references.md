# References — Clap-CLI-Expert

## Official Documentation

- [Clap API Docs](https://docs.rs/clap/latest/clap/) — full API reference
- [Clap Derive Guide](https://docs.rs/clap/latest/clap/_derive/index.html) — derive attribute reference
- [Clap Builder Guide](https://docs.rs/clap/latest/clap/_builder/index.html) — builder API reference
- [Clap v3 to v4 Migration](https://docs.rs/clap/latest/clap/_migration/index.html) — upgrade guide
- [Clap Complete](https://docs.rs/clap_complete/latest/clap_complete/) — shell completions
- [Clap Cookbook](https://docs.rs/clap/latest/clap/_cookbook/index.html) — example patterns
- [Clap Man](https://docs.rs/clap_mangen/latest/clap_mangen/) — man page generation

## Key Terms

1. **Parser**: The main derive trait for the top-level CLI struct.
2. **Args**: A derive trait for a group of arguments that can be flattened.
3. **Subcommand**: A derive trait for enum-based subcommand definition.
4. **ValueEnum**: A derive trait for string-to-enum argument parsing.
5. **Positional Argument**: An argument identified by position, not name.
6. **Named Argument**: An argument identified by --name or -n.
7. **Flag**: A boolean argument (present or not).
8. **Option**: An argument that takes a value (--name value).
9. **value_parser**: Defines how argument values are parsed and validated.
10. **Completions**: Shell tab-completion scripts.
11. **Subcommand**: A nested command within the CLI.
12. **Conflict**: Two arguments that cannot be used together.
13. **Requires**: An argument that requires another to be present.
14. **Group**: A set of arguments where one is required.
15. **Env Fallback**: Reading argument values from environment variables.

## Architecture Notes

Clap's derive API uses proc macros to generate a Command definition from struct/enum annotations. The generated code calls the builder API internally. Arguments are processed in order: positional args first, then named options. The `value_parser` system converts raw strings to typed values with validation. Subcommands are represented as an enum where each variant is a separate command.

## Key APIs

- `#[derive(Parser)] #[command(name = "...", version, about, long_about)]`
- `#[arg(short, long, default_value = "...", value_parser = ..., conflicts_with = "...")]`
- `#[command(subcommand)]` on Parser and `#[derive(Subcommand)]` on enum
- `#[command(flatten)]` for reusing argument groups
- `#[derive(ValueEnum)]` for enum arguments
- `clap::Error`, `clap::error::ErrorKind` — error types
- `clap_complete::{Generator, generate}` — shell completions
- `clap::builder::StyledStr` — colored help text

## Conventions

- CLI names: kebab-case (e.g., `my-tool`)
- Short flags: single letter when possible (-v, -o, -f)
- Long flags: kebab-case (--output-file, --verbose)
- Subcommands: lowercase verbs (build, run, test, clean)
- Environment variables: SCREAMING_SNAKE_CASE with tool prefix (MY_TOOL_CONFIG)
- Doc comments on struct fields become help text

## Project Structure

```
cli_app/
├── Cargo.toml
├── src/
│   ├── main.rs            # entry point, parse and run
│   ├── cli.rs             # CLI definition (derive structs)
│   ├── commands/
│   │   ├── mod.rs
│   │   ├── build.rs       # build command implementation
│   │   ├── run.rs         # run command implementation
│   │   └── config.rs      # config command implementation
│   └── completions.rs     # shell completion generation
├── tests/
│   └── cli_tests.rs       # argument parsing tests
└── completions/            # generated completion scripts
    ├── my-tool.bash
    ├── my-tool.zsh
    └── my-tool.fish
```
