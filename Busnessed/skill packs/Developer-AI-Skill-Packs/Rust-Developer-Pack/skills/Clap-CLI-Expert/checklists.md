# Checklists — Clap-CLI-Expert

## Pre-Flight Checklist

- [ ] CLI command structure designed (subcommands, arguments, flags)
- [ ] Derive API chosen (Parser, Subcommand, Args, ValueEnum)
- [ ] Argument naming conventions established
- [ ] Validation requirements documented
- [ ] Environment variables planned for configurable values
- [ ] Shell completion targets identified
- [ ] Error handling strategy chosen (anyhow, custom types)
- [ ] Help text written for all arguments and subcommands

## Implementation Checklist

- [ ] Parser derive on main CLI struct
- [ ] Subcommand derive on command enum
- [ ] All arguments have short/long names (except positional)
- [ ] Default values provided where appropriate
- [ ] value_parser/validation configured for constrained inputs
- [ ] Conflicts and requires relationships defined
- [ ] Environment variable fallback configured
- [ ] Flat groups with Args derive
- [ ] Color output configured (auto/default)
- [ ] Long_about for detailed help
- [ ] arg_required_else_help for better UX
- [ ] Version from Cargo.toml with `version` attribute

## Testing Checklist

- [ ] Parse succeeds with valid arguments
- [ ] Parse fails with invalid arguments (expected errors)
- [ ] All subcommands parse correctly
- [ ] Default values applied when arguments omitted
- [ ] Environment variable fallback works
- [ ] Validation rules reject invalid input
- [ ] Conflicts prevent invalid combinations
- [ ] Help text displays correctly
- [ ] Version output correct
- [ ] Shell completions generate without errors

## Release Checklist

- [ ] Version matches Cargo.toml
- [ ] Help text reviewed for clarity
- [ ] Error messages user-friendly
- [ ] Completions generated for all supported shells
- [ ] Man page generated (clap_mangen)
- [ ] Binary size optimized (strip = true in release profile)
- [ ] License and copyright headers in help
- [ ] --help and --version work without errors
- [ ] Pipeline: parse -> validate -> execute
- [ ] CI tests include CLI parsing tests

## Maintenance Checklist

- [ ] Argument changes versioned (breaking changes documented)
- [ ] Deprecated arguments marked with `hide = true`
- [ ] Environment variable list documented
- [ ] Shell completions regenerated on changes
- [ ] Clap version checked for updates
- [ ] Documentation examples updated
- [ ] CLI UX reviewed (is it intuitive?)
- [ ] Tab completion tested in all target shells
