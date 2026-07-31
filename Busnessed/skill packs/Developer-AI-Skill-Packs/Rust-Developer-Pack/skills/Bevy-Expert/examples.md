# Examples — Bevy-Expert

## Beginner: 2D Sprite Movement

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, move_player)
        .run();
}

#[derive(Component)]
struct Player { speed: f32 }

fn setup(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn(Camera2dBundle::default());
    commands.spawn((
        SpriteBundle {
            texture: asset_server.load("player.png"),
            ..default()
        },
        Player { speed: 200.0 },
    ));
}

fn move_player(
    time: Res<Time>,
    keys: Res<ButtonInput<KeyCode>>,
    mut query: Query<(&mut Transform, &Player)>,
) {
    for (mut transform, player) in query.iter_mut() {
        let mut direction = Vec3::ZERO;
        if keys.pressed(KeyCode::ArrowLeft) { direction.x -= 1.0; }
        if keys.pressed(KeyCode::ArrowRight) { direction.x += 1.0; }
        if keys.pressed(KeyCode::ArrowUp) { direction.y += 1.0; }
        if keys.pressed(KeyCode::ArrowDown) { direction.y -= 1.0; }
        transform.translation += direction.normalize_or_zero() * player.speed * time.delta_seconds();
    }
}
```

**Explanation**: Basic 2D game with player sprite movement. Uses `Camera2dBundle` for 2D rendering, `SpriteBundle` for the player sprite, and `ButtonInput<KeyCode>` for keyboard input.

## Intermediate: State Management with Menu and Game

```rust
use bevy::prelude::*;

#[derive(Debug, Clone, Copy, Default, Eq, PartialEq, Hash, States)]
enum GameState { #[default] Menu, Playing, Paused }

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .init_state::<GameState>()
        .add_systems(Startup, setup)
        .add_systems(OnEnter(GameState::Menu), setup_menu)
        .add_systems(OnExit(GameState::Menu), cleanup_menu)
        .add_systems(Update, menu_ui_interaction.run_if(in_state(GameState::Menu)))
        .add_systems(Update, player_movement.run_if(in_state(GameState::Playing)))
        .run();
}

#[derive(Component)]
struct MenuUI;

fn setup_menu(mut commands: Commands) {
    commands.spawn((
        TextBundle::from_section("Click to Start", TextStyle { font_size: 48.0, ..default() })
            .with_style(Style { position_type: PositionType::Absolute, top: Val::Px(100.0), ..default() }),
        MenuUI,
    ));
}

fn cleanup_menu(mut commands: Commands, menu: Query<Entity, With<MenuUI>>) {
    for entity in menu.iter() { commands.entity(entity).despawn(); }
}

fn menu_ui_interaction(mut next_state: ResMut<NextState<GameState>>) {
    // check for click or key press
    next_state.set(GameState::Playing);
}
```

**Explanation**: State machine with `Menu` and `Playing` states. Systems only run when in the correct state via `run_if(in_state(...))`.

## Advanced: 3D Scene with PBR and Animation

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup_3d)
        .add_systems(Update, rotate_cube)
        .run();
}

#[derive(Component)]
struct Rotating;

fn setup_3d(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    commands.spawn(PointLightBundle {
        point_light: PointLight { intensity: 1500.0, ..default() },
        transform: Transform::from_xyz(4.0, 8.0, 4.0),
        ..default()
    });

    commands.spawn((
        PbrBundle {
            mesh: meshes.add(Cuboid::default()),
            material: materials.add(StandardMaterial { base_color: Color::srgb(0.8, 0.2, 0.2), ..default() }),
            transform: Transform::from_xyz(0.0, 0.5, 0.0),
            ..default()
        },
        Rotating,
    ));

    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(-2.0, 2.5, 5.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });
}

fn rotate_cube(time: Res<Time>, mut query: Query<&mut Transform, With<Rotating>>) {
    for mut transform in query.iter_mut() {
        transform.rotate_y(time.delta_seconds() * 0.5);
    }
}
```

**Explanation**: 3D PBR scene with a rotating cube. Uses `PbrBundle` for physically-based rendering, `PointLightBundle` for lighting, and `Camera3dBundle` for perspective camera.
