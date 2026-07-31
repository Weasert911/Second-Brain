extends Control

@onready var start: Button = $Start
@onready var credits: Button = $Credits
@onready var quit: Button = $Quit
@onready var chide: Button = $"../Credits_panel/Panel/Chide"

@onready var credits_panel: AspectRatioContainer = $"../Credits_panel"

@onready var animation_player: AnimationPlayer = $"../../AnimationPlayer"


func _on_start_pressed() -> void:
    get_tree().change_scene_to_file("res://PackingScene.tscn")

func _on_credits_pressed() -> void:
    animation_player.play("credits_open")

func _on_quit_pressed() -> void:
    get_tree().quit()


func _on_chide_pressed() -> void:
    animation_player.play("credits_closed")
