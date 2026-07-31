# Godot Shader Expert - Examples

## CanvasItem Shaders

### Glow Effect
```glsl
shader_type canvas_item;

uniform vec4 glow_color : source_color = vec4(1.0, 1.0, 0.5, 1.0);
uniform float glow_intensity : hint_range(0.0, 2.0) = 1.0;
uniform float glow_radius : hint_range(0.0, 32.0) = 8.0;
uniform float threshold : hint_range(0.0, 1.0) = 0.5;

void fragment() {
    vec4 base_color = texture(TEXTURE, UV);
    float brightness = dot(base_color.rgb, vec3(0.299, 0.587, 0.114));

    if (brightness > threshold) {
        float glow = brightness * glow_intensity;
        COLOR = mix(base_color, glow_color, glow);
        COLOR.a = min(1.0, COLOR.a + glow * 0.5);
    } else {
        COLOR = base_color;
    }
}
```

### Dissolve Effect
```glsl
shader_type canvas_item;

uniform float dissolve_amount : hint_range(0.0, 1.0) = 0.0;
uniform vec4 edge_color : source_color = vec4(1.0, 0.5, 0.0, 1.0);
uniform float edge_width : hint_range(0.0, 0.2) = 0.05;
uniform float noise_scale : hint_range(0.0, 10.0) = 3.0;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void fragment() {
    vec2 uv = UV * noise_scale;
    float n = noise(uv + TIME * 0.1);
    float dissolve = dissolve_amount;

    float cutoff = n - dissolve;
    if (cutoff < 0.0) {
        discard;
    }

    vec4 color = texture(TEXTURE, UV);
    if (cutoff < edge_width) {
        float edge_intensity = 1.0 - (cutoff / edge_width);
        COLOR = mix(color, edge_color, edge_intensity);
    } else {
        COLOR = color;
    }
}
```

### Water Ripple Effect
```glsl
shader_type canvas_item;

uniform float wave_strength : hint_range(0.0, 0.1) = 0.03;
uniform float wave_speed : hint_range(0.0, 5.0) = 2.0;
uniform float wave_frequency : hint_range(1.0, 20.0) = 8.0;

void vertex() {
    float wave = sin(UV.x * wave_frequency + TIME * wave_speed) * wave_strength;
    wave += sin(UV.y * wave_frequency * 0.7 + TIME * wave_speed * 1.3) * wave_strength;
    VERTEX.y += wave;
}

void fragment() {
    vec2 uv = UV;
    float dist_x = sin(uv.y * wave_frequency + TIME * wave_speed) * wave_strength;
    float dist_y = cos(uv.x * wave_frequency * 0.8 + TIME * wave_speed * 1.2) * wave_strength;
    uv += vec2(dist_x, dist_y);
    COLOR = texture(TEXTURE, uv);
}
```

## Spatial Shaders

### Toon Shader
```glsl
shader_type spatial;
render_mode unshaded;

uniform vec4 base_color : source_color = vec4(1.0);
uniform vec4 shadow_color : source_color = vec4(0.3, 0.3, 0.4, 1.0);
uniform float shadow_threshold : hint_range(0.0, 1.0) = 0.5;
uniform float outline_width : hint_range(0.0, 0.05) = 0.02;

void vertex() {
    vec3 normal_world = (MODEL_MATRIX * vec4(NORMAL, 0.0)).xyz;
    VERTEX += NORMAL * outline_width;
}

void fragment() {
    vec3 light_dir = normalize(vec3(1.0, 2.0, 1.0));
    float ndotl = dot(NORMAL, light_dir);
    float light = step(shadow_threshold, ndotl * 0.5 + 0.5);
    ALBEDO = mix(shadow_color.rgb, base_color.rgb, light);
}
```

### Water Shader (3D)
```glsl
shader_type spatial;
render_mode blend_mix;

uniform vec4 shallow_color : source_color = vec4(0.2, 0.5, 0.7, 0.6);
uniform vec4 deep_color : source_color = vec4(0.0, 0.1, 0.3, 0.8);
uniform float wave_height : hint_range(0.0, 0.5) = 0.2;
uniform float wave_speed : hint_range(0.0, 2.0) = 1.0;
uniform sampler2D wave_normal : hint_normal;

void vertex() {
    vec3 pos = VERTEX;
    float wave = sin(pos.x * 2.0 + TIME * wave_speed) * wave_height;
    wave += sin(pos.z * 3.0 + TIME * wave_speed * 0.7) * wave_height * 0.5;
    VERTEX.y += wave;
}

void fragment() {
    vec2 uv = UV * 2.0 + TIME * 0.05;
    vec3 normal = texture(wave_normal, uv).xyz * 2.0 - 1.0;
    NORMAL = normalize(mix(NORMAL, normal, 0.5));

    float depth = FRAGCOORD.z;
    vec4 color = mix(shallow_color, deep_color, depth);
    ALBEDO = color.rgb;
    METALLIC = 0.0;
    ROUGHNESS = 0.2;
    ALPHA = mix(shallow_color.a, deep_color.a, depth);
}
```

### Fire Shader (Particles)
```glsl
shader_type particles;

uniform vec4 flame_color1 : source_color = vec4(1.0, 0.8, 0.2, 1.0);
uniform vec4 flame_color2 : source_color = vec4(0.8, 0.2, 0.0, 1.0);
uniform vec4 smoke_color : source_color = vec4(0.1, 0.1, 0.1, 0.3);

void vertex() {
    float lifetime = CUSTOM.y;
    float progress = CUSTOM.x;
    vec3 pos = TRANSFORM[3].xyz;

    float sway = sin(pos.x * 5.0 + TIME * 2.0) * 0.1;
    pos.x += sway * progress;
    pos.y += progress * 2.0;

    TRANSFORM[3].xyz = pos;
    COLOR = mix(flame_color1, flame_color2, progress);
    COLOR.a = 1.0 - progress;

    if (progress > 0.7) {
        COLOR = mix(COLOR, smoke_color, (progress - 0.7) / 0.3);
    }
}
```

## Post-Processing Shader

### CRT Monitor Effect
```glsl
shader_type canvas_item;

uniform float scanline_intensity : hint_range(0.0, 1.0) = 0.3;
uniform float curvature : hint_range(0.0, 10.0) = 3.0;
uniform float chromatic_aberration : hint_range(0.0, 0.01) = 0.003;

void fragment() {
    vec2 uv = FRAGCOORD / SCREEN_PIXEL_SIZE;
    vec2 center = uv - 0.5;
    float dist = length(center);
    vec2 curved_uv = uv + center * dist * dist * curvature * 0.01;
    vec2 screen_uv = curved_uv;

    float scanline = sin(screen_uv.y * SCREEN_PIXEL_SIZE.y * 3.14159 * 0.5);
    scanline = 1.0 - scanline * scanline_intensity;

    vec2 aber = chromatic_aberration;
    float r = texture(SCREEN_TEXTURE, screen_uv + vec2(aber, 0.0)).r;
    float g = texture(SCREEN_TEXTURE, screen_uv).g;
    float b = texture(SCREEN_TEXTURE, screen_uv - vec2(aber, 0.0)).b;

    vec3 color = vec3(r, g, b) * scanline;
    float vignette = 1.0 - dist * 0.5;
    COLOR = vec4(color * vignette, 1.0);
}
```
