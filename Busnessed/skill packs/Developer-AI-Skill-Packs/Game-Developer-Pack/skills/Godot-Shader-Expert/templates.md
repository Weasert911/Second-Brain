# Godot Shader Expert - Templates

## CanvasItem Shader Template

```glsl
shader_type canvas_item;

// Uniforms exposed in material inspector
uniform vec4 color_modulate : source_color = vec4(1.0);
uniform float intensity : hint_range(0.0, 1.0) = 1.0;
uniform sampler2D effect_texture : repeat_enable;

void vertex() {
    // Modify vertex positions here
    // VERTEX, UV, COLOR available
}

void fragment() {
    // Default texture sample
    vec4 base_color = texture(TEXTURE, UV);

    // Apply effects here
    vec4 final_color = base_color * color_modulate;
    final_color.rgb *= intensity;

    // Output
    COLOR = final_color;
}
```

## Spatial Shader Template

```glsl
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_back;

// Material parameters
uniform vec4 albedo_color : source_color = vec4(1.0);
uniform float metallic : hint_range(0.0, 1.0) = 0.0;
uniform float roughness : hint_range(0.0, 1.0) = 0.5;
uniform sampler2D texture_albedo : hint_albedo;
uniform sampler2D texture_normal : hint_normal;
uniform sampler2D texture_metallic_roughness;

void vertex() {
    // Modify vertices for displacement or deformation
    // VERTEX, NORMAL, UV, TANGENT available
}

void fragment() {
    // Sample textures
    vec4 albedo_tex = texture(texture_albedo, UV);
    vec2 metallic_roughness = texture(texture_metallic_roughness, UV).rg;

    // Set material properties
    ALBEDO = albedo_color.rgb * albedo_tex.rgb;
    METALLIC = metallic + metallic_roughness.x;
    ROUGHNESS = roughness + metallic_roughness.y;
    ALPHA = albedo_color.a * albedo_tex.a;

    // Normal mapping
    vec3 normal_tex = texture(texture_normal, UV).xyz * 2.0 - 1.0;
    NORMAL_MAP = normal_tex;
}

void light() {
    // Custom lighting calculations (if not unshaded)
    // DIFFUSE_LIGHT, SPECULAR_LIGHT available
}
```

## Particle Shader Template

```glsl
shader_type particles;

uniform vec4 start_color : source_color = vec4(1.0);
uniform vec4 end_color : source_color = vec4(0.0, 0.0, 0.0, 0.0);
uniform float start_scale : hint_range(0.0, 10.0) = 1.0;
uniform float end_scale : hint_range(0.0, 10.0) = 0.0;

void vertex() {
    // CUSTOM stores per-particle custom data
    // CUSTOM.x = lifetime progress (0.0 to 1.0)
    // CUSTOM.y = initial lifetime
    // CUSTOM.z = emission circle angle
    // CUSTOM.w = emission circle distance

    float progress = CUSTOM.x;

    // Color over lifetime
    COLOR = mix(start_color, end_color, progress);

    // Scale over lifetime
    float scale = mix(start_scale, end_scale, progress);
    TRANSFORM[0] = vec4(scale, 0.0, 0.0, 0.0);
    TRANSFORM[1] = vec4(0.0, scale, 0.0, 0.0);

    // Movement
    VELOCITY.y -= 9.8 * progress * CUSTOM.y; // Gravity
    VELOCITY *= 0.99; // Damping

    // Fade out
    if (progress > 0.9) {
        COLOR.a *= 1.0 - (progress - 0.9) / 0.1;
    }
}
```

## Post-Processing Shader Template

```glsl
// Apply to a ColorRect covering the screen
shader_type canvas_item;

uniform float effect_strength : hint_range(0.0, 1.0) = 1.0;
uniform vec2 pixel_size : hint_range(0.0, 0.1) = vec2(0.003, 0.003);

void fragment() {
    // Sample screen texture
    vec4 screen_color = texture(SCREEN_TEXTURE, SCREEN_UV);

    // Apply effect here
    vec4 result = screen_color;

    // Example: pixelation
    vec2 pixel_uv = floor(SCREEN_UV / pixel_size) * pixel_size;
    vec4 pixelated = texture(SCREEN_TEXTURE, pixel_uv);
    result = mix(screen_color, pixelated, effect_strength);

    COLOR = result;
}
```

## Sky Shader Template

```glsl
shader_type sky;

uniform vec4 top_color : source_color = vec4(0.2, 0.4, 0.8, 1.0);
uniform vec4 horizon_color : source_color = vec4(0.8, 0.7, 0.6, 1.0);
uniform vec4 bottom_color : source_color = vec4(0.3, 0.2, 0.1, 1.0);
uniform float sun_angle : hint_range(0.0, 360.0) = 90.0;

void fragment() {
    // EYEDIR is the normalized direction from camera
    vec3 dir = normalize(EYEDIR);
    float height = dir.y;

    // Sky gradient
    vec3 sky_color;
    if (height > 0.0) {
        float t = clamp(height, 0.0, 1.0);
        sky_color = mix(horizon_color.rgb, top_color.rgb, t);
    } else {
        float t = clamp(-height, 0.0, 1.0);
        sky_color = mix(horizon_color.rgb, bottom_color.rgb, t);
    }

    // Sun
    vec3 sun_dir = normalize(vec3(cos(radians(sun_angle)), 0.5, sin(radians(sun_angle))));
    float sun_dot = max(dot(dir, sun_dir), 0.0);
    float sun = pow(sun_dot, 100.0);

    COLOR = vec4(sky_color + vec3(1.0, 0.9, 0.7) * sun, 1.0);
}
```

## Material Variant Template

```gdscript
# Create material variants from shader parameters
@tool
extends EditorScript

func _run() -> void:
    var base_material := ShaderMaterial.new()
    base_material.shader = preload("res://shaders/character.shader")

    # Create variants
    var variants := {
        "red": {"albedo": Color.RED, "metallic": 0.0, "roughness": 0.8},
        "blue": {"albedo": Color.BLUE, "metallic": 0.5, "roughness": 0.3},
        "gold": {"albedo": Color(1.0, 0.8, 0.0), "metallic": 1.0, "roughness": 0.2},
    }

    for name in variants.keys():
        var material := base_material.duplicate() as ShaderMaterial
        var params := variants[name]
        for param in params.keys():
            material.set_shader_parameter(param, params[param])
        ResourceSaver.save(material, "res://materials/character_%s.tres" % name)
        print("Created: character_%s.tres" % name)
```
