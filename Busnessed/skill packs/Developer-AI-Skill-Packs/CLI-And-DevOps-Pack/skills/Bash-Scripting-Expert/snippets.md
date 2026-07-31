# Bash-Scripting-Expert: Snippets

## 1. Strict Mode Header
```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```
**When to use**: Every bash script. Enables strict error handling, undefined variable detection, pipeline failure detection, and safe field separation.

## 2. Default Variable Value
```bash
VAR="${1:-default_value}"
```
**When to use**: Provide default values for unset or empty variables/parameters.

## 3. Check Command Exists
```bash
if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed" >&2
    exit 1
fi
```
**When to use**: Validate that required external tools are available before proceeding.

## 4. Read File Line by Line
```bash
while IFS= read -r line; do
    echo "Line: $line"
done < "file.txt"
```
**When to use**: Process a file line by line preserving leading/trailing whitespace. The `-r` flag prevents backslash interpretation.

## 5. Temporary File Creation
```bash
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT
```
**When to use**: Create a secure temporary directory that is automatically cleaned up when the script exits.

## 6. Array Iteration
```bash
files=("file1.txt" "file2.txt" "file3.txt")
for file in "${files[@]}"; do
    process "$file"
done
```
**When to use**: Iterate over an array of items, handling elements with spaces correctly.

## 7. Associative Array (Hash Map)
```bash
declare -A config=(
    ["host"]="localhost"
    ["port"]="8080"
    ["user"]="admin"
)
echo "${config[host]}"
```
**When to use**: Store key-value pairs when you need named data structures (bash 4+).

## 8. String Manipulation
```bash
str="hello_world_example"
echo "${str#*_}"    # Remove shortest prefix before _ → world_example
echo "${str##*_}"   # Remove longest prefix before _ → example
echo "${str%_*}"    # Remove shortest suffix after _ → hello_world
echo "${str%%_*}"   # Remove longest suffix after _ → hello
```
**When to use**: Extract substrings or remove prefixes/suffixes from strings.

## 9. Regular Expression Matching
```bash
if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "Valid email"
fi
```
**When to use**: Validate input format using regular expressions. No need to escape `/` in `[[ ]]` context.

## 10. Multi-line String (Here-Document)
```bash
cat <<EOF
Configuration:
  Host: $host
  Port: $port
  User: $user
EOF
```
**When to use**: Generate multi-line output with variable expansion. Use `<<'EOF'` to prevent expansion.

## 11. Error Message to Stderr
```bash
die() {
    echo "Error: $*" >&2
    exit 1
}
```
**When to use**: Standardized error reporting function that prints to stderr and exits with failure.

## 12. Check for Empty Directory
```bash
if [ -d "$dir" ] && [ -z "$(ls -A "$dir" 2>/dev/null)" ]; then
    echo "Directory is empty"
fi
```
**When to use**: Check whether a directory exists and is empty.

## 13. Background Process with PID Capture
```bash
long_running_task &
PID=$!
echo "Task started with PID $PID"
wait "$PID"
echo "Task completed with exit code $?"
```
**When to use**: Run tasks in background while tracking their PID for wait and status checking.

## 14. Safe eval Alternative
```bash
# Instead of: eval "echo \$$var_name"
echo "${!var_name}"
```
**When to use**: Indirect variable reference without using dangerous `eval`.

## 15. Portability: sed -i (Cross-Platform)
```bash
# macOS (BSD sed)
sed -i '' 's/old/new/g' file.txt
# Linux (GNU sed)
sed -i 's/old/new/g' file.txt
# Portable version
sed -i.bak 's/old/new/g' file.txt && rm file.txt.bak
```
**When to use**: Use sed in-place editing across macOS and Linux. The `.bak` approach works on both platforms.
