# Godot 4 Expert - Snippets

## Node Reference Patterns

```gdscript
# @onready pattern (preferred)
@onready var sprite: Sprite2D = $Visual/Sprite2D
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var health_bar: ProgressBar = $UI/HealthBar

# Typed node reference (for autoloads)
@onready var game_manager: GameManager = get_node("/root/GameManager")

# Safe access with is_instance_valid
if is_instance_valid(enemy):
    enemy.take_damage(10)

# Group-based queries
var enemies: Array[Node] = get_tree().get_nodes_in_group("enemies")
for enemy in enemies:
    if enemy.has_method("take_damage"):
        enemy.take_damage(10)

# Owner pattern for nested scripts
func get_health_component() -> HealthComponent:
    return owner.find_child("HealthComponent") as HealthComponent
```

## Signal Connection Patterns

```gdscript
# Basic connection
button.pressed.connect(_on_button_pressed)
health_component.health_depleted.connect(_on_health_depleted)

# One-shot connection
timer.timeout.connect(_on_timer_timeout, CONNECT_ONE_SHOT)

# With extra arguments (bind)
button.pressed.connect(_on_item_pressed.bind(item_data))

# Signal bus pattern
SignalBus.player_damaged.connect(_on_player_damaged)
SignalBus.score_updated.connect(_on_score_updated)

# Custom signal with typed arguments
signal item_collected(item: ItemData, amount: int)
item_collected.emit(potion_data, 3)

# Disconnecting
if health_component.health_changed.is_connected(_on_health_changed):
    health_component.health_changed.disconnect(_on_health_changed)

# Await signal
await get_tree().create_timer(1.0).timeout
var result: Dictionary = await http_request.request_completed
```

## Physics Movement

```gdscript
# CharacterBody2D - Platformer
extends CharacterBody2D

@export var speed: float = 300.0
@export var jump_velocity: float = -400.0
@export var acceleration: float = 1200.0
@export var friction: float = 800.0

var gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity.y += gravity * delta

    var direction := Input.get_axis("move_left", "move_right")
    if direction != 0:
        velocity.x = move_toward(velocity.x, direction * speed, acceleration * delta)
    else:
        velocity.x = move_toward(velocity.x, 0, friction * delta)

    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    move_and_slide()

# CharacterBody2D - Top-down
extends CharacterBody2D

@export var speed: float = 200.0

func _physics_process(delta: float) -> void:
    var input_dir := Input.get_vector("move_left", "move_right", "move_up", "move_down")
    velocity = input_dir * speed
    move_and_slide()

# RigidBody2D - Physics object
extends RigidBody2D

func _ready() -> void:
    mass = 5.0
    gravity_scale = 1.0
    contact_monitor = true
    max_contacts_reported = 5
    body_entered.connect(_on_body_entered)

func apply_explosion(force: float, origin: Vector2) -> void:
    var direction := global_position.direction_to(origin)
    apply_central_impulse(-direction * force)

# Area2D - Detection zone
extends Area2D

func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node2D) -> void:
    if body.is_in_group("player"):
        body.take_damage(10)

func _on_body_exited(body: Node2D) -> void:
    if body.is_in_group("player"):
        body.stop_taking_damage()
```

## Animation Trigger

```gdscript
# Animation trigger from script
@onready var anim_player: AnimationPlayer = $AnimationPlayer

func play_attack() -> void:
    anim_player.play("attack")
    await anim_player.animation_finished
    anim_player.play("idle")

# AnimationTree state machine
@onready var animation_tree: AnimationTree = $AnimationTree
@onready var state_machine: AnimationNodeStateMachinePlayback = animation_tree["parameters/playback"]

func set_movement_state(state: String) -> void:
    state_machine.travel(state)

# BlendSpace2D parameter setting
animation_tree.set("parameters/IdleWalk/blend_position", move_direction)
animation_tree.set("parameters/aim_blend/blend_position", aim_direction)

# AnimationPlayer method track
# Add method call track in AnimationPlayer:
# At 0.5s: NodePath = AudioStreamPlayer2D, Method = play
# At 1.0s: NodePath = Player, Method = attack_finished

# One-shot animation
func play_one_shot(anim_name: String) -> void:
    var anim := AnimationPlayer.new()
    add_child(anim)
    anim.play(anim_name)
    await anim.animation_finished
    anim.queue_free()
```

## Resource Loading

