---
name: "Godot 4 Expert"
version: "1.0.0"
domain: "Game Development"
activation_description: "Expert Godot 4 engine knowledge"
purpose: "Make AI proficient in Godot 4 engine architecture, scene system, signals, physics, animation, and production workflows"
---

## Capabilities
- Architect complete Godot 4 projects using best-practice scene and node trees
- Design and implement signal-based communication between nodes
- Build physics-based gameplay using CharacterBody2D/3D, RigidBody, Area nodes
- Create complex animation trees and state machines
- Implement custom resources and packed scene workflows
- Write type-safe, performant GDScript with full static typing
- Design UI systems using Control nodes and themes
- Implement save/load systems with Resource and ConfigFile
- Build input handling across multiple devices
- Optimize rendering, physics, and memory usage
- Integrate third-party assets and plugins
- Structure multi-scene games with autoloads and singletons

## Limitations
- Does not cover GDScript syntax fundamentals (see GDScript Best Practices skill)
- Does not cover shader programming (see Godot Shader Expert skill)
- Does not cover multiplayer networking (see Godot Multiplayer skill)
- Does not cover Godot 3.x syntax or APIs
- C# bindings are not covered

## Required Tools
- Godot 4.2+ installed
- Text editor with GDScript support
- Git for version control
- Godot editor with Mono support (for C# projects)
- Android SDK (for mobile export)

## Execution Workflow
1. Understand project requirements - genre, target platforms, performance targets
2. Design scene architecture - identify scenes, nodes, and their hierarchy
3. Establish autoloads - create global singletons for game state, audio, input
4. Implement core scenes with proper signal and method patterns
5. Add physics and collision layers with proper layer/mask configuration
6. Implement animation trees and state machines for characters and UI
7. Create custom resources for data-driven design
8. Implement input mapping with Input Map and action system
9. Add save/load functionality with ResourceSaver and ResourceLoader
10. Profile and optimize - use built-in profiler, reduce draw calls
11. Export and test on target platforms
12. Polish - screenshake, particles, audio feedback, transitions

## Decision Tree
```
Is this a new project?
├── Yes -> Create project with proper folder structure
│   ├── 2D game -> Use Node2D as root, enable 2D physics
│   ├── 3D game -> Use Node3D as root, configure world environment
│   └── UI/app -> Use Control as root with theme system
├── No -> Evaluate existing architecture
│   ├── Performance issues -> Run profiler, check draw calls
│   ├── Adding feature -> Find insertion point in scene tree
│   └── Refactoring -> Extract nodes into scenes, add signals

Need to communicate between nodes?
├── Direct parent-child -> Use direct method calls
├── Distant nodes -> Use signals with signal bus autoload
├── Cross-scene -> Use global autoload with signals
└── One-to-many -> Use custom signal with Array argument

Adding physics?
├── Player character -> CharacterBody2D/3D with move_and_slide
├── Physics objects -> RigidBody2D/3D with proper mass
├── Detection zones -> Area2D/3D with collision shape
└── Static environment -> StaticBody2D/3D with collision shapes
```

## Review Checklist
- [ ] All nodes are properly named following PascalCase convention
- [ ] Signals are connected via code, not editor (type-safe)
- [ ] Every exported variable has a proper @export annotation
- [ ] Physics layers and masks are configured correctly
- [ ] No orphan nodes - all nodes are freed properly
- [ ] Resource files use .tres extension for editable resources
- [ ] Autoloads are minimal and purposeful
- [ ] All strings use translation keys, not literal text
- [ ] Project settings are configured for target platforms
- [ ] Performance targets met on minimum-spec hardware

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Signals not firing | Check signal connection is via Callable, not string |
| Physics jitter | Use fixed timestep (delta), not _process for physics code |
| Memory leaks | Ensure queue_free() is called, check for lingering Tween/Timer |
| Export fails | Check export templates are installed for target platform |
| Input not detected | Verify Input Map action names, check device is connected |
| Animation glitches | Check AnimationPlayer blend times and track types |
| Scene load slow | Use ResourcePreloader or background loading with load_async |
| Audio distortion | Check AudioBus layout, bus routing, and volume levels |

## Best Practices
- Always use explicit typing: `var health: int = 100` not `var health = 100`
- Use `@onready var` for node references instead of `get_node()` in _ready()
- Prefer signals over polling in _process() for state changes
- Use PackedScene for instantiating complex objects
- Keep scene tree shallow - max 5-6 levels of nesting
- Use Groups for category-based queries
- Use enums for states, not string comparisons
- Implement _exit_tree() to clean up connections and timers
- Use @tool for editor scripts with proper is_editor_hint() guards
- Use ProjectSettings for configurable constants

## Anti-Patterns
- Using `load()` in _process() - cache resources at init
- Connecting signals via editor panel - use code connections
- Global variables in autoloads - use getters/setters with signals
- Deep scene nesting - flatten and use scenes as composable units
- String-based method calls - use Callable references
- Mixing physics and input in _process() - use _physics_process for physics
- Using yield() - use await and async/await patterns
- Editor-dependent code in runtime - guard with Engine.is_editor_hint()

## References
- See references.md for Godot 4 API documentation and architecture notes
- See examples.md for complete scene implementation walkthroughs
- See templates.md for reusable project templates
- See checklists.md for pre-flight and QA checklists
- See snippets.md for common code patterns
