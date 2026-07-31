# GDScript Best Practices - References

## Type System

### Built-in Types
```gdscript
# Basic types
var boolean: bool = true
var integer: int = 42
var floating: float = 3.14
var string: String = "hello"
var string_name: StringName = &"optimized_string"
var node_path: NodePath = @"Player/Sprite2D"

# Vector types
var vec2: Vector2 = Vector2(1.0, 2.0)
var vec2i: Vector2i = Vector2i(1920, 1080)
var vec3: Vector3 = Vector3(1.0, 2.0, 3.0)
var vec3i: Vector3i = Vector3i(1, 2, 3)
var vec4: Vector4 = Vector4(1.0, 2.0, 3.0, 4.0)

# Color and transform
var color: Color = Color.RED
var transform2d: Transform2D = Transform2D()
var transform3d: Transform3D = Transform3D()

# Collection types
var int_array: Array[int] = [1, 2, 3]
var string_array: PackedStringArray = ["a", "b", "c"]
var dict: Dictionary = {"key": "value"}
var typed_dict: Dictionary[String, int] = {"a": 1}
```

### Static Typing Rules
- Use `: Type` after variable name
- Use `-> Type` for function return types
- Use `Variant` only when type cannot be determined
- Use `Array[Type]` for typed arrays
- Use `Dictionary[KeyType, ValueType]` for typed dictionaries
- Use `Signal` type for signal references

```gdscript
var health: int = 100
func heal(amount: int) -> void:
    health += amount
func get_name() -> String:
    return "Player"
```

## Code Organization

### Folder Structure
```
res://
├── scripts/
│   ├── entities/
│   ├── managers/
│   ├── systems/
│   └── ui/
├── scenes/
├── resources/
└── autoload/
```

### File Naming
- snake_case for files: `player_controller.gd`
- One class per file
- File name matches main class name (inferred)

### Script Structure
```gdscript
extends Node
class_name CustomClass  # Optional, for custom types

# Signals
signal health_changed(amount: int)

# Enums
enum State { IDLE, RUNNING, JUMPING }

# Constants
const MAX_HEALTH: int = 100

# Exported variables
@export var speed: float = 300.0

# Public variables
var health: int = MAX_HEALTH

# Private variables (convention: _ prefix)
var _state: State = State.IDLE

# Node references
@onready var sprite: Sprite2D = $Sprite2D

# Built-in methods
func _ready() -> void:
    pass

func _process(delta: float) -> void:
    pass

# Public methods
func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)

# Private methods (convention)
func _validate_state(new_state: State) -> bool:
    return new_state != _state
```

## Signal Patterns

### Strong Typing
```gdscript
signal item_collected(item: ItemData, count: int)
signal game_state_changed(new_state: GameState)

func _ready() -> void:
    item_collected.connect(_on_item_collected)

func _on_item_collected(item: ItemData, count: int) -> void:
    print("Collected %d of %s" % [count, item.name])
```

### Autoload Signal Bus
```gdscript
# Autoload: SignalBus.gd
extends Node
signal player_died
signal score_changed(new_score: int)

# Usage
SignalBus.player_died.connect(_on_player_died)
SignalBus.score_changed.emit(100)
```

## Memory Management

### Node Lifecycle
```gdscript
func _ready() -> void:
    add_child(instance)

func _exit_tree() -> void:
    # Clean up connections and timers manually if needed
    if some_signal.is_connected(callable):
        some_signal.disconnect(callable)

# Proper cleanup
node.queue_free()
# For immediate removal:
node.free()
```

### Weak References
```gdscript
var weak_enemy := weakref(enemy_node)
if weak_enemy.get_ref():
    weak_enemy.get_ref().take_damage(10)
```

## Error Handling

### Input Validation
```gdscript
func set_health(value: int) -> void:
    assert(value >= 0, "Health cannot be negative")
    health = clamp(value, 0, max_health)

func load_resource(path: String) -> Resource:
    var resource := ResourceLoader.load(path)
    if resource == null:
        push_error("Failed to load: " + path)
        return null
    return resource
```

### Safe Dictionary Access
```gdscript
var value = dict.get("key", default_value)
var exists = dict.has("key")
```

## Testing

### Gut Framework
```gdscript
# test_player.gd
extends GutTest

func test_player_takes_damage() -> void:
    var player = Player.new()
    player.max_health = 100
    player.health = 100
    player.take_damage(10)
    assert_eq(player.health, 90, "Health should decrease by 10")
```

### Built-in Testing
```gdscript
# Run with: godot --scene test_runner.tscn
func test_health_decrease() -> void:
    var player := preload("res://scenes/entities/player.tscn").instantiate()
    add_child(player)
    await get_tree().process_frame
    player.take_damage(10)
    assert(player.health == 90, "Expected 90, got %d" % player.health)
    remove_child(player)
    player.queue_free()
```

## Documentation Conventions

```gdscript
## Class description
## Handles player movement, health, and inventory
extends CharacterBody2D

## Emitted when health changes, value is new health [0..max_health]
signal health_changed(new_health: int)

## Movement speed in pixels per second
@export var speed: float = 300.0

## Apply damage to player, clamped to [0..max_health]
## @param {int} amount - damage amount
## @returns {void}
func take_damage(amount: int) -> void:
    health = clamp(health - amount, 0, max_health)
    health_changed.emit(health)
```

## Performance Guidelines

### Allocation Optimization
```gdscript
# Bad - allocates every frame
func _process(delta: float) -> void:
    var pos := Vector2(global_position.x, global_position.y)

# Good - reuse variables
var _cached_pos: Vector2

func _process(delta: float) -> void:
    _cached_pos = global_position
```

### Hot Path Optimization
```gdscript
# Bad
func _physics_process(delta: float) -> void:
    get_node("Sprite2D").position.x += speed * delta

# Good
@onready var sprite: Sprite2D = $Sprite2D
func _physics_process(delta: float) -> void:
    sprite.position.x += speed * delta
```

## GDScript 2.0 Features (Godot 4)

- Lambda functions: `func(x: int): return x * 2`
- typed arrays: `Array[int]`
- typed dictionaries: `Dictionary[String, int]`
- match statement with pattern matching
- await keyword (replaces yield)
- super() for parent class calls
- @tool annotation for editor scripts
- @export for inspector exposure
- @onready for deferred node references
