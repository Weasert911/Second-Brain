extends Node
class_name GameState
# Global game state singleton
# Stores data between scenes for scoring and result display.
func _ready() -> void:
    add_to_group("Gamestate")
var destination: String = ""
var selected_items: Array = []
var score: int = 0
var missing_required: Array = []
