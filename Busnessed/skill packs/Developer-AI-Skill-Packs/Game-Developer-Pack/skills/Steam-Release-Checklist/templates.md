# Steam Release Checklist - Templates

## SteamManager Template

```gdscript
# autoload/steam_manager.gd
extends Node

signal steam_initialized
signal achievement_unlocked(name: String)
signal leaderboard_score_uploaded(leaderboard: String, score: int)

var initialized: bool = false
var steam_id: int = 0
var persona_name: String = ""
var game_version: String = ""

func _ready() -> void:
    game_version = ProjectSettings.get_setting("application/config/version", "1.0")
    _init_steam()

func _init_steam() -> void:
    var result := Steam.steamInit()
    if result != Steam.STEAM_INIT_OK:
        push_warning("Steam init failed: ", result)
        return

    initialized = true
    steam_id = Steam.getSteamID()
    persona_name = Steam.getPersonaName()
    _set_rich_presence()
    steam_initialized.emit()
    print("Steam: ", persona_name, " (", steam_id, ")")

func _set_rich_presence() -> void:
    if not initialized:
        return
    Steam.setRichPresence("steam_display", "#Status_AtMainMenu")
    Steam.setRichPresence("version", game_version)

func unlock_achievement(api_name: String) -> void:
    if not initialized:
        return
    var result = Steam.getAchievement(api_name)
    var already: bool = result is Dictionary and result.get("achieved", false)
    if already:
        return
    Steam.setAchievement(api_name)
    Steam.storeStats()
    achievement_unlocked.emit(api_name)

func is_achievement_unlocked(api_name: String) -> bool:
    if not initialized:
        return false
    var result = Steam.getAchievement(api_name)
    return result is Dictionary and result.get("achieved", false)

func get_achievement_display_name(api_name: String) -> String:
    if not initialized:
        return api_name
    return Steam.getAchievementDisplayAttribute(api_name, "name")

func get_achievement_description(api_name: String) -> String:
    if not initialized:
        return ""
    return Steam.getAchievementDisplayAttribute(api_name, "desc")

func upload_leaderboard_score(board_name: String, score: int) -> void:
    if not initialized:
        return
    var handle := Steam.findOrCreateLeaderboard(
        board_name,
        Steam.LEADERBOARD_SORT_METHOD_DESC,
        Steam.LEADERBOARD_DISPLAY_TYPE_NUMERIC
    )
    if handle:
        Steam.uploadLeaderboardScore(
            handle,
            Steam.LEADERBOARD_UPLOAD_SCORE_METHOD_KEEP_BEST,
            score
        )
        leaderboard_score_uploaded.emit(board_name, score)

func get_leaderboard_entries(board_name: String, count: int = 10) -> void:
    if not initialized:
        return
    var handle := Steam.findOrCreateLeaderboard(
        board_name,
        Steam.LEADERBOARD_SORT_METHOD_DESC,
        Steam.LEADERBOARD_DISPLAY_TYPE_NUMERIC
    )
    if handle:
        Steam.downloadLeaderboardEntries(
            handle,
            Steam.LEADERBOARD_DATA_REQUEST_GLOBAL,
            1,
            count
        )

func set_rich_presence_key(key: String, value: String) -> void:
    if initialized:
        Steam.setRichPresence(key, value)

func activate_overlay() -> void:
    if initialized:
        Steam.activateGameOverlay()

func activate_overlay_to_page(url: String) -> void:
    if initialized:
        Steam.activateGameOverlayToWebPage(url)

func is_overlay_enabled() -> bool:
    if not initialized:
        return false
    return Steam.isOverlayEnabled()
```

## Depot Config Template

```vdf
"AppBuild"
{
    "AppID" "%APP_ID%"
    "Desc" "%VERSION% - %BUILD_DATE%"
    "ContentRoot" "%CONTENT_ROOT%"
    "BuildOutput" "%BUILD_OUTPUT%"
    "SetLive" "%BRANCH%"

    "Depots"
    {
        "%DEPOT_WINDOWS%"
        {
            "FileMapping"
            {
                "LocalPath" "windows\*"
                "DepotPath" "."
                "recursive" "1"
            }
            "FileExclusion" "*.pdb"
            "FileExclusion" "*.log"
        }

        "%DEPOT_LINUX%"
        {
            "FileMapping"
            {
                "LocalPath" "linux\*"
                "DepotPath" "."
                "recursive" "1"
            }
        }

        "%DEPOT_MACOS%"
        {
            "FileMapping"
            {
                "LocalPath" "macos\*"
                "DepotPath" "."
                "recursive" "1"
            }
        }

        "%DEPOT_SHARED%"
        {
            "FileMapping"
            {
                "LocalPath" "shared\*"
                "DepotPath" "."
                "recursive" "1"
            }
        }
    }
}
```

## Store Page Template

```markdown
# Short Description (max 300 chars)
[30-50 word compelling hook]

# Long Description
## About the Game
[2-3 paragraphs about the game concept]

## Key Features
- [Feature 1]: [Brief description]
- [Feature 2]: [Brief description]
- [Feature 3]: [Brief description]
- [Feature 4]: [Brief description]
- [Feature 5]: [Brief description]
- [Feature 6]: [Brief description]

## System Requirements

### Minimum:
- OS: [OS version]
- Processor: [CPU model]
- Memory: [X] GB RAM
- Graphics: [GPU model]
- Storage: [X] GB available space

### Recommended:
- OS: [OS version]
- Processor: [CPU model]
- Memory: [X] GB RAM
- Graphics: [GPU model]
- Storage: [X] GB available space
```
