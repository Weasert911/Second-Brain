# Aseprite-Expert Snippets

## Snippet 1: Create New Sprite via Script

**Description:** Create a new sprite with specified dimensions and color mode.

```lua
local sprite = Sprite(32, 32, ColorMode.RGB)
sprite:saveAs("C:/project/sprites/character.aseprite")
```

**When to use:** Automating new file creation for batch production with consistent settings.

---

## Snippet 2: Export All Animations as GIFs

**Description:** Export each animation tag as a separate GIF file.

```lua
local sprite = app.activeSprite
if not sprite then return end

for i, tag in ipairs(sprite.tags) do
  app.command.ExportSpriteSheet({
    type = ExportType.GIF,
    file = "C:/exports/" .. tag.name .. ".gif",
    tag = tag.name,
    fromFrame = tag.fromFrame,
    toFrame = tag.toFrame,
  })
end
```

**When to use:** When each animation state needs a separate preview GIF for documentation or portfolio.

---

## Snippet 3: Remap Palette Colors

**Description:** Replace colors in sprite based on palette mapping.

```lua
local sprite = app.activeSprite
if not sprite then return end

-- Define remap: source color to target color
local remap = {
  [Color(255, 0, 0)] = Color(0, 255, 0), -- red to green
  [Color(0, 0, 255)] = Color(255, 0, 0), -- blue to red
}

app.transaction("Remap Palette", function()
  for i, cel in ipairs(sprite.cels) do
    local image = cel.image
    for it in image:pixels() do
      for src, tgt in pairs(remap) do
        if it() == src then
          it(tgt)
        end
      end
    end
  end
end)
```

**When to use:** Batch recoloring sprites for palette swap variants or color scheme changes.

---

## Snippet 4: Auto-Tag Frames

**Description:** Automatically tag frames in sequence with prefix.

```lua
local sprite = app.activeSprite
if not sprite then return end

local prefix = "Anim_"
local frameCount = #sprite.frames
local framesPerTag = 4

for i = 1, frameCount, framesPerTag do
  local tagName = prefix .. math.ceil(i / framesPerTag)
  local fromFrame = sprite.frames[i]
  local toFrame = sprite.frames[math.min(i + framesPerTag - 1, frameCount)]
  sprite:newTag(fromFrame, toFrame)
  sprite.tags[#sprite.tags].name = tagName
end
```

**When to use:** When importing frame sequences and need to quickly organize into animation tags.

---

## Snippet 5: Batch Export All Sprites in Folder

**Description:** Process all .aseprite files in folder and export sprite sheets.

```lua
local lfs = require "lfs"
local inputDir = "C:/project/sprites/"
local outputDir = "C:/project/exports/"

for file in lfs.dir(inputDir) do
  if file:match("%.aseprite$") then
    local sprite = Sprite(inputDir .. file)
    if sprite then
      local name = file:gsub("%.aseprite$", "")
      app.command.ExportSpriteSheet({
        sprite = sprite,
        type = ExportType.SHEET,
        file = outputDir .. name .. ".png",
        data = outputDir .. name .. ".json",
        dataFormat = "json-hash",
        sheet = { columns = 8, borderPadding = 2, shapePadding = 2 },
      })
      sprite:close()
    end
  end
end
```

**When to use:** Production pipeline export of all sprites in a project folder with consistent settings.

---

## Snippet 6: Create Color Palette from Image

**Description:** Extract unique colors from sprite and create palette.

```lua
local sprite = app.activeSprite
if not sprite then return end

local colors = {}
local palette = Palette(#sprite.spec.colorMode)

for i, cel in ipairs(sprite.cels) do
  local image = cel.image
  for it in image:pixels() do
    local c = it()
    if not colors[c] then
      colors[c] = true
      palette:addColor(c)
    end
  end
end

sprite.palette = palette
```

**When to use:** Creating optimized palettes from finished sprites for indexed color mode conversion.

---

## Snippet 7: Create Sprite Sheet with JSON for Unity

**Description:** Export sprite sheet compatible with Unity 2D sprite importer.

```lua
local sprite = app.activeSprite
if not sprite then return end

app.command.ExportSpriteSheet({
  type = ExportType.SHEET,
  file = "C:/exports/" .. sprite.filename .. "_sheet.png",
  data = "C:/exports/" .. sprite.filename .. "_sheet.json",
  dataFormat = "json-hash",
  sheet = {
    columns = 6,
    borderPadding = 1,
    shapePadding = 2,
    innerPadding = 0,
    mergeDuplicatedFrames = true,
  },
  layer = "all",
  tag = nil, -- export all frames
  listFrames = true,
  listTags = true,
  listSlices = true,
  trim = { bounds = "full" },
  textureFormat = "png",
})
```

**When to use:** When exporting game-ready sprite sheets for Unity engine import.

---

## Snippet 8: Apply Pixel Perfect Lines

**Description:** Draw clean 45-degree lines using pixel-perfect mode.

```
1. Enable Pixel Perfect: View > Pixel Perfect Mode (or Ctrl+Shift+P)
2. Select Pencil tool (B)
3. Draw diagonal lines at any angle
4. Aseprite automatically adjusts pixels for clean 1px lines

Manual pixel perfect rules:
- 45° line: alternating single pixels
- 22.5°: 2-1-2-1 pattern
- 11.25°: 3-1-3-1 pattern

Use with Symmetry (Shift+S) for mirrored shapes.
```

**When to use:** When drawing clean lines, curves, and diagonals that need to avoid jagged or double-pixel artifacts.

---

