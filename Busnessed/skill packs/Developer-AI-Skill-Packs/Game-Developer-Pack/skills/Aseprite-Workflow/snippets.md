# Aseprite Workflow - Snippets

## New Sprite

```lua
local sprite = Sprite(32, 32, ColorMode.RGB)
app.activeSprite = sprite
```

## Create Layer

```lua
local layer = sprite:newLayer()
layer.name = "Body"
```

## Create Frame

```lua
local frame = sprite:newFrame()
frame.duration = 150  -- 150ms
```

## Create Cel

```lua
local cel = sprite:newCel(layer, frame)
cel.position = Point(0, 0)
```

## Set Pixel

```lua
local image = cel.image
image:drawPixel(x, y, color)
```

## Get Pixel

```lua
local color = image:getPixel(x, y)
```

## Create Tag

```lua
local tag = sprite:newTag()
tag.name = "idle"
tag.fromFrame = sprite.frames[1]
tag.toFrame = sprite.frames[4]
tag.aniDir = "pingpong"
```

## Save Sprite

```lua
sprite:saveAs("output.png")
```

## Export Sprite Sheet

```lua
app.command.ExportSpriteSheet{
    type = SpriteSheetType.PACKED,
    textureFilename = "sheet.png",
    borderPadding = 1
}
```

## Iterate Cels

```lua
for i, cel in ipairs(sprite.cels) do
    print(cel.layer.name, cel.frameIndex)
end
```

## Get Palette Color

```lua
local color = sprite.palette:getColor(1)
print(color.red, color.green, color.blue)
```
