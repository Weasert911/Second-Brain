# Bash-Scripting-Expert: References

## Official Documentation Summaries
- **GNU Bash Manual** – Complete reference for all bash features
- **Bash Hackers Wiki** – Community-maintained wiki with examples
- **ShellCheck Wiki** – Static analysis rules and explanations
- **Google Shell Style Guide** – Industry standard for shell script style
- **Advanced Bash-Scripting Guide** – In-depth tutorials and examples

## Glossary (15+ Terms)
- **Shebang** – `#!` line at start of script indicating interpreter
- **Strict mode** – `set -euo pipefail` for robust error handling
- **Parameter expansion** – `${var}` with modifiers for manipulation
- **Word splitting** – Shell splits unquoted variables by IFS characters
- **Globbing** – Pattern matching for filenames (*, ?, [])
- **Command substitution** – `$(command)` captures output into variable
- **Process substitution** – `<()` and `>()` for FIFO-based I/O
- **Here-document** – `<<EOF ... EOF` inline input redirection
- **Here-string** – `<<< "string"` single-line input redirection
- **Exit code** – Numeric value returned by command (0=success)
- **Trap** – Catch signals and execute handler function
- **getopts** – Built-in command for parsing command-line options
- **Associative array** – `declare -A` hash map (bash 4+)
- **Nullglob** – `shopt -s nullglob` prevents literal glob when no matches
- **IFS** – Internal Field Separator controlling word splitting

## Architecture Notes
- Bash scripts are interpreted line by line
- Subshells `()` create child processes with isolated environments
- Exporting variables makes them available to child processes
- Functions run in the current shell (no subshell by default)
- Source (`source file` or `. file`) executes in current shell context

## Key Commands / APIs
- `set -euo pipefail` – Enable strict mode
- `shopt -s extglob/nullglob/failglob` – Shell options
- `declare/typeset/local/readonly` – Variable attributes
- `trap 'handler' SIGNAL` – Signal handling
- `getopts 'ab:c:' opt` – Option parsing
- `[[ expression ]]` – Conditional evaluation
- `(( arithmetic ))` – Integer arithmetic evaluation
- `exec {var}>file` – File descriptor manipulation

## Conventions
- Shebang: `#!/usr/bin/env bash` (portable) or `#!/bin/bash`
- Constants: `readonly VAR` or `declare -r VAR`
- Functions: `function_name() { ... }`
- Variables: `lower_snake_case` for locals, `UPPER_SNAKE_CASE` for globals/constants
- Error messages to stderr: `echo "Error: message" >&2`

## Structure Recommendations
```
script.sh
├── Header (shebang + strict mode)
├── Constants (readonly variables)
├── Library includes (source files)
├── Helper functions
├── Argument parsing (getopts)
├── Validation
├── Main execution
└── Cleanup (trap)
```

## Keyboard Shortcuts
- `Ctrl+A` – Beginning of line
- `Ctrl+E` – End of line
- `Ctrl+U` – Delete to beginning
- `Ctrl+K` – Delete to end
- `Ctrl+W` – Delete word backward
- `Ctrl+Y` – Paste deleted text
- `Ctrl+L` – Clear screen
- `Ctrl+R` – Reverse search history
- `Ctrl+X Ctrl+E` – Edit command in editor
- `Alt+.` – Insert last argument from previous command
