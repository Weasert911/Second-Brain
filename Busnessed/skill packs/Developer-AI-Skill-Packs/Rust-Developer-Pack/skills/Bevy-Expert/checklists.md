# Checklists — Bevy-Expert

## Pre-Flight Checklist

- [ ] Bevy version selected (0.14+)
- [ ] Game design decomposed into ECS (components, resources, systems)
- [ ] State machine defined (all game states)
- [ ] Asset list compiled (textures, models, audio, fonts)
- [ ] Plugin architecture planned
- [ ] 2D vs 3D rendering approach decided
- [ ] UI layout designed
- [ ] Input handling strategy decided

## Implementation Checklist

- [ ] App set up with DefaultPlugins and custom plugins
- [ ] Components derive Component trait
- [ ] Resources derive Resource trait
- [ ] Events derive Event trait
- [ ] States derive States trait with Default
- [ ] Systems use correct parameter types
- [ ] Queries use filters (With, Without, Added, Changed) where appropriate
- [ ] Spawn/despawn uses Commands, never direct World access
- [ ] Camera spawned with correct bundle
- [ ] Assets loaded via AssetServer
- [ ] UI elements have interaction handlers
- [ ] System ordering with .before/.after where needed

## Testing Checklist

- [ ] Scene renders correctly (no invisible entities)
- [ ] All state transitions work
- [ ] Input handling responds correctly
- [ ] UI buttons and text display properly
- [ ] Asset loading completes without errors
- [ ] Audio plays correctly
- [ ] Fixed timestep physics are deterministic
- [ ] No systems running in wrong state
- [ ] Entity cleanup on state exit
- [ ] Performance acceptable (stable frame rate)

## Release Checklist

- [ ] DefaultPlugins configured for release (no debug features)
- [ ] Asset paths verified in release build
- [ ] Window settings configured (title, size, fullscreen)
- [ ] Settings/configuration loaded from file
- [ ] Error handling for asset load failures
- [ ] Log level set for release (info or warn)
- [ ] Binary size checked
- [ ] Compile time checked (pre-compiled game)
- [ ] Release profile optimized (lto = "fat")
- [ ] Controls/keybindings documented

## Maintenance Checklist

- [ ] Bevy version checked for updates
- [ ] Asset pipeline reviewed for performance
- [ ] System ordering checked for correctness
- [ ] Query performance profiled
- [ ] Memory usage monitored
- [ ] UI layout tested at different resolutions
- [ ] Input mapping reviewed for ergonomics
- [ ] Dependencies updated
