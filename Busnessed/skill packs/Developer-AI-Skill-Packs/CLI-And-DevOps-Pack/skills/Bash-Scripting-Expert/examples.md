# Bash-Scripting-Expert: Examples

## Beginner: Simple Backup Script
```bash
#!/bin/bash
set -euo pipefail

SOURCE_DIR="${1:-./data}"
BACKUP_DIR="${2:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory $SOURCE_DIR does not exist" >&2
    exit 1
fi

tar -czf "$BACKUP_FILE" "$SOURCE_DIR"
echo "Backup created: $BACKUP_FILE"
```
**Explanation**: This script demonstrates strict mode, positional parameters with defaults, input validation, error handling with meaningful messages, and basic archive creation. Run as `./backup.sh /path/to/source /path/to/backups`.

## Intermediate: File Renamer with Dry-Run
```bash
#!/bin/bash
set -euo pipefail

DRY_RUN=false
PATTERN=""
REPLACEMENT=""

usage() {
    cat <<EOF
Usage: $0 -p PATTERN -r REPLACEMENT [-d] DIRECTORY
Rename files matching PATTERN to REPLACEMENT in DIRECTORY.
  -p PATTERN     Search pattern (sed regex)
  -r REPLACEMENT Replacement string (sed format)
  -d             Dry run (show changes without renaming)
  -h             Show this help
EOF
    exit 0
}

while getopts "p:r:dh" opt; do
    case $opt in
        p) PATTERN="$OPTARG" ;;
        r) REPLACEMENT="$OPTARG" ;;
        d) DRY_RUN=true ;;
        h) usage ;;
        *) usage ;;
    esac
done
shift $((OPTIND-1))

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: $TARGET_DIR is not a directory" >&2
    exit 1
fi

shopt -s nullglob
for file in "$TARGET_DIR"/*; do
    basename=$(basename "$file")
    newname=$(echo "$basename" | sed "s/$PATTERN/$REPLACEMENT/")
    if [ "$basename" != "$newname" ]; then
        if [ "$DRY_RUN" = true ]; then
            echo "[DRY RUN] $basename -> $newname"
        else
            mv "$file" "$(dirname "$file")/$newname"
            echo "Renamed: $basename -> $newname"
        fi
    fi
done
```
**Explanation**: This script uses getopts for argument parsing, dry-run capability for safety, nullglob to handle no matches, and sed for pattern-based renaming. Demonstrates functions, here-docs, arrays (implicitly), and proper usage documentation.

## Advanced: Log Rotator with Compression and Retention
```bash
#!/bin/bash
set -euo pipefail

LOG_DIR="${1:-/var/log/app}"
RETENTION_DAYS="${2:-30}"
MAX_SIZE_MB="${3:-100}"
LOG_PATTERN="*.log"

trap 'echo "[$(date)] Script interrupted" | logger -t log-rotator; exit 1' SIGINT SIGTERM

usage() {
    cat >&2 <<EOF
Usage: $0 [LOG_DIR] [RETENTION_DAYS] [MAX_SIZE_MB]
  LOG_DIR        Directory containing log files (default: /var/log/app)
  RETENTION_DAYS Days to retain compressed logs (default: 30)
  MAX_SIZE_MB    Max size before rotation in MB (default: 100)
EOF
    exit 1
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a /var/log/log-rotator.log
}

rotate_file() {
    local file="$1"
    local dir
    dir=$(dirname "$file")
    local base
    base=$(basename "$file")
    local timestamp
    timestamp=$(date '+%Y%m%d-%H%M%S')

    if ! gzip -c "$file" > "$dir/$base.$timestamp.gz"; then
        log "ERROR: Failed to compress $file"
        return 1
    fi

    : > "$file"
    log "Rotated: $file -> $base.$timestamp.gz"
}

cleanup_old() {
    find "$LOG_DIR" -name "*.gz" -type f -mtime +"$RETENTION_DAYS" -delete
    log "Cleaned up files older than $RETENTION_DAYS days"
}

main() {
    if [ ! -d "$LOG_DIR" ]; then
        log "ERROR: Directory $LOG_DIR does not exist"
        exit 1
    fi

    shopt -s nullglob
    local files=("$LOG_DIR"/$LOG_PATTERN)

    if [ ${#files[@]} -eq 0 ]; then
        log "No log files found in $LOG_DIR"
        exit 0
    fi

    local threshold=$((MAX_SIZE_MB * 1024 * 1024))

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            local size
            size=$(stat -f%z "$file" 2>/dev/null || stat --format=%s "$file" 2>/dev/null)
            if [ "$size" -gt "$threshold" ]; then
                rotate_file "$file" || true
            fi
        fi
    done

    cleanup_old
    log "Rotation complete"
}

main
```
**Explanation**: Production-quality script with trap handlers, logging function, file rotation with gzip compression, size-based threshold checking, retention-based cleanup, and cross-platform stat commands. Suitable for cron execution.

## Production: CI Pipeline Script with Artifacts
```bash
#!/bin/bash
set -euo pipefail

source "$(dirname "$0")/lib/ci-common.sh"

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACTS_DIR="$PROJECT_DIR/artifacts"
BUILD_ID="${BUILD_ID:-$(date +%s)}"
REPORT_FILE="$ARTIFACTS_DIR/build-report-$BUILD_ID.json"

trap cleanup_and_notify EXIT

cleanup_and_notify() {
    local exit_code=$?
    if [ "$exit_code" -ne 0 ]; then
        notify_slack "Build FAILED (exit code: $exit_code)"
    fi
    rm -rf "$TEMP_DIR"
}

validate_env() {
    local required_vars=("GITHUB_TOKEN" "DOCKER_REGISTRY" "DEPLOY_KEY")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            echo "FATAL: $var is not set" >&2
            exit 1
        fi
    done
}

lint_project() {
    log "Running linters..."
    npm run lint || return 1
    shellcheck scripts/*.sh || return 1
}

run_tests() {
    log "Running tests..."
    npm run test:ci || return 1
    npm run test:coverage || return 1
}

build_project() {
    log "Building project..."
    local version
    version=$(get_version)
    docker build \
        --build-arg VERSION="$version" \
        --build-arg BUILD_ID="$BUILD_ID" \
        -t "$DOCKER_REGISTRY/app:$version" \
        -t "$DOCKER_REGISTRY/app:latest" .
    docker push "$DOCKER_REGISTRY/app:$version"
    docker push "$DOCKER_REGISTRY/app:latest"
}

main() {
    validate_env
    mkdir -p "$ARTIFACTS_DIR"
    TEMP_DIR=$(mktemp -d)

    lint_project
    run_tests
    build_project

    generate_report > "$REPORT_FILE"
    notify_slack "Build SUCCESS: $(get_version)"
}

main "$@"
```
**Explanation**: Enterprise-grade CI pipeline script with environment validation, cleanup traps, modular functions, artifact generation, Slack notifications, and Docker build/push. Sources shared library for common functions. Suitable for Jenkins, GitLab CI, or custom runners.
