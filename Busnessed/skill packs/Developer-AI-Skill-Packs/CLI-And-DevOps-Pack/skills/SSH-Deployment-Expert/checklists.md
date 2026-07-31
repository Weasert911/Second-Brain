# SSH-Deployment-Expert: Checklists

## Pre-Flight Checklist
- [ ] SSH key pair generated with Ed25519 algorithm
- [ ] Private key has strong passphrase
- [ ] ssh-agent running and key added
- [ ] Public key deployed to target server
- [ ] SSH config file has Host aliases configured
- [ ] Host key verified on first connection
- [ ] Server SSH port reachable (telnet/nc test)
- [ ] Non-root user exists on server
- [ ] Server has sudo access for deployment user
- [ ] Required tools installed on server (rsync, tar, curl)

## Implementation Checklist
- [ ] ssh_config file permissions set to 600
- [ ] Private key file permissions set to 600
- [ ] authorized_keys file permissions set to 600
- [ ] Multiplexing configured for repeated connections
- [ ] KeepAlive configured for long-running connections
- [ ] ProxyJump configured for bastion hosts
- [ ] Port forwarding restricted to specific interfaces (-L bind_address)
- [ ] Rsync excludes files (node_modules, .git, .env)
- [ ] Deployment script uses set -euo pipefail
- [ ] Rollback mechanism implemented in deployment
- [ ] Health check after deployment verifies service
- [ ] Logging of deployment actions configured

## Testing Checklist
- [ ] SSH connection works with key authentication only
- [ ] Password authentication disabled on server (test: ssh -o PreferredAuthentications=password)
- [ ] SCP/Rsync file transfer works correctly
- [ ] Port forward tunnel connects to target service
- [ ] Multiplexing works (ssh -M first, then ssh without auth)
- [ ] ProxyJump works through bastion
- [ ] Deployment script dry-run shows correct actions
- [ ] Rollback restores previous version successfully
- [ ] Health check passes after deployment
- [ ] fail2ban blocks on multiple failed attempts

## Release Checklist
- [ ] Deployment script tested against staging environment
- [ ] Server configuration changes documented
- [ ] SSH config changes version controlled
- [ ] Service restart handled gracefully (no downtime)
- [ ] Database migrations tested (if applicable)
- [ ] Monitoring alerts configured for health check
- [ ] Release notes include deployment instructions
- [ ] Backup verified before production deploy
- [ ] Rollback procedure documented and tested
- [ ] Post-deployment validation completed

## Maintenance Checklist
- [ ] SSH keys rotated annually or on compromise
- [ ] authorized_keys audited for stale entries
- [ ] SSH server updated for security patches
- [ ] fail2ban logs reviewed for attack patterns
- [ ] Server OS and packages updated
- [ ] SSH configuration reviewed against hardening guide
- [ ] Deployment logs reviewed for failures
- [ ] Access to servers audited quarterly
