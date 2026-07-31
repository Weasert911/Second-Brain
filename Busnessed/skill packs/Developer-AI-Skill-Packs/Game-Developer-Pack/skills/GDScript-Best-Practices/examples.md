# GDScript Best Practices - Examples

## Basic Static Typing

```gdscript
extends Node

class_name PlayerStats

signal health_changed(new_health: int)
signal stamina_changed(new_stamina: float)

enum ClassType { WARRIOR, MAGE, ROGUE }

const MAX_HEALTH: int = 100
const MAX_STAMINA: float = 100.0

@export var character_class: ClassType = ClassType.WARRIOR
@export var speed: float = 300.0

var health: int = MAX_HEALTH:
    set(value):
        health = clampi(value, 0, MAX_HEALTH)
        health_changed.emit(health)

var stamina: float = MAX_STAMINA:
    set(value):
        stamina = clampf(value, 0.0, MAX_STAMINA)
        stamina_changed.emit(stamina)

@onready var sprite: Sprite2D = $Visual/Sprite2D
@onready var animation_player: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
    health = MAX_HEALTH
    stamina = MAX_STAMINA

func take_damage(amount: int, damage_type: StringName) -> void:
    var damage_multiplier: float = _get_damage_multiplier(damage_type)
    var final_damage: int = ceili(float(amount) * damage_multiplier)
    health -= final_damage

func _get_damage_multiplier(damage_type: StringName) -> float:
    match character_class:
        ClassType.WARRIOR:
            return 0.8 if damage_type == &"physical" else 1.2
        ClassType.MAGE:
            return 0.7 if damage_type == &"magical" else 1.3
        ClassType.ROGUE:
            return 1.0
    return 1.0
```

## Match Statement Usage

```gdscript
enum GameState { MENU, PLAYING, PAUSED, GAME_OVER }

var state: GameState = GameState.MENU

func handle_state_transition(new_state: GameState) -> void:
    match new_state:
        GameState.MENU:
            show_menu()
            hide_game_ui()
        GameState.PLAYING:
            hide_menu()
            show_game_ui()
            get_tree().paused = false
        GameState.PAUSED:
            show_pause_overlay()
            get_tree().paused = true
        GameState.GAME_OVER:
            show_game_over_screen()
            save_high_score()
        _:
            push_error("Unknown game state: ", new_state)
```

## Signal Bus Pattern

```gdscript
# signal_bus.gd (Autoload)
extends Node

signal game_ended(score: int, reason: String)
signal player_damaged(amount: int, attacker: Node)
signal item_collected(item_id: String, count: int)

# player.gd
extends CharacterBody2D

func _ready() -> void:
    SignalBus.game_ended.connect(_on_game_ended)

func die() -> void:
    SignalBus.game_ended.emit(score, "death")

# enemy.gd
extends CharacterBody2D

func attack_player(amount: int) -> void:
    SignalBus.player_damaged.emit(amount, self)
```

## Resource-Based Data

```gdscript
# weapon_data.gd
extends Resource
class_name WeaponData

@export var weapon_name: String
@export var damage: int
@export var fire_rate: float
@export var projectile_speed: float
@export var projectile_scene: PackedScene

# weapon.gd
extends Node2D

@export var weapon_data: WeaponData

func fire() -> void:
    var projectile := weapon_data.projectile_scene.instantiate()
    projectile.damage = weapon_data.damage
    projectile.speed = weapon_data.projectile_speed
    add_child(projectile)
```

## Error Handling

```gdscript
func load_player_data(path: String) -> Dictionary:
    if not FileAccess.file_exists(path):
        push_warning("Save file not found: ", path)
        return _create_default_data()

    var file := FileAccess.open(path, FileAccess.READ)
    if file == null:
        push_error("Failed to open save file: ", path)
        return _create_default_data()

    var data: Dictionary = file.get_var(true)
    file.close()

    if data.is_empty():
        push_error("Save file corrupted: ", path)
        return _create_default_data()

    return data

func parse_inventory_string(input: String) -> Array[Dictionary]:
    var result: Array[Dictionary] = []
    if input.is_empty():
        return result

    var json := JSON.new()
    var parse_result := json.parse(input)
    if parse_result != OK:
        push_error("Invalid inventory JSON: ", json.get_error_message())
        return result

    var parsed = json.get_data()
    if typeof(parsed) != TYPE_ARRAY:
        push_error("Expected array, got ", typeof(parsed))
        return result

    for item in parsed:
        if typeof(item) != TYPE_DICTIONARY:
            continue
        if not item.has("id") or not item.has("count"):
            continue
        result.append(item)

    return result
```

## Unit Testing with Gut

```gdscript
# test_example.gd
extends GutTest

var player: Player

func before_each() -> void:
    player = Player.new()
    player.max_health = 100
    player.health = 100
    add_child_autoqfree(player)

func test_initial_health() -> void:
    assert_eq(player.health, 100, "Starts at max health")

func test_take_damage_reduces_health() -> void:
    player.take_damage(30)
    assert_eq(player.health, 70, "Health reduced by 30")

func test_healing_does_not_exceed_max() -> void:
    player.health = 90
    player.heal(20)
    assert_eq(player.health, 100, "Cannot exceed max health")

func test_zero_damage_does_nothing() -> void:
    player.take_damage(0)
    assert_eq(player.health, 100, "Zero damage no effect")

func test_negative_damage_heals() -> void:
    player.take_damage(-10)
    assert_eq(player.health, 100, "Negative damage capped at max")

func test_inventory_starts_empty() -> void:
    assert_eq(player.inventory.size(), 0, "Empty inventory")

func test_add_item_to_inventory() -> void:
    var item := ItemData.new()
    item.item_name = "Potion"
    player.add_item(item)
    assert_eq(player.inventory.size(), 1, "Item added")
    assert_eq(player.inventory[0].item_name, "Potion")

func test_item_stack_limit() -> void:
    player.max_stack_size = 5
    for i in range(6):
        player.add_item("Potion")
    assert_eq(player.inventory["Potion"], 5, "Stack limited to 5")
```
