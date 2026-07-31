# Godot Multiplayer - Snippets

## ENet Setup

```gdscript
var peer := ENetMultiplayerPeer.new()
peer.create_server(port, max_clients)
peer.create_client(address, port)
multiplayer.multiplayer_peer = peer
```

## RPC Patterns

```gdscript
@rpc("authority", "call_local", "reliable")
func spawn_bullet(pos: Vector3, dir: Vector3) -> void:
    pass

@rpc("any_peer", "unreliable")
func update_position(pos: Vector3) -> void:
    pass

rpc("spawn_bullet", position, direction)
rpc_id(target_id, "private_message", data)
```

## Authority Check

```gdscript
func is_server() -> bool:
    return multiplayer.is_server()

func is_owner() -> bool:
    return multiplayer.get_unique_id() == network_id

func get_sender() -> int:
    return multiplayer.get_remote_sender_id()
```

## Scene Spawner

```gdscript
@onready var spawner := $MultiplayerSpawner
spawner.spawn_function = _spawn_func
spawner.spawn({"type": "enemy", "pos": Vector3.ZERO})
```

## State Sync

```gdscript
@rpc("unreliable")
func sync_state(pos: Vector3, rot: float) -> void:
    target_position = pos
    target_rotation = rot

func _process(delta: float) -> void:
    global_position = global_position.lerp(target_position, 0.2)
```

## Lobby Join

```gdscript
multiplayer.peer_connected.connect(_on_join)
multiplayer.peer_disconnected.connect(_on_leave)
multiplayer.connected_to_server.connect(_on_connected)
multiplayer.server_disconnected.connect(_on_disconnected)
```

## Steam Multiplayer

```gdscript
Steam.networkingCreateSession(lobby_id)
Steam.networkingAcceptSession(remote_id)
var peer := SteamMultiplayerPeer.new()
peer.create_host(lobby_id)
peer.join_lobby(lobby_id)
```
