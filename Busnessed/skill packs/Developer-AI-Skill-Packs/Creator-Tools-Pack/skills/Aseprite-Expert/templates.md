# Aseprite-Expert Templates

## Template 1: Character Sprite Setup

**Description:** Canvas and layer setup for a game character sprite.

```
Name: Character_{{character_name}}

Canvas:
- Width: {{sprite_width}}px
- Height: {{sprite_height}}px
- Color Mode: {{color_mode}} (RGBA / Indexed)
- Background: Transparent
- Pixel Size: {{pixel_ratio}} (1x for 32px, 2x for 64px)

Palette:
- Base Colors: {{base_colors}} colors
- Total Palette: {{palette_size}} colors
- Palette File: {{palette_file}}.aseprite-colors

Layers (top to bottom):
1. Highlights (blending: screen, opacity: {{highlight_opacity}}%)
2. Shading (blending: multiply, opacity: {{shadow_opacity}}%)
3. Base Colors (normal)
4. Line Art / Outline (normal, black or {{outline_color}})
5. Sketch / Reference (hidden, reference only)

Animation Frames: {{frame_count}}
Frame Duration: {{frame_duration}}ms
```

**Usage Notes:** Keep line art on separate layer for easy editing. Use shading layer with multiply for shadows. Export with merge visible layers for final sprite.

---

## Template 2: Animation Tag System

**Description:** Standard animation tag setup for game character.

```
Name: Tags_{{character_name}}

Animation States:

{{state_1}} (Idle)
- Frames: {{idle_start}}–{{idle_end}}
- Duration: {{idle_duration}}ms per frame
- Loop: Yes
- Direction: Forward

{{state_2}} (Walk)
- Frames: {{walk_start}}–{{walk_end}}
- Duration: {{walk_duration}}ms per frame
- Loop: Yes
- Direction: Forward

{{state_3}} (Run)
- Frames: {{run_start}}–{{run_end}}
- Duration: {{run_duration}}ms per frame
- Loop: Yes
- Direction: Forward

{{state_4}} (Attack)
- Frames: {{attack_start}}–{{attack_end}}
- Duration: {{attack_duration}}ms per frame
- Loop: No (play once)
- Direction: Forward

{{state_5}} (Hurt)
- Frames: {{hurt_start}}–{{hurt_end}}
- Duration: {{hurt_duration}}ms per frame
- Loop: No (play once)
- Direction: Forward

{{state_6}} (Death)
- Frames: {{death_start}}–{{death_end}}
- Duration: {{death_duration}}ms per frame
- Loop: No (play once)
- Direction: Forward
```

**Usage Notes:** All animations should have consistent sprite origin. Non-looping animations should end on neutral frame. Use reverse direction for some effects (wind-up/release).

---

## Template 3: Sprite Sheet Export Settings

**Description:** Export sprite sheet configuration for game engine.

```
Name: Export_{{sheet_name}}_{{date}}

File:
- Output: {{output_path}}/{{sheet_name}}.png
- JSON Data: {{output_path}}/{{sheet_name}}.json
- Format: {{format}} (PNG / GIF / Individual PNGs)

Layout:
- Columns: {{columns}} (0 = auto)
- Rows: {{rows}} (0 = auto)
- Fit: {{fit}} (Columns / Rows / Any)
- Border: {{border}}px
- Padding: {{padding}}px
- Inner Padding: {{inner_padding}}px

Content:
- Frames: {{tag_name}} (All / Current tag / Selected tags)
- Layers: {{layers}} (Merge / Each layer)
- Slices: {{include_slices}}

JSON Metadata:
- Frame Data: {{frame_data}} (Bounds, duration, tags)
- Array: {{array_format}} (Hash / Array)
- Meta: {{include_meta}} (scale, image size)
```

**Usage Notes:** Use 2px border and padding to prevent bleeding in texture atlases. JSON hash format works with Phaser, PixiJS, and most game engines. Export each direction separately for organized sheets.

---

## Template 4: Palette Swap Configuration

**Description:** Create palette swap variants for character recoloring.

```
Name: PaletteSwap_{{variant_name}}

Source Palette: {{source_palette}}.aseprite-colors

Swap Rules:
| Original Color (Source) | New Color (Target) |
|-------------------------|--------------------|
| {{color_1_original}}    | {{color_1_new}}    |
| {{color_2_original}}    | {{color_2_new}}    |
| {{color_3_original}}    | {{color_3_new}}    |
| {{color_4_original}}    | {{color_4_new}}    |
| {{color_5_original}}    | {{color_5_new}}    |

Method: {{swap_method}} (Replace global color / Remap palette index)

Variants:
- {{variant_1}}: {{description_1}}
- {{variant_2}}: {{description_2}}
- {{variant_3}}: {{description_3}}

Export: {{export_path}}/{{character}}_{{variant}}.png
```

**Usage Notes:** Use replace global color for same-hue shifts. Use palette index remap for complete recoloring. Save swap presets in .aseprite-colors files for reuse.

---

## Template 5: Tilemap and Tileset Layout

**Description:** Organized tileset for tile-based game environments.

