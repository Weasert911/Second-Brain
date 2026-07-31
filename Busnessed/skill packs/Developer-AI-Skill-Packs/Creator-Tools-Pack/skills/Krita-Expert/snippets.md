# Krita-Expert Snippets

## Snippet 1: Create Filter Layer for Color Balance

**Description:** Add a nondestructive color balance adjustment layer.

```
Layer > Create New Filter Layer > Color Balance
- Mode: HSL
- Hue: 0 (or shift for color grading)
- Saturation: +10 to +30 (boost colors)
- Lightness: 0 (keep exposure neutral)
- Blending Mode: Normal
- Set as Filter Layer (affects all layers below)
```

**When to use:** To adjust overall color mood without permanently altering paint layers.

---

## Snippet 2: Stabilizer Settings for Clean Lines

**Description:** Configure stabilizer for smooth inking.

```
Tool Options > Stabilizer:
Type: Weighted (best balance of smoothness and responsiveness)
- Amount: 20-30 (smooth inking)
- Finish: 20 (smooth line endings)
- Delay: 0 (no delay for responsive feel)

Alternative: Drag Mode
- Drag Distance: 10px (lighter smoothing)
- Preferred by many comic artists for natural feel
```

**When to use:** For clean, professional inking without wobble or jitter in long strokes.

---

## Snippet 3: Wrap-Around Mode for Seamless Textures

**Description:** Paint textures that tile seamlessly.

```
View > Wrap-Around Mode (or Ctrl+Shift+W)
- Painting wraps across all edges
- Great for tileable textures and patterns

Workflow:
1. Enable Wrap-Around Mode
2. Paint normally — strokes wrap to opposite edge
3. Disable mode to check result
4. Use Offset Filter (Layer > New Layer > Offset) to verify seams
```

**When to use:** Creating seamless tileable textures for game environments or pattern fills.

---

## Snippet 4: Colorize Mask Workflow

**Description:** Quick flat coloring using colorize mask.

```
1. Create clean line art layer (black lines on transparent)
2. Layer > Create New Colorize Mask > Aligned to existing layer
3. Tool: Fill (Colorize Mask mode)
4. Select colors and click inside regions to fill
5. Mask automatically respects line boundaries
6. Fine-tune: Use brush to add/edit colored regions
7. Convert to paint layer when satisfied:
   Right-click mask > Convert to Paint Layer
```

**When to use:** Fast flat coloring for comics, illustrations, and animation cels with clean line art.

---

## Snippet 5: Transform Tool for Perspective Warp

**Description:** Apply perspective transform to selection or layer.

```
Tool: Transform (T) > Perspective mode
1. Select layer to transform
2. Ctrl+T to activate transform tool
3. Choose "Perspective" from tool options
4. Drag corner handles to set perspective
5. Enable "Smooth Transform" for quality
6. Apply (Enter) or Cancel (Esc)

Tip: Use with grid overlay for accurate perspective matching
View > Grid (Ctrl+Shift+G)
```

**When to use:** Correcting perspective in photos, matching elements to scene perspective, or adding depth.

---

## Snippet 6: HDR Painting Workflow

**Description:** Paint in high dynamic range for vibrant colors.

```
Canvas setup:
1. Image > Properties > Color Space: scRGB (linear) or RGB (16-bit float)
2. Enable HDR: Settings > Configure Krita > Display > HDR

Benefits:
- Colors beyond normal sRGB range
- More vibrant saturated colors
- Better for print color matching

Export:
- EXR format preserves HDR data
- TIFF 16-bit for print
- Save as 8-bit for web (converts automatically)
```

**When to use:** Creating content for HDR displays, VFX work, or preserving maximum color information for print.

---

## Snippet 7: Resource Bundle Management

**Description:** Install and manage brush and resource bundles.

```
Download and install resource bundles:
1. Download .bundle file from Krita Artists or other sources
2. Krita > Tools > Resource Manager
3. Click "Import Bundle"
4. Select .bundle file
5. Bundles appear in respective resource windows

Create custom bundle:
1. Tools > Resource Manager > Create New Bundle
2. Add brushes, patterns, gradients, etc.
3. Save as .bundle file
4. Share with team or transfer to other Krita installs

Bundle location:
Windows: %appdata%\krita\bundles\
```

**When to use:** Managing custom brushes and resources across installations or sharing with collaborators.

---

## Snippet 8: Assistant Tool Setup for 2-Point Perspective

**Description:** Configure 2-point perspective assistants.

```
Tool: Assistant (K)
1. Select "Perspective" assistant type
2. Click to place first vanishing point (left)
3. Click to place second vanishing point (right)
4. Adjust horizon line by dragging
5. Enable "Snap" in tool options for magnetic lines

Additional:
- Add Parallel Ruler for vertical lines
- Add Ellipse Assistant for circles in perspective
- Lock assistant layer to prevent accidental moves

Shortcut: Create new on "Assistants" layer
```

**When to use:** Architectural illustration, environment concept art, or any scene requiring accurate perspective.

---

