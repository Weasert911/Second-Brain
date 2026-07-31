---
name: "Clap-CLI-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Clap CLI expert skill for argument parsing, derive API, subcommands, validation, shell completions, and help customization."
purpose: "Provides comprehensive guidance on building command-line interfaces with Clap, including the derive API for declarative argument definition, subcommand hierarchies, input validation, shell completion generation, custom help formatting, and integration with error handling crates."
---

## Capabilities

1. Define CLI arguments using the derive API (Parser, Args, Subcommand, ValueEnum).
2. Build subcommand hierarchies with nested subcommands.
3. Handle positional arguments, named options, flags, and multiple values.
4. Validate input with value_parser, possible_values, range, and regex constraints.
5. Manage argument conflicts, required groups, and dependencies.
6. Set default values and environment variable fallbacks.
7. Generate shell completion scripts for bash, zsh, fish, PowerShell, and Elvish.
8. Customize help text, version output, and error formatting.
9. Integrate with anyhow and thiserror for clean error handling.
10. Use command groups for organizing large CLIs.
11. Implement custom from_arg_matches for complex argument parsing logic.
12. Migrate between Clap v3 and v4 patterns and understand key differences.

## Limitations

1. Cannot run CLI applications — provides design and code guidance only.
2. Does not cover the Builder API in depth (focus on Derive API).
3. Clap v4+ patterns only; v3 migration notes provided for reference.
4. Shell completion generation requires integration by the user.

## Required Tools

- clap crate with derive feature
- clap_complete for shell completions
- clap_mangen for man page generation

## Execution Workflow

1. Analyze the CLI requirements: commands, arguments, options, subcommands.
2. Design the CLI hierarchy: top-level parser, subcommands, nested subcommands.
3. Define argument types: positional, optional, flags, multiple values.
4. Set validation rules: allowed values, ranges, regex patterns.
5. Configure relationships: conflicts, requires, groups.
6. Add default values and environment variable fallbacks.
7. Customize help text, version, and usage strings.
8. Integrate with application error handling (anyhow/thiserror).
9. Generate shell completion scripts.
10. Test argument parsing with various inputs.
11. Write integration tests for CLI behavior.
12. Generate man pages and CLI documentation.

## Decision Tree

1. **Is the CLI simple (no subcommands)?**
   - YES → Single struct with Parser derive.
   - NO → Use enum with Subcommand derive.

2. **Are arguments positional or named?**
   - Positional → Use unnamed fields in struct.
   - Named → Use named options with short/long.

3. **Is validation needed?**
   - YES → Use value_parser with range, regex, or possible_values.
   - NO → Default parser handles basic types.

4. **Are arguments interdependent?**
   - YES → Use conflicts_with, requires, or groups.
   - NO → Independent arguments.

5. **Is environment variable fallback needed?**
   - YES → Add env attribute to arguments.
   - NO → Only command-line input.

6. **Are shell completions needed?**
   - YES → Use clap_complete for generation.
   - NO → Default tab completion is fine.

## Review Checklist

- [ ] All arguments have appropriate doc comments (used as help text).
- [ ] Subcommands have proper doc comments.
- [ ] Value types are correct (String, PathBuf, u64, etc.).
- [ ] Default values provided where sensible.
- [ ] Environment variable fallback configured for sensitive/config values.
- [ ] Validation rules complete (range, regex, allowed values).
- [ ] Conflicts and requires relationships defined.
- [ ] Subcommand hierarchy matches CLI design.
- [ ] after_help or long_about used for extended documentation.
- [ ] Color output configured (auto, always, never).
- [ ] Error handling converts clap errors to user-friendly messages.
- [ ] Shell completion generation integrated.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Unknown argument error | Argument not defined or typo | Check short/long names match |
| Required argument missing | `required = true` without default | Add default or make optional |
| Subcommand not recognized | Subcommand not added to enum | Add variant to Subcommand enum |
| value_parser fails | Type mismatch or validation error | Check input type and validation rules |
| Conflict error | Arguments marked as conflicting used together | Review conflicts_with settings |
| Help text garbled | Missing newlines in doc comments | Use \n or after_help for multi-line help |
| Completion script not working | Wrong shell or missing setup | Verify shell and sourcing instructions |
| Panic on parse error | Unwrap on parse result | Handle Error with exit or graceful error |

## Best Practices

1. Use derive API over builder API for cleaner code.
2. Document all arguments with doc comments (used as help text).
3. Prefer `value_parser!` over manual validation for common types.
4. Use `env` for configurable values (API keys, paths).
5. Add `long_about` for detailed subcommand help.
6. Use `subcommand_required(true)` for CLIs with mandatory subcommands.
7. Set `arg_required_else_help(true)` to show help when no args given.
8. Use `ColorChoice` for controlling colored output.
9. Group related arguments with `Args` derive for reuse.
10. Integrate with anyhow for `Result<T, anyhow::Error>` in main.

## Anti-Patterns

1. **Overly long argument lists**: More than 5-7 arguments per command.
2. **Inconsistent naming**: Mixing --kebab-case and --snake_case.
3. **Missing help text**: Arguments without doc comments.
4. **Silent failures**: Panicking on parse errors instead of graceful exit.
5. **No subcommand required check**: Running without a subcommand gives confusing error.
6. **Hardcoded paths**: Not using env fallback for configurable paths.
7. **Ignoring clap_complete**: Not providing shell completions.
8. **Deep subcommand nesting**: More than 2 levels of subcommands.

## References

Clap Docs: https://docs.rs/clap/latest/clap/
Clap Derive Guide: https://docs.rs/clap/latest/clap/_derive/index.html
Clap Builder Guide: https://docs.rs/clap/latest/clap/_builder/index.html
Clap v3 to v4 Migration: https://docs.rs/clap/latest/clap/_migration/index.html
Clap Complete: https://docs.rs/clap_complete/latest/clap_complete/
Clap Cookbook: https://docs.rs/clap/latest/clap/_cookbook/index.html
