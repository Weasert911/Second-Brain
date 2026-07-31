# Aseprite Workflow - Examples

## Character Sprite Creation

### 32x32 Character Template

```
Canvas: 32x32 pixels
Palette: 16 colors

Layer structure:
Character
├── Body (base color)
│   ├── Torso - 8x12 px at (12, 12)
│   ├── Head - 8x8 px at (12, 4)
│   └── Legs - 6x6 px each at (10, 24) and (16, 24)
├── Details
│   ├── Eyes - 2x1 px at (14, 6)
│   ├── Hair - 8x6 px at (12, 2)
│   └── Belt - 8x2 px at (12, 20)
└── Equipment
    ├── Sword - 3x12 px at (22, 14)
    └── Shield - 6x8 px at (6, 14)
```

### Pixel Art Shading Steps

```
1. Base color (mid-tone)
   - Fill silhouette with primary color

2. Shading 
   - Light source: top-left
   - Highlight on top and left edges
   - Shadow on bottom and right edges

3. Dithering (optional)
   - Checkerboard pattern between shades
   - 50% dither for mid-tones
   - 25%/75% for transitions

4. Outline
   - Dark outline (3-4 shades darker than base)
   - Inner outline for details
   - Selective outlining (omit where light hits)

5. Anti-aliasing
   - Semi-transparent pixels on curves
   - Smooths jagged edges
   - Use sparingly (time-intensive)
```

## Tileset Creation

### 16x16 Tileset Example

```
Palette: 8 colors (limited for retro feel)

Tile types to create:
1. Grass (top-left) - green with texture
2. Dirt (top-mid) - brown with noise
3. Stone (top-right) - gray with cracks
4. Water (mid-left) - blue animated (2 frames)
5. Sand (mid) - tan with dots
6. Lava (mid-right) - red/orange animated (2 frames)
7. Wall_top (bottom-left) - stone wall top edge
8. Wall_mid (bottom-mid) - stone wall repeat
9. Wall_corner (bottom-right) - 45-degree angle

Auto-tile rules:
- Tile 0: Full (surrounded by same tile)
- Tile 1-4: Edge tiles (top, right, bottom, left)
- Tile 5-8: Corner tiles (top-right, bottom-right, bottom-left, top-left)
- Tile 9-12: Inner corners
- Tile 13-15: Isolated / single
```

## Animation: Walk Cycle (32x32)

### Frame-by-Frame Breakdown

```
Frame 1: Contact (right foot forward)
Frame 2: Passing (right foot passing left)
Frame 3: Contact (left foot forward)
Frame 4: Passing (left foot passing right)

Timing: 150ms per frame (6.67 FPS)
Total: 4 frames = 0.6 seconds per cycle

Key pixels to move per frame:
- Torso: 1-2px bob up/down
- Head: 1px follow torso, slight rotation
- Arms: 2-3px swing opposite to legs
- Legs: 3-4px stride
- Shadows: 0-1px stretch
```

## Sprite Sheet Export Script

```lua
-- export_sprite_sheet.lua
-- Run in Aseprite: File > Scripts > Run Script
local sprite = app.activeSprite
if not sprite then
    app.alert("No active sprite")
    return
end

-- Get export path from user
local dlg = Dialog("Export Sprite Sheet")
dlg:file{
    id = "path",
    label = "Save as:",
    filename = sprite.filename:gsub("%.aseprite$", ".png"),
    save = true,
    filetypes = { "png" }
}
dlg:button{ id = "export", text = "Export" }
dlg:button{ id = "cancel", text = "Cancel" }
dlg:show()

if dlg.data.export then
    local path = dlg.data.path
    if path then
        -- Export as sprite sheet with tags
        app.command.ExportSpriteSheet{
            ui=false,
            askOverwrite=false,
            type=SpriteSheetType.HORIZONTAL,
            textureFilename=path,
            dataFilename=path:gsub("%.png$", ".json"),
            layerIndex="all",
            frameTag="all",
            borderPadding=1,
            shapePadding=0,
            innerPadding=0,
            listLayers=false,
            listFrameTags=true,
            trim=false,
            extrude=false
        }
        app.alert("Exported to: " .. path)
    end
end
```

## Batch Processing Script

```lua
-- batch_resize.lua
-- Resize all sprites in a folder
local fs = require("fs")

local input_dir = "C:/sprites/original/"
local output_dir = "C:/sprites/resized/"
local scale_factor = 2

local files = fs.list_dir(input_dir)

for _, filename in ipairs(files) do
    if filename:match("%.aseprite$") or filename:match("%.png$") then
        local sprite = Sprite{ fromFile = input_dir .. filename }
        if sprite then
            -- Resize with nearest neighbor (preserve pixel art)
            sprite:resize(sprite.width * scale_factor, sprite.height * scale_factor)
            sprite:saveAs(output_dir .. filename)
            sprite:close()
            print("Resized: " .. filename)
        end
    end
end

print("Batch resize complete!")
```

## Palette Creation Script

```lua
-- create_palette_from_image.lua
local sprite = app.activeSprite
if not sprite then return end

-- Extract palette from current sprite
local palette = sprite.palette

-- Reduce to 16 colors
app.command.ColorCurve{
    channel = -1, -- All channels
    curve = { 0, 0, 128, 85, 192, 170, 255, 255 }
}

-- Save palette
local dlg = Dialog("Save Palette")
dlg:file{
    id = "path",
    label = "Save as:",
    filename = "palette.gpl",
    save = true,
    filetypes = { "gpl" }
}
dlg:button{ id = "save", text = "Save" }
dlg:show()

if dlg.data.save and dlg.data.path then
    app.activeSprite.palette:save(dlg.data.path)
    app.alert("Palette saved!")
end
```

## Godot Import Setup

```gdscript
# After exporting sprite sheet from Aseprite
# Import into Godot and set up animations

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D

func setup_aseprite_import() -> void:
    # Load the sprite frames resource created by Godot's import
    var sprite_frames := load("res://assets/character.tres") as SpriteFrames

    # The .tres file is auto-generated by Godot when importing
    # Aseprite .aseprite files directly (with Aseprite Wizard addon)
    # or from sprite sheets

    animated_sprite.sprite_frames = sprite_frames

    # Access animations by tag names from Aseprite
    if sprite_frames.has_animation("idle"):
        animated_sprite.play("idle")

func switch_animation(anim_name: String) -> void:
    if animated_sprite.sprite_frames.has_animation(anim_name):
        animated_sprite.play(anim_name)

func _on_animation_looped() -> void:
    # For non-looping animations, switch back to idle
    if animated_sprite.animation == "attack":
        switch_animation("idle")

func _ready() -> void:
    setup_aseprite_import()
    animated_sprite.animation_looped.connect(_on_animation_looped)
    switch_animation("idle")
```
