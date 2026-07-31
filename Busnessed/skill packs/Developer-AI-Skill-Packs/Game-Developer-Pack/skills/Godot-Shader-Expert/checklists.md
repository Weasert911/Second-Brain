# Godot Shader Expert - Checklists

## Shader Development Checklist

### General
- [ ] Correct `shader_type` (spatial/canvas_item/particles/sky)
- [ ] `render_mode` configured correctly
- [ ] All uniforms have `hint_range` or type hints for inspector
- [ ] Uniforms have sensible default values
- [ ] No hardcoded magic numbers (use uniforms)
- [ ] Comments explain non-obvious math
- [ ] Handles edge cases (UV out of range, zero division)

### Spatial Shaders
- [ ] ALBEDO, METALLIC, ROUGHTNESS set in fragment()
- [ ] NORMAL_MAP set correctly for normal-mapped materials
- [ ] ALPHA set if using transparency
- [ ] EMISSION set for emissive materials
- [ ] vertex() modifies VERTEX correctly
- [ ] light() function handles custom lighting if needed

### CanvasItem Shaders
- [ ] COLOR output set correctly
- [ ] TEXTURE sampled with correct UV coordinates
- [ ] SCREEN_TEXTURE used appropriately in post-process
- [ ] discard used correctly for transparency

### Particle Shaders
- [ ] CUSTOM.x used for lifetime progress
- [ ] TRANSFORM modified for position/scale/rotation
- [ ] VELOCITY set for movement
- [ ] COLOR fades with lifetime
- [ ] ACTIVE managed for particle restart

### Performance
- [ ] Minimized texture samples per fragment
- [ ] No dynamic branching in fragment shader (if possible)
- [ ] Calculations moved to vertex shader where possible
- [ ] `mediump` precision on mobile shaders
- [ ] No expensive operations (pow, exp) in hot paths
- [ ] Shader variants minimized
- [ ] Screen-reading only in post-process shaders

### Compatibility
- [ ] Works on target renderer (Forward+ / Mobile)
- [ ] Mobile-compatible render modes
- [ ] No desktop-only features on mobile builds
- [ ] Tested on target GPU family

### Debugging
- [ ] Visual output matches expected behavior
- [ ] Edge cases produce correct visuals
- [ ] No compilation errors in log
- [ ] Tested with different material parameters
