# Linux-Terminal-Expert: Templates

## 1. System Health Check Script
```
Name: system-health-check
Description: Comprehensive system health report
Template:
#!/bin/bash
echo "=== System Health Report ==="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"
echo "CPU: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4 "%"}')"
echo "Processes: $(ps aux | wc -l)"
echo "Network: $(ip -4 addr show | grep inet | awk '{print $2}' | tr '\n' ' ')"
echo "Last boot: $(who -b | awk '{print $3, $4}')"
Usage Notes: Run with cron for periodic monitoring. Extend with disk per-partition, network I/O, and service status checks.
```

## 2. File Watcher with inotify
```
Name: file-watcher
Description: Monitor directory for changes using inotify
Template:
inotifywait -m -r {{DIRECTORY}} -e {{EVENTS}} --format '%w%f %e' |
while read file event; do
    echo "[$(date)] $event: $file" >> {{LOGFILE}}
done
Usage Notes: Events: modify, create, delete, move, access. Use -r for recursive. Install inotify-tools package first.
```

## 3. Bulk File Processor
```
Name: bulk-file-processor
Description: Process multiple files with pattern matching
Template:
#!/bin/bash
shopt -s nullglob
FILES=({{PATH_PATTERN}})
for file in "${FILES[@]}"; do
    {{PROCESS_COMMAND}} "$file"
done
echo "Processed ${#FILES[@]} files"
Usage Notes: Use nullglob to avoid literal * when no files match. Quote $file to handle spaces.
```

## 4. Service Monitoring Script
```
Name: service-monitor
Description: Monitor service status and restart if down
Template:
#!/bin/bash
SERVICE="{{SERVICE_NAME}}"
if ! systemctl is-active --quiet "$SERVICE"; then
    echo "[$(date)] $SERVICE is down. Attempting restart..."
    systemctl restart "$SERVICE"
    sleep 5
    if systemctl is-active --quiet "$SERVICE"; then
        echo "[$(date)] $SERVICE restarted successfully"
        {{NOTIFY_COMMAND}} "$SERVICE restarted"
    else
        echo "[$(date)] Failed to restart $SERVICE"
        {{NOTIFY_COMMAND}} "FAILED to restart $SERVICE"
    fi
fi
Usage Notes: Run via cron every 5 minutes. Replace NOTIFY_COMMAND with mail, Slack webhook, or logging.
```

## 5. Log Watcher with Alerting
```
Name: log-watcher
Description: Watch log file for specific patterns and trigger alerts
Template:
tail -F {{LOGFILE}} | while read line; do
    if echo "$line" | grep -qE '{{ERROR_PATTERN}}'; then
        echo "[$(date)] ALERT: $line" >> {{ALERT_LOG}}
        {{NOTIFY_COMMAND}} "Alert: $line"
    fi
done
Usage Notes: Run in tmux/screen for persistence. Use -F to follow by filename (handles rotation). Adjust grep pattern for specific error strings.
```

## 6. Network Troubleshooting Toolkit
```
Name: network-troubleshoot
Description: Gather network diagnostics for troubleshooting
Template:
#!/bin/bash
echo "=== Network Diagnostics ==="
echo "--- Interface Configuration ---"
ip addr show
echo "--- Routing Table ---"
ip route show
echo "--- DNS Configuration ---"
cat /etc/resolv.conf
echo "--- Listening Ports ---"
ss -tuln
echo "--- Active Connections ---"
ss -tun | tail -20
echo "--- Traceroute to Target ---"
traceroute {{TARGET}} 2>/dev/null || echo "traceroute not available"
echo "--- Connectivity Test ---"
ping -c 4 {{TARGET}}
Usage Notes: Redirect output to file for support tickets. Replace TARGET with destination host or IP.
```

## 7. Package Audit Script
```
Name: package-audit
Description: List installed packages for audit/compliance
Template:
#!/bin/bash
echo "=== Package Audit ==="
echo "OS: $(cat /etc/os-release | head -1)"
echo "Kernel: $(uname -r)"
echo ""
echo "--- Installed Packages ---"
{{PKG_MANAGER}} list --installed 2>/dev/null | sort > {{OUTPUT_FILE}}
echo "Package list saved to {{OUTPUT_FILE}}"
echo "Total packages: $(wc -l < {{OUTPUT_FILE}})"
Usage Notes: Set PKG_MANAGER to apt, dnf, pacman, or rpm based on distribution. Use for compliance audits or migration planning.
```

## 8. Automated Cleanup Script
```
Name: auto-cleanup
Description: Remove old files, temp data, and unused packages
Template:
#!/bin/bash
set -euo pipefail
echo "[$(date)] Starting cleanup..."

# Clean temp directories
find /tmp -type f -atime +{{DAYS}} -delete 2>/dev/null
find /var/tmp -type f -atime +{{DAYS}} -delete 2>/dev/null

# Clean old logs
find /var/log -name "*.log.*" -type f -mtime +{{DAYS}} -delete 2>/dev/null
find /var/log -name "*.gz" -type f -mtime +{{DAYS}} -delete 2>/dev/null

# Clean package cache
{{PKG_CLEAN_COMMAND}}

# Clean journal logs older than retention
journalctl --vacuum-time={{RETENTION}} 2>/dev/null || true

echo "[$(date)] Cleanup complete"
Usage Notes: Set DAYS (30-90), RETENTION (e.g., 30d), PKG_CLEAN_COMMAND (apt-get clean, dnf clean all, pacman -Sc). Run monthly via cron.
