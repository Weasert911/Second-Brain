# GDScript Best Practices - Templates

## Class Template

```gdscript
extends Node
class_name CustomClass

## Signals
signal value_changed(new_value: Variant)

## Enums
enum State { IDLE, ACTIVE, COOLDOWN }

## Constants
const DEFAULT_VALUE: int = 42

## Exports
@export var config_value: int = DEFAULT_VALUE
@export_group("Visual")
@export var color: Color = Color.WHITE

## Public Variables
var state: State = State.IDLE

## Private Variables
var _internal_state: int = 0

## Node References
@onready var child_node: Node = $ChildNode

## Lifecycle
func _init() -> void:
    pass

func _ready() -> void:
    _setup()

func _process(delta: float) -> void:
    pass

func _physics_process(delta: float) -> void:
    pass

func _exit_tree() -> void:
    _cleanup()

## Public Methods
func do_action(parameter: int) -> void:
    _internal_state = parameter
    _on_action_performed()

## Private Methods
func _setup() -> void:
    pass

func _cleanup() -> void:
    pass

func _on_action_performed() -> void:
    state = State.ACTIVE
    value_changed.emit(_internal_state)

## Static Methods
static func calculate(a: int, b: int) -> int:
    return a + b
```

## Signal Bus Template

```gdscript
# autoload/signal_bus.gd
extends Node

# Game Events
signal game_started
signal game_paused
signal game_resumed
signal game_over(score: int, reason: String)

# Player Events
signal player_damaged(amount: int, source: Node)
signal player_healed(amount: int)
signal player_died
signal player_respawned(position: Vector2)

# Combat Events
signal enemy_spawned(enemy: Node)
signal enemy_killed(enemy: Node, killer: Node)

# Score Events
signal score_changed(new_score: int)
signal combo_updated(multiplier: float)

# UI Events
signal button_pressed(button_name: String)
signal menu_opened(menu_name: String)
signal menu_closed(menu_name: String)
signal notification_shown(message: String, type: String)

# Inventory Events
signal item_added(item: ItemData, count: int)
signal item_removed(item: ItemData, count: int)
signal inventory_full
```

## Resource Template

```gdscript
# resources/item_data.gd
extends Resource
class_name ItemData

enum ItemType { CONSUMABLE, EQUIPMENT, KEY_ITEM, WEAPON }
enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }

@export var item_name: String = "Item"
@export var description: String = ""
@export var item_type: ItemType = ItemType.CONSUMABLE
@export var rarity: Rarity = Rarity.COMMON
@export var icon: Texture2D
@export var value: int = 0
@export var max_stack: int = 99
@export var weight: float = 1.0
@export var effects: Array[ItemEffectResource] = []
@export var equip_slot: String = ""
@export var model_scene: PackedScene

func get_rarity_color() -> Color:
    match rarity:
        Rarity.COMMON: return Color.WHITE
        Rarity.UNCOMMON: return Color.GREEN
        Rarity.RARE: return Color.BLUE
        Rarity.EPIC: return Color(0.8, 0.2, 0.8)
        Rarity.LEGENDARY: return Color(1.0, 0.6, 0.0)
    return Color.WHITE
```

## State Machine Template

```gdscript
# state_machine.gd
extends Node
class_name StateMachine

@export var initial_state: State

var current_state: State
var states: Dictionary = {}

signal state_changed(state_name: String)

func _ready() -> void:
    _register_states()
    if initial_state:
        change_to(initial_state.name)

func _register_states() -> void:
    for child in get_children():
        if child is State:
            states[child.name.to_lower()] = child
            child.state_machine = self

func _process(delta: float) -> void:
    if current_state:
        current_state.update(delta)

func _physics_process(delta: float) -> void:
    if current_state:
        current_state.physics_update(delta)

func _input(event: InputEvent) -> void:
    if current_state:
        current_state.handle_input(event)

func change_to(state_name: String) -> void:
    var new_state := states.get(state_name.to_lower())
    if not new_state or new_state == current_state:
        return
    if current_state:
        current_state.exit()
    current_state = new_state
    current_state.enter()
    state_changed.emit(state_name)

# state.gd
extends Node
class_name State

var state_machine: StateMachine

func enter() -> void:
    pass

func exit() -> void:
    pass

func update(delta: float) -> void:
    pass

func physics_update(delta: float) -> void:
    pass

func handle_input(event: InputEvent) -> void:
    pass

func transition_to(state_name: String) -> void:
    state_machine.change_to(state_name)
```

