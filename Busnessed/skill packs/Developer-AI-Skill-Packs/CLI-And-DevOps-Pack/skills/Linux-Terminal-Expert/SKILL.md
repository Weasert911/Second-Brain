---
name: Linux-Terminal-Expert
version: 1.0.0
domain: Systems Administration
activation_description: Activate when performing Linux system administration, file operations, or text processing tasks
purpose: Master Linux terminal operations including text processing, process management, networking, and system administration
---

# Linux-Terminal-Expert

## Capabilities
- Execute advanced file operations with find, locate, tree, and rsync
- Process text streams using grep, sed, awk, cut, sort, uniq, and wc
- Manage processes with ps, top, htop, kill, nice, and systemctl
- Configure file permissions using chmod, chown, umask, ACL, and capabilities
- Monitor filesystems with df, du, mount, lsblk, and tune2fs
- Diagnose networking with ss, netstat, curl, wget, nc, tcpdump, and nmap
- Manage packages across distributions (apt, dnf, pacman, snap, flatpak)
- Write shell scripts with pipes, redirections, and job control
- Use terminal multiplexers (screen, tmux) for persistent sessions
- Monitor system resources and performance metrics
- Configure systemd services and journalctl logging
- Perform disk partitioning and LVM management

## Limitations
- Cannot modify kernel parameters without appropriate permissions
- Cannot recover data from overwritten or physically damaged disks
- Cannot bypass sudo restrictions without proper authentication
- Cannot run GUI applications from pure terminal environments
- Cannot access network resources behind restrictive firewalls without configuration
- Cannot automatically fix all system configuration errors without understanding context

## Required Tools
- Linux terminal (bash shell)
- Core utilities (coreutils, util-linux)
- sudo access (for system administration tasks)
- Network tools (curl, wget, nmap, tcpdump)
- Package manager (apt/dnf/pacman)

## Execution Workflow

1. Identify the task category (file ops, text processing, process mgmt, networking, system config)
2. Use tab completion and command history for efficient command entry
3. Chain commands with pipes for complex data processing pipelines
4. Use redirection operators to control input/output streams (>, >>, <, 2>&1)
5. Leverage find with -exec or xargs for batch file operations
6. Use grep with appropriate flags (-r, -i, -v, -l, -H) for targeted searches
7. Apply sed or awk for stream editing and text transformation
8. Monitor system resources with top/htop and analyze with ps aux
9. Check disk usage with df -h and directory sizes with du -sh
10. Manage processes with kill, killall, pkill and nice/renice
11. Configure services with systemctl (start, stop, enable, disable, status)
12. Review system logs with journalctl using filters (--since, -u, -p)
13. Archive and compress files with tar, gzip, bzip2, xz
14. Transfer files securely with scp, rsync, sftp

## Decision Tree

```
What type of file operation?
├── Find files → find with name, type, size, time filters
├── Compare files → diff, comm, cmp
├── Transform text → sed, awk, tr
├── Search content → grep -r, rg (ripgrep)
└── Bulk rename → rename, mmv, or loop with mv

Process management needed?
├── View processes → ps aux, top, htop
├── Kill process → kill PID, killall name, pkill pattern
├── Change priority → nice/renice
└── Service → systemctl start/stop/enable/disable

Network troubleshooting?
├── Check connections → ss -tuln, netstat
├── Test endpoint → curl -v, wget
├── DNS resolution → dig, nslookup, host
├── Trace route → traceroute, mtr
└── Packet capture → tcpdump, wireshark (tshark)

Install software?
├── Debian/Ubuntu → apt, apt-get
├── RHEL/Fedora → dnf, yum
├── Arch → pacman
├── Universal → snap, flatpak
└── From source → ./configure && make && make install

Need persistent terminal?
├── tmux → attach/detach sessions
├── screen → alternative multiplexer
└── nohup → run command immune to hangups
```

## Review Checklist
- [ ] Commands verified with dry-run or --test flags where available
- [ ] Redirections do not overwrite important files (use >> for append)
- [ ] rm -rf used with extreme caution and path verification
- [ ] sudo commands limited to minimum necessary scope
- [ ] Processes killed with correct signal (SIGTERM before SIGKILL)
- [ ] Network commands use appropriate security (SSH, HTTPS)
- [ ] File permissions set to minimum required (principle of least privilege)
- [ ] Archive/compression verified with integrity checks
- [ ] sed -i used with backup (-i.bak) or on version-controlled files
- [ ] find -delete used carefully (preview with -print first)
- [ ] systemctl commands verify service status after change
- [ ] journalctl filters used to limit output scope

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Command not found | PATH issue or package not installed | Check PATH: `echo $PATH`; install package |
| Permission denied | Insufficient privileges | Use sudo or check file permissions |
| Disk full | No free space | `du -sh /* | sort -rh` to find large files |
| Process not responding | Zombie or stuck state | `kill -9 PID` as last resort; check dmesg |
| Network unreachable | DNS, routing, or firewall | Ping gateway; check /etc/resolv.conf; inspect iptables |
| Package installation fails | Dependency conflict | `apt-get -f install`; check PPA/sources |
| grep binary file warning | grep on binary data | Use `grep -a` or `strings file | grep pattern` |
| tar archive errors | Corrupted archive | `tar -tf archive.tar` to test; try `tar -xzf` with --ignore-zeros |

## Best Practices
- Use tab completion to avoid typos in file paths
- Quote variables and paths with spaces ("$VAR" or "$(command)")
- Use `set -euo pipefail` at the start of critical shell scripts
- Preview destructive commands (rm, dd, mkfs) with dry-run flags
- Use `find -print0 | xargs -0` for filenames with spaces
- Keep sudo sessions short; use `sudo -k` to reset timestamp
- Use `journalctl -u service-name -f` for real-time service logs
- Prefer `[[` over `[` in bash for conditional expressions
- Use `trap` to clean up temporary files on script exit
- Redirect error messages to log files for debugging
- Use `watch` to monitor command output over time
- Keep terminal multiplexer sessions organized with session names

## Anti-Patterns
- Running `rm -rf /` or `rm -rf .` without verifying current directory
- Using `chmod 777` as a quick fix for permission issues
- Parsing output of `ls` instead of using globs or find
- Piping `curl` directly to `sudo bash` (remote execution vulnerability)
- Killing processes with `kill -9` without trying gentler signals first
- Running commands as root when a regular user would suffice
- Using `sudo !!` without reviewing the previous command
- Ignoring error messages and exit codes in scripts
- Hard-coding IP addresses instead of hostnames
- Leaving terminal sessions open with sensitive information visible

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
