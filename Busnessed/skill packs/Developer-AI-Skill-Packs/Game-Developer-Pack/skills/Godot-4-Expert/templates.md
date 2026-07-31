# Godot 4 Expert - Templates

## Project Folder Structure Template
```
project_name/
├── .godot/
├── assets/
│   ├── audio/
│   │   ├── sfx/
│   │   └── music/
│   ├── fonts/
│   ├── textures/
│   │   ├── sprites/
│   │   ├── tilesets/
│   │   ├── ui/
│   │   └── environments/
│   └── models/
│       ├── characters/
│       └── environment/
├── scenes/
│   ├── main/
│   ├── levels/
│   ├── entities/
│   ├── ui/
│   └── objects/
├── scripts/
│   ├── entities/
│   ├── managers/
│   ├── systems/
│   └── ui/
├── resources/
│   ├── weapons/
│   ├── items/
│   ├── enemies/
│   └── upgrades/
├── shaders/
├── autoload/
├── addons/
├── ui/
│   └── themes/
├── tests/
├── export/
│   ├── windows/
│   ├── linux/
│   ├── macos/
│   ├── android/
│   ├── ios/
│   └── web/
├── docs/
├── .gitignore
├── project.godot
└── README.md
```

## Scene Structure Templates

### 2D Game Root
```
GameRoot (Node2D)
├── World (Node2D)
│   ├── Environment (TileMap / ParallaxBackground)
│   ├── Entities (Node2D)
│   │   ├── Player (CharacterBody2D)
│   │   └── Enemies (Node2D)
│   ├── Objects (Node2D)
│   └── Spawners (Node2D)
├── UI (CanvasLayer)
│   ├── HUD (Control)
│   ├── PauseMenu (Control) - visible = false
│   └── GameOverScreen (Control) - visible = false
└── Systems (Node)
    ├── WaveManager (Node)
    └── SpawnManager (Node)
```

### 3D Game Root
```
GameRoot (Node3D)
├── WorldEnvironment (WorldEnvironment)
├── World (Node3D)
│   ├── Environment (MeshInstance3D / GridMap)
│   ├── Entities (Node3D)
│   │   ├── Player (CharacterBody3D)
│   │   └── Enemies (Node3D)
│   ├── Lights (Node3D)
│   │   ├── DirectionalLight3D
│   │   └── WorldEnvironment
│   └── Navigation (NavigationRegion3D)
├── UI (CanvasLayer)
└── Systems (Node)
```

### UI Screen
```
ScreenRoot (Control) - full_rect = true, mouse_filter = Ignore
├── VBoxContainer - alignment = center
│   ├── TitleLabel (Label) - theme font sizes
│   ├── Spacer (Control) - size_flags_stretch_ratio
│   ├── ButtonsContainer (VBoxContainer)
│   │   ├── StartButton (Button)
│   │   ├── OptionsButton (Button)
│   │   └── QuitButton (Button)
│   └── VersionLabel (Label) - align = bottom
├── Background (ColorRect / TextureRect)
└── TransitionOverlay (ColorRect) - visible = false
```

## Autoload Template

### GameManager.gd (Autoload)
```gdscript
extends Node

signal game_state_changed(new_state: GameState)
signal scene_changing(from: String, to: String)
signal scene_changed(scene_name: String)

enum GameState { MENU, PLAYING, PAUSED, GAME_OVER, VICTORY, LOADING }

var current_state: GameState = GameState.MENU:
    set(value):
        if current_state != value:
            var old = current_state
            current_state = value
            game_state_changed.emit(value)
            handle_state_change(old, value)

var current_scene: String = ""
var previous_scene: String = ""

var save_path: String = "user://savegame.dat"
var settings_path: String = "user://settings.cfg"

var settings: Dictionary = {
    "master_volume": 1.0,
    "music_volume": 0.8,
    "sfx_volume": 1.0,
    "fullscreen": false,
    "vsync": true,
    "resolution": Vector2i(1920, 1080),
    "language": "en"
}

func _ready() -> void:
    process_mode = PROCESS_MODE_ALWAYS
    load_settings()

func change_scene(scene_path: String, transition_time: float = 0.5) -> void:
    previous_scene = current_scene
    current_scene = scene_path
    scene_changing.emit(previous_scene, scene_path)
    current_state = GameState.LOADING
    await get_tree().create_timer(transition_time).timeout
    var packed := load(scene_path) as PackedScene
    get_tree().change_scene_to_packed(packed)
    await get_tree().process_frame
    current_state = GameState.PLAYING
    scene_changed.emit(scene_path)

func handle_state_change(old_state: GameState, new_state: GameState) -> void:
    match new_state:
        GameState.PAUSED:
            get_tree().paused = true
        GameState.PLAYING:
            get_tree().paused = false
        GameState.MENU:
            get_tree().paused = false

func save_game(data: Dictionary) -> void:
    var file := FileAccess.open(save_path, FileAccess.WRITE)
    file.store_var(data)
    file.close()

func load_game() -> Dictionary:
    if not FileAccess.file_exists(save_path):
        return {}
    var file := FileAccess.open(save_path, FileAccess.READ)
    var data := file.get_var()
    file.close()
    return data

func save_settings() -> void:
    var config := ConfigFile.new()
    for key in settings.keys():
        config.set_value("settings", key, settings[key])
    config.save(settings_path)

func load_settings() -> void:
    var config := ConfigFile.new()
    if config.load(settings_path) == OK:
        for key in settings.keys():
            if config.has_section_key("settings", key):
                settings[key] = config.get_value("settings", key)
```