## Snippet 9: Animation Frame Management

**Description:** Add, duplicate, and manage animation frames.

```
Timeline panel:
- Add frame: Right-click > Add Frame
- Duplicate frame: Select > Duplicate (or Ctrl+D)
- Remove frame: Right-click > Remove
- Move frame: Drag to new position
- Set frame delay: Right-click > Frame Properties > Delay (ms)

Onion Skin:
Layer > Onion Skin > Settings:
- Previous frames: 2 (shown in red)
- Next frames: 1 (shown in blue)
- Opacity: 50% prev, 25% next

Frame colors:
- Green: Keyframe (has content)
- Gray: Empty frame (inherits from previous)
- Red: Selected frame
```

**When to use:** During frame-by-frame animation to organize timing and manage frames efficiently.

---

## Snippet 10: Quick Color Palette from Image

**Description:** Extract color palette from reference image.

```
1. Open reference image as new document
2. Window > Docker > Palette
3. In Palette docker, click "+" > New Palette
4. Name: {{palette_name}}
5. Click "Add from Image" button
6. Select number of colors: 8, 16, 32, or custom
7. New palette populated with dominant colors
8. Save palette for future use

Alternative: Use Color Picker (I) while holding Ctrl
to sample from reference without making it active
```

**When to use:** Building cohesive color schemes from reference photos or existing artwork for consistent coloring.

---

## Snippet 11: Clone Layer for Textures

**Description:** Use clone layer to paint texture consistently.

```
1. Create source texture layer (filled with pattern or noise)
2. Layer > Create New Clone Layer
3. In Clone Layer Properties, set Source to texture layer
4. Apply blending mode: Overlay / Multiply / Screen
5. Use eraser or mask to reveal clone texture selectively

Variation:
- Multiple clone layers with different sources
- Use layer mask on clone for selective application
- Adjust opacity for subtle texture
- Transform clone layer for size/rotation
```

**When to use:** Applying consistent texture (canvas grain, paper texture, noise) across artwork without duplicating large layer data.

---

## Snippet 12: Liquify Transform

**Description:** Warp and distort with liquify tool.

```
Tool: Transform (T) > Liquify
1. Select target layer or area
2. Choose Liquify brush type:
   - Push: Drag pixels in direction
   - Expand: Inflate area
   - Shrink: Deflate area
   - Smooth: Smooth distortions
3. Brush Size: {{size}}px (adjust with [ ])
4. Brush Pressure: {{pressure}}% (affects distortion strength)
5. Apply strokes to distort image
6. Reset button removes all distortions

Use cases:
- Adjusting proportions
- Creating organic distortions
- Fixing minor pose issues
- Adding dynamic movement to stiff artwork
```

**When to use:** Making subtle adjustments to character proportions, creating dynamic effects, or organic shape manipulation.

---

## Snippet 13: Vector Layer for Flat Design

**Description:** Create and edit vector shapes in Krita.

```
1. Layer > Create New Vector Layer
2. Tools > Shape tools:
   - Rectangle: R
   - Ellipse: Ctrl+R
   - Path: P (for custom shapes)
3. Use "Edit Shapes" tool (F6) to adjust nodes
4. Fill and stroke properties in Tool Options
5. Convert to paint layer: Right-click > Convert to Paint Layer

Vector properties:
- Fill: Solid color, gradient, or none
- Stroke: Width, color, style (solid/dashed)
- Opacity: Per-shape or per-layer
- Corner radius: For rounded rectangles
```

**When to use:** Creating UI elements, flat design illustrations, logos, or any artwork needing clean, scalable shapes.

---

## Snippet 14: G'MIC Plugin Effects

**Description:** Apply advanced filters via G'MIC plugin.

```
Filters > G'MIC (if installed):
1. Select G'MIC from Filters menu
2. Browse effect categories:
   - Artistic: Oil painting, sketch, cartoon
   - Photo: HDR, colorize, denoise
   - Pattern: Halftone, weave, tiles
   - Repair: Inpaint, despeckle, cleanup
3. Preview effect in real-time
4. Adjust parameters
5. Apply to current layer or new layer

Installation:
Settings > Configure Krita > Plugins
Enable G'MIC Qt, restart Krita
```

**When to use:** Applying advanced photographic effects, artistic filters, or repair operations beyond Krita's built-in filter set.

---

## Snippet 15: Export Layers as Individual Files

**Description:** Export each layer as a separate PNG file.

```
File > Export > Export Layers...
1. Format: PNG
2. Path: {{output_directory}}
3. Options:
   - Layer name as filename: Yes
   - Skip hidden layers: Yes
   - Include background: No (for transparent)
   - Scale: 100% (or custom)
4. Click "Export All"

Python scripting alternative:
from krita import Krita
doc = Krita.instance().activeDocument()
for node in doc.topLevelNodes():
    if node.visible():
        node.save(node.name() + ".png", "32BPP_GUIE", "image/png", 0)
```

**When to use:** Exporting individual sprites, game assets, or UI elements from a single multi-layer document.
