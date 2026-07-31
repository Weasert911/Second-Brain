# Aseprite Workflow - Templates

## Canvas Setup Template

```lua
-- new_sprite.lua - Create new sprite with standard settings
local dlg = Dialog("New Character Sprite")

dlg:slider{
    id = "width",
    label = "Width:",
    min = 8,
    max = 256,
    value = 32
}

dlg:slider{
    id = "height",
    label = "Height:",
    min = 8,
    max = 256,
    value = 32
}

dlg:newcombo{
    id = "color_mode",
    label = "Color Mode:",
    option = "RGBA",
    options = {"RGBA", "Indexed", "Grayscale"}
}

dlg:newcombo{
    id = "palette_size",
    label = "Palette:",
    option = "16 colors",
    options = {"8 colors", "16 colors", "32 colors", "64 colors", "256 colors"}
}

dlg:button{ id = "create", text = "Create" }
dlg:button{ id = "cancel", text = "Cancel" }
dlg:show()

if dlg.data.create then
    local sprite = Sprite(
        dlg.data.width,
        dlg.data.height,
        dlg.data.color_mode
    )
    if dlg.data.color_mode == "Indexed" then
        local palette = Palette(#sprite.palette)
        sprite:setPalette(palette)
    end
    app.activeSprite = sprite
    app.command.SetPixelRatio{ ratio = "1:1" }
    app.alert("Created new sprite!")
end
```

## Layer Structure Template

```lua
-- create_character_layers.lua
local sprite = app.activeSprite
if not sprite then
    app.alert("No active sprite")
    return
end

-- Create layer structure
local function ensure_layer(name, parent)
    -- Check if exists
    for _, layer in ipairs(sprite.layers) do
        if layer.name == name then
            return layer
        end
    end

    -- Create new layer
    local layer
    if parent then
        layer = sprite:newLayer()
        layer.name = name
        layer.parent = parent
    else
        layer = sprite:newLayer()
        layer.name = name
    end
    return layer
end

-- Root layer
local root = ensure_layer("Character")

-- Body parts
local body_group = sprite:newGroup()
body_group.name = "Body"
body_group.parent = sprite.layers["Character"]

ensure_layer("Head", body_group)
ensure_layer("Torso", body_group)
ensure_layer("Arms", body_group)
ensure_layer("Legs", body_group)

-- Details
local details_group = sprite:newGroup()
details_group.name = "Details"
details_group.parent = sprite.layers["Character"]

ensure_layer("Eyes", details_group)
ensure_layer("Mouth", details_group)
ensure_layer("Hair", details_group)
ensure_layer("Clothing", details_group)

-- Equipment
local equip_group = sprite:newGroup()
equip_group.name = "Equipment"
equip_group.parent = sprite.layers["Character"]

ensure_layer("Weapon", equip_group)
ensure_layer("Shield", equip_group)

-- Shadow layer
local shadow = ensure_layer("Shadow")
shadow.parent = sprite.layers["Character"]
shadow.opacity = 128

-- Effects
local effects = ensure_layer("Effects")
effects.parent = sprite.layers["Character"]
effects.blendMode = BlendMode.ADD

app.refresh()
app.alert("Layer structure created!")
```

## Sprite Sheet Export Template

```lua
-- export_sprite_sheet.lua
local sprite = app.activeSprite
if not sprite then
    app.alert("No active sprite")
    return
end

local dlg = Dialog("Export Settings")

dlg:file{
    id = "output",
    label = "Output:",
    filename = sprite.filename:gsub("%.aseprite$", "") .. "_sheet.png",
    save = true
}

dlg:newcombo{
    id = "sheet_type",
    label = "Layout:",
    option = "Packed",
    options = {"Horizontal", "Vertical", "Rows", "Columns", "Packed"}
}

dlg:slider{
    id = "border",
    label = "Border (px):",
    min = 0,
    max = 8,
    value = 1
}

dlg:check{
    id = "trim",
    label = "Trim frames",
    selected = false
}

dlg:check{
    id = "tags_only",
    label = "Tagged frames only",
    selected = true
}

dlg:button{ id = "export", text = "Export" }
dlg:button{ id = "cancel", text = "Cancel" }
dlg:show()

if dlg.data.export then
    local sheet_type_map = {
        Horizontal = SpriteSheetType.HORIZONTAL,
        Vertical = SpriteSheetType.VERTICAL,
        Rows = SpriteSheetType.ROWS,
        Columns = SpriteSheetType.COLUMNS,
        Packed = SpriteSheetType.PACKED
    }

    app.command.ExportSpriteSheet{
        ui = false,
        askOverwrite = false,
        type = sheet_type_map[dlg.data.sheet_type],
        textureFilename = dlg.data.output,
        dataFilename = dlg.data.output:gsub("%.png$", ".json"),
        layerIndex = "all",
        frameTag = dlg.data.tags_only and "all" or "",
        borderPadding = dlg.data.border,
        shapePadding = 0,
        innerPadding = 0,
        trim = dlg.data.trim,
        extrude = false,
        listFrameTags = dlg.data.tags_only
    }
    app.alert("Exported to: " .. dlg.data.output)
end
```

## Animation Tag Template

```lua
-- setup_animation_tags.lua
local sprite = app.activeSprite
if not sprite then
    app.alert("No active sprite")
    return
end

-- Define animations
local animations = {
    { name = "idle", from = 1, to = 4, dir = "pingpong", color = Color(0, 255, 0) },
    { name = "walk", from = 5, to = 12, dir = "forward", color = Color(0, 0, 255) },
    { name = "run", from = 13, to = 18, dir = "forward", color = Color(0, 255, 255) },
    { name = "jump", from = 19, to = 22, dir = "forward", color = Color(255, 255, 0) },
    { name = "attack", from = 23, to = 28, dir = "forward", color = Color(255, 0, 0) },
    { name = "hurt", from = 29, to = 31, dir = "forward", color = Color(255, 0, 255) },
    { name = "death", from = 32, to = 38, dir = "forward", color = Color(128, 128, 128) },
}

-- Clear existing tags
for i = #sprite.tags, 1, -1 do
    sprite:deleteTag(sprite.tags[i])
end

-- Create tags
for _, anim in ipairs(animations) do
    local tag = sprite:newTag()
    tag.name = anim.name
    tag.fromFrame = sprite.frames[anim.from]
    tag.toFrame = sprite.frames[anim.to]
    tag.aniDir = anim.dir
    tag.color = anim.color
end

app.refresh()
app.alert(string.format("Created %d animation tags", #animations))
```
