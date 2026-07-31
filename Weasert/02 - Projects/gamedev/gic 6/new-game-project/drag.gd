extends TextureRect
@export var  item_id: String

func _get_drag_data(at_position: Vector2):
    var preview := TextureRect.new()
    preview.texture = texture
    preview.custom_minimum_size= Vector2(128,80)
    preview.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
    preview.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
    set_drag_preview(preview)
    return {
        "item_id": item_id,
        "texture": texture
        }

func _gui_input(event: InputEvent) -> void:
    if event is InputEventMouseButton and event.pressed:
        get_node("../../../storage").show_item_info(item_id)
