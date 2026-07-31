# Templates — Bevy-Expert

## Template 1: Basic App Setup

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, {{system1}})
        .run();
}

fn setup(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn(Camera2dBundle::default());
    {{setup_commands}}
}

fn {{system1}}({{params}}) {
    {{system_body}}
}
```

## Template 2: Game State Machine

```rust
#[derive(Debug, Clone, Copy, Default, Eq, PartialEq, Hash, States)]
enum GameState {
    #[default]
    {{State1}},
    {{State2}},
    {{State3}},
}

// In App:
// .init_state::<GameState>()
// .add_systems(OnEnter(GameState::State1), enter_state1)
// .add_systems(OnExit(GameState::State1), exit_state1)
// .add_systems(Update, state1_system.run_if(in_state(GameState::State1)))
```

## Template 3: Player Controller

```rust
#[derive(Component)]
struct Player { speed: f32 }

#[derive(Component)]
struct Velocity(Vec3);

fn player_movement(
    time: Res<Time>,
    keys: Res<ButtonInput<KeyCode>>,
    mut query: Query<(&Player, &mut Transform)>,
) {
    for (player, mut transform) in query.iter_mut() {
        let mut dir = Vec3::ZERO;
        if keys.pressed(KeyCode::KeyW) {{ dir.z -= 1.0; }}
        if keys.pressed(KeyCode::KeyS) {{ dir.z += 1.0; }}
        if keys.pressed(KeyCode::KeyA) {{ dir.x -= 1.0; }}
        if keys.pressed(KeyCode::KeyD) {{ dir.x += 1.0; }}
        transform.translation += dir.normalize_or_zero() * player.speed * time.delta_seconds();
    }
}
```

## Template 4: UI Button

```rust
#[derive(Component)]
struct {{ButtonName}};

fn setup_ui(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn((
        ButtonBundle {
            style: Style { width: Val::Px({{width}}), height: Val::Px({{height}}), ..default() },
            background_color: BackgroundColor(Color::srgb({{r}}, {{g}}, {{b}})),
            ..default()
        },
        {{ButtonName}},
    ))
    .with_children(|parent| {
        parent.spawn(TextBundle::from_section("{{label}}", TextStyle {
            font: asset_server.load("{{font_path}}"),
            font_size: {{font_size}},
            ..default()
        }));
    });
}

fn {{button}}_interaction(
    mut interaction_query: Query<(&Interaction, &mut BackgroundColor), (Changed<Interaction>, With<{{ButtonName}}>)>,
) {
    for (interaction, mut color) in interaction_query.iter_mut() {
        match *interaction {
            Interaction::Pressed => {{color_0 = Color::srgb(0.9, 0.3, 0.3); /* action */}},
            Interaction::Hovered => {{color_0 = Color::srgb(0.7, 0.5, 0.5);}},
            Interaction::None => {{color_0 = Color::srgb(0.3, 0.3, 0.3);}},
        }
    }
}
```

## Template 5: Asset Loading with Tracking

```rust
#[derive(Resource)]
struct GameAssets {
    {{asset1}}: Handle<{{AssetType1}}>,
    {{asset2}}: Handle<{{AssetType2}}>,
}

fn load_assets(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.insert_resource(GameAssets {
        {{asset1}}: asset_server.load("{{path1}}"),
        {{asset2}}: asset_server.load("{{path2}}"),
    });
}

fn check_loading(mut next_state: ResMut<NextState<{{StateType}}>>, assets: Res<GameAssets>, server: Res<AssetServer>) {
    if server.load_state(&assets.{{asset1}).is_loaded() {
        && server.load_state(&assets.{{asset2}).is_loaded() {
        next_state.set({{LoadedState}});
    }
}
```

## Template 6: Custom Event

```rust
#[derive(Event)]
struct {{EventName}} {
    entity: Entity,
    {{field}}: {{field_type}},
}

fn {{event_sender}}(mut events: EventWriter<{{EventName}}>, query: Query<(Entity, ...)>) {
    for (entity, ...) in query.iter() {
        events.send({{EventName}} { entity, {{field}}: value });
    }
}

fn {{event_receiver}}(mut events: EventReader<{{EventName}}>) {
    for event in events.read() {
        println!("Event: {:?}", event.entity);
    }
}

// In App: .add_event::<{{EventName}}>()
```

## Template 7: Plugin Structure

```rust
pub struct {{Name}}Plugin;

impl Plugin for {{Name}}Plugin {
    fn build(&self, app: &mut App) {
        app
            .add_systems(Startup, setup{{Name}})
            .add_systems(Update, {{system1}})
            .add_systems(FixedUpdate, {{fixed_system}});
    }
}

fn setup{{Name}}(mut commands: Commands) {
    {{setup_commands}}
}
```

## Template 8: Fixed Timestep Physics

```rust
#[derive(Component)]
struct RigidBody { velocity: Vec3, mass: f32 }

fn physics_system(
    time: Res<Time>,
    mut query: Query<(&mut Transform, &RigidBody)>,
) {
    let dt = time.delta_seconds();
    for (mut transform, body) in query.iter_mut() {
        transform.translation += body.velocity * dt;
        // Apply gravity, friction, etc.
    }
}

// In App: .add_systems(FixedUpdate, physics_system)
```
