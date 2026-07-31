# Godot Multiplayer - References

## High-Level Multiplayer API

### Networked MultiplayerPeer
```gdscript
# ENet (UDP-based, recommended)
var peer := ENetMultiplayerPeer.new()
peer.create_server(port, max_clients)
peer.create_client(address, port)

# WebSocket (TCP-based, for web)
var peer := WebSocketMultiplayerPeer.new()
peer.create_server(port, "/")
peer.create_client(url)

# Steam (via Steamworks)
var peer := SteamMultiplayerPeer.new()
peer.create_host(lobby_id)
peer.join_lobby(lobby_id)
```

### MultiplayerAPI
```gdscript
# Access
var multiplayer: MultiplayerAPI = get_tree().get_multiplayer()
multiplayer.multiplayer_peer = peer

# Connection callbacks
multiplayer.peer_connected.connect(_on_peer_connected)
multiplayer.peer_disconnected.connect(_on_peer_disconnected)
multiplayer.connected_to_server.connect(_on_connected_to_server)
multiplayer.connection_failed.connect(_on_connection_failed)
multiplayer.server_disconnected.connect(_on_server_disconnected)

# Properties
multiplayer.is_server() - returns bool
multiplayer.get_unique_id() - returns int
multiplayer.get_remote_sender_id() - returns int (inside RPC)
multiplayer.get_peers() - returns Array[int]
```

## RPC Configuration

### RPC Annotation
```gdscript
@rpc("authority", "call_local", "reliable")
func spawn_enemy(position: Vector3) -> void:
    # Server calls this, executes locally and on peers

@rpc("any_peer", "call_remote", "unreliable_ordered")
func update_position(pos: Vector3, rot: float) -> void:
    # Any peer can call, unreliable but ordered

@rpc("authority", "call_remote", "reliable", 1)
func send_chat_message(sender_id: int, message: String) -> void:
    # Channel 1 for reliable chat messages
```

### RPC Mode Flags
| Flag | Description |
|------|-------------|
| authority | Only server/authority can call |
| any_peer | Any connected peer can call |
| call_local | Execute on calling peer too |
| call_remote | Execute only on remote peers |
| reliable | Guaranteed delivery (TCP-like) |
| unreliable | Best-effort (UDP-like) |
| unreliable_ordered | Unreliable but maintains order |
| <channel> | Channel ID for ordering (0-255) |

### Manual RPC
```gdscript
# Equivalent to annotation
rpc("spawn_enemy", position)
rpc_id(peer_id, "spawn_enemy", position)

# Check if can call
rpc_config("spawn_enemy", MultiplayerAPI.RPC_MODE_AUTHORITY)
```

## Scene Replication

### MultiplayerSpawner
```gdscript
@onready var spawner: MultiplayerSpawner = $MultiplayerSpawner

func _ready() -> void:
    spawner.spawn_function = _spawn_enemy
    spawner.spawn_path = NodePath("")  # Root to add children to

func _spawn_enemy(data: Dictionary) -> Node:
    var enemy := preload("res://enemy.tscn").instantiate()
    enemy.position = data.get("position", Vector3.ZERO)
    return enemy

# Server spawns
func server_spawn_enemy(pos: Vector3) -> void:
    spawner.spawn({"position": pos})
```

### MultiplayerSynchronizer
```gdscript
@onready var synchronizer: MultiplayerSynchronizer = $MultiplayerSynchronizer

func _ready() -> void:
    synchronizer.set_replication_config("health", {
        "sync": true,
        "delta": false
    })

# Properties to sync automatically
@export var health: int = 100:
    set(value):
        health = value
        if health <= 0:
            die()
```

## State Synchronization

### Authoritative Server
```gdscript
# Server has authority over game state
# Client sends inputs, server validates and responds

# Client sends input
func _input(event: InputEvent) -> void:
    if event.is_action_pressed("shoot"):
        rpc_id(1, "request_shoot", get_global_mouse_position())

# Server validates
@rpc("any_peer", "call_local", "reliable")
func request_shoot(target: Vector2) -> void:
    if not multiplayer.is_server():
        return
    # Validate player can shoot
    var shooter := get_node(str(multiplayer.get_remote_sender_id()))
    if shooter and shooter.can_shoot():
        rpc("spawn_bullet", shooter.position, target)
```

### Client Prediction
```gdscript
var local_position: Vector3
var server_position: Vector3

func _physics_process(delta: float) -> void:
    if multiplayer.is_server():
        # Server runs full physics
        move_character(delta)
        rpc("update_position", global_position)
    else:
        # Client predicts
        move_character(delta)
        local_position = global_position
        rpc_id(1, "send_input", input_vector)

# Server reconciliation
@rpc("authority")
func update_position(pos: Vector3) -> void:
    server_position = pos
    # Interpolate toward server position
    global_position = global_position.lerp(server_position, 0.5)
```

## Lag Compensation

### Server-Side Rewind
```gdscript
# Store recent world snapshots
var history: Array[Dictionary] = []
const HISTORY_SIZE: int = 10

func _physics_process(delta: float) -> void:
    history.push_front({
        "time": Time.get_ticks_msec(),
        "positions": get_all_player_positions()
    })
    if history.size() > HISTORY_SIZE:
        history.pop_back()

func compensate_hit(shooter_id: int, target_pos: Vector3, latency: float) -> bool:
    var rewind_time := Time.get_ticks_msec() - int(latency * 1000.0)
    for snapshot in history:
        if snapshot.time <= rewind_time:
            return check_hit_at_time(snapshot, shooter_id, target_pos)
    return false
```

## Matchmaking

### Simple Lobby System
```gdscript
var lobbies: Dictionary = {}

func create_lobby(lobby_name: String, max_players: int) -> int:
    var lobby_id := randi()
    lobbies[lobby_id] = {
        "name": lobby_name,
        "host_id": multiplayer.get_unique_id(),
        "players": [multiplayer.get_unique_id()],
        "max_players": max_players,
        "state": "waiting"
    }
    return lobby_id

func join_lobby(lobby_id: int) -> void:
    if lobbies.has(lobby_id):
        var lobby = lobbies[lobby_id]
        if lobby.players.size() < lobby.max_players:
            lobby.players.append(multiplayer.get_unique_id())
```

## Dedicated Server

### Headless Mode
```bash
# Run without graphics
godot --headless --server scene.tscn

# In code
func _ready() -> void:
    if DisplayServer.get_name() == "headless":
        start_dedicated_server()
```

### Server Build
```gdscript
# Export as "Dedicated Server" preset
# Disable everything in the template
func start_dedicated_server() -> void:
    # No rendering, no audio
    AudioServer.set_bus_count(0)
    # Set up networking
    var peer := ENetMultiplayerPeer.new()
    peer.create_server(port, max_players)
    multiplayer.multiplayer_peer = peer
```

## Anti-Cheat Considerations

- Never trust client authority
- Validate all RPC parameters on server
- Use checksums for game state integrity
- Server-authoritative for critical game state
- Rate limit RPC calls per client
- Encrypt sensitive network data
- Use variable delta compression to hide data patterns
- Detect speed hacks with server timestamp validation
