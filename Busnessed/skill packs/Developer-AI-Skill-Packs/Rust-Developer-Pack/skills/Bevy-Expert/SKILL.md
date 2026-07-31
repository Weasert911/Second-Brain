---
name: "Bevy-Expert"
version: "1.0.0"
domain: "Rust Development"
activation_description: "Activate Bevy expert skill for ECS architecture, game engine, rendering, UI, asset management, plugins, and Bevy 0.14+ patterns."
purpose: "Provides comprehensive guidance on game development with Bevy engine, including ECS architecture, system scheduling, rendering (2D and 3D), asset pipeline, UI system, input handling, audio, and performance optimization."
---

## Capabilities

1. Architect games using Bevy ECS with Components, Resources, Systems, and Bundles.
2. Design system schedules with startup, update, fixed timestep, and custom run criteria.
3. Implement 2D sprite rendering with transforms, textures, animations, and cameras.
4. Set up 3D rendering with PBR materials, meshes, lighting, and cameras.
5. Handle user input from keyboard, mouse, gamepad, and touch.
6. Create UI layouts with Bevy UI (NodeBundle, ButtonBundle, TextBundle).
7. Manage game states with Bevy state machine and state transitions.
8. Implement custom events and system chaining patterns.
9. Use AssetServer and Handle for asset loading and management.
10. Create modular plugins for clean project organization.
11. Implement audio playback with bevy_audio.
12. Optimize performance with bevy_ecs best practices and Bevy 0.14+ features.

## Limitations

1. Cannot run or render Bevy applications — provides design and code guidance only.
2. Limited to Bevy 0.14+ patterns; older versions may differ in API.
3. Cannot provide real-time performance profiling.
4. Does not cover external engine integrations (physics, networking) beyond general patterns.

## Required Tools

- Bevy crate 0.14+ with appropriate feature flags
- Rust compiler 1.75+
- bevy_editor_egui or similar for debugging
- bevy-inspector-egui for runtime inspection
- cargo-watch for hot reloading

## Execution Workflow

1. Understand the game design to decompose into ECS entities, components, and systems.
2. Design the state machine (menu, playing, paused, game over).
3. Define components for game data (health, position, velocity, etc.).
4. Define resources for global state (score, game config, asset handles).
5. Implement systems for game logic (movement, collision, input handling).
6. Set up rendering with spawn_camera, spawn sprites/meshes, materials.
7. Add UI with buttons, text, and interaction callbacks.
8. Implement asset loading with AssetServer and loading screen.
9. Add audio for sound effects and background music.
10. Create plugins to organize systems into logical modules.
11. Optimize with query filters, change detection, and system ordering.
12. Add debugging tools (bevy-inspector-egui, FPS overlay).

## Decision Tree

1. **Is the game 2D or 3D?**
   - 2D → Use `Camera2dBundle`, `SpriteBundle`, `OrthographicProjection`.
   - 3D → Use `Camera3dBundle`, `PbrBundle`, `PerspectiveProjection`.

2. **Is fixed timestep physics needed?**
   - YES → Use `FixedUpdate` schedule with fixed timestep.
   - NO → Use `Update` schedule for variable timestep.

3. **Is there complex game state?**
   - YES → Use `States` with `OnEnter`, `OnUpdate`, `OnExit`.
   - NO → Simple flag resource may suffice.

4. **Is there heavy asset loading?**
   - YES → Implement loading state with asset tracking.
   - NO → Load assets directly in startup.

5. **Is networking needed?**
   - YES → Consider bevy_replicon or bevy_ggrs.
   - NO → Local single-player.

6. **Is a UI system needed?**
   - YES → Use Bevy UI for HUD, menus, inventory.
   - NO → Minimal or no UI.

## Review Checklist

- [ ] ECS decomposition follows Bevy idioms (small components, focused systems).
- [ ] Systems have correct parameter types (Query, Res, ResMut, Commands, EventReader/Writer).
- [ ] System ordering is explicit where dependencies exist (`.before()`, `.after()`).
- [ ] State transitions use `NextState` and run criteria.
- [ ] Assets are loaded with `AssetServer` and tracked to prevent duplicate loads.
- [ ] Sprites/meshes use correct bundles for 2D/3D.
- [ ] UI elements have proper hierarchy and interaction callbacks.
- [ ] Input handling uses `ButtonInput` resource.
- [ ] `FixedUpdate` used for physics; `Update` used for rendering.
- [ ] Custom events defined as plain structs with `Event` trait.
- [ ] Plugins organize related systems.
- [ ] Performance: system queries filtered, heavy work amortized.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Systems not running | Missing system in app, wrong schedule | Add `.add_systems(Update, my_system)` |
| Query returns nothing | Incorrect component query filter | Check component types, use `With<>, Without<>` |
| Sprites not visible | Missing camera or transform | Ensure `Camera2dBundle` is spawned |
| UI not interactive | Missing interaction logic | Add `Interaction` change detection system |
| State transition not firing | State not added | Add `.init_state::<GameState>()` to app |
| Asset loading slow | No loading state/unoptimized assets | Implement loading screen, use compressed formats |
| Frame rate drops | Too many entities or expensive systems | Profile with bevy-inspector-egui, optimize queries |
| Audio not playing | Missing audio source file | Check asset path and format support |

## Best Practices

1. Keep components small and focused (single responsibility).
2. Use query filters (`With<>, Without<>, Added<>, Changed<>`) to narrow systems.
3. Prefer `Commands` over direct mutation for spawning/despawning.
4. Use `FixedUpdate` for anything that needs consistent timestep (physics, movement).
5. Organize code into plugins for modularity and reusability.
6. Use `Res<Assets<T>>` for runtime asset access after loading.
7. Handle asset loading with loading state and progress tracking.
8. Use change detection (`Changed<T>`, `Added<T>`) to react to component changes.
9. Prefer enums for states over boolean flags.
10. Use `bevy-inspector-egui` during development for debugging.

## Anti-Patterns

1. **Giant components**: One component holding all entity data.
2. **God systems**: One system doing everything (rendering, physics, input).
3. **Polling resources inefficiently**: Checking every frame when events should be used.
4. **Ignoring system ordering**: Relying on implicit ordering causing race conditions.
5. **Direct asset file access**: Using std::fs instead of AssetServer.
6. **Hardcoded asset paths**: Not using labeled handles.
7. **No loading state**: Assets loaded synchronously causing frame drops.
8. **Manual memory management**: Forgetting to despawn entities when no longer needed.

## References

Bevy Book: https://bevyengine.org/learn/book/introduction/
Bevy API Docs: https://docs.rs/bevy/0.14/bevy/
Bevy Examples: https://github.com/bevyengine/bevy/tree/latest/examples
Bevy Assets: https://bevyengine.org/assets/
Bevy Discord: https://discord.gg/bevy
Bevy GitHub: https://github.com/bevyengine/bevy
