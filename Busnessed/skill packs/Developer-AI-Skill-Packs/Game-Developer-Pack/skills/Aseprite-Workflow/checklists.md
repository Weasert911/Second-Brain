# Aseprite Workflow - Checklists

## Pixel Art Checklist

### Canvas
- [ ] Canvas size appropriate for game style
- [ ] Resolution consistent across all sprites
- [ ] Pixel aspect ratio correct (1:1 for pixel art)

### Layers
- [ ] Layers organized in groups
- [ ] Layers named descriptively
- [ ] Background layer separate from characters
- [ ] Shadows on separate layer below character

### Colors
- [ ] Palette defined and limited
- [ ] Colors consistent across all sprites
- [ ] Dithering used appropriately
- [ ] No banding in gradients

### Shading
- [ ] Light source consistent across all sprites
- [ ] Highlights and shadows on correct sides
- [ ] Value contrast readable at game size
- [ ] No pillow shading (uniform gradient)

### Line Art
- [ ] Outlines clean and consistent width
- [ ] No stray pixels
- [ ] Anti-aliasing smooths curves
- [ ] Silhouette readable

### Animation
- [ ] Frame timing consistent for animation type
- [ ] Onion skin used for smooth transitions
- [ ] Animation tags defined
- [ ] Looping animations seamless
- [ ] Key poses established before in-betweens

### Export
- [ ] Sprite sheet layout chosen optimally
- [ ] Padding between frames (1-2px)
- [ ] Frame tags exported for Godot
- [ ] Export format PNG (indexed or RGBA)
- [ ] Trimmed if needed for memory

### Godot Import
- [ ] SpriteFrames resource created
- [ ] Animation speed matches Aseprite
- [ ] Autoplay set for idle animation
- [ ] Default animation configured
- [ ] Filter set to Nearest (for pixel art)
