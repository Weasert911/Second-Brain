# Godot Multiplayer - Examples

## Simple Lobby System

```gdscript
# LobbyManager.gd (Autoload)
extends Node

signal lobby_created(lobby_id: int)
signal lobby_joined(lobby_id: int)
signal player_joined(player_id: int)
signal player_left(player_id: int)
signal game_starting

var peer: ENetMultiplayerPeer
var player_data: Dictionary = {}  # {peer_id: {"name": String, "ready": bool}}
var is_host: bool = false
var lobby_id: int = 0

const DEFAULT_PORT: int = 31415
const MAX_PLAYERS: int = 4

func host_game(port: int = DEFAULT_PORT) -> void:
    peer = ENetMultiplayerPeer.new()
    var error := peer.create_server(port, MAX_PLAYERS)
    if error != OK:
        push_error("Failed to create server: ", error)
        return

    multiplayer.multiplayer_peer = peer
    multiplayer.peer_connected.connect(_on_player_connected)
    multiplayer.peer_disconnected.connect(_on_player_disconnected)

    is_host = true
    player_data[multiplayer.get_unique_id()] = {"name": PlayerManager.player_name, "ready": false}
    lobby_created.emit(port)
    print("Hosting game on port ", port)

func join_game(address: String, port: int = DEFAULT_PORT) -> void:
    peer = ENetMultiplayerPeer.new()
    var error := peer.create_client(address, port)
    if error != OK:
        push_error("Failed to join server: ", error)
        return

    multiplayer.multiplayer_peer = peer
    multiplayer.connected_to_server.connect(_on_connected_to_server)
    multiplayer.connection_failed.connect(_on_connection_failed)
    multiplayer.server_disconnected.connect(_on_server_disconnected)

func _on_player_connected(player_id: int) -> void:
    print("Player connected: ", player_id)
    if is_host:
        _sync_player_list()
        rpc_id(player_id, "set_player_data", player_data)

func _on_player_disconnected(player_id: int) -> void:
    print("Player disconnected: ", player_id)
    player_data.erase(player_id)
    player_left.emit(player_id)
    if is_host:
        _sync_player_list()

func _on_connected_to_server() -> void:
    print("Connected to server")
    var my_id := multiplayer.get_unique_id()
    player_data[my_id] = {"name": PlayerManager.player_name, "ready": false}
    lobby_joined.emit(0)

func _on_connection_failed() -> void:
    push_error("Failed to connect to server")

func _on_server_disconnected() -> void:
    print("Disconnected from server")
    player_data.clear()
    is_host = false

@rpc("authority", "call_remote", "reliable")
func set_player_data(data: Dictionary) -> void:
    player_data = data
    for pid in player_data.keys():
        if pid != multiplayer.get_unique_id():
            player_joined.emit(pid)

func _sync_player_list() -> void:
    rpc("set_player_data", player_data)

@rpc("any_peer", "call_remote", "reliable")
func set_ready(ready: bool) -> void:
    var sender := multiplayer.get_remote_sender_id()
    if player_data.has(sender):
        player_data[sender]["ready"] = ready
    if is_host and _all_ready():
        rpc("start_game")

@rpc("authority", "call_local", "reliable")
func start_game() -> void:
    game_starting.emit()

func _all_ready() -> bool:
    if player_data.size() < 2:
        return false
    for data in player_data.values():
        if not data["ready"]:
            return false
    return true
```

## Authoritative Player Movement

```gdscript
# Player.gd
extends CharacterBody3D

@export var speed: float = 5.0
@export var jitter_threshold: float = 0.1

var input_vector: Vector2 = Vector2.ZERO
var server_position: Vector3
var server_velocity: Vector3
var is_authority: bool = false

@rpc("authority")
func set_server_authority() -> void:
    is_authority = false

func _ready() -> void:
    if multiplayer.is_server():
        is_authority = true
    else:
        rpc_id(1, "request_authority")

@rpc("any_peer", "call_remote", "reliable")
func request_authority() -> void:
    if not multiplayer.is_server():
        return
    var caller := multiplayer.get_remote_sender_id()
    rpc_id(caller, "grant_authority")

@rpc("authority", "call_remote", "reliable")
func grant_authority() -> void:
    is_authority = true

func _input(event: InputEvent) -> void:
    if not is_authority:
        return
    if event.is_action_pressed("move_left"):
        input_vector.x = -1
    elif event.is_action_released("move_left"):
        input_vector.x = 0
    if event.is_action_pressed("move_right"):
        input_vector.x = 1
    elif event.is_action_released("move_right"):
        input_vector.x = 0
    if event.is_action_pressed("move_forward"):
        input_vector.y = -1
    elif event.is_action_released("move_forward"):
        input_vector.y = 0
    if event.is_action_pressed("move_back"):
        input_vector.y = 1
    elif event.is_action_released("move_back"):
        input_vector.y = 0

func _physics_process(delta: float) -> void:
    if is_authority:
        var direction := Vector3(input_vector.x, 0, input_vector.y).normalized()
        velocity = direction * speed
        move_and_slide()
        rpc_unreliable("update_position", global_position, velocity)

func _process(delta: float) -> void:
    if not is_authority:
        # Interpolate toward server position
        global_position = global_position.lerp(server_position, 0.3)

@rpc("any_peer", "unreliable")
func update_position(pos: Vector3, vel: Vector3) -> void:
    if multiplayer.is_server():
        server_position = pos
        server_velocity = vel
        # Relay to other clients
        rpc_unreliable("update_position", pos, vel)
    else:
        server_position = pos
        server_velocity = vel
```

## Scene Replication with MultiplayerSpawner

```gdscript
# GameManager.gd (Autoload)
extends Node

@onready var spawner: MultiplayerSpawner = $MultiplayerSpawner

func _ready() -> void:
    spawner.spawn_function = _spawn_player
    multiplayer.peer_connected.connect(_on_player_connected)

func _on_player_connected(player_id: int) -> void:
    if multiplayer.is_server():
        spawner.spawn({"player_id": player_id})

func _spawn_player(data: Dictionary) -> Node:
    var player_scene := preload("res://scenes/entities/player.tscn")
    var player := player_scene.instantiate()
    player.name = str(data["player_id"])
    player.position = Vector3(randf_range(-10, 10), 0, randf_range(-10, 10))
    return player
```

## Chat System

```gdscript
# ChatManager.gd
extends Node

signal message_received(sender_name: String, message: String)

@rpc("any_peer", "reliable")
func send_chat_message(message: String) -> void:
    var sender_id := multiplayer.get_remote_sender_id()
    var sender_name := LobbyManager.player_data.get(sender_id, {}).get("name", "Unknown")
    rpc("receive_message", sender_name, message)

@rpc("authority", "call_local", "reliable")
func receive_message(sender_name: String, message: String) -> void:
    message_received.emit(sender_name, message)

# Usage
func send_message(text: String) -> void:
    rpc("send_chat_message", text)

func _on_message_received(sender_name: String, message: String) -> void:
    chat_log.text += "[%s] %s\n" % [sender_name, message]
```
