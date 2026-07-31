---
name: Krita-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about Krita for digital painting, brush engine, animation, layer management, or illustration workflows.
purpose: Provide expert-level guidance on Krita for digital painting, illustration, animation, and texture creation with professional brush and layer management.
---

## Capabilities

- Master the brush engine: brush tips, textures, brush settings, and preset management
- Manage layers: paint, filter, group, clone, vector, file, transparency mask, filter mask, colorize mask
- Utilize selection tools: freehand, polygonal, elliptical, magnetic, color-based, and outline
- Configure color management with color profiles, blending modes, and color selector
- Apply transform tools: cage, warp, mesh, perspective, and liquify
- Produce frame-by-frame animation with onion skin, timeline, and lip-sync
- Create and edit vector graphics and shapes
- Use filter layers for nondestructive editing
- Manage resources: brushes, patterns, gradients, and presets
- Paint in HDR mode with wide color gamut
- Import and export PSD files with layer preservation
- Use assistant tools for perspective drawing
- Apply stabilizer for smooth line art

## Limitations

- Cannot process video files or animated content beyond frame-by-frame animation
- 3D painting and model import covered at intermediate depth only
- Plugin development in Python is covered but with basic examples
- Complex photo manipulation better suited to GIMP or Photoshop
- Cannot replace tablet hardware calibration for pressure sensitivity

## Required Tools

- Krita 5.2+ installed
- Graphics tablet with pressure sensitivity
- Color-calibrated monitor for professional work
- Brushes and resources (can be downloaded from Krita Artists)

## Execution Workflow

1. Determine artwork type: illustration, concept art, texture, animation, or photo edit
2. Create file with appropriate resolution, color profile, and DPI
3. Configure canvas: orientation, background color, guides and grid
4. Set up brush with appropriate tip, size, opacity, and flow
5. Block in base shapes and composition using sketch layer
6. Refine line art with stabilizer for smooth strokes
7. Apply flat colors on separate layer beneath line art
8. Add shading and lighting using multiply/screen layers
9. Create texture and detail with specialized brushes
10. Apply color correction with filter layers (adjustment layers)
11. Add effects, overlays, and final touches
12. Export in appropriate format (PSD, PNG, TIFF, EXR)

## Decision Tree

- Artwork type → {Illustration, Concept art, Texture, Comic, Animation, Photo edit}
- Color mode → {RGB (web/screen), CMYK (print), LAB (high precision), HDR}
- Resolution → {72 DPI (web), 300 DPI (print), 600+ DPI (detailed print)}
- Brush type → {Pencil, Ink, Paint, Airbrush, Texture, Blender, Eraser, Custom}
- Layer approach → {Single layer, Multi-layer with groups, Adjustment layers, Filter masks}
- Shading method → {Multiply layer, Overlay layer, Hard light, Soft brush shading}
- Export target → {Web (JPEG/PNG), Print (TIFF/PDF), PSD (editing), EXR (HDR)}
- Animation → {Frame-by-frame, Onion skin, Lip-sync, Export as video}

## Review Checklist

- [ ] Canvas resolution and DPI match output requirements
- [ ] Color profile correct for intended medium (sRGB/AdobeRGB/CMYK)
- [ ] Brush settings produce desired stroke quality
- [ ] Layer organization clear with named layers and groups
- [ ] Line art clean with consistent stroke weight
- [ ] Colors well-blended with smooth transitions
- [ ] Shading consistent with light source direction
- [ ] Filter layers applied nondestructively
- [ ] Animation timing correct with proper onion skin
- [ ] Export format preserves intended quality

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Brush lag or delay | Brush size too large or complex | Reduce brush size or simplify brush tip |
| Pressure sensitivity not working | Tablet driver issue | Reinstall tablet driver, check Krita input settings |
| Colors look different in browser | Color profile mismatch | Convert to sRGB before web export |
| Canvas rotation not resetting | Locked rotation | Reset rotation with Ctrl+Shift+R |
| Stabilizer causing delay | High stabilizer value | Reduce stabilizer or disable for straight lines |
| Animation playback too fast | Wrong frame rate | Check animation FPS in timeline settings |
| PSD import missing layers | Incompatible layer type | Flatten adjustment layers before PSD import |
| Filter mask not showing effect | Mask disabled or wrong blend mode | Check mask visibility and blending mode |
| Memory usage high | Too many layers at high resolution | Merge layers or increase memory limit in settings |
| Paint engine errors | GPU acceleration issue | Disable OpenGL or switch to DirectX |
| Vector tool not snapping | Snap to grid disabled | Enable snap and configure grid settings |
| Colorize mask bleeding | Low contrast in reference layer | Increase contrast or use stricter fill threshold |

## Best Practices

- Name layers and groups descriptively for complex projects
- Use filter layers instead of direct adjustments for flexibility
- Save custom brush presets for project-specific needs
- Enable auto-save with 5-minute interval
- Use reference images tool for consistent proportions
- Work at 300 DPI for print, 150 DPI for large canvases
- Use layer groups for organization and group blending modes
- Leverage assistant tools for perspective and geometric accuracy
- Export to PSD for cross-software collaboration
- Keep resource folder organized with categorized brush packs

## Anti-Patterns

- Working in RGB for print output without proofing
- Applying filters destructively to paint layers instead of using filter layers
- Using too many layers (hundreds) causing performance issues without groups
- Neglecting to calibrate tablet pressure curve for natural strokes
- Overusing stabilizer resulting in lifeless, uniform lines
- Ignoring color management until export — leads to color shifts
- Painting at low resolution then upscaling (quality loss)
- Mixing color profiles within same project
- Working without backup before major edits
- Using default brush for all work instead of purpose-specific brushes

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
