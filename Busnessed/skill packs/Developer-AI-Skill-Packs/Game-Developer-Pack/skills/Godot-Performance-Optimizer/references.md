# Godot Performance Optimizer - References

## Profiler Documentation

### Built-in Profiler
- Location: Debugger > Profiler
- Covers: Script functions, built-in processes, physics
- Columns: Function, Self Time, Total Time, Calls
- Frame time target: 16.67ms (60 FPS), 33.33ms (30 FPS)

### Visual Profiler
- Location: Debugger > Visual Profiler
- Covers: Render pipeline stages
- Stages: Setup, Shadow, Opaque, Transparent, UI, Canvas, Particles
- Measures: Time per stage, draw calls per stage

### Network Profiler
- Location: Debugger > Network Profiler
- Covers: RPC calls, bandwidth usage
- Metrics: Sent/Received bytes, RPC counts

### Performance Monitors
- Location: Debugger > Monitors
- Key metrics: FPS, frame time, physics time, draw calls, vertices, memory

## Draw Call Optimization

### Batching
- Static objects: Use MultiMeshInstance for identical objects
- TileMap bakes static geometry into fewer draw calls
- Texture atlas reduces material swaps
- Label batching for text (single draw call per font)

### Reduce Draw Calls
```gdscript
# Bad - each is a separate draw call
$Sprite1.show()
$Sprite2.show()
$Sprite3.show()

# Good - combine into single texture atlas
$AnimatedSprite2D.play("idle")
```

### Texture Atlas Guidelines
- Combine related sprites into single texture
- Maximum atlas size: 2048x2048 (mobile), 4096x4096 (desktop)
- Maintain 2px padding between sprites to avoid bleeding
- Use Godot's TextureAtlas importer or external tool

## Occlusion Culling (3D)

### Setup
1. Add OccluderInstance3D nodes to scene
2. Bake occlusion data
3. Configure occluder shapes (simple geometry preferred)
4. Enable occlusion culling in WorldEnvironment

### Best Practices
- Use simple occluder geometry (boxes, spheres)
- Avoid concave occluders (use multiple convex shapes)
- Bake after scene layout changes
- Use layers to exclude small objects from occlusion

## LOD System

### Configuration
```gdscript
# In MeshInstance3D
var lod_count: int = 3
var lod_bias: float = 1.0

# LOD distances (world units)
# LOD 0: 0-20m (full detail)
# LOD 1: 20-50m (medium)
# LOD 2: 50-100m (low)
# Culled: >100m
```

### LOD Generation
- Godot can auto-generate LODs for imported meshes
- Manual LOD generation in Blender for better quality
- Use GLTF export with LOD groups

## Physics Optimization

### Broadphase Settings
```gdscript
# Project Settings > Physics
# 2D: broadphase_type = "Sweep and Prune" (default) or "Hash Grid"
# 3D: broadphase_type = "Sweep and Prune" or "Variable Bounding Volume Tree"

# Hash Grid optimization for 2D:
# cell_size = average object size
# bits = log2(grid cells), default 12 (4096x4096)
```

### Collision Shape Optimization
- Use simple shapes (sphere, capsule, box) over complex
- Limit total collision objects per scene
- Use Area2D/3D for detection over frequent physics queries
- Set proper collision layers/masks to reduce pair checks

### Physics Settings
```gdscript
# Reduce physics FPS if acceptable
# Project > Physics > Common > Physics FPS: 30 instead of 60

# Disable sleeping for moving objects
rigid_body.sleeping = false
```

## GDScript Performance

### Avoid Allocations in Hot Paths
```gdscript
# Bad
func _process(delta: float) -> void:
    var enemies = get_tree().get_nodes_in_group("enemies")
    for enemy in enemies:
        var pos = Vector2(enemy.global_position.x + 1, enemy.global_position.y)

# Good
@onready var enemies_group: Array[Node] = []
func _ready() -> void:
    enemies_group = get_tree().get_nodes_in_group("enemies")

func _process(delta: float) -> void:
    for enemy in enemies_group:
        var pos: Vector2 = enemy.global_position
```

### Use Built-in Functions Over GDScript
```gdscript
# Bad - GDScript operations
var clamped = min(max(value, 0), 100)

# Good - built-in
var clamped = clamp(value, 0, 100)
```

## Memory Profiling

### Monitor Memory
- Monitors > Memory > Dynamic, Static, Max
- Watch for memory growth (indicates leaks)
- Use `Performance.get_monitor(Performance.MEMORY_STATIC)` in scripts

### Texture Memory
- Use texture compression (VRAM Compressed)
- Enable mipmaps for distant objects
- Use lower resolution textures for mobile
- Stream textures for large open worlds
- Limit texture sizes: 1024x1024 typical max

## Loading Time Optimization

### Background Loading
```gdscript
ResourceLoader.load_threaded_request(path)
# Check progress with:
ResourceLoader.load_threaded_get_status(path, progress)
# Retrieve with:
var resource = ResourceLoader.load_threaded_get(path)
```

### Resource Preloading
```gdscript
# Preload all scenes at game start
const LEVELS: Array[PackedScene] = [
    preload("res://scenes/level_01.tscn"),
    preload("res://scenes/level_02.tscn"),
    preload("res://scenes/level_03.tscn"),
]
```

### PCK Size Optimization
- Remove unused resources before export
- Compress audio to Ogg Vorbis (quality 0.5-0.7)
- Use texture compression (BPTC for desktop, ETC2 for mobile)
- Convert large PNGs to compressed formats
- Use .res (binary) for large resources

## Platform-Specific Optimizations

### Mobile
- Reduce texture sizes (max 2048)
- Use Mobile renderer (not Forward+)
- Reduce physics FPS to 30
- Limit draw calls to <200
- Use GLTF compression (Draco)
- Reduce particle counts

### Web
- Use WebGL 2.0 renderer
- Limit texture memory to 256MB
- Enable texture compression (ETC2)
- Use progressive loading
- Compress PCK with gzip

### Desktop
- Forward+ renderer for quality
- Increase draw call budget to 1000+
- Use anisotropic filtering
- Enable MSAA for anti-aliasing
