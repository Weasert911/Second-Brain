# Godot Performance Optimizer - Checklists

## Pre-Optimization Checklist
- [ ] FPS target defined (30/60/120)
- [ ] Target hardware spec documented
- [ ] Performance budget established (draw calls, memory, etc.)
- [ ] Profiler understands baseline before changes
- [ ] Profiling done on actual target hardware

## Rendering Checklist
- [ ] Draw calls below budget
- [ ] Texture atlas used for related sprites
- [ ] MultiMesh used for identical objects
- [ ] Batching enabled (static objects)
- [ ] LODs configured for 3D meshes
- [ ] Occlusion culling enabled (3D)
- [ ] Texture sizes appropriate for use case
- [ ] Mipmaps enabled for distant textures
- [ ] VRAM compression enabled
- [ ] Shader complexity minimized

## Physics Checklist
- [ ] Physics FPS set appropriately (30-60)
- [ ] Collision shapes are simple (primitive preferred)
- [ ] Sleeping enabled for static physics bodies
- [ ] Layer/mask culling configured
- [ ] Area nodes used over RayCast for continuous detection
- [ ] Broadphase type configured optimally
- [ ] Physics queries minimized per frame

## Script Checklist
- [ ] No allocations in hot paths
- [ ] Node references cached with @onready
- [ ] Groups queried on timer, not every frame
- [ ] distance_squared_to() used over distance_to()
- [ ] No string operations in _process()
- [ ] Arrays pre-sized when possible
- [ ] Signal connections cached

## Memory Checklist
- [ ] No memory leaks (monitor memory over time)
- [ ] Object pooling for frequent spawn/despawn objects
- [ ] Resources freed when not needed
- [ ] Texture memory within budget
- [ ] Audio streams limited
- [ ] No orphan nodes after scene transitions

## Loading Checklist
- [ ] Scene load times < 10 seconds
- [ ] Background loading for heavy scenes
- [ ] Resource preloading at init
- [ ] Progressive loading for large levels
- [ ] Loading screen with progress feedback

## Platform-Specific
- [ ] Mobile: draw calls < 200, textures < 1024px
- [ ] Web: PCK compressed, texture memory < 256MB
- [ ] Desktop: draw calls < 1000, Forward+ renderer
- [ ] VR: 90 FPS, < 11ms frame time
