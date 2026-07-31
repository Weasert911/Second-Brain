# Godot 4 Expert - References

## Official Godot Documentation
- Getting Started: https://docs.godotengine.org/en/stable/getting_started/introduction/index.html
- GDScript Reference: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/index.html
- Node Documentation: https://docs.godotengine.org/en/stable/classes/class_node.html
- SceneTree: https://docs.godotengine.org/en/stable/classes/class_scenetree.html
- Viewport: https://docs.godotengine.org/en/stable/classes/class_viewport.html
- Input: https://docs.godotengine.org/en/stable/classes/class_input.html
- ProjectSettings: https://docs.godotengine.org/en/stable/classes/class_projectsettings.html
- Resource: https://docs.godotengine.org/en/stable/classes/class_resource.html

## Key Classes

### Node
- Base class for all scene objects
- Lifecycle: _init() -> _enter_tree() -> _ready() -> _process(delta) -> _exit_tree()
- Tree notifications: NOTIFICATION_ENTER_TREE, NOTIFICATION_READY, NOTIFICATION_EXIT_TREE
- Child management: add_child(), remove_child(), get_child(), get_children()
- Owner property for scene root identification

### SceneTree
- Access via get_tree()
- Scene change: change_scene_to_file(), change_scene_to_packed()
- Root property returns the Viewport root
- current_scene returns the active scene root
- paused property for global pause
- Network peer management for multiplayer

### Viewport
- Canvas transform for camera movement
- Size and content_scale for resolution handling
- world_2d / world_3d for physics and rendering space
- CanvasItem shader access
- GUI embed mode for sub-viewports

### Input
- Singleton, always available
- Input.is_action_just_pressed() for one-shot input
- Input.is_action_pressed() for continuous input
- Input.get_vector() for analog input
- InputMap for action definition
- InputEvent system for raw event handling

### ProjectSettings
- Access via ProjectSettings singleton
- Custom settings: ProjectSettings.set_setting(), get_setting()
- Input map configuration
- Physics layer names (layer_names/2d_physics)
- Rendering quality settings

### Resource
- Data container, serializable to .tres / .res
- Subclasses: Resource, PackedScene, Texture, Material, Animation
- Custom resources extend Resource directly
- ResourceSaver.save() and ResourceLoader.load()
- @export var for serialization in inspector

## Signal Connection Patterns

### Standard Connection
```gdscript
signal health_changed(new_health: int)
health_changed.connect(_on_health_changed)
func _on_health_changed(new_health: int) -> void:
    pass
```

### One-Shot Connection
```gdscript
signal_done.connect(_on_done, CONNECT_ONE_SHOT)
```

### Signal Bus (Autoload)
```gdscript
# signal_bus.gd
extends Node
signal game_over
signal score_updated(points: int)
signal enemy_killed(enemy: Node)
```

### Cross-Scene Signal
```gdscript
# In any script
SignalBus.score_updated.emit(100)
SignalBus.score_updated.connect(_on_score_updated)
```

## Physics Layer Terminology

| Term | Description |
|------|-------------|
| Collision Layer | Layer this object exists on (2D: 1-32, 3D: 1-32) |
| Collision Mask | Layers this object can collide with |
| Layer Names | Defined in Project > Layer Names > 2D Physics / 3D Physics |
| Area | Detection zone, replaces RayCast for continuous overlap |
| Shape | CollisionShape2D/3D containing Circle, Rectangle, Capsule, etc. |
| move_and_slide() | CharacterBody movement with automatic collision resolution |
| move_and_collide() | Direct movement with collision info returned |

## Animation System

### AnimationPlayer
- Single animation track player
- Track types: property, method, bezier, audio, animation
- Animation length, loop, autoplay on load
- Playback methods: play(), stop(), seek()
- Blend times for crossfade

### AnimationTree
- State machine for blending animations
- AnimationNodeStateMachine for state-based transitions
- AnimationNodeBlendSpace2D/1D for blended movement
- AnimationNodeBlend2 for simple crossfade
- AnimationNodeAnimation for leaf nodes

### BlendSpace2D Configuration
```gdscript
@onready var animation_tree: AnimationTree = $AnimationTree
@onready var state_machine: AnimationNodeStateMachinePlayback = animation_tree.get("parameters/playback")
animation_tree.set("parameters/IdleWalk/blend_position", Vector2(0.0, 0.0))
```

## File System

| Extension | Purpose |
|-----------|---------|
| .tscn | Text scene file (Godot 4 default) |
| .scn | Binary scene file |
| .tres | Text resource file (human-readable) |
| .res | Binary resource file |
| .gd | GDScript source |
| .gdshader | Shader source |
| .import | Import configuration file |
| .theme | Theme resource |
| .otf / .ttf | Font files |

## Conventions

### Naming
- Nodes: PascalCase (Player, HealthBar, MainMenu)
- Variables: snake_case (player_health, is_moving)
- Constants: ALL_CAPS (MAX_SPEED, GRAVITY)
- Signals: snake_case (health_changed, game_over)
- Methods: snake_case (move_character(), update_health())
- Files: snake_case (player_controller.gd, health_bar.tscn)

### Scene Structure
- Root node matches scene purpose (Player, Level_01, MainMenu)
- Children organized by function: Visual, Collision, Script, Audio
- Groups for category tags ("enemies", "collectibles", "interactables")

## Architecture Patterns

### Scene-as-Class
- Each logical game entity is a scene file
- Scene acts as a blueprint (like a class)
- Instance scenes via preload() or load()
- Export variables act as constructor parameters

### Autoload Singletons
- Global state manager (GameState.gd)
- Audio manager (AudioManager.gd)
- Signal bus (SignalBus.gd)
- Save/load manager (SaveManager.gd)
- Scene transition manager (SceneManager.gd)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| F5 | Run project |
| F6 | Run current scene |
| F7 | Run with debugger |
| F8 | Stop project |
| F9 | Toggle breakpoint |
| Ctrl + Space | Autocomplete |
| Ctrl + D | Duplicate line/selection |
| Ctrl + Shift + F | Find in files |
| Ctrl + K | Comment/uncomment line |
| Alt + Click | Multi-cursor |
| Q | Select tool |
| W | Move tool |
| E | Rotate tool |
| R | Scale tool |
| T | Z-Axis transform (3D) |

## Version-Specific Notes (Godot 4.x)

### Godot 4.0
- Initial 4.0 release
- TileMap Layer support
- New AnimationTree system
- Vulkan renderer

### Godot 4.1
- XR stability improvements
- Animation editor enhancements
- FBX importer via OpenAssetIO

### Godot 4.2
- Better .NET integration
- Background loading improvements
- TileSet editor overhaul

### Godot 4.3+
- Additional audio server improvements
- Navigation system updates
- Thread-safe rendering progress
