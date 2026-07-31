# Krita-Expert Templates

## Template 1: Illustration Layer Structure

**Description:** Standard layer organization for character illustration.

```
Name: Illust_{{project_name}}

Layer Stack (top to bottom):
1. Effects (Group) [Pass-Through]
   ├── Glow / Light Rays (Screen, Opacity: {{glow_opacity}})
   └── Vignette (Filter Layer, Curves)
2. Color Adjustments (Group) [Pass-Through]
   ├── Color Balance (Filter Layer, {{color_balance_params}})
   ├── Curves (Filter Layer, {{curves_params}})
   └── Saturation (Filter Layer, {{saturation}})
3. Highlights (Screen, Opacity: {{highlight_opacity}})
4. Shadows (Multiply, Opacity: {{shadow_opacity}})
5. Colors (Group) [Normal]
   ├── Skin (Normal)
   ├── Hair (Normal)
   ├── Clothes (Normal)
   ├── Accessories (Normal)
   └── Background (Normal)
6. LineArt (Multiply or Normal, Opacity: {{line_opacity}})
7. Sketch (Normal, Opacity: 30%, hidden) [optional]
8. Background (Normal, below everything)
```

**Usage Notes:** Use group pass-through mode for adjustment layers. Keep line art layer separate for coloring flexibility. Hide sketch layer before final export.

---

## Template 2: Canvas Setup for Print

**Description:** Canvas configuration for professional print output.

```
Name: Print_{{project_name}}_{{size}}

Canvas:
- Width: {{width}} mm (or {{width_px}}px)
- Height: {{height}} mm (or {{height_px}}px)
- Resolution: {{dpi}} DPI (300 for print, 150 for large format)
- Color Model: {{color_model}} (CMYK / RGB)
- Color Profile: {{color_profile}} (FOGRA39 / US Web Coated / Adobe RGB)
- Background: {{background}} (White / Transparent / {{custom_color}})

Guides:
- Bleed: {{bleed}} mm (3mm standard for print)
- Safe Area: {{safe_area}} mm (5mm from trim)
- Center lines: Yes/No
- Grid spacing: {{grid_spacing}} mm

Export for Print:
- Format: TIFF (CMYK) or PDF
- Compression: LZW (lossless)
- Color Profile: Embed profile
- Alpha: Disabled (flatten)
```

**Usage Notes:** CMYK preview in Krita is approximate; soft-proof with profile. 300 DPI for standard prints. Embed color profile for accurate reproduction.

---

## Template 3: Brush Preset for Inking

**Description:** Custom brush preset configuration for comic/manga inking.

```
Name: InkBrush_{{style}}

Brush Type: Pixel (default)
Brush Tip: {{tip_shape}} (Circle / Flat / Texture)
Size: {{size}}px (pressure sensitive)
Opacity: {{opacity}} (100%, pressure sensitive)
Flow: {{flow}} (80-100%)
Blending Mode: Normal

Stabilizer: {{stabilizer}} (Basic / Weighted / Drag)
Stabilizer Amount: {{stabilizer_value}} (15-30 for inking)

Brush Settings:
- Spacing: {{spacing}}% (10-20%)
- Fade: {{fade}} (disabled)
- Wetness: {{wetness}} (0 for dry ink, 50+ for brush pen)
- Rotation: Follow drawing direction (for line variation)
- Pressure: Size 100%, Opacity 50%

Texture: {{texture}} (None / Rough paper)
Dual Brush: {{dual_brush}} (Disabled for clean lines)

Save as: Ink_{{style}}.brushpreset
```

**Usage Notes:** Lower stabilizer for sketchy lines, higher for clean finished inks. Adjust spacing based on brush size (smaller spacing for larger brushes).

---

## Template 4: Animation Timeline Setup

**Description:** Animation project configuration for frame-by-frame animation.

```
Name: Anim_{{project_name}}

Canvas: {{width}}x{{height}}px, {{dpi}} DPI
Color Mode: {{color_mode}} (RGB for screen)
Background: Transparent

Animation Settings:
- Frame Rate: {{fps}} FPS (12=rough, 24=smooth, 30=standard video)
- Total Frames: {{total_frames}}
- Playback Range: {{start_frame}} to {{end_frame}}
- Onion Skin: {{prev_frames}} previous, {{next_frames}} next
- Frame Duration: {{frame_duration}}ms per frame (1000ms / fps)

Layer Structure for Animation:
1. Effects (Group) — post-process, opacity/effects
2. Foreground (Group) — separate from character
3. Character (Group)
   ├── Body (Normal)
   ├── Head (Normal)
   ├── Eyes (Normal)
   └── Mouth (Normal) — for lip-sync frames
4. Background (Normal)

Audio:
- Import: WAV / MP3 file
- Visual waveform: Yes (in timeline)
```

**Usage Notes:** Use 12 FPS for rough animation, 24 FPS for smooth. Separate mouth layer simplifies lip-sync. Onion skin 2 frames before and 1 after for smoothest workflow.

---

## Template 5: Assistant Tool Configuration

