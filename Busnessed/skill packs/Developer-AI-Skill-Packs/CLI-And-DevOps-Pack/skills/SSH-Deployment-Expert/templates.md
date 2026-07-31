# SSH-Deployment-Expert: Templates

## 1. SSH Config Template
```
Name: ssh-config
Description: SSH client configuration with common patterns
Template:
# ~/.ssh/config

# Global defaults
Host *
    ServerAliveInterval {{KEEPALIVE_INTERVAL}}
    ServerAliveCountMax {{KEEPALIVE_COUNT}}
    Compression yes
    ExitOnForwardFailure yes
    StrictHostKeyChecking {{STRICT_MODE}}

# Web server
Host {{ALIAS}}
    HostName {{HOSTNAME}}
    User {{USERNAME}}
    Port {{PORT}}
    IdentityFile ~/.ssh/{{KEY_FILE}}
    LocalForward {{LOCAL_PORT}} localhost:{{REMOTE_PORT}}

# Jump host / bastion
Host {{BASTION_ALIAS}}
    HostName {{BASTION_HOST}}
    User {{BASTION_USER}}
    IdentityFile ~/.ssh/{{BASTION_KEY}}

# Target through bastion
Host {{TARGET_ALIAS}}
    HostName {{TARGET_HOST}}
    User {{TARGET_USER}}
    IdentityFile ~/.ssh/{{TARGET_KEY}}
    ProxyJump {{BASTION_ALIAS}}

# Multiplexing hosts
Host {{MUX_PATTERN}}
    ControlMaster auto
    ControlPath ~/.ssh/controlmasters/%r@%h:%p
    ControlPersist {{PERSIST_TIME}}
Usage Notes: KEEPALIVE_INTERVAL=60, KEEPALIVE_COUNT=3. STRICT_MODE=ask (accept-new for automation). Use ProxyJump for bastion. Multiplexing speeds up repeated connections.
```

## 2. Deployment Script Template
```
Name: deployment-script
Description: Automated deployment via SSH with rollback
Template:
#!/bin/bash
set -euo pipefail

SERVER="{{SERVER_ALIAS}}"
REMOTE_DIR="{{REMOTE_DIR}}"
RELEASE_DIR="${REMOTE_DIR}/releases/$(date +%Y%m%d_%H%M%S)"
CURRENT_LINK="${REMOTE_DIR}/current"
BACKUP_DIR="${REMOTE_DIR}/backups"
KEEP_RELEASES={{KEEP_RELEASES}}

deploy() {
    echo "Deploying to $SERVER..."

    # Create directories
    ssh "$SERVER" "mkdir -p $RELEASE_DIR $BACKUP_DIR"

    # Upload files
    rsync -avz --delete \
        --exclude '.git' --exclude 'node_modules' --exclude '.env' \
        ./ "$SERVER:${RELEASE_DIR}/"

    # Backup current version
    ssh "$SERVER" "if [ -L $CURRENT_LINK ]; then \
        cp -rL $CURRENT_LINK $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S); fi"

    # Switch symlink
    ssh "$SERVER" "ln -sfn $RELEASE_DIR $CURRENT_LINK"

    # Restart service
    ssh "$SERVER" "sudo systemctl restart {{SERVICE_NAME}}"

    # Health check
    sleep 5
    if ssh "$SERVER" "curl -sf http://localhost:{{HEALTH_PORT}}/health"; then
        echo "Deploy successful!"
        # Cleanup old releases
        ssh "$SERVER" "ls -t ${REMOTE_DIR}/releases | tail -n +$((KEEP_RELEASES + 1)) | \
            xargs -I {} rm -rf ${REMOTE_DIR}/releases/{}"
    else
        echo "Health check failed! Rolling back..."
        ssh "$SERVER" "ln -sfn $(ls -t ${REMOTE_DIR}/releases | head -2 | tail -1) $CURRENT_LINK"
        ssh "$SERVER" "sudo systemctl restart {{SERVICE_NAME}}"
        exit 1
    fi
}

deploy
Usage Notes: Replace SERVER_ALIAS with SSH config host. KEEP_RELEASES=5. Rsync excludes build artifacts. Health check before considering deploy successful.
```

