---
name: "Aseprite Workflow"
version: "1.0.0"
domain: "Game Development"
activation_description: "Aseprite pixel art and sprite creation for Godot games"
purpose: "Make AI proficient in creating pixel art assets with Aseprite, including sprite creation, animation, palette management, sprite sheet export, and Godot import pipeline integration"
---

## Capabilities
- Create pixel art sprites with proper resolution and canvas setup
- Organize layers for modular character parts
- Manage color palettes and apply color theory
- Animate using Aseprite's timeline and frame system
- Export sprite sheets with proper metadata
- Create tilesets for tilemap-based levels
- Apply dithering techniques for color transitions
- Use Aseprite scripting API for automation
- Integrate with Godot import pipeline
- Create UI icons with consistent pixel sizes

## Limitations
- Does not cover hand-drawn animation or traditional art fundamentals
- Does not cover Godot engine animation systems (see Godot 4 Expert)
- Does not cover 3D modeling or rendering
- Does not cover photorealistic or high-resolution art

## Required Tools
- Aseprite 1.3+ (Steam or official)
- Godot 4.2+ for import testing
- Image optimization tools (optional)

## Execution Workflow
1. Determine canvas size and resolution based on game style
2. Set up palette with primary, secondary, and accent colors
3. Create sprite with clean pixel art techniques
4. Organize layers for body parts or animation elements
5. Animate using frame-by-frame or tweened methods
6. Export as sprite sheet or individual tags
7. Configure Godot import settings
8. Create animations in Godot AnimationPlayer

## Best Practices
- Canvas size: powers of 2 (16, 32, 64, 128, 256)
- Palette: <64 colors for retro style
- Consistent pixel density across all assets
- Use cel shading and outlines for clarity
- Export at 1x scale, scale in Godot engine
- Name layers consistently for easy import

## References
- See references.md for Aseprite tools and workflow reference
- See examples.md for character and tileset creation examples
- See templates.md for Aseprite file templates
- See checklists.md for pixel art quality checklist
- See snippets.md for Aseprite Lua scripts