```gdscript
# Preload at script level (cached at parse time)
const PISTOL_DATA: WeaponData = preload("res://resources/weapons/pistol.tres")
const BULLET_SCENE: PackedScene = preload("res://scenes/entities/projectile.tscn")

# Load at runtime
var weapon_data: WeaponData = load("res://resources/weapons/shotgun.tres")

# ResourceLoader with error handling
func load_resource_safe(path: String):
    var resource: Resource = ResourceLoader.load(path)
    if resource == null:
        push_error("Failed to load: " + path)
        return null
    return resource

# Background loading
func load_scene_async(path: String) -> void:
    var loader := ResourceLoader.load_threaded_request(path)
    while true:
        var progress: Array[float] = []
        var status := ResourceLoader.load_threaded_get_status(path, progress)
        if status == ResourceLoader.THREAD_LOAD_IN_PROGRESS:
            update_loading_bar(progress[0])
            await get_tree().process_frame
        elif status == ResourceLoader.THREAD_LOAD_LOADED:
            var scene: PackedScene = ResourceLoader.load_threaded_get(path)
            get_tree().change_scene_to_packed(scene)
            break
        else:
            push_error("Failed to load scene: " + path)
            break

# Resource instantiation
func spawn_bullet(pos: Vector2, dir: Vector2) -> void:
    var bullet := BULLET_SCENE.instantiate() as Projectile
    bullet.global_position = pos
    bullet.direction = dir
    add_child(bullet)
```

## Scene Transitions

```gdscript
# Direct scene change
get_tree().change_scene_to_file("res://scenes/main/Level01.tscn")

# PackedScene change
var level_scene: PackedScene = preload("res://scenes/main/Level02.tscn")
get_tree().change_scene_to_packed(level_scene)

# Fade transition
func transition_to_scene(scene_path: String) -> void:
    var transition := preload("res://scenes/ui/TransitionOverlay.tscn").instantiate()
    get_tree().current_scene.add_child(transition)
    transition.play_fade_out()
    await transition.fade_out_completed
    get_tree().change_scene_to_file(scene_path)
    var new_scene := get_tree().current_scene
    new_scene.add_child(transition)
    transition.play_fade_in()

# Loading screen
func load_scene_with_loading_screen(scene_path: String) -> void:
    get_tree().change_scene_to_file("res://scenes/ui/LoadingScreen.tscn")
    var loader := ResourceLoader.load_threaded_request(scene_path)
    while ResourceLoader.load_threaded_get_status(scene_path) == ResourceLoader.THREAD_LOAD_IN_PROGRESS:
        await get_tree().process_frame
    var scene: PackedScene = ResourceLoader.load_threaded_get(scene_path)
    get_tree().change_scene_to_packed(scene)
```

## Input Handling

```gdscript
# Action-based input
var direction := Input.get_axis("move_left", "move_right")
var jump_just_pressed := Input.is_action_just_pressed("jump")
var fire_pressed := Input.is_action_pressed("fire")

# InputEvent handling
func _input(event: InputEvent) -> void:
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
        handle_click(event.position)

    if event is InputEventKey and event.keycode == KEY_ESCAPE and event.pressed:
        GameManager.toggle_pause()

# Input buffer for precise timing
var jump_buffer_timer := 0.0
const JUMP_BUFFER_TIME := 0.1

func _input(event: InputEvent) -> void:
    if event.is_action_pressed("jump"):
        jump_buffer_timer = JUMP_BUFFER_TIME

func _physics_process(delta: float) -> void:
    jump_buffer_timer = max(0.0, jump_buffer_timer - delta)
    if jump_buffer_timer > 0.0 and is_on_floor():
        velocity.y = jump_velocity
        jump_buffer_timer = 0.0

# Touch input
func _unhandled_input(event: InputEvent) -> void:
    if event is InputEventScreenTouch and event.pressed:
        var touch_pos := event.position
        if touch_pos.x < get_viewport().size.x / 2:
            move_left()
        else:
            move_right()

# Custom input remapping
func remap_action(action: String, event: InputEvent) -> void:
    var input_map := InputMap
    input_map.action_erase_events(action)
    input_map.action_add_event(action, event)
```

## Save/Load