## 3. SSH Hardening Template
```
Name: ssh-hardening
Description: SSH server hardening configuration
Template:
# /etc/ssh/sshd_config (hardened)

# Authentication
Port {{PORT}}
Protocol 2
PermitRootLogin no
MaxAuthTries {{MAX_TRIES}}
MaxSessions {{MAX_SESSIONS}}
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
AuthenticationMethods publickey

# Keys
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key
KexAlgorithms {{KEX_ALGORITHMS}}
Ciphers {{CIPHERS}}
MACs {{MAC_ALGORITHMS}}

# Session
ClientAliveInterval {{ALIVE_INTERVAL}}
ClientAliveCountMax {{ALIVE_COUNT}}
TCPKeepAlive yes
Compression delayed
MaxStartups {{MAX_STARTUPS}}

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Access control
AllowUsers {{ALLOWED_USERS}}
DenyUsers {{DENIED_USERS}}
AllowGroups {{ALLOWED_GROUPS}}
Usage Notes: PORT: change from 22 to reduce scans. MAX_TRIES=3, KEX: sntrup761x25519-sha512 and curve25519-sha256. Restart sshd: `sudo systemctl restart sshd`. Keep current session open during testing.
```

## 4. Port Forwarding Template
```
Name: port-forwarding
Description: Various SSH port forwarding configurations
Template:
# Local forwarding: access remote service on local port
ssh -L {{LOCAL_PORT}}:localhost:{{REMOTE_PORT}} {{SERVER_ALIAS}}

# Remote forwarding: expose local service on remote port
ssh -R {{REMOTE_PORT}}:localhost:{{LOCAL_PORT}} {{SERVER_ALIAS}}

# Dynamic forwarding: SOCKS proxy
ssh -D {{SOCKS_PORT}} {{SERVER_ALIAS}}

# Multi-hop forwarding (via bastion)
ssh -J {{BASTION_ALIAS}} -L {{LOCAL_PORT}}:{{TARGET_HOST}}:{{TARGET_PORT}} {{TARGET_ALIAS}}

# With config file (local forward in config)
# In ~/.ssh/config:
# Host {{ALIAS}}
#     LocalForward {{LOCAL_PORT}} {{TARGET_HOST}}:{{TARGET_PORT}}

# Persistent tunnel with autossh
autossh -M {{MONITOR_PORT}} \
    -o "ServerAliveInterval=30" \
    -o "ServerAliveCountMax=3" \
    -L {{LOCAL_PORT}}:localhost:{{REMOTE_PORT}} \
    -N {{SERVER_ALIAS}}
Usage Notes: LOCAL_PORT: port on your machine. REMOTE_PORT: port on the remote machine. SOCKS_PORT: 1080 for browser proxy. -N flag: do not execute remote command (tunnel only). autossh for persistent tunnels.
```

## 5. Rsync Deployment Template
```
Name: rsync-deploy
Description: Rsync-based deployment with exclusions
Template:
#!/bin/bash
set -euo pipefail

SOURCE="{{SOURCE_DIR}}"
DEST="{{SERVER}}:{{DEST_DIR}}"
EXCLUDES="{{EXCLUDE_FILE}}"
LOG_FILE="{{LOG_FILE}}"
DRY_RUN="${DRY_RUN:-false}"

OPTS="-avz --delete --partial --progress"
[ -f "$EXCLUDES" ] && OPTS="$OPTS --exclude-from=$EXCLUDES"
[ "$DRY_RUN" = "true" ] && OPTS="$OPTS --dry-run"

echo "Syncing $SOURCE -> $DEST"
rsync $OPTS \
    -e "ssh -o StrictHostKeyChecking=accept-new" \
    "$SOURCE" "$DEST" | tee "$LOG_FILE"

echo "Rsync completed. Log: $LOG_FILE"
Usage Notes: DRY_RUN=true for preview. EXCLUDE_FILE: list of patterns (one per line). --delete removes files on dest not in source. --partial resumes interrupted transfers.
```

