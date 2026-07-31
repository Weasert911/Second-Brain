# Linux-Terminal-Expert: Examples

## Beginner: Find and Process Files
```bash
# Find all log files modified in the last 7 days
find /var/log -name "*.log" -mtime -7 -type f

# Search for error patterns in multiple files
grep -r "ERROR\|FATAL" /var/log/app/ --include="*.log"

# Count occurrences of each error type
grep -roh "ERROR\|FATAL\|WARN" /var/log/app/ | sort | uniq -c

# Compress old log files
find /var/log/app -name "*.log" -mtime +30 -exec gzip {} \;
```
**Explanation**: This pipeline finds log files by criteria, searches for error patterns, counts them by type, and compresses old logs. Each command can be used independently or chained.

## Intermediate: System Performance Investigation
```bash
# Top CPU-consuming processes
ps aux --sort=-%cpu | head -10

# Top memory-consuming processes
ps aux --sort=-%mem | head -10

# Real-time process view with htop
htop

# Disk I/O statistics
iostat -x 1 5

# Network connections per state
ss -tuln | awk '{print $1}' | sort | uniq -c

# Open file descriptors per process
lsof | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# System load average
uptime

# Memory usage summary
free -h
```
**Explanation**: Combine multiple monitoring commands to get a comprehensive view of system health. Use `ps aux` for process details, `ss` for network connections, `lsof` for file descriptors, and `free` for memory.

## Advanced: Log Analysis Pipeline
```bash
# Extract IP addresses from access log, count unique visitors
grep -oP '\d+\.\d+\.\d+\.\d+' /var/log/nginx/access.log | sort -u | wc -l

# Top 10 most requested URLs
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# HTTP status code distribution
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# Find requests with 5xx errors
awk '$9 ~ /^5[0-9][0-9]/' /var/log/nginx/access.log

# Bandwidth usage per IP
awk '{bytes[$1]+=$10} END {for (ip in bytes) print ip, bytes[ip]}' \
  /var/log/nginx/access.log | sort -k2 -rn | head -10

# Requests per hour
awk '{print substr($4,2,14)}' /var/log/nginx/access.log | \
  cut -d: -f1 | sort | uniq -c
```
**Explanation**: These awk-based patterns analyze web server logs for traffic patterns, errors, and bandwidth usage. Each one-liner provides specific operational insight from raw log data.

## Production: Automated Backup with Rsync
```bash
#!/bin/bash
set -euo pipefail

SOURCE="/data/app"
DEST="backup@backupserver:/backups/app"
SNAPSHOT="/snapshots/app/$(date +%Y%m%d-%H%M%S)"
LOGFILE="/var/log/backup.log"
RETENTION_DAYS=30

echo "[$(date)] Starting backup" >> "$LOGFILE"

# Create snapshot directory
mkdir -p "$SNAPSHOT"

# Rsync with hard links for incremental backup
rsync -avz --delete \
  --link-dest="$(ls -td /snapshots/app/*/ | head -1)" \
  -e "ssh -i /root/.ssh/backup_key -o StrictHostKeyChecking=no" \
  "$SOURCE" "$SNAPSHOT" >> "$LOGFILE" 2>&1

# Rsync to remote server
rsync -avz --delete \
  -e "ssh -i /root/.ssh/backup_key -o StrictHostKeyChecking=no" \
  "$SNAPSHOT/" "$DEST" >> "$LOGFILE" 2>&1

# Clean up old snapshots
find /snapshots/app -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;

echo "[$(date)] Backup completed" >> "$LOGFILE"
```
**Explanation**: This backup script uses rsync with hard-link snapshots for efficient incremental backups. The `--link-dest` flag creates incremental backups that appear as full copies. Remote sync ensures off-site backup. Old snapshots are automatically cleaned up.
