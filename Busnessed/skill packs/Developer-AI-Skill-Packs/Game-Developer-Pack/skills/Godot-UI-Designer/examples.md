# Godot UI Designer - Examples

## Main Menu Screen

```gdscript
# MainMenu.tscn structure
# MainMenu (Control) - full_rect
# ├── Background (TextureRect) - stretch mode: tile
# ├── VBoxContainer - center, alignment center
# │   ├── TitleLabel (Label) - theme font size
# │   ├── StartButton (Button)
# │   ├── OptionsButton (Button)
# │   ├── CreditsButton (Button)
# │   └── QuitButton (Button)
# └── VersionLabel (Label) - bottom right

# MainMenu.gd
extends Control

@onready var title_label: Label = $VBoxContainer/TitleLabel
@onready var start_button: Button = $VBoxContainer/StartButton
@onready var options_button: Button = $VBoxContainer/OptionsButton
@onready var credits_button: Button = $VBoxContainer/CreditsButton
@onready var quit_button: Button = $VBoxContainer/QuitButton

func _ready() -> void:
    start_button.pressed.connect(_on_start_pressed)
    options_button.pressed.connect(_on_options_pressed)
    credits_button.pressed.connect(_on_credits_pressed)
    quit_button.pressed.connect(_on_quit_pressed)

    # Keyboard navigation
    start_button.focus_neighbor_bottom = options_button.get_path()
    options_button.focus_neighbor_top = start_button.get_path()
    options_button.focus_neighbor_bottom = credits_button.get_path()
    credits_button.focus_neighbor_top = options_button.get_path()
    credits_button.focus_neighbor_bottom = quit_button.get_path()
    quit_button.focus_neighbor_top = credits_button.get_path()

    start_button.grab_focus()

func _on_start_pressed() -> void:
    get_tree().change_scene_to_file("res://scenes/levels/level_01.tscn")

func _on_options_pressed() -> void:
    var options_scene := preload("res://scenes/ui/OptionsMenu.tscn")
    var options := options_scene.instantiate()
    add_child(options)

func _on_credits_pressed() -> void:
    pass

func _on_quit_pressed() -> void:
    get_tree().quit()
```

## HUD with Health Bar

```gdscript
# GameHUD.tscn
# GameHUD (CanvasLayer)
# ├── VBoxContainer - full_rect, top
# │   ├── HealthContainer (MarginContainer)
# │   │   ├── HealthIcon (TextureRect)
# │   │   └── HealthBar (TextureProgressBar)
# │   ├── AmmoContainer (HBoxContainer)
# │   │   ├── AmmoIcon (TextureRect)
# │   │   └── AmmoLabel (Label)
# │   └── ScoreLabel (Label) - right aligned
# ├── Crosshair (TextureRect) - center
# └── DamageOverlay (ColorRect) - full_rect, modulate alpha 0

# GameHUD.gd
extends CanvasLayer

@onready var health_bar: TextureProgressBar = $VBoxContainer/HealthContainer/HealthBar
@onready var health_icon: TextureRect = $VBoxContainer/HealthContainer/HealthIcon
@onready var ammo_label: Label = $VBoxContainer/AmmoContainer/AmmoLabel
@onready var score_label: Label = $VBoxContainer/ScoreLabel
@onready var crosshair: TextureRect = $Crosshair
@onready var damage_overlay: ColorRect = $DamageOverlay

var damage_tween: Tween

func _ready() -> void:
    SignalBus.health_updated.connect(_on_health_updated)
    SignalBus.ammo_updated.connect(_on_ammo_updated)
    SignalBus.score_updated.connect(_on_score_updated)
    SignalBus.player_damaged.connect(_on_player_damaged)

    damage_overlay.modulate = Color(1, 0, 0, 0)

func _on_health_updated(current: int, max_hp: int) -> void:
    health_bar.max_value = max_hp
    health_bar.value = current

    if current <= max_hp * 0.25:
        health_bar.modulate = Color.RED
        health_icon.modulate = Color.RED
    elif current <= max_hp * 0.5:
        health_bar.modulate = Color.YELLOW
        health_icon.modulate = Color.YELLOW
    else:
        health_bar.modulate = Color.WHITE
        health_icon.modulate = Color.WHITE

func _on_ammo_updated(current: int, max_ammo: int) -> void:
    ammo_label.text = "%d / %d" % [current, max_ammo]
    if current == 0:
        ammo_label.add_theme_color_override("font_color", Color.RED)
    else:
        ammo_label.add_theme_color_override("font_color", Color.WHITE)

func _on_score_updated(score: int) -> void:
    score_label.text = "SCORE: %d" % score

func _on_player_damaged(amount: int) -> void:
    if damage_tween and damage_tween.is_valid():
        damage_tween.kill()

    damage_overlay.modulate = Color(1, 0, 0, 0.3)
    damage_tween = create_tween()
    damage_tween.tween_property(damage_overlay, "modulate", Color(1, 0, 0, 0), 0.5)
```

## Inventory Grid