## Snippet 9: Onion Skin Configuration

**Description:** Configure onion skin for optimal animation workflow.

```
Onion Skin Settings (Layer > Onion Skin):
- Previous frames: 2 (shown in red tint)
- Next frames: 2 (shown in blue tint)
- Opacity: 50% (previous), 25% (next)
- Mode: Relative (frame-based) or Absolute (time-based)
- Cel-Based: Enabled (shows per-cel, not per-layer)

Labels:
- Current frame: Full opacity
- Previous frame 1: Red 50%
- Previous frame 2: Dark red 25%
- Next frame 1: Blue 50%
- Next frame 2: Dark blue 25%
```

**When to use:** During frame-by-frame animation to maintain consistent positioning and motion flow.

---

## Snippet 10: Shadow and Highlight Technique

**Description:** Pixel art shading technique for depth.

```
Light Source: Top-left (standard)

Shading Steps:
1. Base color: Mid-tone (e.g., #4488CC)
2. Highlight: Top and left edges (e.g., #66AAEE)
   - 1px line on top edge, 1px on left edge
   - Corner pixel at top-left gets brightest color
3. Shadow: Bottom and right edges (e.g., #2266AA)
   - 1px line on bottom edge, 1px on right edge
   - Corner pixel at bottom-right gets darkest color
4. Core shadow: Deepest crevices (e.g., #114488)
   - Inside corners, under overhangs

Rule: 2-3 shades between base and highlight
       2-3 shades between base and shadow
       Total: 5-7 colors per material (including base)
```

**When to use:** Adding depth and volume to pixel art sprites for professional-quality game assets.

---

## Snippet 11: Export Individual PNG Frames

**Description:** Export each frame as an individual PNG file.

```lua
local sprite = app.activeSprite
if not sprite then return end

local outputDir = "C:/exports/frames/"
for i, frame in ipairs(sprite.frames) do
  local fileName = string.format("%sframe_%04d.png", outputDir, i - 1)
  app.command.ExportSpriteSheet({
    type = ExportType.PNG,
    file = fileName,
    fromFrame = i - 1,
    toFrame = i - 1,
  })
end
```

**When to use:** When individual frame files are needed for game engines or compositing in other tools.

---

## Snippet 12: Create Repeating Tile Pattern

**Description:** Create tileset tiles that tile seamlessly.

```
Tileable Tile Requirements:
1. Left edge matches right edge
2. Top edge matches bottom edge
3. Corner pixels consistent across all 4 corners

Techniques:
- Wrap-around mode: Edit > Tiled Mode (Ctrl+Shift+T)
  - Enables painting across tile edges
  - Drawings on left wrap to right automatically
- Offset filter: Layer > New Layer > Offset
  - Offsets image by half width/height
  - Fix seam by painting over the center seam
  - Re-offset back to original position

Test: Create 3x3 tile grid in new file to check seams visually.
```

**When to use:** Creating tilesets for game levels where tiles must join seamlessly without visible seams.

---

## Snippet 13: Dithering by Hand

**Description:** Manual dithering patterns for color transitions.

```
Dithering Patterns (2-color):

50% Checkerboard:
X .   . X
. X   X .

25% Dots (sparse):
. .   . .
. X   . .

75% Dots (dense):
X X   X .
X X   X X

Ordered Bayer 4x4 (smoothest):
Step 1:  . . . .    Step 2:  . . . .    Step 3:  . . X .    Step 4:  . X X .
         . . . .             X . . .             X . . .             X . X .
         . . . .             . . . .             . . . .             . . X .
         . . . .             . . . .             . . . .             . . . .

Pattern size:
- 2x2: Fast, visible grain
- 4x4: Smooth, recommended
- 8x8: Very smooth, larger grain
```

**When to use:** Reducing visible banding in gradients when using limited palettes or indexed color modes.

---

## Snippet 14: Quick Color Palette Setup

**Description:** Set up a standard game art palette.

```
Recommended Palettes by Style:

1. NES-style (52 colors):
   - Primary: Red (#E00808), Blue (#0000E8), Green (#00A800)
   - Skin: #E8A058, #D08030, #A05000
   - Metal: #C0C0C0, #808080, #585858, #282828

2. GB Studio (4 shades of green):
   - #0F380F, #306230, #8BAC0F, #9BBC0F

3. Pico-8 (16 colors):
   - Fixed palette, load from Lospec

4. Custom 32-color:
   - 4 skin tones, 4 hair colors, 4 cloth colors
   - 4 metal colors, 4 environmental colors
   - 4 UI colors, 4 accent/effect colors
   - 4 black/white/gray for outlines/shadows

Palette file format: .aseprite-colors (save from Palette window)
```

**When to use:** Starting new pixel art projects with established, coherent color schemes.

---

## Snippet 15: Sprite Pivot Point Guidelines

**Description:** Consistent pivot point positioning for character sprites.

```
Pivot Point (origin) Standards:

Character (side view):
- Feet on bottom edge of bounding box
- X center of character's feet
- Y at bottom of sprite

Character (top-down):
- X center of sprite
- Y center of sprite (feet at bottom third)

Item pickups:
- X center of item
- Y center of item
- Bottom at sprite bottom

UI Icons:
- Exact center of icon
- X percentage offset for visual centering

Implementation:
- Apply pivot in engine (Unity: sprite pivot, Godot: offset)
- Alternatively, pad sprite so origin is at bottom-center
- Consistent across ALL frames of ALL animations
```

**When to use:** Ensuring all sprites have consistent pivot points for proper positioning in game engines.
