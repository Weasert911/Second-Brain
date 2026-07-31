# Godot Debugger - References

## Editor Debugger Panel

### Debugger Tabs
| Tab | Purpose |
|-----|---------|
| Debugger | Breakpoints, stack traces, locals |
| Errors | Parse errors, script errors |
| Profiler | CPU frame timing per function |
| Visual Profiler | Render pipeline timing |
| Network Profiler | RPC and networking stats |
| Monitors | Real-time performance graphs |
| Output | Print statements and logging |

### Breakpoints
```gdscript
# Set via editor: Click line number gutter
# Or via code:
# breakpoint  # Inline breakpoint

# Conditional breakpoints (right-click breakpoint)
# Only stop when variable matches
# e.g., health <= 0

# Breakpoint types
# Standard: stops at line
# Conditional: stops when condition true
# Logpoint: logs message without stopping
```

### Debugger Features
```gdscript
# Step Over (F6): Execute current line, stop at next
# Step Into (F7): Enter function call
# Step Out (Shift+F7): Return to caller
# Continue (F5): Resume execution

# Watch expressions
# Add variable to watch: right-click > Add Watch
# Evaluate expression: type in Evaluate box
```

## Stack Inspection

### Call Stack
```
# Top of stack: current function
# Bottom of stack: _ready() or _process()
# Click stack frame to inspect locals at that point

[0] _physics_process (delta: float = 0.016)
[1] _notification (what: int = 1000)
[2] main loop iteration
```

### Variable Inspection
```gdscript
# Locals tab: all local variables in current frame
# Members tab: all member variables of current object
# Auto tab: variables near current execution point

# You can modify variable values at runtime
# Right-click > Set Value
```

## Remote Debugging

### Device Setup
```gdscript
# Export with Debug template
# Enable remote debug in Export > Debug
# Set network address to your computer's IP

# Android
# Enable USB debugging
# Connect via ADB: adb tcpip 5555

# iOS
# Enable Developer mode
# Connect via Xcode

# Web
# Use browser developer tools (F12)
# Godot debugger works over WebSocket
```

### Remote Debug Commands
```gdscript
# In editor: Debug > Debugger > Connect to Running Instance
# Enter device IP address
# Port: 6007 (default)
```

## Performance Monitors

### Key Metrics
| Monitor | What to Watch |
|---------|---------------|
| FPS | Below target? Bottleneck identified |
| Time Process | Script time per frame |
| Time Physics | Physics time per frame |
| Draw Calls | Too many renders |
| Vertices Count | Model complexity |
| Memory Static | Total RAM usage |
| Node Count | Scene complexity |
| Object Count | Total objects in memory |
| Audio Streams | Active audio channels |

## Visual Profiler

### Pipeline Stages
1. Setup - Culling, light setup
2. Shadow - Shadow map rendering
3. Opaque - Opaque geometry pass
4. Depth Prepass - Early Z-pass
5. Transparent - Transparent objects
6. UI - Canvas UI rendering
7. Canvas Items - 2D node rendering
8. Particles - Particle systems
9. Post Processing - Tonemap, FXAA, glow

## Network Profiler

### Metrics
- RPC Sent/Received per second
- Bandwidth usage (bytes/sec)
- Packet loss (if available)
- Peer connection status

## Custom Debugger Plugin

### Debugger Plugin Template
```gdscript
# debugger_plugin.gd
@tool
extends EditorPlugin

var debugger := DebuggerPanel.new()

func _enter_tree() -> void:
    add_debugger_plugin(debugger)

func _exit_tree() -> void:
    remove_debugger_plugin(debugger)

# DebuggerPanel.gd
@tool
extends EditorDebuggerPlugin

func _has_capture(capture: String) -> bool:
    return capture == "my_game"

func _capture(capture: String, message: String, data: Array) -> void:
    print("Debug data received: ", data)
```

## Crash Handler

### Godot Crash Handler Setup
```gdscript
# Enable crash handler in project settings
# Project > Debug > Error > Error Logger
# Options: File, Console, Both

# Custom crash handler
func _crash_handler(signal: String, stack: PackedStringArray) -> void:
    var report := "Crash: %s\n" % signal
    for frame in stack:
        report += frame + "\n"
    var file := FileAccess.open("user://crash_report.txt", FileAccess.WRITE)
    file.store_string(report)
    file.close()
```

## Error Logging Strategies

```gdscript
# Debug-only logging
func log_debug(message: String) -> void:
    if OS.is_debug_build():
        print(message)

# Structured logging
func log_event(category: String, message: String, data: Dictionary = {}) -> void:
    var entry := {
        "time": Time.get_datetime_string_from_system(),
        "category": category,
        "message": message,
        "data": data
    }
    print(JSON.stringify(entry))

# Log levels
enum LogLevel { DEBUG, INFO, WARN, ERROR, FATAL }
var log_level: LogLevel = LogLevel.INFO

func log(level: LogLevel, message: String) -> void:
    if level >= log_level:
        print("[%s] %s" % [LogLevel.keys()[level], message])
```

## Script Editor Debugging

### Debug Features
```gdscript
# Right-click line number:
# Toggle Breakpoint (F9)
# Toggle Bookmark
# Run to Line (Ctrl+F9)

# Debug menu:
# Keep Debugger Open
# Error Warnings
# Small Deopt (if memory is large)

# Debug Console:
# Use to evaluate expressions in current context
# Type: health  -> prints current health value
```

## Common Debug Utilities

```gdscript
# Visual debugging
func draw_debug_line(from: Vector2, to: Vector2, color: Color = Color.RED) -> void:
    if not Engine.is_editor_hint():
        return
    DebugDraw2D.draw_line(from, to, color)

# Timer-based logging
func log_every_n_seconds(n: float) -> void:
    if Time.get_ticks_msec() / 1000 % int(n) == 0:
        print("Logging every %d seconds" % n)

# Assert macro
func assert(condition: bool, message: String = "") -> void:
    if not condition:
        push_error("Assertion failed: " + message)
        if OS.is_debug_build():
            breakpoint
```