```gdscript
# InventoryPanel.tscn
# InventoryPanel (PanelContainer)
# └── GridContainer - columns = 4
#     ├── InventorySlot (PanelContainer) x N
#     │   └── ItemIcon (TextureRect) - visible when item present
#     └── ...

# InventoryPanel.gd
extends PanelContainer

@export var columns: int = 4
@export var slot_scene: PackedScene

var slots: Array[InventorySlot] = []
var selected_slot: InventorySlot = null

signal item_selected(slot: InventorySlot)
signal item_used(slot: InventorySlot)

func _ready() -> void:
    _build_grid()

func _build_grid() -> void:
    var grid := GridContainer.new()
    grid.columns = columns
    grid.add_theme_constant_override("h_separation", 4)
    grid.add_theme_constant_override("v_separation", 4)

    for i in range(InventoryManager.inventory_size):
        var slot := slot_scene.instantiate() as InventorySlot
        slot.slot_index = i
        slot.gui_input.connect(_on_slot_gui_input.bind(slot))
        slot.mouse_entered.connect(_on_slot_hovered.bind(slot))
        slot.mouse_exited.connect(_on_slot_unhovered.bind(slot))
        grid.add_child(slot)
        slots.append(slot)

    add_child(grid)

func refresh() -> void:
    for i in range(slots.size()):
        var item := InventoryManager.get_item_at(i)
        slots[i].set_item(item)

func _on_slot_gui_input(event: InputEvent, slot: InventorySlot) -> void:
    if event is InputEventMouseButton and event.pressed:
        match event.button_index:
            MOUSE_BUTTON_LEFT:
                selected_slot = slot
                item_selected.emit(slot)
            MOUSE_BUTTON_RIGHT:
                if slot.has_item():
                    item_used.emit(slot)

func _on_slot_hovered(slot: InventorySlot) -> void:
    if slot.has_item():
        TooltipManager.show(slot.get_item_tooltip(), get_global_mouse_position())

func _on_slot_unhovered(slot: InventorySlot) -> void:
    TooltipManager.hide()

# InventorySlot.gd
extends PanelContainer

var slot_index: int = -1
var _item: ItemData = null

@onready var icon: TextureRect = $Icon
@onready var count_label: Label = $CountLabel

func set_item(item: ItemData) -> void:
    _item = item
    if item:
        icon.texture = item.icon
        icon.visible = true
        count_label.text = str(item.count) if item.count > 1 else ""
        count_label.visible = item.count > 1
        tooltip_text = item.description
    else:
        icon.texture = null
        icon.visible = false
        count_label.visible = false
        tooltip_text = ""

func has_item() -> bool:
    return _item != null

func get_item() -> ItemData:
    return _item

func get_item_tooltip() -> String:
    if not _item:
        return ""
    return "[b]%s[/b]\n%s\n[i]%s[/i]" % [_item.item_name, _item.description, _item.rarity_string()]
```

## Settings Menu

```gdscript
# OptionsMenu.gd
extends Control

@onready var master_slider: HSlider = $VBoxContainer/Audio/MasterSlider
@onready var music_slider: HSlider = $VBoxContainer/Audio/MusicSlider
@onready var sfx_slider: HSlider = $VBoxContainer/Audio/SFXSlider
@onready var fullscreen_check: CheckButton = $VBoxContainer/Video/FullscreenCheck
@onready var resolution_option: OptionButton = $VBoxContainer/Video/ResolutionOption
@onready var vsync_check: CheckButton = $VBoxContainer/Video/VSyncCheck
@onready var language_option: OptionButton = $VBoxContainer/Language/LanguageOption

func _ready() -> void:
    _load_settings()
    _connect_signals()

func _connect_signals() -> void:
    master_slider.drag_ended.connect(_on_master_volume_changed)
    music_slider.drag_ended.connect(_on_music_volume_changed)
    sfx_slider.drag_ended.connect(_on_sfx_volume_changed)
    fullscreen_check.toggled.connect(_on_fullscreen_toggled)
    resolution_option.item_selected.connect(_on_resolution_selected)
    vsync_check.toggled.connect(_on_vsync_toggled)
    language_option.item_selected.connect(_on_language_selected)

func _load_settings() -> void:
    master_slider.value = SettingsManager.get_setting("master_volume", 1.0) * 100
    music_slider.value = SettingsManager.get_setting("music_volume", 0.8) * 100
    sfx_slider.value = SettingsManager.get_setting("sfx_volume", 1.0) * 100
    fullscreen_check.button_pressed = SettingsManager.get_setting("fullscreen", false)
    vsync_check.button_pressed = SettingsManager.get_setting("vsync", true)
    resolution_option.select(SettingsManager.get_setting("resolution_index", 0))
    language_option.select(SettingsManager.get_setting("language_index", 0))

func _on_master_volume_changed(value_changed: bool) -> void:
    if value_changed:
        var volume := master_slider.value / 100.0
        AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Master"), linear_to_db(volume))
        SettingsManager.set_setting("master_volume", volume)

func _on_music_volume_changed(value_changed: bool) -> void:
    if value_changed:
        var volume := music_slider.value / 100.0
        AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Music"), linear_to_db(volume))
        SettingsManager.set_setting("music_volume", volume)

func _on_sfx_volume_changed(value_changed: bool) -> void:
    if value_changed:
        var volume := sfx_slider.value / 100.0
        AudioServer.set_bus_volume_db(AudioServer.get_bus_index("SFX"), linear_to_db(volume))
        SettingsManager.set_setting("sfx_volume", volume)

func _on_fullscreen_toggled(toggled: bool) -> void:
    if toggled:
        DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
    else:
        DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
    SettingsManager.set_setting("fullscreen", toggled)

func _on_resolution_selected(index: int) -> void:
    var resolutions := [
        Vector2i(1920, 1080),
        Vector2i(2560, 1440),
        Vector2i(1280, 720),
        Vector2i(3840, 2160)
    ]
    if index < resolutions.size():
        DisplayServer.window_set_size(resolutions[index])
        SettingsManager.set_setting("resolution_index", index)

func _on_vsync_toggled(toggled: bool) -> void:
    DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_ENABLED if toggled else DisplayServer.VSYNC_DISABLED)
    SettingsManager.set_setting("vsync", toggled)

func _on_language_selected(index: int) -> void:
    var locales := ["en", "fr", "de", "es", "ja"]
    if index < locales.size():
        TranslationServer.set_locale(locales[index])
        SettingsManager.set_setting("language_index", index)
```
