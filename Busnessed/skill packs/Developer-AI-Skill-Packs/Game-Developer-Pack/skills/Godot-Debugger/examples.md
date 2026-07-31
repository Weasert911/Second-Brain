# Godot Debugger - Examples

## Breakpoint Usage

```gdscript
# Setting breakpoints in the editor:
# Click line number (left gutter) to add/remove

# Conditional breakpoint example
func calculate_damage(attacker: Node, target: Node, base_damage: int) -> int:
    var defense := target.get("defense", 0)

    # Set conditional breakpoint here:
    # Condition: base_damage > 100
    # (only stops when damage > 100)

    var damage_multiplier := 1.0
    if attacker.has_method("get_damage_multiplier"):
        damage_multiplier = attacker.get_damage_multiplier()

    var final_damage := int(base_damage * damage_multiplier) - defense
    return max(0, final_damage)

# Log point example (print without stopping):
# Right-click breakpoint > Edit > Log Message
# Message: "Attack: {attacker.name} -> {target.name}, damage={final_damage}"
```

## Stack Trace Inspection

```gdscript
# Example of a crash scenario
func _ready() -> void:
    var enemy := Enemy.new()
    enemy.queue_free()

    # Some time later...
    # If enemy is accessed after free, we get an error
    # Stack trace shows:
    # 0 - Error: Attempt to call function 'take_damage' in deleted object
    # 1 - Player._process:10
    # 2 - Main._process:20

    # Solution: Check instance validity
    func attack_enemy(enemy: Node) -> void:
        if not is_instance_valid(enemy):
            return
        enemy.take_damage(10)
```

## Remote Debugging

```gdscript
# Mobile device remote debug setup
# 1. Export game with Debug template
# 2. Connect device to same network
# 3. In Godot editor: Debug > Debugger > Connect to Running Instance
# 4. Enter device IP address

# On device, game will try to connect to editor automatically
# Check console for: "Debugger connected to 192.168.1.100:6007"
```

## Performance Monitor Integration

```gdscript
# Custom performance monitoring
func setup_performance_monitoring() -> void:
    # Add custom monitor
    Performance.add_custom_monitor("game/enemy_count", _get_enemy_count)
    Performance.add_custom_monitor("game/draw_calls", _get_draw_calls)
    Performance.add_custom_monitor("game/memory_mb", _get_memory_mb)

func _get_enemy_count() -> float:
    return get_tree().get_nodes_in_group("enemies").size()

func _get_draw_calls() -> float:
    return Performance.get_monitor(Performance.RENDER_DRAW_CALLS_IN_FRAME)

func _get_memory_mb() -> float:
    return Performance.get_monitor(Performance.MEMORY_STATIC) / (1024.0 * 1024.0)

# Real-time FPS display
func toggle_fps_display() -> void:
    var fps_label := Label.new()
    fps_label.name = "FPSLabel"
    fps_label.add_theme_color_override("font_color", Color.GREEN)
    add_child(fps_label)

    var timer := Timer.new()
    timer.timeout.connect(func():
        fps_label.text = "FPS: %d" % Performance.get_monitor(Performance.TIME_FPS)
    )
    timer.wait_time = 0.5
    timer.start()
    add_child(timer)
```

## Profiler Analysis

```gdscript
# Common profiler patterns and fixes

# Pattern 1: High script time in _process
# Before optimization:
func _process(delta: float) -> void:
    for enemy in get_tree().get_nodes_in_group("enemies"):
        # This get_tree() call is expensive every frame
        var dist = position.distance_to(enemy.position)
        if dist < 100:
            attack(enemy)

# After optimization (cache group reference):
@onready var enemies: Array[Node] = []
var _update_timer: float = 0.0

func _process(delta: float) -> void:
    _update_timer += delta
    if _update_timer > 0.5:
        enemies = get_tree().get_nodes_in_group("enemies")
        _update_timer = 0.0

    for enemy in enemies:
        if not is_instance_valid(enemy):
            continue
        var dist = position.distance_to(enemy.position)
        if dist < 100:
            attack(enemy)

# Pattern 2: High render time
# Check visual profiler:
# If Opaque stage is high:
#   - Reduce overdraw
#   - Enable occlusion culling
#   - Use LODs
# If Shadow stage is high:
#   - Reduce shadow map size
#   - Limit shadow-casting lights
```

## Error Log Analysis

```gdscript
# Structured error logging
enum LogLevel { DEBUG, INFO, WARN, ERROR, FATAL }
var log_buffer: Array[Dictionary] = []
const MAX_LOG_ENTRIES: int = 1000

func log_message(level: LogLevel, source: String, message: String, data: Dictionary = {}) -> void:
    var entry := {
        "timestamp": Time.get_datetime_string_from_system(),
        "level": LogLevel.keys()[level],
        "source": source,
        "message": message,
        "data": data,
        "stack": get_stack()
    }

    log_buffer.append(entry)
    if log_buffer.size() > MAX_LOG_ENTRIES:
        log_buffer.pop_front()

    var formatted = "[%s] %s: %s" % [entry.level, source, message]
    match level:
        LogLevel.DEBUG:
            print(formatted)
        LogLevel.INFO:
            print(formatted)
        LogLevel.WARN:
            push_warning(formatted)
        LogLevel.ERROR:
            push_error(formatted)
            _write_error_report(entry)
        LogLevel.FATAL:
            push_error(formatted)
            _write_crash_report(entry)
            get_tree().quit()

func _write_error_report(entry: Dictionary) -> void:
    var report_path := "user://error_log.txt"
    var file := FileAccess.open(report_path, FileAccess.WRITE)
    if file:
        file.store_line(JSON.stringify(entry))
        file.close()

func _write_crash_report(entry: Dictionary) -> void:
    var report := "FATAL ERROR\n"
    report += "Time: %s\n" % entry.timestamp
    report += "Source: %s\n" % entry.source
    report += "Message: %s\n" % entry.message
    report += "Stack Trace:\n"
    for frame in entry.stack:
        report += "  %s\n" % frame

    var file := FileAccess.open("user://crash_report.txt", FileAccess.WRITE)
    if file:
        file.store_string(report)
        file.close()

func get_stack() -> Array:
    var stack: Array = []
    var engine = Engine.get_version_info()
    stack.append("Engine: Godot %s" % engine.string)
    return stack
```

## Custom Debugger Plugin

```gdscript
# custom_debugger_plugin.gd
@tool
extends EditorPlugin

var debugger_panel: Control

func _enter_tree() -> void:
    debugger_panel = preload("res://addons/custom_debugger/debugger_panel.tscn").instantiate()
    add_debugger_plugin(debugger_panel)

func _exit_tree() -> void:
    remove_debugger_plugin(debugger_panel)
    debugger_panel.queue_free()

# debugger_panel.gd
@tool
extends EditorDebuggerPlugin

func _has_capture(capture: String) -> bool:
    return capture == "game_debug"

func _capture(capture: String, message: String, data: Array) -> void:
    # Called when game sends debug data
    print("Debug capture from game: ", message)

func _setup_session(session_id: int) -> void:
    # Called when debug session starts
    print("Debug session started: ", session_id)

# In game code:
func send_debug_info(key: String, value: Variant) -> void:
    if Engine.is_editor_hint():
        return
    # Send to editor debugger
    var msg := JSON.stringify({"key": key, "value": str(value)})
    # This would be captured by the plugin
```
