# Godot Shader Expert - References

## Shader Language Basics

### Shader Types
```glsl
// Spatial (3D)
shader_type spatial;

// CanvasItem (2D)
shader_type canvas_item;

// Particles (GPU)
shader_type particles;
```

### Render Modes
```glsl
// Spatial render modes
render_mode blend_mix, blend_add, blend_sub, blend_mul;
render_mode depth_test_disable, depth_draw_opaque, depth_draw_always;
render_mode cull_front, cull_back, cull_disabled;
render_mode unshaded, ambient_light_disabled;
render_mode shadows_disabled;

// CanvasItem render modes
render_mode blend_mix, blend_add, blend_sub, blend_mul;
render_mode unshaded, light_only;
render_mode sdf_scale_1x, sdf_scale_2x, sdf_scale_4x;
```

## Built-in Variables

### Spatial Shader
```glsl
// Per-vertex
VERTEX - vec3, vertex position in model space
NORMAL - vec3, vertex normal in model space
TANGENT - vec4, vertex tangent in model space
UV - vec2, UV coordinates
UV2 - vec2, secondary UV coordinates
COLOR - vec4, vertex color

// Per-instance
INSTANCE_ID - int, instance index
MODEL_MATRIX - mat4, model-to-world transform
VIEW_MATRIX - mat4, world-to-view transform
PROJECTION_MATRIX - mat4, view-to-clip transform
MODELVIEW_MATRIX - mat4, model-to-view transform

// Fragment
FRAGCOORD - vec4, fragment position in screen space
SCREEN_TEXTURE - sampler2D, screen content at this pixel
POINT_COORD - vec2, point sprite coordinates
ALBEDO - vec3, base color output
METALLIC - float, metallic value [0..1]
ROUGHNESS - float, roughness value [0..1]
EMISSION - vec3, emission color
NORMAL_MAP - vec3, normal map for tangent-space normal
```

### CanvasItem Shader
```glsl
// Vertex
VERTEX - vec2, vertex position
UV - vec2, UV coordinates
COLOR - vec4, vertex color

// Fragment
COLOR - vec4, output color
TEXTURE - sampler2D, sprite texture
TEXTURE_PIXEL_SIZE - vec2, texel size
FRAGCOORD - vec2, fragment position in pixels
POINT_COORD - vec2, point sprite coordinates
SCREEN_TEXTURE - sampler2D, screen content
```

### Particle Shader
```glsl
// Per-particle
TRANSFORM - mat4, particle transform
COLOR - vec4, particle color
VELOCITY - vec3, particle velocity
MASS - float, particle mass
ACTIVE - bool, particle active state
RESTART - bool, restart particle
CUSTOM - vec4, custom data

// Emission
EMISSION_TRANSFORM - mat4, emission point transform
EMISSION_SHAPE - int, 0=point, 1=sphere, 2=box, 3=ring
```

## Common Built-in Functions

```glsl
// Math
sin(x), cos(x), tan(x)
abs(x), sign(x), floor(x), ceil(x), round(x)
min(a, b), max(a, b), clamp(x, min, max)
mix(a, b, t) - linear interpolation
step(edge, x) - 0 if x < edge, 1 otherwise
smoothstep(edge0, edge1, x) - smooth Hermite interpolation
length(v) - vector length
distance(a, b) - distance between vectors
dot(a, b) - dot product
cross(a, b) - cross product
normalize(v) - normalized vector
reflect(I, N) - reflection vector
refract(I, N, eta) - refraction vector

// Texture
texture(sampler, uv) - sample texture
textureLod(sampler, uv, lod) - sample with LOD
textureSize(sampler, lod) - get texture dimensions

// Noise and random
fract(x) - fractional part
mod(x, y) - modulo
```

## Texture Filtering Modes

| Mode | Description |
|------|-------------|
| nearest | Pixel art, no blending |
| bilinear | Smooth blending |
| trilinear | Smooth with mipmaps |
| anisotropic | Best quality for angled surfaces |
| max_anisotropy | Maximum quality, expensive |

## Shader Parameter Types

```glsl
uniform float my_float;
uniform int my_int;
uniform vec2 my_vec2;
uniform vec3 my_vec3;
uniform vec4 my_vec4;
uniform sampler2D my_texture;
uniform bool my_bool;
uniform mat4 my_matrix;

// With hints for the inspector
uniform float speed : hint_range(0, 100, 1) = 10.0;
uniform vec2 direction : hint_range(-1, 1) = vec2(1.0, 0.0);
uniform sampler2D normal_map : hint_normal;
```

## Common Effect Techniques

| Effect | Approach |
|--------|----------|
| Glow | Sample screen texture with blur |
| Dissolve | Alpha clip based on noise + edge glow |
| Water | Vertex displacement with sin/cos, UV distortion |
| Fire | Animated noise texture, color ramp |
| Outlines | Edge detection via normal/ depth difference |
| Pixelation | Floor UV to pixel grid |
| Wave | UV distortion with time-based sin |
| Hologram | Scan lines, Fresnel effect, distortion |
| Ice | Refraction through normal distortion |
| Glass | Mix reflection and refraction |

## Optimization Tips

- Minimize texture samples (most expensive)
- Use `hint_range` for shader parameters
- Avoid dynamic branching in fragment shaders
- Use `mediump` for mobile shader precision
- Prefer `textureLod` over `texture` when LOD is known
- Use uniforms instead of hardcoded constants for flexibility
- Group calculations in vertex shader (per-vertex) vs fragment (per-pixel)
- Use `DISCARD` early for transparent fragments
- Limit number of shader variants per material
