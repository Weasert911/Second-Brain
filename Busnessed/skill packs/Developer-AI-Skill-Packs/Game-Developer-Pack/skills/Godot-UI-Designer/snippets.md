# Godot UI Designer - Snippets

## Anchor Presets

```gdscript
control.anchor_left = 0.0
control.anchor_top = 0.0
control.anchor_right = 1.0
control.anchor_bottom = 1.0
```

## Container Setup

```gdscript
var vbox := VBoxContainer.new()
vbox.add_theme_constant_override("separation", 8)
add_child(vbox)

var grid := GridContainer.new()
grid.columns = 3
grid.add_theme_constant_override("h_separation", 4)
grid.add_theme_constant_override("v_separation", 4)
```

## Theme Overrides

```gdscript
button.add_theme_color_override("font_color", Color.WHITE)
button.add_theme_stylebox_override("hover", hover_style)
button.add_theme_font_override("font", custom_font)
button.add_theme_font_size_override("font_size", 18)
```

## Focus Navigation

```gdscript
button.focus_neighbor_left = other.get_path()
button.focus_neighbor_right = other.get_path()
button.focus_neighbor_top = other.get_path()
button.focus_neighbor_bottom = other.get_path()
button.grab_focus()
```

## Translation

```gdscript
label.text = tr("WELCOME_MESSAGE")
label.text = tr("SCORE_FORMAT") % [score]
TranslationServer.set_locale("fr")
```

## RichTextLabel

```gdscript
rich_label.append_text("[b]Bold[/b] [color=red]Red[/color]")
rich_label.push_bold()
rich_label.push_color(Color.YELLOW)
rich_label.pop()
```

## Size Flags

```gdscript
control.size_flags_horizontal = Control.SIZE_EXPAND | Control.SIZE_FILL
control.size_flags_vertical = Control.SIZE_SHRINK_CENTER
control.size = Vector2(200, 50)
control.custom_minimum_size = Vector2(100, 30)
```
