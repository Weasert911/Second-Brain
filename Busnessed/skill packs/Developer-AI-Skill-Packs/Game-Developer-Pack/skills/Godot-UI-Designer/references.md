# Godot UI Designer - References

## Control Node Types

### Display Controls
| Node | Purpose |
|------|---------|
| Label | Single-line or wrapped text |
| RichTextLabel | BBCode-formatted text |
| TextureRect | Static image display |
| ColorRect | Colored rectangle |
| NinePatchRect | Scalable bordered texture |
| TextureProgressBar | Progress bar with texture |
| Sprite2D | (Not Control) Use TextureRect for UI |

### Button Controls
| Node | Purpose |
|------|---------|
| Button | Clickable button with text |
| TextureButton | Image-based button |
| LinkButton | Hyperlink-style button |
| OptionButton | Dropdown selection |
| MenuButton | Dropdown menu |
| CheckButton | Toggle switch |
| CheckBox | Checkbox indicator |
| ColorPickerButton | Color picker popup |

### Input Controls
| Node | Purpose |
|------|---------|
| LineEdit | Single-line text input |
| TextEdit | Multi-line text input |
| SpinBox | Numeric input with arrows |
| Slider | Value slider (horizontal/vertical) |
| HSlider, VSlider | Horizontal/vertical slider |
| ProgressBar | Horizontal progress indicator |
| HScrollBar, VScrollBar | Scroll bar controls |

### Container Controls
| Node | Purpose |
|------|---------|
| HBoxContainer | Horizontal layout |
| VBoxContainer | Vertical layout |
| GridContainer | Grid layout |
| MarginContainer | Adds margin padding |
| CenterContainer | Centers single child |
| AspectRatioContainer | Maintains child aspect ratio |
| ScrollContainer | Scrollable content area |
| SplitContainer | Resizable split panel |
| PanelContainer | Styled container panel |
| TabContainer | Tabbed interface |

## Layout System

### Anchors
```gdscript
# Preset values
control.anchor_left = 0.0   # Left edge of parent
control.anchor_top = 0.0    # Top edge of parent
control.anchor_right = 1.0  # Right edge of parent
control.anchor_bottom = 1.0 # Bottom edge of parent

# Preset shortcuts
# Full Rect: left=0, top=0, right=1, bottom=1
# Center: left=0.5, top=0.5, right=0.5, bottom=0.5
# Custom via Layout menu
```

### Size Flags
```gdscript
control.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
control.size_flags_vertical = Control.SIZE_EXPAND_FILL

# Flags
SIZE_FILL        - Fill available space
SIZE_EXPAND      - Expand to take available space
SIZE_SHRINK_CENTER - Center within available space
SIZE_SHRINK_BEGIN - Align to beginning
SIZE_SHRINK_END  - Align to end
```

### Containers
```gdscript
# VBoxContainer - children stacked vertically
var vbox := VBoxContainer.new()
vbox.add_child(label)
vbox.add_child(button)

# GridContainer - grid layout
var grid := GridContainer.new()
grid.columns = 3

# MarginContainer - padding
var margin := MarginContainer.new()
margin.add_theme_constant_override("margin_left", 10)
margin.add_theme_constant_override("margin_right", 10)
margin.add_theme_constant_override("margin_top", 10)
margin.add_theme_constant_override("margin_bottom", 10)

# ScrollContainer - scrollable area
var scroll := ScrollContainer.new()
scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_SHOW_NEVER
scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
```

## Theme System

### Theme Structure
```gdscript
# Create theme resource
var theme := Theme.new()

# Set stylebox for buttons
var stylebox := StyleBoxFlat.new()
stylebox.bg_color = Color(0.2, 0.5, 0.8)
stylebox.corner_radius_top_left = 4
stylebox.corner_radius_top_right = 4
stylebox.corner_radius_bottom_left = 4
stylebox.corner_radius_bottom_right = 4
theme.set_stylebox("normal", "Button", stylebox)

# Set font
theme.set_font("font", "Label", font_resource)
theme.set_font_size("font_size", "Label", 16)

# Set colors
theme.set_color("font_color", "Label", Color.WHITE)
theme.set_color("font_hover_color", "Button", Color.YELLOW)

# Set constants
theme.set_constant("h_separation", "Button", 4)
theme.set_constant("minimum_width", "Button", 100)
```

