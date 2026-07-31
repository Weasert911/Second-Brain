# Godot 4 Expert - Examples

## Beginner: Simple Player Movement (CharacterBody2D)

### Player scene structure
```
Player (CharacterBody2D)
├── Sprite2D
├── CollisionShape2D (Capsule shape)
└── Player.gd
```

### Player.gd
```gdscript
extends CharacterBody2D

@export var speed: float = 300.0
@export var jump_velocity: float = -400.0

var gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity.y += gravity * delta

    var direction := Input.get_axis("move_left", "move_right")
    if direction != 0:
        velocity.x = direction * speed
    else:
        velocity.x = move_toward(velocity.x, 0, speed)

    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    move_and_slide()
```

### Input Map setup (Project > Input Map)
- move_left: A key, Left arrow
- move_right: D key, Right arrow
- jump: Space, W key, Up arrow

---

## Intermediate: Platformer with Animations, Collectibles, and UI

### Game structure
```
Main (Node)
├── World (Node2D)
│   ├── Player (CharacterBody2D)
│   │   ├── Sprite2D
│   │   ├── CollisionShape2D
│   │   └── AnimationPlayer
│   ├── Collectible (Area2D) x N
│   │   ├── Sprite2D
│   │   ├── CollisionShape2D
│   │   └── AnimationPlayer
│   └── LevelGeometry (TileMap)
├── UI (CanvasLayer)
│   ├── ScoreLabel (Label)
│   └── HealthBar (TextureProgressBar)
└── GameManager (Node) - autoload
```

### GameManager.gd (Autoload)
```gdscript
extends Node

signal score_updated(new_score: int)
signal health_updated(new_health: int)
signal game_over

var score: int = 0:
    set(value):
        score = value
        score_updated.emit(score)

var health: int = 3:
    set(value):
        health = max(0, value)
        health_updated.emit(health)
        if health <= 0:
            game_over.emit()

func reset_game() -> void:
    score = 0
    health = 3
```

### Player.gd (Enhanced)
```gdscript
extends CharacterBody2D

@export var speed: float = 300.0
@export var jump_velocity: float = -400.0
@export var acceleration: float = 1200.0
@export var friction: float = 800.0

var gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")
var is_hurt: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var anim_player: AnimationPlayer = $AnimationPlayer
@onready var hurt_timer: Timer = $HurtTimer

func _ready() -> void:
    GameManager.health_updated.connect(_on_health_updated)

func _physics_process(delta: float) -> void:
    if is_hurt:
        return

    if not is_on_floor():
        velocity.y += gravity * delta

    var direction := Input.get_axis("move_left", "move_right")

    if direction != 0:
        velocity.x = move_toward(velocity.x, direction * speed, acceleration * delta)
        sprite.scale.x = sign(direction)
    else:
        velocity.x = move_toward(velocity.x, 0, friction * delta)

    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    update_animation(direction)
    move_and_slide()

func update_animation(direction: float) -> void:
    if is_on_floor():
        if direction != 0:
            anim_player.play("run")
        else:
            anim_player.play("idle")
    else:
        if velocity.y < 0:
            anim_player.play("jump")
        else:
            anim_player.play("fall")

func take_damage(amount: int) -> void:
    if is_hurt:
        return
    GameManager.health -= amount
    is_hurt = true
    hurt_timer.start()
    anim_player.play("hurt")
    velocity.y = jump_velocity * 0.5

func _on_hurt_timer_timeout() -> void:
    is_hurt = false

func _on_health_updated(new_health: int) -> void:
    if new_health <= 0:
        queue_free()
```

### Collectible.gd
```gdscript
extends Area2D

@export var point_value: int = 100
@export var collect_sound: AudioStream

@onready var anim_player: AnimationPlayer = $AnimationPlayer
@onready var audio_player: AudioStreamPlayer2D = $AudioStreamPlayer2D

func _ready() -> void:
    body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node2D) -> void:
    if body.is_in_group("player"):
        GameManager.score += point_value
        set_deferred("monitoring", false)
        anim_player.play("collect")
        audio_player.stream = collect_sound
        audio_player.play()
        await anim_player.animation_finished
        queue_free()
```

### UI.gd (CanvasLayer)
```gdscript
extends CanvasLayer

@onready var score_label: Label = $ScoreLabel
@onready var health_bar: TextureProgressBar = $HealthBar

func _ready() -> void:
    GameManager.score_updated.connect(_on_score_updated)
    GameManager.health_updated.connect(_on_health_updated)

func _on_score_updated(new_score: int) -> void:
    score_label.text = "Score: %d" % new_score

func _on_health_updated(new_health: int) -> void:
    health_bar.value = new_health
    if new_health <= 1:
        health_bar.modulate = Color.RED
    else:
        health_bar.modulate = Color.WHITE
```

---

## Advanced: Modular Weapon System Using Resources

### Resource definitions

