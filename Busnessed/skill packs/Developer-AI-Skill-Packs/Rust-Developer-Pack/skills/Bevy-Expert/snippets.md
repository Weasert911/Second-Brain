# Snippets — Bevy-Expert

## 1. App Setup with Plugins

```rust
App::new()
    .add_plugins(DefaultPlugins)
    .add_plugins(GamePlugin)
    .run();
```

**Usage**: DefaultPlugins includes renderer, input, audio, UI, etc. Custom plugins add game-specific logic.

## 2. Spawning Entities

```rust
commands.spawn((
    SpriteBundle { texture: asset_server.load("player.png"), ..default() },
    Player { health: 100, speed: 200.0 },
    Collider,
));
```

**Usage**: Spawn entities with component bundles. Tuple syntax lets you add custom components alongside bundles.

## 3. Query with Filters

```rust
fn damage_enemies(
    mut query: Query<(&mut Health, &Transform), (With<Enemy>, Without<Player>)>,
) {
    for (mut health, transform) in query.iter_mut() {
        health.0 -= 10;
    }
}
```

**Usage**: Use `With<...>` and `Without<...>` to narrow queries. Combine with `Changed<T>` or `Added<T>` for change detection.

## 4. Resource Management

```rust
#[derive(Resource)]
struct Score(u32);

fn score_system(score: Res<Score>) {
    println!("Score: {}", score.0);
}

fn update_score(mut score: ResMut<Score>) {
    score.0 += 1;
}
```

**Usage**: Resources are global singletons. Use `Res<T>` for read and `ResMut<T>` for write access.

## 5. State Transitions

```rust
#[derive(States, Default, Clone, Eq, PartialEq, Hash, Debug)]
enum GameState { #[default] Menu, Playing }

fn enter_playing(mut commands: Commands) { /* setup */ }
fn exit_playing(mut commands: Commands, query: Query<Entity, With<GameEntity>>) {
    for e in query.iter() { commands.entity(e).despawn(); }
}

// .add_systems(OnEnter(GameState::Playing), enter_playing)
// .add_systems(OnExit(GameState::Playing), exit_playing)
```

**Usage**: `OnEnter`/`OnExit` run exactly once per transition. `run_if(in_state(...))` runs every frame in that state.

## 6. Change Detection

```rust
fn highlight_changed(mut query: Query<&mut Sprite, Changed<Health>>) {
    for mut sprite in query.iter_mut() {
        sprite.color = Color::RED;
    }
}
```

**Usage**: `Changed<T>` triggers only when component T was modified since last frame.

## 7. Custom Events

```rust
#[derive(Event)]
struct CollisionEvent { entity_a: Entity, entity_b: Entity }

fn send_collisions(mut events: EventWriter<CollisionEvent>) {
    events.send(CollisionEvent { entity_a, entity_b });
}
```

**Usage**: Define events, send with `EventWriter`, read with `EventReader`. Add to app with `.add_event::<CollisionEvent>()`.

## 8. Fixed Timestep

```rust
fn physics_system(time: Res<Time>, mut query: Query<&mut Transform, With<RigidBody>>) {
    for mut transform in query.iter_mut() {
        transform.translation.y -= 9.81 * time.delta_seconds();
    }
}

// .add_systems(FixedUpdate, physics_system)
```

**Usage**: `FixedUpdate` runs at a fixed rate (default 64 Hz) independent of frame rate. Use for physics.

## 9. UI Button with Interaction

```rust
fn button_system(mut query: Query<(&Interaction, &mut BackgroundColor), (Changed<Interaction>, With<Button>)>) {
    for (interaction, mut color) in query.iter_mut() {
        *color = match interaction {
            Interaction::Pressed => Color::rgb(0.9, 0.3, 0.3).into(),
            Interaction::Hovered => Color::rgb(0.7, 0.5, 0.5).into(),
            Interaction::None => Color::rgb(0.3, 0.3, 0.3).into(),
        };
    }
}
```

**Usage**: Check `Changed<Interaction>` to react to button hover/press without polling.

## 10. Asset Server Loading

```rust
fn setup(mut commands: Commands, asset_server: Res<AssetServer>) {
    let texture: Handle<Image> = asset_server.load("textures/player.png");
    // Use texture handle in SpriteBundle
}
```

**Usage**: AssetServer loads assets asynchronously. Handles can be used immediately; assets will be ready when loaded.

## 11. 2D Camera with Follow

```rust
fn follow_player(
    player: Query<&Transform, With<Player>>,
    mut camera: Query<&mut Transform, (With<Camera2d>, Without<Player>)>,
) {
    if let Ok(player_transform) = player.get_single() {
        if let Ok(mut camera_transform) = camera.get_single_mut() {
            camera_transform.translation = player_transform.translation;
        }
    }
}
```

**Usage**: Make camera follow the player by setting camera translation to player translation each frame.

## 12. Timer Component

```rust
#[derive(Component)]
struct Lifetime(Timer);

fn lifetime_system(mut commands: Commands, time: Res<Time>, mut query: Query<(Entity, &mut Lifetime)>) {
    for (entity, mut lifetime) in query.iter_mut() {
        if lifetime.0.tick(time.delta()).finished() {
            commands.entity(entity).despawn();
        }
    }
}
```

**Usage**: Use `Timer` component for timed actions (despawn after delay, ability cooldowns).

## 13. Plugin Organization

```rust
pub struct PlayerPlugin;
impl Plugin for PlayerPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, spawn_player)
           .add_systems(Update, (player_movement, player_shoot));
    }
}
```

**Usage**: Organize related systems and resources into plugins. Main app just adds plugins.

## 14. Input Handling with KeyCode

```rust
fn player_input(keys: Res<ButtonInput<KeyCode>>, mut query: Query<&mut Player>) {
    for mut player in query.iter_mut() {
        player.moving = keys.pressed(KeyCode::ArrowLeft) || keys.pressed(KeyCode::ArrowRight);
    }
}
```

**Usage**: Use `ButtonInput<KeyCode>` for keyboard, `ButtonInput<MouseButton>` for mouse, `ButtonInput<GamepadButton>` for gamepad.

## 15. Audio Playback

```rust
fn play_sound(asset_server: Res<AssetServer>, audio: Res<Audio>) {
    audio.play(asset_server.load("audio/explosion.ogg"));
}
```

**Usage**: Use `bevy_audio` (included in DefaultPlugins) for sound effects. `Audio` resource has `play()`, `play_with_settings()`.
