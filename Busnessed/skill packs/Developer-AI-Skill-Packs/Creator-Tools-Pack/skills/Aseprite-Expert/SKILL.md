---
name: Aseprite-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about Aseprite for pixel art creation, animation, sprite sheets, tilesets, or pixel art workflows.
purpose: Provide expert-level guidance on Aseprite for pixel art creation, cel animation, sprite sheet generation, tilesets, and game-ready asset production.
---

## Capabilities

- Create pixel art with proper canvas setup, resolution, and color palette management
- Manage layers including normal, group, tilemap, and cel layer types
- Utilize drawing tools: pencil, brush, eraser, fill, gradient, and selection tools
- Produce cel animation using timeline, keyframes, onion skin, and layer animation
- Organize frames with tags for animation states (idle, walk, attack, jump)
- Export sprite sheets with JSON data for game engine integration
- Create tilesets for tile-based game levels
- Apply palette swaps and recoloring techniques for asset variants
- Implement shadow and highlight techniques for pixel art depth
- Apply anti-aliasing and dithering for color transitions
- Use pixel-perfect drawing mode for clean lines
- Write Aseprite Lua scripts for automation and custom tools

## Limitations

- Cannot execute Aseprite scripts directly; provides code for manual loading
- 3D pixel art (voxel) creation is outside scope
- Complex multi-character animation scenes beyond 500 frames may be slow
- Cannot export directly to console-specific formats (PSP, GBA) without conversion tools
- Vector-to-pixel conversion requires manual touch-up

## Required Tools

- Aseprite 1.3+ installed
- Image editor for post-processing sprite sheets (optional)
- Game engine (Unity, Godot, GameMaker) for asset integration (optional)
- Text editor for editing Lua scripts

## Execution Workflow

1. Determine art requirements: canvas size, color palette, animation frames, export format
2. Create new file with appropriate resolution and color mode (RGBA/Indexed)
3. Set up color palette with primary, secondary, and accent colors
4. Draw base sprite with pencil tool, blocking in main shapes
5. Add shading and highlights using pixel art shading techniques
6. Create animation frames in timeline with onion skin for reference
7. Tag frames for different animation states
8. Add details, dithering, and anti-aliasing as needed
9. Export as sprite sheet with JSON metadata or as individual files
10. Test in target game engine or viewer
11. Create variations via palette swaps
12. Optimize final asset for game integration

## Decision Tree

- Art type → {Character sprite, Tile/environment, UI element, Icon, Effects}
- Color mode → {RGBA (full color), Indexed (limited palette), Grayscale}
- Animation needed → {Static, 2-4 frames, 8-16 frames, 16+ frames, Full sequence}
- Palette size → {2-color (1-bit), 8-color, 16-color, 32-color, 64+, Unlimited}
- Game engine → {Unity, Godot, GameMaker, RPG Maker, Custom engine}
- Export type → {Sprite sheet, Individual PNGs, GIF animation, JSON data, Aseprite file}
- Resolution → {8x8, 16x16, 32x32, 64x64, 128x128, 256x256}
- Tile type → {Auto-tile, Manual tile, Animated tile, Large terrain tile}

## Review Checklist

- [ ] Canvas resolution matches game asset requirements
- [ ] Color palette is consistent across all assets
- [ ] Line art is clean with no stray pixels
- [ ] Shading follows consistent light source direction
- [ ] Animation frames are properly timed with onion skin
- [ ] Frame tags cover all animation states
- [ ] Sprite sheet export includes necessary metadata
- [ ] Tile set tiles correctly in target engine
- [ ] Palette swaps produce clean color replacements
- [ ] Dithering and anti-aliasing match art style
- [ ] Export size and format compatible with target platform
- [ ] Pivot points are consistent across frames

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Colors shift on export | Wrong color profile | Export as PNG with sRGB, avoid indexed mode for gradients |
| Animation jitters | Inconsistent sprite positioning | Lock sprite origin point across all frames |
| Palette swap affecting wrong colors | Similar color values | Increase gap between swapped color hues |
| Anti-aliased edges look blurry | Wrong alpha handling | Use pixel-perfect mode for sharp edges |
| Sprite sheet spacing wrong | Insufficient padding | Set border/padding in export settings |
| Aseprite script error | Syntax or API mismatch | Check Aseprite API version in script |
| GIF export has color banding | Too few colors | Use 256 colors and error diffusion dithering |
| Tilemap not aligning | Tile size mismatch | Verify tile size matches grid settings |
| Pencil tool drawing thick lines | Anti-aliasing enabled | Disable anti-aliasing in tool settings |
| Onion skin not showing | Layer or frame issue | Enable onion skin per layer and check visibility |
| Export sprite sheet has duplicates | Same tags across frames | Ensure unique tagging for animation clips |
| Performance slow with many layers | Layer count too high | Merge finished layers or group them |

## Best Practices

- Start with low resolution and scale up for detailed work
- Use indexed color mode for palette-limited art styles
- Enable pixel-perfect drawing for clean diagonal lines
- Use onion skin with 2-3 previous/next frames for smooth animation
- Group related layers for organized project files
- Tag frames immediately when animation is finalized
- Export with layer bounds to minimize sprite sheet waste
- Save palette files (.aseprite-colors) separately for reuse
- Use symmetry tool for character front-view art
- Keep backups of .aseprite files before major changes

## Anti-Patterns

- Working at too high resolution for pixel art style
- Using too many colors causing noisy, inconsistent art
- Neglecting to set consistent light source before shading
- Animating without onion skin reference
- Exporting sprite sheets without testing in target engine
- Using anti-aliasing on pixel art that requires sharp edges
- Over-dithering causing visual noise
- Mixing different pixel sizes within same sprite
- Forgetting to tag frames before sprite sheet export
- Working without saving palette for cross-sprite consistency

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