## 6. Key Management Template
```
Name: key-management
Description: SSH key generation, rotation, and management
Template:
# Generate Ed25519 key
ssh-keygen -t ed25519 -C "{{COMMENT}}" -f ~/.ssh/{{KEY_NAME}} -N "{{PASSPHRASE}}"

# Generate RSA key (for legacy systems)
ssh-keygen -t rsa -b 4096 -C "{{COMMENT}}" -f ~/.ssh/{{KEY_NAME}} -N "{{PASSPHRASE}}"

# Add key to agent with timeout
ssh-add -t {{TIMEOUT}} ~/.ssh/{{KEY_NAME}}

# Rotate key (keep old key until tested)
ssh-keygen -t ed25519 -C "{{COMMENT}} - $(date +%Y%m)" -f ~/.ssh/{{KEY_NAME}}_new
ssh-copy-id -i ~/.ssh/{{KEY_NAME}}_new.pub {{SERVER}}
# Verify new key works, then:
# 1. Remove old key from authorized_keys on server
# 2. Remove old key from ssh-agent
# 3. Rename new key files to replace old ones

# List keys in agent
ssh-add -l

# Remove all keys from agent
ssh-add -D
Usage Notes: TIMEOUT: 3600 (1 hour). COMMENT: your email or username. Always use passphrase on private keys. Rotate keys annually or on compromise.
```

## 7. Fail2ban Configuration Template
```
Name: fail2ban-config
Description: Fail2ban configuration for SSH protection
Template:
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = {{BAN_TIME}}
findtime = {{FIND_TIME}}
maxretry = {{MAX_RETRY}}
ignoreip = {{ALLOWED_IPS}}

[sshd]
enabled = true
port = {{SSH_PORT}}
filter = sshd
logpath = /var/log/auth.log
maxretry = {{SSH_MAX_RETRY}}
bantime = {{SSH_BAN_TIME}}
action = iptables[name=SSH, port={{SSH_PORT}}, protocol=tcp]

# Custom filter for non-standard SSH configurations
[sshd-dict]
enabled = true
port = {{SSH_PORT}}
filter = sshd-dict
logpath = /var/log/auth.log
maxretry = 1
bantime = 86400
Usage Notes: BAN_TIME=3600, FIND_TIME=600, MAX_RETRY=5. Ban on first failed attempt for dictionary attacks. Always whitelist your own IP in ignoreip. Test with: `fail2ban-client status sshd`.
```

## 8. SSH Audit Script Template
```
Name: ssh-audit
Description: Audit SSH configuration and key usage
Template:
#!/bin/bash
echo "=== SSH Security Audit ==="

# Check SSH config file permissions
echo "Config file permissions:"
ls -la ~/.ssh/config 2>/dev/null || echo "No config file"
ls -la ~/.ssh/authorized_keys 2>/dev/null || echo "No authorized_keys"

# List keys
echo -e "\n=== SSH Keys ==="
for key in ~/.ssh/id_* ~/.ssh/*_rsa ~/.ssh/*_ed25519; do
    if [ -f "$key" ] && [[ "$key" != *.pub ]]; then
        echo "Key: $key"
        ssh-keygen -lf "$key"
        echo "Permissions: $(stat -c '%a' "$key" 2>/dev/null || stat -f '%Lp' "$key" 2>/dev/null)"
    fi
done

# List authorized keys on server
echo -e "\n=== Authorized Keys on {{SERVER}} ==="
ssh {{SERVER}} "cat ~/.ssh/authorized_keys" | while read -r line; do
    echo "$line" | awk '{print $3 " " $1}'
done

# Check server SSH configuration
echo -e "\n=== Server SSH Config ==="
ssh {{SERVER}} "sudo sshd -T | grep -E '^(port|permitrootlogin|passwordauthentication|pubkeyauthentication)'"

# Fail2ban status
echo -e "\n=== Fail2ban Status ==="
ssh {{SERVER}} "sudo fail2ban-client status sshd" 2>/dev/null || echo "fail2ban not active"
Usage Notes: Run periodically for security compliance. Checks key permissions (should be 600). Verifies server config matches hardening policy. Replace SERVER with actual host alias.