**Description:** Perspective assistant setup for architectural drawing.

```
Name: Assist_{{type}}_Perspective

Assistant Type: {{perspective_type}} (1-point / 2-point / 3-point / Fisheye)

1-Point Perspective:
- Vanishing Point: ({{vp_x}}, {{vp_y}}) — center of horizon
- Horizon Line: y = {{horizon_y}}

2-Point Perspective:
- VP Left: ({{vp_left_x}}, {{vp_left_y}})
- VP Right: ({{vp_right_x}}, {{vp_right_y}})
- Horizon Line: y = {{horizon_y}}

3-Point Perspective:
- VP Left: ({{vp_left_x}}, {{vp_left_y}})
- VP Right: ({{vp_right_x}}, {{vp_right_y}})
- VP Vertical: ({{vp_vert_x}}, {{vp_vert_y}})

Snap Settings:
- Magnetic: Yes
- Snap Distance: {{snap_distance}}px

Additional Assistants:
- Parallel Ruler: For vertical/horizontal alignment
- Ellipse Assistant: For circular objects in perspective
- Spline Ruler: For organic curves
- Vanishing Point: Additional VPs for complex scenes
```

**Usage Notes:** Create assistants on dedicated "Assistants" layer. Lock assistant layer to prevent accidental movement. Use magnetic snap for precise alignment.

---

## Template 6: Filter Layer Color Grade

**Description:** Nondestructive color grading using filter layers.

```
Name: Grade_{{look_name}}

Filter Layers (top to bottom):

1. Vibrance (Filter Layer > Vibrance)
   - Vibrance: {{vibrance}} (20-40 for punchy colors)
   - Saturation: {{saturation}} (5-10)

2. Color Balance (Filter Layer > Color Balance)
   - Shadows: {{shadow_rgb}} (cool blue for depth)
   - Midtones: {{mid_rgb}} (neutral to warm)
   - Highlights: {{highlight_rgb}} (warm golden)

3. Curves (Filter Layer > Curves)
   - RGB: S-curve for contrast
   - Red: {{red_curve}} (subtle adjustment)
   - Blue: {{blue_curve}} (subtle adjustment)

4. HSL Adjustment (Filter Layer > HSL Adjustment)
   - Hue: {{hue_shift}}
   - Saturation: {{sat_adjust}}
   - Lightness: {{lightness}}

5. Gradient Map (Filter Layer > Gradient Map) [optional]
   - Gradient: {{gradient_preset}}
   - Blending Mode: Overlay, Opacity: {{gm_opacity}}%
```

**Usage Notes:** Filter layers affect all layers below. Use group with Pass-Through blend mode for organized grading. Save as filter layer preset for reuse.

---

## Template 7: Custom Texture Brush

**Description:** Create a custom textured brush for environments.

```
Name: TextureBrush_{{surface_type}}

Brush Tip:
- Type: {{tip_type}} (Image pipe / Texture / Blended)
- Image: {{texture_image}} (grayscale PNG for height)
- Spacing: {{spacing}}% (1-5 for continuous, 20+ for stamped)

Brush Settings:
- Size: {{size}}px (pressure sensitive)
- Opacity: {{opacity}} (50-80%)
- Flow: {{flow}} (50-100%)
- Blending Mode: Normal / Multiply

Texture:
- Texture: {{brush_texture}} (paper grain, canvas, noise)
- Scale: {{texture_scale}}%
- Mode: {{texture_mode}} (Subtle / Multiply / Overlay)
- Depth: {{texture_depth}} (0-100)

Color:
- Source: {{color_source}} (Foreground / Pattern / Gradient)
- Color Randomness: {{color_randomness}}% (for organic variation)

Pressure Mapping:
- Size: 100%
- Opacity: 50-80%
- Flow: 50%
- Rotation: 0 (or random)

Save as: Texture_{{surface_type}}.brushpreset
```

**Usage Notes:** Use image pipe for complex multi-texture brushes. For realistic surfaces, use subtle texture (20-40% depth). Randomize color slightly for organic materials.

---

## Template 8: PSD Export Settings

**Description:** Export Krita file to PSD with layer preservation.

```
Name: Export_PSD_{{project_name}}

File > Export > PSD:
- Format: Photoshop Image (*.psd)
- Color Model: {{psd_color}} (RGB / CMYK)
- Depth: 8-bit (or 16-bit for high precision)
- Compression: RLE (lossless, smaller than uncompressed)

Compatibility Notes:
- Filter layers: Converted to pixel layers in PSD
- Colorize masks: Flattened (may lose editability)
- Group layers: Preserved
- Blending modes: Most common modes preserved
- Vector layers: Preserved as shape layers
- File layer: Rasterized
- Clone layer: Rasterized

Limitations:
- Krita-specific blending modes not supported in PSD
- Filter layer adjustments rasterized
- 16-bit PSD may not open in older Photoshop versions
```

**Usage Notes:** Flatten filter layers before export if issues arise. Test PSD in target software before final delivery. Use 8-bit for maximum compatibility.
