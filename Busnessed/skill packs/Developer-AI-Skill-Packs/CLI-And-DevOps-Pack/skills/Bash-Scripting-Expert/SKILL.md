---
name: Bash-Scripting-Expert
version: 1.0.0
domain: Shell Scripting
activation_description: Activate when writing or debugging bash shell scripts for automation
purpose: Master bash scripting including strict mode, control structures, error handling, and portable scripting
---

# Bash-Scripting-Expert

## Capabilities
- Implement strict mode with `set -euo pipefail` for robust scripts
- Manipulate variables with advanced parameter expansion (##, %%, :-, :=, :+, :?)
- Work with indexed and associative arrays for data structures
- Use control structures (if, for, while, until, case) effectively
- Define functions with proper scoping and return values
- Implement error handling with trap (EXIT, ERR, SIGINT, SIGTERM)
- Master input/output redirection and process substitution
- Use here-documents and here-strings for inline data
- Apply regular expressions with `=~` operator in conditions
- Parse command-line arguments with getopts and shift
- Debug scripts with set -x, set -v, and bash -n syntax checking
- Write portable scripts compatible with multiple bash versions

## Limitations
- Cannot handle floating-point arithmetic without external tools (bc)
- Cannot handle complex data structures like objects or hash maps efficiently
- Cannot run on systems without bash installed (use sh for POSIX compliance)
- Cannot handle binary data reliably in all contexts
- Cannot provide built-in unit testing framework
- Cannot guarantee identical behavior across different bash versions

## Required Tools
- Bash 4.0+ (for associative arrays and advanced features)
- ShellCheck (for static analysis and linting)
- Core utilities (grep, sed, awk, find, xargs)
- Git (for version control of scripts)

## Execution Workflow

1. Define script purpose, inputs, outputs, and error conditions
2. Set strict mode: `#!/bin/bash` followed by `set -euo pipefail`
3. Declare constants and configuration at the top of the script
4. Define helper functions before main execution logic
5. Parse command-line arguments with getopts or manual shift loop
6. Validate inputs (file existence, permissions, data format)
7. Execute main logic with error handling at each step
8. Use trap to clean up temporary files on exit
9. Provide user feedback with meaningful error messages
10. Log operations to stdout/stderr with appropriate verbosity
11. Return appropriate exit codes (0 for success, non-zero for errors)
12. Test with ShellCheck and run with bash -n for syntax validation
13. Debug with set -x when needed, ensuring output is clean
14. Document usage with --help flag and inline comments

## Decision Tree

```
What type of script?
├── One-time task → Simple script, minimal error handling
├── Automated/cron → Strict mode, logging, trap cleanup
└── Shared with team → Full argument parsing, documentation, ShellCheck

How to handle errors?
├── Continue on error → set +e; check exit codes manually
├── Stop on first error → set -e (with caveats)
├── Stop on any error in pipe → set -o pipefail
└── Always clean up → trap 'cleanup' EXIT

How to parse arguments?
├── Simple flags → $1, $2 positional with defaults
├── Named flags → getopts for -a -b --long flags
└── Complex CLI → Use argparse or external tool

Need structured data?
├── Key-value pairs → Associative arrays (declare -A)
├── Lists → Indexed arrays
├── Simple strings → Variables
└── Multi-line → Here-documents

Need portability?
├── Linux only → Bash-specific features ([[, arrays)
├── Cross-platform → POSIX sh subset
└── macOS/Linux → Test with both bash versions
```

## Review Checklist
- [ ] Shebang line specifies correct interpreter (`#!/bin/bash` or `#!/usr/bin/env bash`)
- [ ] Strict mode enabled: `set -euo pipefail`
- [ ] All variables quoted to prevent word splitting
- [ ] Exit codes checked for critical commands
- [ ] Temporary files cleaned up in trap
- [ ] Input validation performed before processing
- [ ] No uninitialized variables used (`${var:-default}` pattern)
- [ ] Functions are pure (no global side effects unless intentional)
- [ ] Script passes ShellCheck with no warnings
- [ ] --help flag implemented with usage documentation
- [ ] Portability considered for target environments
- [ ] No hard-coded paths (use variables with defaults)
- [ ] Error messages go to stderr (`echo "Error" >&2`)
- [ ] set -x not left in production scripts

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| set -e exits unexpectedly | Command returns non-zero in condition | Use `|| true` after expected failures |
| Variable empty/undefined | Not set before use | Use `${var:-default}` pattern |
| Word splitting issues | Unquoted variable containing spaces | Always quote variables: `"$var"` |
| Array iteration fails | Wrong syntax for arrays | Use `for i in "${arr[@]}"` not `for i in $arr` |
| Function returns wrong value | return vs echo confusion | Use `return` for exit codes, `echo` for output |
| sed -i fails on macOS | BSD vs GNU sed differences | Use `sed -i ''` on BSD; install gsed |
| getopts not working | Options consumed before shift | Call getopts in while loop, then shift remaining |
| Glob doesn't match files | nullglob not set | Set `shopt -s nullglob` before glob operations |
| trap not firing | Script killed with SIGKILL | trap cannot catch SIGKILL; use SIGTERM instead |
| Here-doc variable not expanding | Quotes around delimiter | Use `<<EOF` (expands) vs `<<'EOF'` (literal) |

## Best Practices
- Use `#!/usr/bin/env bash` for portability of interpreter path
- Quote all variable expansions: `"$var"`, `"${arr[@]}"`
- Use `[[ ]]` instead of `[ ]` for more features and fewer bugs
- Prefer `printf` over `echo` for reliable formatting
- Name functions with verbs: `validate_input()`, `process_file()`
- Keep functions small and single-purpose
- Use local variables in functions with `local` keyword
- Use `readonly` or `declare -r` for constants
- Check return codes explicitly with `if command; then`
- Use `trap 'cmd' EXIT` for guaranteed cleanup
- Separate code into source-able library files for reuse
- Use `shellcheck` as part of CI pipeline
- Version control all scripts with descriptive commit messages

## Anti-Patterns
- Using `eval` on user input (command injection risk)
- Parsing `ls` output instead of using globs
- Using `cat file | command` instead of `command < file`
- Using backticks for command substitution instead of `$(...)`
- Not quoting variables (leads to unexpected word splitting)
- Using `exit 1` without an error message on stderr
- Hard-coding sensitive data (passwords, keys) in scripts
- Using `chmod 777` for script permissions
- Having unreachable code after `exit` or `return`
- Using `for file in $(find ...)` instead of `find ... -exec` or `while read`
- Mixing tabs and spaces for indentation in heredocs
- Assuming script runs from a specific working directory

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