### WeaponData.gd
```gdscript
extends Resource

class_name WeaponData

@export var weapon_name: String = "Unnamed"
@export var damage: int = 10
@export var fire_rate: float = 0.5  # seconds between shots
@export var ammo_per_fire: int = 1
@export var max_ammo: int = 30
@export var reload_time: float = 2.0
@export var projectile_scene: PackedScene
@export var muzzle_flash_scene: PackedScene
@export var fire_sound: AudioStream
@export var weapon_icon: Texture2D
@export var spread_degrees: float = 0.0
@export var projectile_count: int = 1
@export var is_automatic: bool = false
@export var damage_falloff_start: float = 0.0
@export var damage_falloff_end: float = 0.0
```

### Weapon.gd
```gdscript
extends Node2D

class_name Weapon

@export var weapon_data: WeaponData

var current_ammo: int
var is_reloading: bool = false
var can_fire: bool = true

signal weapon_fired(weapon: Weapon)
signal ammo_updated(current: int, max: int)
signal reloading_started(reload_time: float)
signal reloading_finished

@onready var fire_timer: Timer = $FireTimer
@onready var reload_timer: Timer = $ReloadTimer
@onready var muzzle: Node2D = $Muzzle

func _ready() -> void:
    current_ammo = weapon_data.max_ammo
    fire_timer.wait_time = weapon_data.fire_rate
    reload_timer.wait_time = weapon_data.reload_time
    fire_timer.timeout.connect(_on_fire_timer_timeout)
    reload_timer.timeout.connect(_on_reload_finished)
    ammo_updated.emit(current_ammo, weapon_data.max_ammo)

func try_fire() -> void:
    if not can_fire or is_reloading:
        return
    if current_ammo <= 0:
        start_reload()
        return
    if not weapon_data.is_automatic and Input.is_action_just_pressed("fire"):
        fire()
    elif weapon_data.is_automatic and Input.is_action_pressed("fire"):
        fire()

func fire() -> void:
    can_fire = false
    current_ammo -= weapon_data.ammo_per_fire
    fire_timer.start()

    for i in range(weapon_data.projectile_count):
        var projectile := weapon_data.projectile_scene.instantiate() as Projectile
        var spread := randf_range(
            -deg_to_rad(weapon_data.spread_degrees),
            deg_to_rad(weapon_data.spread_degrees)
        )
        projectile.damage = weapon_data.damage
        projectile.damage_falloff_start = weapon_data.damage_falloff_start
        projectile.damage_falloff_end = weapon_data.damage_falloff_end
        get_tree().root.add_child(projectile)
        projectile.global_position = muzzle.global_position
        projectile.rotation = muzzle.global_rotation + spread
        projectile.direction = Vector2.RIGHT.rotated(projectile.rotation)

    if weapon_data.muzzle_flash_scene:
        var flash := weapon_data.muzzle_flash_scene.instantiate()
        muzzle.add_child(flash)
        flash.emitting = true

    if weapon_data.fire_sound:
        AudioManager.play_sound(weapon_data.fire_sound, muzzle.global_position)

    weapon_fired.emit(self)
    ammo_updated.emit(current_ammo, weapon_data.max_ammo)

func start_reload() -> void:
    if is_reloading or current_ammo >= weapon_data.max_ammo:
        return
    is_reloading = true
    reloading_started.emit(weapon_data.reload_time)
    reload_timer.start()

func _on_fire_timer_timeout() -> void:
    can_fire = true

func _on_reload_finished() -> void:
    current_ammo = weapon_data.max_ammo
    is_reloading = false
    reloading_finished.emit()
    ammo_updated.emit(current_ammo, weapon_data.max_ammo)

func interrupt_reload() -> void:
    if is_reloading:
        reload_timer.stop()
        is_reloading = false
```

### Weapon resources (.tres example)
```gdscript
# pistol.tres
[gd_resource type="Resource" load_steps=2 format=3]
[ext_resource type="PackedScene" path="res://projectiles/bullet.tscn" id="1"]

[resource]
resource_name = "Pistol"
weapon_name = "Pistol"
damage = 25
fire_rate = 0.3
ammo_per_fire = 1
max_ammo = 15
reload_time = 1.5
projectile_scene = ExtResource("1")
spread_degrees = 2.0
projectile_count = 1
is_automatic = false
```

---

## Production: Complete Arena Game Structure

