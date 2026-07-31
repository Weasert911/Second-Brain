# Godot Debugger - Templates

## Debug Overlay Template

```gdscript
# debug_overlay.gd
extends CanvasLayer

@onready var fps_label: Label = $VBoxContainer/FPSLabel
@onready var memory_label: Label = $VBoxContainer/MemoryLabel
@onready var draw_calls_label: Label = $VBoxContainer/DrawCallsLabel
@onready var physics_label: Label = $VBoxContainer/PhysicsLabel
@onready var node_count_label: Label = $VBoxContainer/NodeCountLabel
@onready var custom_label: Label = $VBoxContainer/CustomLabel

var _update_timer: float = 0.0
var _show_debug: bool = false

func _ready() -> void:
    visible = false
    Input.is_action_just_pressed("toggle_debug")
    if Input.has_action("toggle_debug"):
        var event := InputEventKey.new()
        event.keycode = KEY_F3
        InputMap.add_action("toggle_debug")
        InputMap.action_add_event("toggle_debug", event)

func _input(event: InputEvent) -> void:
    if event.is_action_pressed("toggle_debug"):
        _show_debug = not _show_debug
        visible = _show_debug

func _process(delta: float) -> void:
    if not _show_debug:
        return

    _update_timer += delta
    if _update_timer < 0.25:
        return
    _update_timer = 0.0

    fps_label.text = "FPS: %d" % Performance.get_monitor(Performance.TIME_FPS)
    var mem := Performance.get_monitor(Performance.MEMORY_STATIC)
    memory_label.text = "Memory: %.1f MB" % (mem / (1024.0 * 1024.0))
    draw_calls_label.text = "Draw Calls: %d" % Performance.get_monitor(Performance.RENDER_DRAW_CALLS_IN_FRAME)
    physics_label.text = "Physics: %.2fms" % Performance.get_monitor(Performance.TIME_PHYSICS_PROCESS)
    node_count_label.text = "Nodes: %d" % Performance.get_monitor(Performance.OBJECT_NODE_COUNT)
```

## Custom Logger Template

```gdscript
# debug_logger.gd
extends Node

enum LogLevel { DEBUG, INFO, WARN, ERROR, FATAL }
var _log_buffer: Array[Dictionary] = []
var _log_file: FileAccess
var _log_level: LogLevel = LogLevel.DEBUG

signal log_entry_added(entry: Dictionary)

func _ready() -> void:
    var log_path := "user://game_%s.log" % Time.get_datetime_string_from_system().replace(":", "-")
    _log_file = FileAccess.open(log_path, FileAccess.WRITE)
    if _log_file:
        _log_file.store_line("=== Game Log Started %s ===" % Time.get_datetime_string_from_system())

func log(level: LogLevel, source: String, message: String, data: Dictionary = {}) -> void:
    if level < _log_level:
        return

    var entry := {
        "timestamp": Time.get_datetime_string_from_system(),
        "level": LogLevel.keys()[level],
        "source": source,
        "message": message,
        "data": data
    }

    _log_buffer.append(entry)
    if _log_buffer.size() > 1000:
        _log_buffer.pop_front()

    var formatted := "[%s] [%s] %s: %s" % [entry.timestamp, entry.level, source, message]
    if _log_file:
        _log_file.store_line(formatted)

    match level:
        LogLevel.DEBUG, LogLevel.INFO:
            print(formatted)
        LogLevel.WARN:
            push_warning(formatted)
        LogLevel.ERROR, LogLevel.FATAL:
            push_error(formatted)

    log_entry_added.emit(entry)

func debug(source: String, message: String) -> void:
    log(LogLevel.DEBUG, source, message)

func info(source: String, message: String) -> void:
    log(LogLevel.INFO, source, message)

func warn(source: String, message: String) -> void:
    log(LogLevel.WARN, source, message)

func error(source: String, message: String, data: Dictionary = {}) -> void:
    log(LogLevel.ERROR, source, message, data)

func fatal(source: String, message: String, data: Dictionary = {}) -> void:
    log(LogLevel.FATAL, source, message, data)
    get_tree().quit()

func _exit_tree() -> void:
    if _log_file:
        _log_file.store_line("=== Game Log Ended ===")
        _log_file.close()
```

## Debug Draw Template

```gdscript
# debug_draw.gd
extends Node

static func draw_circle(position: Vector2, radius: float, color: Color = Color.RED, duration: float = 0.0) -> void:
    if not Engine.is_editor_hint():
        var instance := Node2D.new()
        get_tree().current_scene.add_child(instance)
        var draw := func():
            var transform := instance.transform
            instance.draw_circle(Vector2.ZERO, radius, color)
        instance.draw.connect(draw)
        if duration > 0.0:
            get_tree().create_timer(duration).timeout.connect(instance.queue_free)

static func draw_line(from: Vector2, to: Vector2, color: Color = Color.GREEN, duration: float = 0.0) -> void:
    if not Engine.is_editor_hint():
        var instance := Node2D.new()
        get_tree().current_scene.add_child(instance)
        var draw := func():
            instance.draw_line(from - instance.global_position, to - instance.global_position, color)
        instance.draw.connect(draw)
        if duration > 0.0:
            get_tree().create_timer(duration).timeout.connect(instance.queue_free)

static func draw_rect(rect: Rect2, color: Color = Color.BLUE, duration: float = 0.0) -> void:
    if not Engine.is_editor_hint():
        var instance := Node2D.new()
        instance.global_position = rect.position
        get_tree().current_scene.add_child(instance)
        var draw := func():
            instance.draw_rect(Rect2(Vector2.ZERO, rect.size), color, false)
        instance.draw.connect(draw)
        if duration > 0.0:
            get_tree().create_timer(duration).timeout.connect(instance.queue_free)
```

## Performance Snapshot Template

```gdscript
# performance_snapshot.gd
extends Node

func take_snapshot(label: String = "") -> Dictionary:
    var snapshot := {
        "label": label,
        "time": Time.get_datetime_string_from_system(),
        "fps": Performance.get_monitor(Performance.TIME_FPS),
        "process_time": Performance.get_monitor(Performance.TIME_PROCESS),
        "physics_time": Performance.get_monitor(Performance.TIME_PHYSICS_PROCESS),
        "draw_calls": Performance.get_monitor(Performance.RENDER_DRAW_CALLS_IN_FRAME),
        "vertices": Performance.get_monitor(Performance.RENDER_VERTICES_IN_FRAME),
        "memory_static": Performance.get_monitor(Performance.MEMORY_STATIC),
        "memory_dynamic": Performance.get_monitor(Performance.MEMORY_DYNAMIC),
        "nodes": Performance.get_monitor(Performance.OBJECT_NODE_COUNT),
        "objects": Performance.get_monitor(Performance.OBJECT_COUNT),
        "audio_streams": AudioServer.get_bus_count(),
    }
    return snapshot

func compare(before: Dictionary, after: Dictionary) -> Dictionary:
    var diff := {}
    for key in before.keys():
        if key in ["label", "time"]:
            continue
        diff[key] = after.get(key, 0) - before.get(key, 0)
    return diff
```
