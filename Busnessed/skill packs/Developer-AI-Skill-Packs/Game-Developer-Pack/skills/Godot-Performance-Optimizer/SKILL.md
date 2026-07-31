---
name: "Godot Performance Optimizer"
version: "1.0.0"
domain: "Game Development"
activation_description: "Godot engine performance profiling and optimization"
purpose: "Make AI proficient in profiling, analyzing, and optimizing Godot 4 projects for rendering, physics, GDScript, memory, and load times"
---

## Capabilities
- Use built-in profiler to identify CPU/GPU bottlenecks
- Analyze draw calls and implement batching strategies
- Configure texture atlases and sprite merging
- Implement occlusion culling for 3D scenes
- Set up LOD (Level of Detail) system for models
- Optimize physics collision detection and broadphase
- Profile GDScript for slow functions and allocations
- Analyze and reduce memory usage
- Optimize scene loading times with background loading

## Limitations
- Does not cover Godot engine fundamentals (see Godot 4 Expert)
- Does not cover network optimization (see Godot Multiplayer)
- Does not cover shader optimization in depth (see Godot Shader Expert)
- Platform-specific optimizations limited to general guidance

## Required Tools
- Godot 4.2+ built-in profiler
- RenderDoc (GPU profiling, optional)
- GPU vendor tools (NVIDIA Nsight, AMD Radeon GPU Profiler, optional)

## Execution Workflow
1. Establish baseline performance metrics
2. Run built-in profiler during typical gameplay
3. Identify top CPU/GPU bottlenecks
4. Address rendering bottlenecks first (draw calls, shader complexity)
5. Optimize physics (collision shapes, broadphase settings)
6. Profile GDScript and optimize hot paths
7. Reduce memory allocations and texture memory
8. Optimize loading times
9. Re-profile and verify improvements

## Key Metrics
- FPS: target 60 (30 minimum)
- Draw calls: <200 mobile, <500 desktop
- Physics time: <4ms per frame
- Script time: <8ms per frame
- Memory: <1GB mobile, <4GB desktop
- Load time: <10s per scene

## References
- See references.md for profiler documentation and optimization techniques
- See examples.md for real-world optimization case studies
- See templates.md for performance budget templates
- See checklists.md for pre-optimization checklist
- See snippets.md for optimized code patterns
