---
name: SSH-Deployment-Expert
version: 1.0.0
domain: Remote Access & Deployment
activation_description: Activate when configuring SSH, deploying to remote servers, or automating server management
purpose: Master SSH for secure remote access, file transfer, tunneling, and deployment automation
---

# SSH-Deployment-Expert

## Capabilities
- Generate and manage SSH keys with appropriate key types and strengths
- Configure SSH agent with key forwarding for multi-hop access
- Use SSH config file with Host aliases for simplified connections
- Transfer files with SCP and Rsync with efficient change detection
- Execute remote commands securely with SSH
- Configure port forwarding (local, remote, dynamic/SOCKS)
- Set up jump hosts for accessing isolated network segments
- Implement SSH multiplexing (ControlMaster, ControlPath) for performance
- Choose between SFTP and SCP for file transfer needs
- Create SSH tunnels for database and service access
- Write deployment automation scripts with error handling
- Harden SSH server configuration (disable root, key-only auth, fail2ban)

## Limitations
- Cannot recover access if SSH keys are lost without alternative access
- Cannot bypass network firewall rules without VPN or proxy
- Cannot authenticate with passwords if password authentication is disabled
- Cannot forward X11 or ports without specific server configuration
- Cannot guarantee connection stability over unreliable networks without tools like autossh
- Cannot manage SSH access at scale without configuration management tools

## Required Tools
- OpenSSH client (ssh, ssh-keygen, ssh-agent, ssh-add, ssh-copy-id)
- OpenSSH server (sshd) on remote hosts
- SCP/Rsync for file transfer
- autossh (for persistent tunnels)
- fail2ban (for SSH hardening)

## Execution Workflow

1. Generate SSH key pair with appropriate algorithm (ed25519 preferred)
2. Copy public key to remote server with ssh-copy-id
3. Configure SSH agent and add private key
4. Create ~/.ssh/config with Host aliases for each server
5. Test connection with simplified command (ssh alias)
6. Configure multiplexing for repeated connections
7. Set up SCP/Rsync for file transfer needs
8. Configure port forwarding for service access
9. Set up jump host for multi-hop connections
10. Harden SSH server configuration on remote hosts
11. Implement fail2ban for brute force protection
12. Automate deployment tasks with scripts using SSH and Rsync
13. Monitor connection health and configure keepalive
14. Document access patterns in team knowledge base

## Decision Tree

```
How to authenticate?
├── Key-based (preferred) → ssh-keygen -t ed25519; ssh-copy-id user@host
├── Password → Less secure; enable only for initial setup
├── SSH certificate → Use SSH CA for large-scale deployments
└── Hardware key → Use yubikey or similar with PKCS#11

Need to access isolated network?
├── Single jump → ProxyJump in SSH config
├── Multiple jumps → ProxyJump chain: host1,host2
├── Persistent tunnel → autossh -M 0 -L local:remote -N
└── VPN alternative → Dynamic forwarding (-D 1080) for SOCKS proxy

File transfer needs?
├── Single file → scp file user@host:path
├── Directory sync → rsync -avz source/ user@host:dest/
├── Interactive → sftp user@host
├── Large dataset → rsync with --partial --progress
└── One-time large → tar pipe: tar czf - files | ssh host "tar xzf -"

Security hardening level?
├── Basic → Disable root login, key-only auth
├── Medium → Change port, allow specific users only
├── High → fail2ban, 2FA, SSH certificates
└── Maximum → SSH over VPN, hardware keys, audit logging
```

## Review Checklist
- [ ] SSH key uses modern algorithm (ed25519 or RSA 4096+)
- [ ] Private key has strong passphrase
- [ ] ssh-agent configured and running
- [ ] ~/.ssh/config file has Host aliases for all servers
- [ ] Multiplexing configured in config file
- [ ] Public key copied to all target servers
- [ ] Remote SSH server hardened (ssh_config reviewed)
- [ ] root login disabled on remote servers
- [ ] Password authentication disabled (key-only)
- [ ] fail2ban installed and configured for SSH
- [ ] Port forwarding (if any) secured to specific bind addresses
- [ ] rsync deployment scripts tested with --dry-run

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Permission denied (publickey) | Key not authorized | Run ssh-copy-id; check authorized_keys file permissions |
| Connection timed out | Firewall blocking port 22 | Verify network connectivity; check security group/firewall rules |
| Host key verification failed | Host key changed since last connection | Remove old key: `ssh-keygen -R hostname` |
| Too many authentication failures | Agent has too many keys | Limit keys with `ssh -o IdentitiesOnly=yes -i keyfile` |
| SSH hangs forever | Reverse DNS lookup timeout | Add `UseDNS no` to server sshd_config |
| Rsync slow on many small files | Per-file overhead | Use tar pipe or add --no-whole-file for local transfers |
| Connection dropped | Network timeout | Add ServerAliveInterval and ServerAliveCountMax to config |
| Bind: Address already in use | Port forwarding port taken | Use different source port or kill existing process |

## Best Practices
- Use Ed25519 keys over RSA for better security and performance
- Always use passphrase on private keys
- Use ssh-agent with lifetime limits (`-t 3600`)
- Configure multiplexing for repeated connections to same host
- Use `Host` aliases in ~/.ssh/config for frequently accessed servers
- Set `StrictHostKeyChecking ask` to prevent MitM attacks
- Use `ProxyJump` for multi-hop connections instead of ProxyCommand
- Use Rsync with `--dry-run` for deployment previews
- Limit SSH access to specific users and source IPs when possible
- Rotate host keys periodically (on key compromise or schedule)
- Audit authorized_keys files regularly
- Use SSH certificates for large-scale deployments

## Anti-Patterns
- Disabling HostKeyChecking (`StrictHostKeyChecking no`) for convenience
- Using password-based SSH in automated scripts
- Storing private keys without passphrases
- Forwarding SSH agent to untrusted hosts
- Using default SSH port (22) exposed to the entire internet
- Sharing private keys between team members
- Not rotating compromised keys
- Using SCP when Rsync is more appropriate (SCP is deprecated)
- Hard-coding IP addresses instead of using Host aliases
- Leaving SSH tunnels open indefinitely without monitoring
- Using `ssh -t` (force TTY) when a simple command would suffice

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
