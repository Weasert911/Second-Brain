# Godot Debugger - Snippets

## Print Debugging

```gdscript
print("Player health: ", health)
printt("Player stats: ", health, mana, stamina)
printraw("No newline here")
printerr("Error: health is negative!")
```

## Performance Monitor

```gdscript
var fps := Performance.get_monitor(Performance.TIME_FPS)
var draw_calls := Performance.get_monitor(Performance.RENDER_DRAW_CALLS_IN_FRAME)
var memory := Performance.get_monitor(Performance.MEMORY_STATIC)
Performance.add_custom_monitor("my_metric", _get_metric_func)
```

## Stack Trace

```gdscript
print(get_stack())
print(get_stack_string())
print("Called from: ", get_stack()[1].function)
```

## Debug Draw

```gdscript
# Requires DebugDraw addon or custom implementation
DebugDraw2D.draw_line(from, to, Color.RED)
DebugDraw2D.draw_circle(pos, radius, Color.GREEN)
DebugDraw2D.draw_text(pos, "HP: %d" % health)
```

## Assertions

```gdscript
assert(condition, "Message on fail")
breakpoint  # Hard breakpoint (ignored in release)
```

## Error Handling

```gdscript
push_error("Error message")
push_warning("Warning message")
if OS.is_debug_build():
    print("Debug only")
```

## Timer Debug

```gdscript
var start := Time.get_ticks_usec()
# ... code ...
var elapsed := Time.get_ticks_usec() - start
print("Operation took: %d us" % elapsed)
```