```gdscript
# Resource-based save
extends Resource
class_name SaveData

@export var player_data: Dictionary = {}
@export var world_data: Dictionary = {}
@export var inventory: Array[Dictionary] = []
@export var game_flags: Dictionary = {}
@export var timestamp: int = 0

func create_snapshot() -> SaveData:
    var data := SaveData.new()
    data.player_data = {
        "position": PlayerManager.player.global_position,
        "health": PlayerManager.player.health,
        "max_health": PlayerManager.player.max_health
    }
    data.world_data = {
        "current_level": GameManager.current_level,
        "enemies_defeated": GameManager.enemies_defeated,
        "time_elapsed": GameManager.time_elapsed
    }
    data.inventory = InventoryManager.serialize_inventory()
    data.game_flags = GameManager.flags.duplicate()
    data.timestamp = Time.get_unix_time_from_system()
    return data

func save_to_file(path: String) -> void:
    ResourceSaver.save(self, path)

static func load_from_file(path: String) -> SaveData:
    return ResourceLoader.load(path) as SaveData

# ConfigFile save
func save_settings() -> void:
    var config := ConfigFile.new()
    config.set_value("display", "fullscreen", DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN)
    config.set_value("display", "resolution", DisplayServer.window_get_size())
    config.set_value("audio", "master_volume", AudioServer.get_bus_volume_db(AudioServer.get_bus_index("Master")))
    config.set_value("audio", "music_volume", AudioServer.get_bus_volume_db(AudioServer.get_bus_index("Music")))
    config.save("user://settings.cfg")

func load_settings() -> void:
    var config := ConfigFile.new()
    if config.load("user://settings.cfg") != OK:
        return
    if config.has_section_key("display", "fullscreen"):
        OS.window_fullscreen = config.get_value("display", "fullscreen")
    if config.has_section_key("display", "resolution"):
        OS.window_size = config.get_value("display", "resolution")
```

## Random Generation

```gdscript
# Random number helpers
func randf_range(min_val: float, max_val: float) -> float:
    return randf() * (max_val - min_val) + min_val

func randi_range(min_val: int, max_val: int) -> int:
    return randi() % (max_val - min_val + 1) + min_val

# Weighted random selection
func weighted_random(weights: Dictionary) -> Variant:
    var total := 0.0
    for weight in weights.values():
        total += weight
    var roll := randf() * total
    var cumulative := 0.0
    for key in weights.keys():
        cumulative += weights[key]
        if roll <= cumulative:
            return key
    return weights.keys().back()

# Shuffle array
func shuffle_array(array: Array) -> Array:
    var shuffled := array.duplicate()
    shuffled.shuffle()
    return shuffled

# Random spawn position
func random_spawn_in_rect(rect: Rect2, margin: float = 0.0) -> Vector2:
    return Vector2(
        randf_range(rect.position.x + margin, rect.position.x + rect.size.x - margin),
        randf_range(rect.position.y + margin, rect.position.y + rect.size.y - margin)
    )

# Procedural generation: simple noise-based terrain
@onready var noise := FastNoiseLite.new()
noise.seed = randi()
noise.frequency = 0.05
noise.fractal_type = FastNoiseLite.FRACTAL_FBM
noise.fractal_octaves = 4

func get_height(x: float, z: float) -> float:
    return noise.get_noise_2d(x, z)
```

## Audio Management

```gdscript
# Play a sound at a position
func play_sfx(sound: AudioStream, position: Vector2 = Vector2.ZERO) -> void:
    var player := AudioStreamPlayer2D.new()
    player.stream = sound
    player.global_position = position
    player.bus = "SFX"
    add_child(player)
    player.play()
    await player.finished
    player.queue_free()

# Play music with crossfade
func play_music(track: AudioStream, fade_time: float = 1.0) -> void:
    var music_player := AudioStreamPlayer.new()
    music_player.stream = track
    music_player.bus = "Music"
    music_player.volume_db = -80.0
    add_child(music_player)
    music_player.play()
    var tween := create_tween()
    tween.tween_property(music_player, "volume_db", 0.0, fade_time)
    if current_music_player:
        var old := current_music_player
        var fade_out := create_tween()
        fade_out.tween_property(old, "volume_db", -80.0, fade_time)
        fade_out.tween_callback(old.queue_free)
    current_music_player = music_player

# Audio pool for frequent sounds
class AudioPool:
    var players: Array[AudioStreamPlayer2D] = []
    var max_players: int = 8

    func play(stream: AudioStream, position: Vector2) -> void:
        var player := get_free_player()
        if player == null:
            return
        player.stream = stream
        player.global_position = position
        player.play()

    func get_free_player() -> AudioStreamPlayer2D:
        for player in players:
            if not player.playing:
                return player
        if players.size() < max_players:
            var new_player := AudioStreamPlayer2D.new()
            players.append(new_player)
            return new_player
        return null
```
