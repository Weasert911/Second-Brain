# Linux-Terminal-Expert: Snippets

## 1. Find Largest Directories
```bash
du -sh /* 2>/dev/null | sort -rh | head -10
```
**When to use**: Quickly identify which directories consume the most disk space.

## 2. Find Files by Content
```bash
grep -rl "SEARCH_TERM" /path/to/search --include="*.{js,ts,py}" 2>/dev/null
```
**When to use**: Search for specific text content across multiple files with type filtering.

## 3. Kill Process by Name
```bash
pkill -f "process_name_pattern" || killall process_name
```
**When to use**: Terminate processes matching a name pattern without finding PID first.

## 4. Monitor Logs in Real-Time
```bash
tail -F /var/log/syslog | grep --line-buffered "ERROR"
```
**When to use**: Watch log files for specific patterns as they are written.

## 5. Archive and Compress Directory
```bash
tar -czf archive.tar.gz --exclude="node_modules" --exclude=".git" /path/to/dir
```
**When to use**: Create compressed archive while excluding unwanted directories.

## 6. Open Ports and Services
```bash
ss -tuln | awk 'NR>1 {print $1, $5}' | sort -u
```
**When to use**: List all listening ports and their associated services for security auditing.

## 7. Recursive File Permission Change
```bash
find /path -type f -exec chmod 644 {} \; && find /path -type d -exec chmod 755 {} \;
```
**When to use**: Set standard file (644) and directory (755) permissions recursively.

## 8. System Resource Summary
```bash
echo "CPU: $(top -bn1 | grep '%Cpu' | awk '{print $2+$4"%"}') | MEM: $(free -h | awk '/Mem:/{print $3}') | DISK: $(df -h / | awk 'NR==2{print $5}')"
```
**When to use**: Get a quick one-line summary of CPU, memory, and disk usage.

## 9. Download File with Resume
```bash
wget -c "https://example.com/large-file.iso" || curl -C - -O "https://example.com/large-file.iso"
```
**When to use**: Resume an interrupted download instead of starting from scratch.

## 10. Run Command with Timeout
```bash
timeout 30 command_here || echo "Command timed out"
```
**When to use**: Limit command execution time to prevent hanging processes.

## 11. Compare Two Directories
```bash
diff -rq dir1/ dir2/ | grep -v "\.git"
```
**When to use**: Find differences between two directory trees (files present in one but not the other, or content differences).

## 12. Recursive Search and Replace
```bash
find /path -type f -name "*.config" -exec sed -i 's/old_text/new_text/g' {} \;
```
**When to use**: Perform find-and-replace across multiple files matching a pattern.

## 13. Check SSL Certificate Expiry
```bash
echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```
**When to use**: Check when an SSL/TLS certificate expires from the command line.

## 14. Monitor Disk I/O
```bash
iostat -x 1 5 | grep -A1 "avg-cpu"
```
**When to use**: Monitor disk I/O performance metrics (await, svctm, %util) in real-time.

## 15. Network Bandwidth Test
```bash
iperf3 -c server_ip -t 10 -P 4
```
**When to use**: Measure network throughput between two hosts (requires iperf3 on both ends).
