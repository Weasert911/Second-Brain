# SSH-Deployment-Expert: References

## Official Documentation Summaries
- **OpenSSH Manual (ssh_config)** – Client configuration reference
- **OpenSSH Manual (sshd_config)** – Server configuration reference
- **OpenSSH Cookbook** – Practical SSH usage patterns and configurations
- **ssh-keygen manual** – Key generation options and formats
- **Rsync manual** – All rsync options and filtering

## Glossary (15+ Terms)
- **Public key authentication** – Cryptographic authentication using key pairs
- **Private key** – Secret key that must be kept secure (never shared)
- **Public key** – Key placed on servers for authentication
- **SSH agent** – Program that holds private keys in memory for authentication
- **Agent forwarding** – Forwarding authentication through intermediate hosts
- **Host key** – Server identity key (fingerprint verified on first connection)
- **authorized_keys** – File listing public keys allowed to authenticate
- **known_hosts** – File tracking verified host keys
- **Port forwarding** – Tunneling traffic through SSH connection
- **Local forwarding** – Forward local port to remote host through SSH
- **Remote forwarding** – Forward remote port to local host through SSH
- **Dynamic forwarding** – SOCKS proxy through SSH connection
- **Jump host** – Intermediate host for accessing isolated networks
- **Multiplexing** – Reusing single TCP connection for multiple SSH sessions
- **ControlMaster** – SSH option for connection multiplexing

## Architecture Notes
- SSH uses a client-server model with encrypted transport layer
- Key exchange establishes encrypted channel before authentication
- SSH supports multiple authentication methods: publickey, password, keyboard-interactive, GSSAPI
- SSH connections can carry multiple channels (shell, exec, forward, SFTP, X11)
- The SSH config file is parsed top-to-bottom; first matching Host block wins

## Key Commands / APIs
- `ssh user@host -i keyfile -p port` – Basic SSH connection
- `ssh-keygen -t ed25519 -f ~/.ssh/keyname` – Key generation
- `ssh-copy-id user@host` – Copy public key to server
- `ssh-agent bash` then `ssh-add ~/.ssh/keyname` – Agent setup
- `scp file user@host:path` – File copy
- `rsync -avz source/ user@host:destination/` – Sync directories
- `sftp user@host` – Interactive file transfer
- `ssh -L 8080:localhost:80 user@host` – Local port forwarding
- `ssh -D 1080 user@host` – SOCKS proxy

## Conventions
- Config file ordering: `Host` blocks from most specific to most general
- `Host` patterns: `*` (all), `*.example.com`, `host1 host2`
- Key naming: `~/.ssh/id_ed25519` (private), `~/.ssh/id_ed25519.pub` (public)
- Config file permissions: 600 for private keys, 644 for public keys, 600 for config
- `authorized_keys` file permissions: 600

## Structure Recommendations
```
~/.ssh/
├── config                 # Host configuration
├── id_ed25519             # Private key
├── id_ed25519.pub         # Public key
├── authorized_keys        # Authorized keys (server-side)
├── known_hosts            # Verified host keys
└── controlmasters/        # Multiplexing socket directory
```

## Keyboard Shortcuts
- `~C` – Open SSH command line (in session)
- `~.` – Terminate connection (force close)
- `~^Z` – Suspend SSH session (bg to move to background)
- `~?` – Display escape sequences help
- `Tab` – Auto-complete hosts from config file and known_hosts
