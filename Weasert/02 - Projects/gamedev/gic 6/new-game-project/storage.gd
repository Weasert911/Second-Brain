extends Panel

# Handles packing logic for the destination
# Manages destination generation, item dragging, timer, space usage,
# item info display, scoring and transition to the result screen.

@onready var packeditemscontainer: FlowContainer = $Packeditemscontainer
@onready var destname: Label = $"../Destname"
@onready var progress_bar: ProgressBar = $"../ProgressBar"
@onready var info_label: Label = $"../Infocontainer/Label"
@onready var timer_label: Label = $"../Timer"

# Game configuration
var destination_options = ["Beach", "Camping"]
var max_space = 300
var max_items = 5
var time_limit = 30.0  # seconds

# Runtime state
var space_used = 0
var time_left = time_limit
var selected_items: Array = []
var packed_items: Array = []  # kept for potential future use
var current_destination = ""
var requirements = {
    "Camping": ["Tent", "Pani", "Torch", "Sleepbag", "Towel", "Book"],
    "Beach": ["Pani", "Sunscreen", "Towel", "Drone"]
}

var items_size = {
    "Tent": 60,
    "Pani": 10,
    "Torch": 20,
    "Sunscreen": 30,
    "Towel": 20,
    "Drone": 40,
    "Sleepbag": 40,
    "Book": 10,
    "Stove": 40,
    "Gameboy": 10
}

var item_info = {
    "Tent": "A tent where you will sleep at night.",
    "Pani": "Stay hydrated during the hot vacation.",
    "Torch": "You will need something to watch at night.",
    "Drone": "Get a topÃ¢â‚¬â€˜view of the scene.",
    "Towel": "Dry up after a wash.",
    "Sunscreen": "Prevents becoming a tomato.",
    "Sleepbag": "Safe to cover up your body, mosquitos are annoying.",
    "Book": "A way to pass lazy time.",
    "Stove": "For cooking, but can you?",
    "Gameboy": "Spend boring time fast."
}

func _ready() -> void:
    current_destination = destination_options.pick_random()
    destname.text = current_destination
    progress_bar.max_value = max_space
    progress_bar.value = space_used
    timer_label.text = str(ceil(time_left))

func _process(delta: float) -> void:
    time_left = max(time_left - delta, 0)
    timer_label.text = str(ceil(time_left))
    if time_left <= 0:
        finish_packing()

func _can_drop_data(at_position: Vector2, data: Variant) -> bool:
    return data is Dictionary and data.has("item_id")

func _drop_data(at_position: Vector2, data: Variant) -> void:
    var item_id = data["item_id"]
    pack_item(item_id, data["texture"])

func pack_item(item_id: String, texture: Texture2D) -> void:
    if selected_items.size() >= max_items:
        return
    var size = items_size.get(item_id, 0)
    if space_used + size > max_space:
        return
    if item_id in selected_items:
        return
    # Update space and UI
    space_used += size
    progress_bar.value = space_used
    selected_items.append(item_id)
    # Create icon
    var icon = TextureRect.new()
    icon.texture = texture
    icon.custom_minimum_size = Vector2(128, 50)
    packeditemscontainer.add_child(icon)
    # Show info
    show_item_info(item_id)
    # Penalty for nonÃ¢â‚¬â€˜required item
    if not item_id in requirements[current_destination]:
        time_left = max(time_left - 5, 0)
    # AutoÃ¢â‚¬â€˜finish when enough items are selected
    if selected_items.size() >= max_items:
        finish_packing()

func show_item_info(item_id: String) -> void:
    var info = item_info.get(item_id, "No description available.")
    info_label.text = info

func finish_packing() -> void:
    # Compute score
    var req = requirements[current_destination]
    var score = 0
    var missing = []
    for needed in req:
        if needed in selected_items:
            score += 30
        else:
            score -= 20
            missing.append(needed)
    # Bonus items (any selected that is not required)
    for itm in selected_items:
        if not itm in req:
            score += 10
    score = clamp(score, 0, 100)
    # Store results globally
    var gs = get_node("/root/GameState")
    gs.destination = current_destination
    gs.selected_items = selected_items
    gs.score = score
    gs.missing_required = missing
    # Transition to result scene
    get_tree().change_scene_to_file("res://ResultScene.tscn")
