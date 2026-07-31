# Linux-Terminal-Expert: References

## Official Documentation Summaries
- **GNU Coreutils Manual** – All standard file, shell, and text utilities
- **man pages** – `man <command>` for every utility
- **tldr pages** – Simplified man pages: `tldr <command>`
- **Linux man pages online** – man7.org/linux/man-pages/
- **Filesystem Hierarchy Standard (FHS)** – Linux directory structure

## Glossary (15+ Terms)
- **Pipe (`|`)** – Connect stdout of one command to stdin of another
- **Redirection** – Control input/output streams (>, >>, <, 2>&1)
- **Process** – Running instance of a program with PID
- **Daemon** – Background process typically started at boot
- **Signal** – IPC mechanism for process control (SIGTERM, SIGKILL, SIGHUP)
- **Inode** – Filesystem data structure storing file metadata
- **Hard link** – Directory entry pointing to same inode
- **Symbolic link** – Special file pointing to another path
- **ACL** – Access Control List for fine-grained permissions
- **Capability** – Fine-grained privileges for processes (Linux capabilities)
- **systemd** – Init system and service manager
- **Journald** – System logging daemon (part of systemd)
- **cgroups** – Control groups for resource management
- **Namespace** – Linux kernel feature for process isolation
- **Socket** – Endpoint for network or IPC communication

## Architecture Notes
- Linux follows a monolithic kernel architecture
- Everything is a file (regular files, directories, devices, sockets, pipes)
- Processes are isolated in separate virtual memory spaces
- Filesystem is a tree starting from root (/)
- Devices are represented as files in /dev
- systemd is the standard init system on most modern distributions

## Key Commands / APIs
- `find/locat e/tree` – File location and directory tree
- `grep/sed/awk/cut/sort/uniq/wc` – Text processing
- `ps/top/htop/kill/nice/renice` – Process management
- `chmod/chown/umask/setfacl/getfacl` – Permissions
- `df/du/mount/umount/lsblk/blkid` – Filesystem
- `ss/ip/curl/wget/nc/tcpdump/nmap` – Networking
- `apt/dnf/pacman/snap/flatpak` – Package management
- `systemctl/journalctl/timedatectl` – systemd management

## Conventions
- Configuration files in `/etc/`, user configs in `~/.config/`
- Logs in `/var/log/`, temporary files in `/tmp/`
- Binaries in `/usr/bin/`, `/usr/local/bin/`
- Environment variables: `UPPER_SNAKE_CASE`
- Hidden files and directories start with `.`

## Structure Recommendations
- `/etc/` – System-wide configuration
- `/var/log/` – Application and system logs
- `/opt/` – Third-party software installations
- `/usr/local/` – Locally compiled software
- `~/bin/` – User-specific scripts in PATH

## Keyboard Shortcuts
- `Ctrl+C` – Terminate current command
- `Ctrl+Z` – Suspend current command (bg to background)
- `Ctrl+D` – EOF / exit shell
- `Ctrl+R` – Reverse search command history
- `Ctrl+L` – Clear screen
- `Ctrl+A` / `Ctrl+E` – Beginning / end of line
- `Ctrl+U` / `Ctrl+K` – Delete to beginning / end of line
- `Ctrl+W` – Delete word backward
- `Alt+.` – Insert last argument of previous command
- `!!` – Repeat last command
- `!$` – Last argument of last command
- `~` – Home directory shorthand
