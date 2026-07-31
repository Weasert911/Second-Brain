extends Control

@onready var stars_label: Label = $StarsLabel
@onready var grade_label: Label = $GradeLabel
@onready var consequence_label: Label = $ConsequenceLabel
@onready var play_again_button: Button = $PlayAgainButton

func _ready() -> void:
    var gs = get_node("/root/GameState")
    var score = gs.score
    var stars = compute_stars(score)
    stars_label.text = "Stars: %d" % stars
    grade_label.text = "Grade: " + grade_from_stars(stars)
    if gs.missing_required.size() > 0:
        consequence_label.text = "Missing: " + ", ".join(gs.missing_required)
    else:
        consequence_label.text = "All requirements met!"
    # Connect button signal
    play_again_button.pressed.connect(_on_PlayAgainButton_pressed)

func compute_stars(score: int) -> int:
    if score >= 90:
        return 5
    elif score >= 70:
        return 4
    elif score >= 50:
        return 3
    elif score >= 30:
        return 2
    else:
        return 1

func grade_from_stars(stars: int) -> String:
    match stars:
        5:
            return "A Legendary Vacation"
        4:
            return "Pretty Great Trip"
        3:
            return "Mostly Functional"
        2:
            return "Questionable Planning"
        _:
            return "Family Group Chat Meltdown"

func _on_PlayAgainButton_pressed() -> void:
    get_tree().change_scene_to_file("res://Mainmenu.tscn")