### Project structure
```
res://
├── assets/
│   ├── audio/
│   │   ├── sfx/
│   │   └── music/
│   ├── textures/
│   │   ├── characters/
│   │   ├── environment/
│   │   └── ui/
│   └── fonts/
├── scenes/
│   ├── main/
│   │   ├── MainMenu.tscn
│   │   ├── OptionsMenu.tscn
│   │   ├── LevelSelect.tscn
│   │   └── GameOver.tscn
│   ├── game/
│   │   ├── Arena.tscn
│   │   ├── GameUI.tscn
│   │   └── PauseMenu.tscn
│   ├── entities/
│   │   ├── Player.tscn
│   │   ├── EnemyBasic.tscn
│   │   ├── EnemyElite.tscn
│   │   ├── EnemyBoss.tscn
│   │   └── Projectile.tscn
│   └── objects/
│       ├── PickupHealth.tscn
│       ├── PickupAmmo.tscn
│       ├── SpawnPoint.tscn
│       └── Obstacle.tscn
├── scripts/
│   ├── entities/
│   │   ├── player.gd
│   │   ├── enemy_base.gd
│   │   ├── enemy_basic.gd
│   │   ├── enemy_elite.gd
│   │   ├── enemy_boss.gd
│   │   └── projectile.gd
│   ├── managers/
│   │   ├── game_state.gd
│   │   ├── wave_manager.gd
│   │   ├── audio_manager.gd
│   │   └── save_manager.gd
│   ├── ui/
│   │   ├── main_menu.gd
│   │   ├── options_menu.gd
│   │   ├── game_ui.gd
│   │   └── pause_menu.gd
│   └── systems/
│       ├── weapon_system.gd
│       ├── upgrade_system.gd
│       └── score_system.gd
├── resources/
│   ├── weapons/
│   │   ├── pistol.tres
│   │   ├── shotgun.tres
│   │   ├── rifle.tres
│   │   └── rocket_launcher.tres
│   ├── enemies/
│   │   ├── wave_definitions.tres
│   │   └── difficulty_curves.tres
│   └── upgrades/
│       ├── damage_upgrades.tres
│       └── speed_upgrades.tres
├── autoload/
│   ├── signal_bus.gd
│   ├── game_state.gd
│   └── audio_manager.gd
├── ui/
│   └── themes/
│       ├── default.theme
│       └── game_ui.theme
└── project.godot
```

### WaveManager.gd
```gdscript
extends Node

@export var wave_definitions: Array[WaveDefinition]
@export var spawn_points: Array[Node2D]

var current_wave: int = 0
var enemies_alive: int = 0

signal wave_started(wave_number: int)
signal wave_completed(wave_number: int)
signal all_waves_completed
signal enemy_spawned(enemy: Node)
signal enemy_died(enemy: Node)

@onready var spawn_timer: Timer = $SpawnTimer

func start_wave(wave_index: int) -> void:
    current_wave = wave_index
    var wave_def: WaveDefinition = wave_definitions[wave_index]
    enemies_alive = wave_def.total_enemies
    wave_started.emit(wave_index + 1)
    start_spawning(wave_def)

func start_spawning(wave_def: WaveDefinition) -> void:
    spawn_timer.wait_time = wave_def.spawn_interval
    spawn_timer.start()

func _on_spawn_timer_timeout() -> void:
    var wave_def: WaveDefinition = wave_definitions[current_wave]
    var enemy_scene: PackedScene = wave_def.get_next_enemy()
    if enemy_scene == null:
        if enemies_alive <= 0:
            wave_completed.emit(current_wave + 1)
            if current_wave + 1 >= wave_definitions.size():
                all_waves_completed.emit()
        return

    var spawn_point := spawn_points.pick_random()
    var enemy := enemy_scene.instantiate()
    add_child(enemy)
    enemy.global_position = spawn_point.global_position
    enemy.died.connect(_on_enemy_died)
    enemy_spawned.emit(enemy)

func _on_enemy_died(enemy: Node) -> void:
    enemies_alive -= 1
    emit_signal("enemy_died", enemy)
    if enemies_alive <= 0:
        spawn_timer.stop()
        wave_completed.emit(current_wave + 1)
```

### GameState.gd (Autoload)
```gdscript
extends Node

enum GamePhase { MENU, PLAYING, PAUSED, GAME_OVER, VICTORY }

var current_phase: GamePhase = GamePhase.MENU
var selected_level: int = 0
var difficulty: float = 1.0

var player_health: int = 100
var player_max_health: int = 100
var player_ammo: Dictionary = {}
var score: int = 0
var combo_multiplier: float = 1.0
var time_elapsed: float = 0.0
var enemies_killed: int = 0

signal phase_changed(new_phase: GamePhase, old_phase: GamePhase)
signal score_changed(new_score: int)
signal health_changed(new_health: int, max_health: int)

func transition_to(new_phase: GamePhase) -> void:
    var old := current_phase
    current_phase = new_phase
    phase_changed.emit(new_phase, old)
    get_tree().paused = (new_phase == GamePhase.PAUSED)

func add_score(points: int) -> void:
    score += int(points * combo_multiplier)
    score_changed.emit(score)

func reset_run() -> void:
    player_health = 100
    score = 0
    combo_multiplier = 1.0
    time_elapsed = 0.0
    enemies_killed = 0
    player_ammo.clear()
```
