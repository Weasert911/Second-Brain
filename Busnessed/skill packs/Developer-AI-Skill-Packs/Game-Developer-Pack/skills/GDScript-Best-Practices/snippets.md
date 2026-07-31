# GDScript Best Practices - Snippets

## Type Annotations

```gdscript
var health: int = 100
var speed: float = 300.0
var name: String = "Player"
var position: Vector2 = Vector2.ZERO
var items: Array[ItemData] = []
var map: Dictionary[String, int] = {}
var is_alive: bool = true
func attack(target: Node, damage: int) -> bool:
    return true
```

## Safe Node Access

```gdscript
@onready var sprite := $Sprite2D as Sprite2D
@onready var health_bar := %HealthBar as ProgressBar

func safe_get_parent() -> Node:
    return get_parent() if get_parent() else self

func safe_find_child(name: String) -> Node:
    var child := find_child(name, true, false)
    return child
```

## Dictionary Helpers

```gdscript
var config := {
    "volume": 0.8,
    "fullscreen": false
}

var volume := config.get("volume", 1.0)
config["fullscreen"] = true
var has_key := config.has("brightness")
config.erase("brightness")
var keys := config.keys()
```

## Match Statement

```gdscript
match state:
    State.IDLE:
        play_animation("idle")
    State.RUNNING:
        play_animation("run")
    State.JUMPING:
        play_animation("jump")
    _:
        push_warning("Unknown state: ", state)
```

## Signal Connection

```gdscript
health_changed.connect(_on_health_changed)
health_changed.connect(_on_health_changed, CONNECT_ONE_SHOT)
SignalBus.game_over.connect(_on_game_over)
button.pressed.connect(_on_button_clicked.bind(button_data))
```

## Export Variables

```gdscript
@export var speed: float = 300.0
@export_range(0, 100, 1) var health: int = 100
@export_enum("Slow", "Medium", "Fast") var speed_tier: String = "Medium"
@export_group("Combat")
@export var damage: int = 10
@export var attack_speed: float = 1.0
@export var weapon: PackedScene
@export_multiline var description: String = ""
@export_color_no_alpha var tint: Color = Color.WHITE
```

## Assertions

```gdscript
assert(health >= 0, "Health cannot be negative")
assert(item != null, "Item is null")
assert(not is_processing(), "Should not be processing")
```

## Resource Saving

```gdscript
ResourceSaver.save(resource, "user://data.tres")
var loaded := ResourceLoader.load("user://data.tres") as CustomResource
```
