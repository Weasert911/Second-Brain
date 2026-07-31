# Krita-Expert References

## Official Documentation

- [Krita Manual](https://docs.krita.org/en/) — Complete user manual covering all features and tools
- [Krita Artists Forum](https://krita-artists.org/) — Community tutorials, brush packs, and troubleshooting
- [Krita Animation Guide](https://docs.krita.org/en/user_manual/animation.html) — Dedicated animation workflow documentation
- [Krita Python Scripting](https://docs.krita.org/en/reference_manual/python_scripting.html) — Python plugin and script development
- [Krita API Reference](https://api.krita.org/) — Complete Python API documentation
- [Krita Color Management](https://docs.krita.org/en/user_manual/color_management.html) — Color profiles and management guide

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Brush Tip** | The shape and texture used to stamp the brush stroke |
| **Brush Preset** | Saved configuration of brush tip, size, opacity, flow, and settings |
| **Filter Layer** | Nondestructive adjustment layer for color correction and effects |
| **Filter Mask** | Mask that applies filter effects selectively to areas |
| **Colorize Mask** | Mask that fills line art with color using region detection |
| **Transparency Mask** | Mask controlling pixel transparency |
| **Stabilizer** | Algorithm smoothing brush strokes by reducing jitter |
| **Assistant** | Guide tool for perspective, vanishing points, and rulers |
| **Wrap-Around Mode** | Painting mode that wraps strokes across canvas edges |
| **Onion Skin** | Overlay of previous/next frames for animation reference |
| **Resource Bundle** | Packaged collection of brushes, patterns, gradients, and presets |
| **Gamut Mask** | Limits color selector to specific color range |
| **PSD** | Photoshop Document format with partial layer support |
| **EXR** | OpenEXR high dynamic range image format |

## Conventions / Naming Standards

- Layers: `Type_Description` (e.g., `LineArt_Character`, `Color_Base`, `Shadow_Multiply`)
- Layer Groups: `Group_Description` (e.g., `Group_Background`, `Group_Character`)
- Brush Presets: `Purpose_Style` (e.g., `Ink_Manga`, `Paint_Oil`, `Sketch_Pencil`)
- Resources: `Type_Collection_Version` (e.g., `Brushes_Default_v5`)
- Filter Layers: `Filter_Effect_Param` (e.g., `Filter_Curves_Contrast`)
- Animation: `Scene_Shot_Take` (e.g., `Scene01_Shot02_Take1`)

## Architecture / Workflow Notes

Krita uses a node-based layer system where each layer can have masks, blend modes, and opacity. Filter layers are non-destructive and apply to all layers below. The brush engine evaluates: tip → texture → size → opacity → flow → color → blending.

**Layer evaluation order:** Bottom to top (background to foreground). Group blending mode can override child behavior.

**Animation pipeline:** Sketch → Clean line art → Flat colors → Shading → Effects → Export

## Key Tools / Commands

- `Ctrl+Shift+N` — New layer
- `Ctrl+G` — New group layer
- `Ctrl+Shift+M` — New filter mask
- `Ctrl+M` — New transparency mask
- `W` — Colorize mask tool
- `T` — Transform tool
- `R` — Crop tool
- `K` — Assistant tool
- `Y` — Pan tool
- `Z` — Zoom
- `[` / `]` — Decrease/increase brush size
- `Shift+[` / `]` — Decrease/increase brush opacity
- `Ctrl+Alt+Space+Drag` — Rotate canvas
- `F5` — Brush editor
- `F6` — Colorize mask editor

## Recommended Project Structure

```
art-project/
├── source/
│   ├── illustrations/
│   │   ├── project_name/
│   │   │   ├── project_name.kra
│   │   │   ├── references/
│   │   │   └── exports/
│   │   └── ...
│   ├── textures/
│   ├── concepts/
│   └── animations/
├── resources/
│   ├── brushes/
│   │   ├── ink_bundles/
│   │   ├── paint_bundles/
│   │   └── texture_bundles/
│   ├── patterns/
│   ├── gradients/
│   └── palettes/
├── exports/
│   ├── web/
│   ├── print/
│   └── psd/
└── scripts/
    └── python/
```
