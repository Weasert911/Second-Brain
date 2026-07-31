# Aseprite Workflow - References

## Aseprite Interface Reference

### Key Panels
| Panel | Location | Purpose |
|-------|----------|---------|
| Layers | F6 | Layer management and stacking |
| Timeline | Alt+T | Frame and cel management |
| Color Palette | F2 | Color swatch management |
| Tileset | Shift+T | Tileset editing mode |
| Tools | B | Drawing tool selection |
| Brushes | Shift+B | Brush presets |
| Onion Skin | Top bar | Previous frame overlay |

### Essential Tools
| Tool | Shortcut | Usage |
|------|----------|-------|
| Pencil | B | Pixel drawing |
| Eraser | E | Remove pixels |
| Paint Bucket | G | Fill areas |
| Selection | M | Marquee selection |
| Lasso | W | Freeform selection |
| Magic Wand | Q | Color-based selection |
| Eyedropper | I | Color picker |
| Hand | H | Pan canvas |
| Zoom | Z | Zoom in/out |
| Move | V | Move layer/cel |
| Slice | S | Create sprite sheet slices |

## Canvas Setup

### Recommended Canvas Sizes
```
Character sprite: 16x16, 24x24, 32x32, 64x64
Tileset tile: 8x8, 16x16, 32x32
UI icons: 8x8, 16x16, 24x24, 32x32
Background/parallax: 256x256, 512x128
GUI elements: Based on screen resolution
```

## Layer Management

### Layer Types
| Type | Icon | Usage |
|------|------|-------|
| Raster | Solid square | Pixel art layers |
| Group | Folder icon | Organize related layers |
| Tilemap | Grid icon | Tileset painting |
| Slice | Dotted outline | Export regions |

### Layer Organization
```
Character
├── Body (Group)
│   ├── Skin (Raster)
│   ├── Clothes (Raster)
│   └── Details (Raster)
├── Equipment (Group)
│   ├── Weapon (Raster)
│   └── Shield (Raster)
└── Effects (Group)
    └── Shadow (Raster)
```

### Layer Properties
- Blend Mode: Normal, Multiply, Screen, Overlay, etc.
- Opacity: 0-255
- Visible/Hidden: Eye icon
- Locked: Padlock icon
- Continuous: For tilemap layers
- Reference Layer: For tracing (blue icon)

## Color Palette

### Palette Management
```lua
-- Get palette colors
local palette = app.activeSprite.palette
for i=1, #palette do
    local color = palette:getColor(i)
    print(string.format("Color %d: (%d, %d, %d, %d)",
        i, color.red, color.green, color.blue, color.alpha))
end

-- Create palette from image
app.command.SetPalette{
    fromFile="sprite.png"
}
```

### Palette Size Guidelines
```
Retro (NES): 54 colors (4 per 16x16 tile)
Game Boy: 4 shades of green
Modern pixel art: 32-256 colors per character
UI: 16-32 colors total
Environment: 64-128 colors
```

## Animation Workflow

### Frame Management
```lua
-- Create frames
local sprite = app.activeSprite
local frame1 = sprite:newFrame()
local frame2 = sprite:newFrame()

-- Tag frames for animation
local tag = sprite.tags[1]
tag.fromFrame = frame1
tag.toFrame = frame2
tag.name = "idle"
tag.aniDir = "forward"  -- or "pingpong", "reverse"
```

### Animation Speed
```
Idle: 4-8 frames, 150-200ms per frame
Walk: 6-12 frames, 100-150ms per frame
Run: 6-8 frames, 60-100ms per frame
Attack: 4-8 frames, 80-120ms per frame
Jump: 4-6 frames, 100-150ms per frame
Death: 6-10 frames, 150-200ms per frame
```

## Sprite Sheet Export

### Export Settings
```lua
-- Export sprite sheet via script
local sprite = app.activeSprite
local sheet = SpriteSheetExporter()
sheet:exportAsFile("character.png", {})
```

### Aseprite Export Dialog Settings
```
Layout: Columns (packed)
Sheet Type: Horizontal, Vertical, Rows, Columns
Size Constraints: None (or power of 2)
Borders: 1px padding, 0px spacing
Inner Padding: 0px
Fit to Sheet: Yes
Open with: System default
```

### Tags Export
- Each tag becomes a separate animation in Godot
- Tag name matches animation name
- Tag direction: forward, reverse, ping-pong

## Godot Import Pipeline

### Godot Import Settings for Aseprite
```gdscript
# In Godot, select .aseprite or .png file
# Import > SpriteSheet
# Set:
#   - H frames: autodetect
#   - V frames: autodetect
#   - Frame count: per tag
#   - Animation speed: from Aseprite
#   - Autoplay: set default animation

# Or use Aseprite Wizard addon for direct import
# https://github.com/viniciusgerevini/godot-aseprite-wizard
```

### Animation Setup in Godot
```gdscript
# After importing sprite sheet
@onready var anim_sprite: AnimatedSprite2D = $AnimatedSprite2D

func _ready() -> void:
    anim_sprite.sprite_frames = load("res://assets/character.tres")
    anim_sprite.play("idle")

func change_animation(anim_name: String) -> void:
    if anim_sprite.animation != anim_name:
        anim_sprite.play(anim_name)
```

## Tileset Creation

### Tileset Guidelines
- Tile size: consistent (16x16, 32x32)
- Tiles aligned to pixel grid
- 2px padding between tiles in spritesheet
- Edge consistency for seamless tiling
- Include auto-tile variants

### Tile Types
```
Floor: ground, grass, stone, water
Walls: brick, wood, metal, cave
Decorations: torch, window, plant, rock
Platforms: moving, breakable, one-way
Interactive: door, switch, chest, ladder
```

## Aseprite Scripting API

### Script Structure
```lua
-- myscript.lua
local sprite = app.activeSprite
if sprite == nil then
    return
end

for i, cel in ipairs(sprite.cels) do
    -- Process each cel
end

app.refresh()
```

### Common API
```lua
-- App
app.activeSprite - Current sprite
app.version - Aseprite version
app.command - Execute commands

-- Sprite
sprite.width, sprite.height
sprite:newLayer() - Create layer
sprite:newFrame() - Create frame
sprite:newCel(layer, frame) - Create cel

-- Layer
layer.name - Layer name
layer.isVisible - Visibility
layer.opacity - Layer opacity

-- Cel
cel.position - Position
cel.image - Image data
```

## UI Icon Workflow

### Icon Sizes
```
Menu bar: 16x16
Toolbar: 24x24
Small buttons: 32x32
Item icons: 64x64
Large UI elements: 128x128
```

### Icon Design Principles
- Clear silhouette (readable at small sizes)
- Consistent style across all icons
- Use alpha transparency for irregular shapes
- Color-coded categories (red=danger, green=health, blue=magic)
- Avoid text in icons
- Test at actual display size
