# Aseprite-Expert References

## Official Documentation

- [Aseprite Documentation](https://www.aseprite.org/docs/) — Official user manual and feature guides
- [Aseprite Scripting API](https://github.com/aseprite/aseprite/blob/main/docs/API.md) — Lua scripting API reference
- [Aseprite Community Forum](https://community.aseprite.org/) — User community, tutorials, and troubleshooting
- [Aseprite GitHub Repository](https://github.com/aseprite/aseprite) — Source code, issues, and development
- [Aseprite Color Palettes](https://www.aseprite.org/palettes/) — Official color palette collection
- [Pixel Art Tutorials (Lospec)](https://lospec.com/) — Comprehensive pixel art tutorials and palette library

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Pixel** | Smallest unit of digital image; a single colored square |
| **Sprite** | A 2D bitmap image used in games or animation |
| **Sprite Sheet** | Single image containing multiple sprite frames arranged in a grid |
| **Tile** | Repeatable square image used to build game environments |
| **Tileset** | Collection of tiles arranged in a single image sheet |
| **Cel** | Individual layer frame in Aseprite's animation system |
| **Frame** | A single image in an animation sequence |
| **Tag** | Named range of frames defining an animation state |
| **Onion Skin** | Overlay showing previous/next frames as transparent ghosts |
| **Palette** | Set of colors used in an image or project |
| **Indexed Color** | Color mode where each pixel references a palette index |
| **Dithering** | Pattern of pixels simulating colors not in palette |
| **Anti-Aliasing** | Smoothing edges by blending with intermediate colors |
| **Pixel Perfect** | Drawing mode producing clean diagonal lines |
| **Tilemap** | Aseprite layer type for tile-based level editing |

## Conventions / Naming Standards

- Sprites: `character_action_state` (e.g., `hero_idle_front`, `goblin_walk_side`)
- Sprite Sheets: `character_action_sheet` (e.g., `hero_animation_sheet.png`)
- Tilesets: `environment_type_tileset` (e.g., `dungeon_floor_tileset.png`)
- Palettes: `project_palette.aseprite-colors`
- Tags: `StateName` (e.g., `Idle`, `Walk`, `Attack`, `Jump`, `Death`)
- Exports: `character_state_count.png` (e.g., `hero_idle_4frames.png`)

## Architecture / Workflow Notes

Aseprite uses a layer-frame architecture where each layer can have independent frames, creating cels. The timeline shows frames horizontally and layers vertically. Tags define frame ranges. Animation speed is controlled by frame duration (milliseconds per frame).

**Animation pipeline:** Sketch → Line art → Flat colors → Shading → Highlights → Export

**Export pipeline:** Select tagged frames → Sprite sheet layout → Border/padding → Metadata format → Preview → Export

## Key Tools / Commands

- `B` — Pencil tool
- `Alt+B` — Brush tool
- `E` — Eraser
- `G` — Paint bucket / Fill
- `M` — Marquee/Selection
- `L` — Lasso
- `I` — Eyedropper
- `C` — Move tool
- `H` — Hand / Pan
- `Z` — Zoom
- `N` — Pencil (non-contiguous fill)
- `Shift+S` — Symmetry toggle
- `Tab` — Toggle UI visibility
- `Enter` — Confirm text entry
- `Space+Drag` — Pan canvas

## Recommended Project Structure

```
pixel-art-project/
├── source/
│   ├── characters/
│   │   ├── hero/
│   │   │   ├── hero.aseprite
│   │   │   └── expressions/
│   │   ├── enemies/
│   │   └── npcs/
│   ├── environments/
│   │   ├── tilesets/
│   │   │   ├── floor.aseprite
│   │   │   └── walls.aseprite
│   │   └── backgrounds/
│   └── ui/
│       ├── icons/
│       ├── buttons/
│       └── fonts/
├── exports/
│   ├── spritesheets/
│   ├── tilesets/
│   ├── gifs/
│   └── individual/
├── palettes/
│   ├── project.aseprite-colors
│   └── references/
└── scripts/
    ├── export_batch.lua
    └── palette_tools.lua
```