### Theme Application
```gdscript
# Apply to a single control
control.theme = my_theme

# Apply to entire scene (Control root)
get_tree().current_scene.theme = my_theme

# Apply project-wide
# Project > GUI > Theme > Custom

# Theme overrides on individual controls
button.add_theme_color_override("font_color", Color.RED)
button.add_theme_stylebox_override("hover", hover_stylebox)
```

## Responsive UI

### Resolution Handling
```gdscript
# Project Settings > Display > Window
# Stretch Mode: viewport, canvas_items, disabled
# Stretch Aspect: keep, keep_width, keep_height, expand

# Detect screen size
var screen_size := DisplayServer.screen_get_size()
var window_size := get_viewport().get_visible_rect().size
```

### Adapting Layouts
```gdscript
func _ready() -> void:
    get_viewport().size_changed.connect(_on_screen_resized)

func _on_screen_resized() -> void:
    var size := get_viewport().get_visible_rect().size
    if size.x < 600:
        switch_to_mobile_layout()
    else:
        switch_to_desktop_layout()
```

## Accessibility

### Focus Management
```gdscript
# Enable focus for keyboard/controller navigation
control.focus_mode = Control.FOCUS_ALL

# Navigation with arrow keys/gamepad
control.focus_neighbor_left = button_left.get_path()
control.focus_neighbor_right = button_right.get_path()
control.focus_neighbor_top = button_top.get_path()
control.focus_neighbor_bottom = button_bottom.get_path()

# Focus next/previous
control.focus_next = next_control.get_path()
control.focus_previous = prev_control.get_path()

# Visual focus indicator (theme)
theme.set_stylebox("focus", "Button", focus_stylebox)
```

### Accessibility Properties
```gdscript
# Tooltip for screen readers
control.tooltip_text = "Click to start the game"

# Mouse filter
# PASS: let events pass through
# STOP: capture events
# IGNORE: ignore all events
control.mouse_filter = Control.MOUSE_FILTER_PASS
```

## RichTextLabel

### BBCode Tags
```bbcode
[b]Bold[/b]
[i]Italic[/i]
[color=red]Colored text[/color]
[font_size=24]Larger text[/font_size]
[url=http://example.com]Link[/url]
[img]res://icon.png[/img]
[center]Centered text[/center]
[right]Right-aligned[/right]
[code]Monospace code[/code]
[ol]Ordered list[/ol]
[ul]Unordered list[/ul]
[indent]Indented text[/indent]
[table][cell]Table cell[/cell][/table]
```

### RichTextLabel in Code
```gdscript
@onready var rich_label: RichTextLabel = $RichTextLabel

func show_message(message: String) -> void:
    rich_label.clear()
    rich_label.push_color(Color.YELLOW)
    rich_label.push_bold()
    rich_label.append_text(message)
    rich_label.pop()
    rich_label.pop()
```

## Localization

### TranslationServer
```gdscript
# Set language
TranslationServer.set_locale("fr")

# Get translated string
var text := tr("START_GAME")

# Translation CSV format
# keys,en,fr,de
# START_GAME,Start Game,Commencer,Spiel Starten

# Load translation
var translation := Translation.new()
translation.add_message("START_GAME", "Start Game")
TranslationServer.add_translation(translation)
```

### Using Translation Keys
```gdscript
# In scene: use tr() function
label.text = tr("HELLO")

# With placeholders
label.text = tr("SCORE_FORMAT") % [score]

# Dynamic language switching
func set_language(locale: String) -> void:
    TranslationServer.set_locale(locale)
    # Re-translate all visible UI
    var translation_nodes := get_tree().get_nodes_in_group("translate")
    for node in translation_nodes:
        if node.has_method("update_translation"):
            node.update_translation()
```