```
Name: Tileset_{{environment_name}}

Tile Size: {{tile_width}}x{{tile_height}}px
Grid: {{columns}} columns x {{rows}} rows

Tile Categories:

1. Floor Tiles ({{floor_count}} tiles)
   - {{floor_tile_1}}: {{floor_desc_1}}
   - {{floor_tile_2}}: {{floor_desc_2}}
   - {{floor_tile_3}}: {{floor_desc_3}}

2. Wall Tiles ({{wall_count}} tiles)
   - {{wall_tile_1}}: {{wall_desc_1}}
   - {{wall_tile_2}}: {{wall_desc_2}}

3. Corner Tiles ({{corner_count}} tiles)
   - {{corner_tile_1}}: {{corner_desc_1}}

4. Transition Tiles ({{transition_count}} tiles)
   - {{transition_tile_1}}: {{transition_desc_1}}

5. Props / Decorations ({{prop_count}} tiles)
   - {{prop_tile_1}}: {{prop_desc_1}}

Auto-Tile Bitmask: {{bitmask_type}} (2x2 / 3x3 / 4x4)
Export: {{export_path}}/{{tileset_name}}.png
```

**Usage Notes:** Use auto-tile for large environment areas. Manual tiles for unique locations. Include at least 4 floor variants to avoid repetition. Export with tile index map for engine reference.

---

## Template 6: UI Element Style Guide

**Description:** Standard UI element pixel art template.

```
Name: UI_Style_{{style_name}}

Canvas: {{canvas_width}}x{{canvas_height}}px
Palette: {{palette_file}} ({{color_count}} colors)

Elements:
1. Button: {{button_width}}x{{button_height}}px
   - Normal: {{button_normal_bg}}
   - Hover: {{button_hover_bg}}
   - Pressed: {{button_pressed_bg}}
   - Disabled: {{button_disabled_bg}}
   - Text offset: x={{text_x}}, y={{text_y}}

2. Panel: {{panel_width}}x{{panel_height}}px
   - 9-slice border: {{border_size}}px
   - Background: {{panel_bg_color}}

3. Icon size: {{icon_size}}x{{icon_size}}px
   - Outline: 1px {{icon_outline_color}}
   - Accent: {{icon_accent_color}}

4. Text box: {{textbox_width}}x{{textbox_height}}px
   - Background: {{textbox_bg}}
   - Text color: {{text_color}}
   - Padding: {{text_padding}}px

Font: {{font_name}} (built-in / custom bitmap font)
```

**Usage Notes:** Use 1px outline for UI elements. 9-slice panels scale cleanly. Keep icon style consistent (same pixel size, outline style). Export UI elements with exact pixel positions for development.

---

## Template 7: Export Batch Script (Lua)

**Description:** Aseprite Lua script for batch exporting.

```lua
-- Export Script: {{script_name}}
-- Description: {{script_description}}

local sprite = app.activeSprite
if not sprite then
  return app.alert("No active sprite")
end

local outputDir = "{{output_directory}}"
local exportParams = {
  type = ExportType.SHEET,
  file = outputDir .. "/{{sheet_name}}.png",
  sheet = {
    columns = {{columns}},
    rows = {{rows}},
    borderPadding = {{border_padding}},
    shapePadding = {{shape_padding}},
    innerPadding = {{inner_padding}},
    mergeDuplicatedFrames = {{merge_dupes}},
  },
  layer = {{layer_type}}, -- ExportType.MERGE_VISIBLE or ExportType.EACH_LAYER
  tag = {{tag_name}} or nil,
  data = outputDir .. "/{{sheet_name}}.json",
  dataFormat = "{{data_format}}", -- "json-array" or "json-hash"
  listFrames = false,
  listTags = true,
  listSlices = true,
  textureFormat = "png",
  -- trim: { bounds: "{{trim_bounds}}" }
}

app.command.ExportSpriteSheet(exportParams)
app.alert("Export complete: " .. outputDir .. "/{{sheet_name}}.png")
```

**Usage Notes:** Save script in Aseprite Scripts folder, run via File > Scripts. Customize paths per project. Use mergeDuplicatedFrames for sprite sheet optimization.

---

## Template 8: Gradients and Dithering Patterns

**Description:** Dithering pattern templates for color transitions.

```
Name: DitherPattern_{{name}}

Canvas: {{canvas_width}}x{{canvas_height}}px
Colors: {{color_a}}, {{color_b}}

Dither Patterns (from light to dark):
1. None: Solid {{color_a}}
2. 25%: {{pattern_25}} (checkerboard dots)
3. 50%: {{pattern_50}} (checkerboard pattern)
4. 75%: {{pattern_75}} (inverse checkerboard dots)
5. 100%: Solid {{color_b}}

Pattern Types:
- Checkerboard: Basic 2x2 pattern, good for general use
- Interleaved: 4x1 line pattern, good for horizontal transitions
- Noise: Random distribution, good for organic textures
- Ordered Bayer: Smooth gradient transitions

Usage Examples:
- {{example_1}}: {{example_desc_1}}
- {{example_2}}: {{example_desc_2}}
```

**Usage Notes:** 4x4 Bayer dithering produces the smoothest gradients. Save dithering patterns as separate file for reference. Use noise dithering for organic textures, ordered for mechanical surfaces.
