# Bash-Scripting-Expert: Templates

## 1. Script Template with Strict Mode
```
Name: strict-script-template
Description: Standard bash script template with strict mode and error handling
Template:
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly VERSION="{{VERSION}}"

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS] {{ARGUMENTS}}
{{DESCRIPTION}}
Options:
  -h    Show this help message
EOF
    exit 0
}

cleanup() {
    local exit_code=$?
    {{CLEANUP_COMMANDS}}
    exit "$exit_code"
}
trap cleanup EXIT SIGINT SIGTERM

main() {
    {{MAIN_LOGIC}}
}

main "$@"
Usage Notes: Replace VERSION, ARGUMENTS, DESCRIPTION, CLEANUP_COMMANDS, and MAIN_LOGIC. Use cleanup() for temp files.
```

## 2. Argument Parser Template
```
Name: argument-parser
Description: Command-line argument parser using getopts
Template:
#!/usr/bin/env bash
set -euo pipefail

VERBOSE=false
OUTPUT_DIR=""
CONFIG_FILE="{{DEFAULT_CONFIG}}"

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS] {{REQUIRED_ARG}}
Options:
  -o DIR    Output directory (default: current dir)
  -c FILE   Configuration file (default: {{DEFAULT_CONFIG}})
  -v        Verbose output
  -h        Show this help
EOF
    exit 0
}

while getopts "o:c:vh" opt; do
    case $opt in
        o) OUTPUT_DIR="$OPTARG" ;;
        c) CONFIG_FILE="$OPTARG" ;;
        v) VERBOSE=true ;;
        h) usage ;;
        *) usage ;;
    esac
done
shift $((OPTIND-1))

{{REQUIRED_ARG}}="${1:-}"
if [ -z "${{REQUIRED_ARG}}" ]; then
    echo "Error: {{REQUIRED_ARG}} is required" >&2
    usage
fi
Usage Notes: Required arguments are positional after options. Use `:` after option character if it requires a value.
```

## 3. Logging Library Template
```
Name: logging-library
Description: Reusable logging functions with levels and colors
Template:
#!/usr/bin/env bash

readonly LOG_LEVEL="${LOG_LEVEL:-INFO}"
readonly NO_COLOR="${NO_COLOR:-false}"

if [ "$NO_COLOR" = false ]; then
    readonly RED='\033[0;31m'
    readonly GREEN='\033[0;32m'
    readonly YELLOW='\033[1;33m'
    readonly BLUE='\033[0;34m'
    readonly NC='\033[0m'
else
    readonly RED='' GREEN='' YELLOW='' BLUE='' NC=''
fi

log_debug() { if [[ "DEBUG" =~ ^($LOG_LEVEL) ]]; then echo -e "${BLUE}[DEBUG]${NC} $*" >&2; fi; }
log_info()  { if [[ "INFO DEBUG" =~ ^($LOG_LEVEL) ]]; then echo -e "${GREEN}[INFO]${NC} $*"; fi; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

export -f log_debug log_info log_warn log_error
Usage Notes: Source this file in other scripts: `source logging.sh`. Set LOG_LEVEL=DEBUG for verbose output.
```

## 4. Configuration File Loader
```
Name: config-loader
Description: Load configuration from key=value file
Template:
#!/usr/bin/env bash

load_config() {
    local config_file="$1"
    if [ ! -f "$config_file" ]; then
        log_error "Config file not found: $config_file"
        return 1
    fi

    local line_num=0
    while IFS='=' read -r key value; do
        line_num=$((line_num + 1))
        key="$(echo "$key" | tr -d '[:space:]')"

        [[ -z "$key" ]] && continue
        [[ "$key" =~ ^# ]] && continue

        if [ -z "$value" ]; then
            log_warn "Empty value for $key in $config_file:$line_num"
            continue
        fi

        printf -v "$key" "%s" "$value"
        readonly "$key"
    done < "$config_file"
}

{{REQUIRED_VARS}}=""
for var in DATABASE_URL API_KEY LOG_LEVEL; do
    if [ -z "${!var:-}" ]; then
        log_error "Missing required config: $var"
        REQUIRED_VARS+=" $var"
    fi
done

if [ -n "$REQUIRED_VARS" ]; then
    exit 1
fi
Usage Notes: Config file format: KEY=VALUE per line, # for comments, blank lines skipped. Variables are set as readonly after loading.
```

## 5. Error Handler with Stack Trace
```
Name: error-handler
Description: Trap errors and print stack trace for debugging
Template:
#!/usr/bin/env bash
set -euo pipefail

error_handler() {
    local line_no=$1
    local command=$2
    local exit_code=$3
    echo "Error on line $line_no: '$command' exited with code $exit_code" >&2
    echo "Stack trace:" >&2
    local i=0
    while caller $i; do
        i=$((i+1))
    done | awk '{printf "  %s() at %s:%d\n", $2, $3, $1}' >&2
}

trap 'error_handler ${LINENO} "$BASH_COMMAND" $?' ERR
Usage Notes: Place at the top of scripts after strict mode. Prints file, line number, function name, and command that failed.
```

## 6. Cross-Platform Detection Template
```
Name: platform-detection
Description: Detect OS and architecture for cross-platform scripts
Template:
#!/usr/bin/env bash

detect_platform() {
    local os arch
    case "$(uname -s)" in
        Linux*)  os="linux" ;;
        Darwin*) os="macos" ;;
        CYGWIN*|MINGW*|MSYS*) os="windows" ;;
        *)       os="unknown" ;;
    esac

    case "$(uname -m)" in
        x86_64|amd64) arch="x64" ;;
        aarch64|arm64) arch="arm64" ;;
        i686|i386)     arch="x86" ;;
        *)             arch="unknown" ;;
    esac

    echo "${os}_${arch}"
}

PLATFORM=$(detect_platform)
case "$PLATFORM" in
    linux_x64)   {{LINUX_CMD}} ;;
    macos_x64)   {{MACOS_CMD}} ;;
    windows_x64) {{WINDOWS_CMD}} ;;
    *) echo "Unsupported platform: $PLATFORM" >&2; exit 1 ;;
esac
Usage Notes: Use for scripts that need platform-specific commands (sed -i, md5 vs md5sum, etc.).
```

## 7. Temporary File Management
```
Name: temp-file-manager
Description: Create and automatically clean up temporary files
Template:
#!/usr/bin/env bash
set -euo pipefail

readonly TEMP_FILES=()

cleanup_temp() {
    if [ ${#TEMP_FILES[@]} -gt 0 ]; then
        rm -rf "${TEMP_FILES[@]}"
        log_debug "Cleaned up ${#TEMP_FILES[@]} temp files"
    fi
}
trap cleanup_temp EXIT

create_temp() {
    local prefix="${1:-tmp}"
    local temp_file
    temp_file=$(mktemp -t "${prefix}_XXXXXX")
    TEMP_FILES+=("$temp_file")
    echo "$temp_file"
}

temp_dir=$(mktemp -d)
TEMP_FILES+=("$temp_dir")

# Use temp files
data_file=$(create_temp "data")
echo "{{DATA}}" > "$data_file"
process_data "$data_file"
Usage Notes: All temp files are tracked in array and cleaned on script exit. Use mktemp for secure temporary file creation.
```

## 8. Progress Bar / Spinner
```
Name: progress-spinner
Description: Simple spinner for long-running operations
Template:
#!/usr/bin/env bash

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while ps -p "$pid" > /dev/null 2>&1; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

long_running_task &
spinner $!
wait
echo "Task completed!"
Usage Notes: Call spinner $! after backgrounding a task. Shows animated spinner while process runs.