## State Machine Template

### state_machine.gd
```gdscript
extends Node

class_name StateMachine

@export var initial_state: State

var current_state: State
var states: Dictionary = {}

signal state_changed(state_name: String)

func _ready() -> void:
    for child in get_children():
        if child is State:
            states[child.name.to_lower()] = child
            child.state_machine = self
            child.transition_requested.connect(_on_transition_requested)
    if initial_state:
        change_to(initial_state.name.to_lower())

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
    if new_state == null or new_state == current_state:
        return
    if current_state:
        current_state.exit()
    current_state = new_state
    current_state.enter()
    state_changed.emit(state_name)

func _on_transition_requested(from: State, to: String) -> void:
    if from == current_state:
        change_to(to)
```

### state.gd
```gdscript
extends Node

class_name State

var state_machine: StateMachine

signal transition_requested(from: State, to: String)

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
```

### Example states
# idle_state.gd
```gdscript
extends State

@onready var player: CharacterBody2D = owner

func enter() -> void:
    player.velocity.x = 0

func update(delta: float) -> void:
    if Input.get_axis("move_left", "move_right") != 0:
        transition_requested.emit(self, "run")
    if Input.is_action_just_pressed("jump") and player.is_on_floor():
        transition_requested.emit(self, "jump")
```

# run_state.gd
```gdscript
extends State

@onready var player: CharacterBody2D = owner

func enter() -> void:
    pass

func update(delta: float) -> void:
    var direction := Input.get_axis("move_left", "move_right")
    if direction == 0:
        transition_requested.emit(self, "idle")
    if Input.is_action_just_pressed("jump") and player.is_on_floor():
        transition_requested.emit(self, "jump")
```

## Resource Definition Template

### item_data.gd
```gdscript
extends Resource

class_name ItemData

enum ItemType { CONSUMABLE, EQUIPMENT, KEY_ITEM, UPGRADE }
enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }

@export var item_name: String = "Item"
@export var description: String = ""
@export var item_type: ItemType = ItemType.CONSUMABLE
@export var rarity: Rarity = Rarity.COMMON
@export var icon: Texture2D
@export var value: int = 0
@export var stackable: bool = true
@export var max_stack: int = 99
@export var scene_model: PackedScene
@export var effects: Array[ItemEffectResource]
@export var equip_slot: String = ""
@export var requirements: Dictionary = {}
```

## Signal Bus Template

### signal_bus.gd (Autoload)
```gdscript
extends Node

# Game events
signal game_started
signal game_over(final_score: int)
signal game_paused
signal game_resumed
signal level_completed(level_id: String, score: int)

# Player events
signal player_damaged(amount: int, source: Node)
signal player_healed(amount: int)
signal player_died
signal player_respawned

# Combat events
signal enemy_spawned(enemy: Node, wave: int)
signal enemy_killed(enemy: Node, killer: Node)
signal damage_dealt(source: Node, target: Node, amount: int)
signal projectile_fired(projectile: Node, weapon: Node)

# Score events
signal score_added(points: int, source: String)
signal combo_updated(multiplier: float)
signal high_score_achieved(score: int)

# UI events
signal ui_button_pressed(button_name: String)
signal menu_opened(menu_name: String)
signal menu_closed(menu_name: String)
signal notification_shown(message: String, type: String)
signal health_bar_updated(current: int, max: int)

# Audio events
signal sfx_played(sound: AudioStream, position: Vector2)
signal music_changed(track: AudioStream)
signal volume_changed(bus: String, volume: float)

# Save events
signal game_saved(slot: int)
signal game_loaded(slot: int)
signal save_failed(error: String)

# Input events
signal action_pressed(action: String)
signal action_released(action: String)
signal device_connected(device_id: int)
signal device_disconnected(device_id: int)
```

