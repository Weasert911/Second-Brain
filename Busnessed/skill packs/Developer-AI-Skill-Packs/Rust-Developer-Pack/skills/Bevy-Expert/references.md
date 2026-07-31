# References — Bevy-Expert

## Official Documentation

- [Bevy Book](https://bevyengine.org/learn/book/introduction/) — comprehensive guide
- [Bevy API](https://docs.rs/bevy/0.14/bevy/) — full API reference
- [Bevy Examples](https://github.com/bevyengine/bevy/tree/latest/examples) — runnable examples
- [Bevy Assets](https://bevyengine.org/assets/) — community assets
- [Bevy Migration Guide](https://bevyengine.org/learn/migration-guides/) — version upgrades
- [Bevy GitHub](https://github.com/bevyengine/bevy) — source code and issues

## Key Terms

1. **Entity**: A unique ID representing an object in the game world.
2. **Component**: Data attached to an entity (health, position, velocity).
3. **Resource**: Global singleton data (score, config, asset handles).
4. **System**: A function that operates on entities and resources.
5. **Schedule**: The execution order of systems.
6. **Bundle**: A group of components spawned together.
7. **Plugin**: A collection of systems and resources that can be added to the app.
8. **Query**: A way to access entities with specific components.
9. **World**: The ECS world containing all entities, components, resources.
10. **Handle**: A reference to an asset (texture, mesh, audio).
11. **AssetServer**: The asset loading and management system.
12. **State**: A finite state machine for game modes.
13. **Change Detection**: Detecting when a component has been added or modified.
14. **Fixed Timestep**: A fixed-rate update loop for physics.
15. **PBR**: Physically-Based Rendering for realistic 3D materials.

## Architecture Notes

Bevy uses a data-oriented ECS architecture. The World stores entities as simple IDs with associated components in archetype tables. Queries iterate over archetypes matching the component filter. Resources are stored separately from components. Systems are scheduled in stages within schedules. The main loop runs `Update` every frame and `FixedUpdate` at a fixed rate. Plugins are the unit of modularity.

## Key APIs

- `App::new().add_plugins(DefaultPlugins)` — app creation
- `commands.spawn((Component1, Component2, ...))` — entity spawning
- `Query<&Component, With<Filter>>` — entity queries
- `Res<Resource>`, `ResMut<Resource>` — resource access
- `EventReader<T>`, `EventWriter<T>` — event system
- `AssetServer::load(path)` — async asset loading
- `Camera2dBundle`, `Camera3dBundle` — cameras
- `SpriteBundle`, `PbrBundle` — rendering bundles
- `TextBundle`, `ButtonBundle`, `NodeBundle` — UI bundles
- `States`, `NextState<GameState>` — state management
- `FixedUpdate`, `Update`, `Startup`, `OnEnter(GameState)` — system sets/schedules

## Conventions

- Component naming: `PascalCase`, single-file modules
- System naming: `snake_case`, prefixed by category (`player_movement`, `enemy_ai`)
- Plugin naming: `PascalCase` with `Plugin` suffix
- State naming: `PascalCase` enum with descriptive variants
- Asset paths: relative to `assets/` directory
- File structure: one plugin per module, systems in submodules

## Project Structure

```
my_game/
├── Cargo.toml
├── assets/
│   ├── textures/
│   ├── models/
│   ├── audio/
│   └── fonts/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── plugins/
│   │   ├── mod.rs
│   │   ├── player.rs      # PlayerPlugin
│   │   ├── enemy.rs       # EnemyPlugin
│   │   ├── ui.rs          # UIPlugin
│   │   └── audio.rs       # AudioPlugin
│   ├── components.rs      # shared component defs
│   ├── resources.rs       # shared resource defs
│   ├── states.rs          # game state enum
│   └── systems/
│       ├── mod.rs
│       ├── movement.rs
│       ├── collision.rs
│       └── input.rs
└── build.rs
```
