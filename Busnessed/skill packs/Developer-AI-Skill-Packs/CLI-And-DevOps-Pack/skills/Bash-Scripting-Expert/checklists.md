# Bash-Scripting-Expert: Checklists

## Pre-Flight Checklist
- [ ] Shebang line specifies correct interpreter
- [ ] Strict mode enabled: `set -euo pipefail`
- [ ] IFS set to `$'\n\t'` to prevent word splitting issues
- [ ] Script has executable permission (chmod +x)
- [ ] Shellcheck installed and run on script
- [ ] Script tested with `bash -n` for syntax errors
- [ ] All external commands available (which/command -v check)
- [ ] Input files/directories exist and are readable
- [ ] Output directories exist and are writable
- [ ] No hard-coded absolute paths (use variables with defaults)

## Implementation Checklist
- [ ] Functions are pure (no global variable mutation unless intended)
- [ ] Local variables declared with `local` keyword in functions
- [ ] Constants declared with `readonly` or `declare -r`
- [ ] All variables quoted to prevent word splitting
- [ ] Arrays iterated with `"${arr[@]}"` syntax
- [ ] Error messages go to stderr with `>&2`
- [ ] Command substitutions use `$()` not backticks
- [ ] Temporary files use `mktemp` and are cleaned in trap
- [ ] Trap handlers cover EXIT, ERR, SIGINT, SIGTERM
- [ ] Conditionals use `[[ ]]` instead of `[ ]`
- [ ] Arguments validated before use
- [ ] Help flag (`--help` or `-h`) implemented

## Testing Checklist
- [ ] Script runs with no arguments (default behavior)
- [ ] Script handles invalid arguments gracefully
- [ ] Script handles missing files/directories gracefully
- [ ] All error conditions produce meaningful error messages
- [ ] exit codes are correct (0 success, non-zero failure)
- [ ] set -x output shows expected execution flow
- [ ] Edge cases tested: empty strings, files with spaces, special characters
- [ ] Pipeline failures detected (set -o pipefail)
- [ ] Trap cleanup executes on normal exit and signal
- [ ] Shellcheck produces zero warnings for the target bash version
- [ ] Performance tested on expected data sizes
- [ ] Race conditions considered for concurrent access

## Release Checklist
- [ ] Script version bumped following semver
- [ ] CHANGELOG entry written for changes
- [ ] Usage/help text is accurate and complete
- [ ] README or man page updated
- [ ] Script added to PATH if intended for general use
- [ ] CI pipeline includes shellcheck and bash -n validation
- [ ] Tests automated and passing
- [ ] Dependencies documented in comments
- [ ] No debugging output left in code
- [ ] Backward compatibility considered

## Maintenance Checklist
- [ ] Dependencies checked for deprecation/availability
- [ ] Shellcheck version updated and script re-checked
- [ ] Tests pass after bash version updates
- [ ] Logging reviewed for PII/sensitive data exposure
- [ ] Error messages reviewed for clarity and actionability
- [ ] Performance profiling done on large inputs
- [ ] Portability tested on target platforms
- [ ] Security audit for injection vulnerabilities (eval, $(), backticks)