## Manager Singleton Template

```gdscript
# autoload/game_manager.gd
extends Node

signal game_state_changed(new_state: GameState)
signal scene_changing(from: String, to: String)

enum GameState { MENU, PLAYING, PAUSED, LOADING, GAME_OVER }

var current_state: GameState = GameState.MENU:
    set(value):
        if current_state != value:
            current_state = value
            game_state_changed.emit(value)

var score: int = 0
var current_level: String = ""
var difficulty: float = 1.0

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS

func change_level(level_path: String) -> void:
    scene_changing.emit(current_level, level_path)
    current_state = GameState.LOADING
    get_tree().change_scene_to_file(level_path)
    await get_tree().process_frame
    current_level = level_path
    current_state = GameState.PLAYING

func toggle_pause() -> void:
    match current_state:
        GameState.PLAYING:
            current_state = GameState.PAUSED
        GameState.PAUSED:
            current_state = GameState.PLAYING
```

## Autoload Audio Manager Template

```gdscript
# autoload/audio_manager.gd
extends Node

@export var music_bus: String = "Music"
@export var sfx_bus: String = "SFX"
@export var max_sfx_players: int = 16

var _current_music: AudioStreamPlayer
var _sfx_pool: Array[AudioStreamPlayer] = []
var _music_volume: float = 1.0
var _sfx_volume: float = 1.0

func _ready() -> void:
    _init_sfx_pool()
    _load_volumes()

func _init_sfx_pool() -> void:
    for i in range(max_sfx_players):
        var player := AudioStreamPlayer.new()
        player.bus = sfx_bus
        add_child(player)
        _sfx_pool.append(player)

func play_sfx(stream: AudioStream, volume: float = 1.0, pitch: float = 1.0) -> void:
    for player in _sfx_pool:
        if not player.playing:
            player.stream = stream
            player.volume_db = linear_to_db(_sfx_volume * volume)
            player.pitch_scale = pitch
            player.play()
            return

func play_sfx_at_position(stream: AudioStream, position: Vector2, volume: float = 1.0) -> void:
    var player := AudioStreamPlayer2D.new()
    player.stream = stream
    player.global_position = position
    player.volume_db = linear_to_db(_sfx_volume * volume)
    player.bus = sfx_bus
    add_child(player)
    player.play()
    await player.finished
    player.queue_free()

func play_music(stream: AudioStream, fade_time: float = 1.0) -> void:
    if _current_music:
        var old := _current_music
        var tween := create_tween()
        tween.tween_property(old, "volume_db", -80.0, fade_time)
        tween.tween_callback(old.queue_free)

    _current_music = AudioStreamPlayer.new()
    _current_music.stream = stream
    _current_music.bus = music_bus
    _current_music.volume_db = linear_to_db(_music_volume)
    add_child(_current_music)
    _current_music.play()

func set_music_volume(volume: float) -> void:
    _music_volume = clampf(volume, 0.0, 1.0)
    if _current_music and _current_music.playing:
        _current_music.volume_db = linear_to_db(_music_volume)
    _save_volumes()

func set_sfx_volume(volume: float) -> void:
    _sfx_volume = clampf(volume, 0.0, 1.0)
    var db := linear_to_db(_sfx_volume)
    AudioServer.set_bus_volume_db(AudioServer.get_bus_index(sfx_bus), db)
    _save_volumes()

func _load_volumes() -> void:
    var config := ConfigFile.new()
    if config.load("user://audio_settings.cfg") == OK:
        _music_volume = config.get_value("audio", "music_volume", 1.0)
        _sfx_volume = config.get_value("audio", "sfx_volume", 1.0)

func _save_volumes() -> void:
    var config := ConfigFile.new()
    config.set_value("audio", "music_volume", _music_volume)
    config.set_value("audio", "sfx_volume", _sfx_volume)
    config.save("user://audio_settings.cfg")
```
