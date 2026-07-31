# Linux-Terminal-Expert: Checklists

## Pre-Flight Checklist
- [ ] Shell is bash (verify with `echo $SHELL`)
- [ ] User has appropriate permissions for intended operations
- [ ] Required packages installed (verify with which/command -v)
- [ ] Terminal multiplexer (tmux/screen) started for long operations
- [ ] Working directory verified with pwd
- [ ] Disk space available (df -h)
- [ ] Backup of critical data exists before destructive operations
- [ ] SSH key loaded in agent for remote operations
- [ ] PATH includes expected directories
- [ ] umask set to appropriate value

## Implementation Checklist
- [ ] Commands tested with echo or dry-run before execution
- [ ] Pipes handle errors appropriately (set -o pipefail)
- [ ] find commands previewed before -delete or -exec
- [ ] rm -rf never used with variables that could be empty
- [ ] Redirecting output to files uses >> not > when appending
- [ ] chmod sets minimum required permissions
- [ ] chown changes ownership to correct user/group
- [ ] systemctl changes verified with status check
- [ ] Network commands use secure protocols (SSH, HTTPS)
- [ ] Archive integrity verified after creation

## Testing Checklist
- [ ] find command returns expected results before action
- [ ] grep patterns match intended content (no false positives)
- [ ] sed transformations produce correct output
- [ ] Sort/uniq pipelines produce expected counts
- [ ] Process listing shows expected PIDs
- [ ] Service starts/stops correctly with systemctl
- [ ] Network ports are listening as expected
- [ ] File permissions set correctly (ls -la verification)
- [ ] Disk usage matches expectations
- [ ] Logs contain expected entries after operation

## Release Checklist
- [ ] Configuration changes documented
- [ ] systemd unit files reviewed and validated
- [ ] Cron jobs tested with manual execution
- [ ] Scripts made executable (chmod +x)
- [ ] PATH updated if new scripts added
- [ ] Log rotation configured for new log files
- [ ] Monitoring updated for new services
- [ ] Firewall rules reviewed if ports opened
- [ ] Backup jobs verified after changes
- [ ] Rollback plan documented

## Maintenance Checklist
- [ ] System packages updated regularly (apt update && apt upgrade)
- [ ] Kernel versions tracked for security updates
- [ ] Disk usage monitored weekly
- [ ] Log files rotated and archived
- [ ] Failed systemd services reviewed (systemctl --failed)
- [ ] SSH keys audited for stale entries
- [ ] Cron jobs reviewed for continued relevance
- [ ] Backup integrity tested monthly with restore dry-run