## Save/Load System Template

### save_manager.gd
```gdscript
extends Node

class_name SaveManager

const SAVE_DIR := "user://saves/"
const SAVE_EXT := ".sav"
const MAX_SLOTS := 20
const BACKUP_COUNT := 3

signal save_completed(slot: int, save_data: Dictionary)
signal load_completed(slot: int, save_data: Dictionary)
signal save_failed(slot: int, error: String)
signal load_failed(slot: int, error: String)

func _ready() -> void:
    DirAccess.make_dir_recursive_absolute(SAVE_DIR)

func save_game(slot: int, data: Dictionary) -> void:
    data["_meta"] = {
        "timestamp": Time.get_unix_time_from_system(),
        "godot_version": Engine.get_version_info().string,
        "version": ProjectSettings.get_setting("application/config/version", "1.0")
    }
    data["_checksum"] = hash(data)

    var path := SAVE_DIR + "slot_%d" % slot + SAVE_EXT
    create_backup(path)

    var file := FileAccess.open(path, FileAccess.WRITE)
    if file == null:
        save_failed.emit(slot, FileAccess.get_open_error())
        return
    file.store_var(data, true)
    file.close()
    save_completed.emit(slot, data)

func load_save(slot: int) -> Dictionary:
    var path := SAVE_DIR + "slot_%d" % slot + SAVE_EXT
    if not FileAccess.file_exists(path):
        load_failed.emit(slot, "Save file not found")
        return {}

    var file := FileAccess.open(path, FileAccess.READ)
    if file == null:
        load_failed.emit(slot, FileAccess.get_open_error())
        return {}

    var data := file.get_var(true)
    file.close()

    if data.get("_checksum") != hash(data):
        var backup := try_restore_backup(path)
        if backup.size() > 0:
            data = backup
        else:
            load_failed.emit(slot, "Checksum mismatch and no backup")
            return {}

    load_completed.emit(slot, data)
    return data

func get_save_info(slot: int) -> Dictionary:
    var data := load_save(slot)
    if data.is_empty():
        return {}
    return {
        "slot": slot,
        "exists": true,
        "timestamp": data.get("_meta", {}).get("timestamp", 0),
        "version": data.get("_meta", {}).get("version", ""),
        "preview": data.get("_preview", {})
    }

func list_saves() -> Array[Dictionary]:
    var saves: Array[Dictionary] = []
    for i in range(MAX_SLOTS):
        var path := SAVE_DIR + "slot_%d" % i + SAVE_EXT
        if FileAccess.file_exists(path):
            saves.append(get_save_info(i))
    return saves

func delete_save(slot: int) -> void:
    var path := SAVE_DIR + "slot_%d" % slot + SAVE_EXT
    if FileAccess.file_exists(path):
        DirAccess.remove_absolute(path)
    for i in range(BACKUP_COUNT):
        var backup_path := path + ".backup%d" % i
        if FileAccess.file_exists(backup_path):
            DirAccess.remove_absolute(backup_path)

func create_backup(path: String) -> void:
    if not FileAccess.file_exists(path):
        return
    for i in range(BACKUP_COUNT - 1, 0, -1):
        var old_path := path + ".backup%d" % (i - 1)
        var new_path := path + ".backup%d" % i
        if FileAccess.file_exists(old_path):
            DirAccess.rename_absolute(old_path, new_path)
    DirAccess.copy_absolute(path, path + ".backup0")

func try_restore_backup(path: String) -> Dictionary:
    for i in range(BACKUP_COUNT):
        var backup_path := path + ".backup%d" % i
        if FileAccess.file_exists(backup_path):
            var file := FileAccess.open(backup_path, FileAccess.READ)
            if file:
                var data := file.get_var(true)
                file.close()
                if data.get("_checksum") == hash(data):
                    return data
    return {}
```
