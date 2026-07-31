# SSH-Deployment-Expert: Examples

## Beginner: Key-Based SSH Setup
```bash
# Generate Ed25519 key pair
ssh-keygen -t ed25519 -C "user@example.com" -f ~/.ssh/id_ed25519

# Start SSH agent and add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.example.com

# Test connection (first time prompts for host key verification)
ssh user@server.example.com

# Run a command remotely
ssh user@server.example.com "df -h && uptime"
```
**Explanation**: Complete key-based authentication setup. Ed25519 keys are faster and more secure than RSA. ssh-copy-id adds the public key to the server's authorized_keys. First connection verifies host key fingerprint.

## Intermediate: SSH Config for Efficient Access
```ssh_config
# ~/.ssh/config

# Default settings for all hosts
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    Compression yes
    ExitOnForwardFailure yes

# Web server with custom port
Host web
    HostName web.company.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/deploy_key
    LocalForward 8080 localhost:80

# Database server through jump host
Host bastion
    HostName bastion.company.com
    User admin
    IdentityFile ~/.ssh/bastion_key

Host db-prod
    HostName db.internal.company.com
    User dbadmin
    IdentityFile ~/.ssh/db_key
    ProxyJump bastion
    LocalForward 5432 localhost:5432

# Multiplexing for fast reconnections
Host dev-*
    ControlMaster auto
    ControlPath ~/.ssh/controlmasters/%r@%h:%p
    ControlPersist 10m
```
```bash
# Now connect with simple aliases
ssh web           # → ssh deploy@web.company.com -p 2222
ssh db-prod       # → via bastion to db.internal with port forwarding
ssh dev-server01  # → multiplexed connection
```
**Explanation**: SSH config file simplifies connections with Host aliases. Multiplexing reuses TCP connections for faster logins. ProxyJump chains through bastion hosts. Local forwarding provides secure access to internal services.

## Advanced: Deployment Automation Script
```bash
#!/bin/bash
set -euo pipefail

# Automated deployment with rollback
APP_DIR="/opt/myapp"
BACKUP_DIR="/opt/backups"
RELEASE_DIR="${APP_DIR}/releases/$(date +%Y%m%d_%H%M%S)"
SHARED_DIR="${APP_DIR}/shared"
CURRENT_LINK="${APP_DIR}/current"
MAX_RELEASES=5

usage() {
    echo "Usage: $0 <server-alias> <build-tarball>"
    exit 1
}

deploy() {
    local server="$1"
    local tarball="$2"

    if [ ! -f "$tarball" ]; then
        echo "Error: tarball $tarball not found" >&2
        return 1
    fi

    echo "=== Deploying to $server ==="

    # Create release directory
    ssh "$server" "mkdir -p $RELEASE_DIR $SHARED_DIR"

    # Upload tarball
    echo "Uploading $tarball..."
    rsync -avz --progress "$tarball" "$server:${RELEASE_DIR}/"

    # Extract and set up
    ssh "$server" "cd $RELEASE_DIR && tar xzf $(basename $tarball) && rm $(basename $tarball)"

    # Link shared resources (logs, config, uploads)
    ssh "$server" "ln -sf $SHARED_DIR/logs $RELEASE_DIR/logs && \
                   ln -sf $SHARED_DIR/config $RELEASE_DIR/config"

    # Symlink current release
    ssh "$server" "ln -sfn $RELEASE_DIR $CURRENT_LINK"

    # Restart service
    ssh "$server" "sudo systemctl restart myapp"

    # Health check
    sleep 5
    if ssh "$server" "curl -sf http://localhost:8080/health > /dev/null"; then
        echo "Deployment successful!"
    else
        echo "Health check FAILED! Rolling back..."
        rollback "$server"
        return 1
    fi

    # Cleanup old releases
    ssh "$server" "cd ${APP_DIR}/releases && ls -t | tail -n +$((MAX_RELEASES + 1)) | xargs -r rm -rf"
}

rollback() {
    local server="$1"
    local previous
    previous=$(ssh "$server" "ls -t ${APP_DIR}/releases | head -2 | tail -1")
    if [ -n "$previous" ]; then
        ssh "$server" "ln -sfn ${APP_DIR}/releases/$previous $CURRENT_LINK && \
                       sudo systemctl restart myapp"
        echo "Rolled back to $previous"
    fi
}

[ "$#" -eq 2 ] || usage
deploy "$@"
```
**Explanation**: Production deployment script with release directory structure, shared resources (logs, config), atomic symlink switch, health check verification, automatic rollback, and cleanup of old releases. Rsync for efficient uploads.

## Production: Persistent SSH Tunnel with autossh
```bash
#!/bin/bash
# /usr/local/bin/db-tunnel.sh
# Systemd service for persistent SSH tunnel

set -euo pipefail

TUNNEL_HOST="bastion.company.com"
LOCAL_PORT=5432
REMOTE_HOST="db.internal"
REMOTE_PORT=5432
SSH_KEY="/root/.ssh/tunnel_key"
MONITOR_PORT=20000

exec autossh -M $MONITOR_PORT \
    -o "ServerAliveInterval=30" \
    -o "ServerAliveCountMax=3" \
    -o "ExitOnForwardFailure=yes" \
    -o "StrictHostKeyChecking=accept-new" \
    -i "$SSH_KEY" \
    -L ${LOCAL_PORT}:${REMOTE_HOST}:${REMOTE_PORT} \
    -N \
    tunnel@$TUNNEL_HOST
```
```ini
# /etc/systemd/system/db-tunnel.service
[Unit]
Description=SSH Tunnel to Database
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/db-tunnel.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```
```bash
# Set up and start tunnel service
sudo systemctl daemon-reload
sudo systemctl enable db-tunnel
sudo systemctl start db-tunnel
sudo systemctl status db-tunnel

# Application connects to localhost:5432
# Traffic is tunneled to db.internal:5432 through bastion
```
**Explanation**: autossh maintains persistent SSH tunnels with automatic reconnection. Systemd service ensures tunnel restarts on failure or reboot. Used for secure database access without direct network connectivity. Monitor port (-M) checks tunnel health.
