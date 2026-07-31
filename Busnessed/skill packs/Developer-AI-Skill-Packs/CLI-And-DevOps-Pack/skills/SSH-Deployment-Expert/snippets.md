# SSH-Deployment-Expert: Snippets

## 1. Generate Ed25519 Key
```bash
ssh-keygen -t ed25519 -C "user@example.com" -f ~/.ssh/id_ed25519
```
**When to use**: Create a modern, secure SSH key pair (preferred over RSA).

## 2. Copy Public Key to Server
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.example.com
```
**When to use**: Install public key on a remote server's authorized_keys file.

## 3. SSH Agent Setup
```bash
eval "$(ssh-agent -s)" && ssh-add -t 3600 ~/.ssh/id_ed25519
```
**When to use**: Load private key into agent with 1-hour timeout for key forwarding.

## 4. Quick Port Forwarding
```bash
ssh -L 8080:localhost:80 -L 5432:db.internal:5432 bastion.example.com
```
**When to use**: Tunnel multiple ports through a bastion host.

## 5. SOCKS Proxy
```bash
ssh -D 1080 -C -q user@server.example.com
```
**When to use**: Create a SOCKS5 proxy for browser traffic through the SSH server.

## 6. Rsync Deployment
```bash
rsync -avz --delete --exclude '.git' --exclude 'node_modules' ./ user@server:/app/
```
**When to use**: Efficiently sync project files to a remote server with exclusions.

## 7. Remote Command Execution
```bash
ssh user@server "sudo systemctl restart myapp && journalctl -u myapp -n 50 --no-pager"
```
**When to use**: Execute commands on a remote server and see output locally.

## 8. Jump Host / Bastion
```bash
ssh -J user@bastion.example.com user@internal-server.local
```
**When to use**: Access a server in a private network through a bastion host.

## 9. Multiplexing Configuration
```ssh_config
Host *
    ControlMaster auto
    ControlPath ~/.ssh/controlmasters/%r@%h:%p
    ControlPersist 10m
```
**When to use**: Reuse SSH connections for faster multiple sessions to the same host.

## 10. Secure File Copy
```bash
scp -i ~/.ssh/deploy_key -P 2222 file.tar.gz deploy@app-server:/tmp/
```
**When to use**: Copy a single file to a server with custom key and port.

## 11. Tar Pipe Transfer
```bash
tar czf - project/ | ssh user@server "tar xzf - -C /destination/"
```
**When to use**: Transfer large directory trees without intermediate files.

## 12. Test SSH Connection
```bash
ssh -o ConnectTimeout=5 -o BatchMode=yes -T user@server "echo 2>&1" && echo "OK" || echo "FAIL"
```
**When to use**: Verify SSH connectivity and authentication in scripts.

## 13. SSH Host Key Verification
```bash
ssh-keyscan -t ed25519 server.example.com >> ~/.ssh/known_hosts
```
**When to use**: Pre-accept host keys for automation scripts (use with caution).

## 14. Kill Stuck SSH Session
```bash
# In an SSH session: ~. (tilde then dot) to force disconnect
# Or kill process:
pkill -f "ssh user@server"
```
**When to use**: Terminate a stuck or unresponsive SSH connection.

## 15. SSH Config Host Entry
```ssh_config
Host web
    HostName web.company.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/deploy_key
    LocalForward 8080 localhost:80
```
**When to use**: Simplify connections with meaningful aliases and pre-configured options.
