# Steam Release Checklist - Examples

## Steamworks Integration

```gdscript
# SteamManager.gd (Autoload)
extends Node

var steam_initialized: bool = false
var steam_id: int = 0
var steam_name: String = ""

signal steam_ready
signal achievement_unlocked(name: String)
signal leaderboard_updated(name: String)

func _ready() -> void:
    initialize_steam()

func initialize_steam() -> void:
    var init_result := Steam.steamInit()
    if init_result != Steam.STEAM_INIT_OK:
        push_error("Steam initialization failed: ", init_result)
        return

    steam_initialized = true
    steam_id = Steam.getSteamID()
    steam_name = Steam.getPersonaName()

    Steam.setRichPresence("steam_display", "#Status_Playing")
    Steam.setRichPresence("steam_player_group", "default")

    print("Steam initialized: ", steam_name, " (", steam_id, ")")
    steam_ready.emit()

func _process(delta: float) -> void:
    if steam_initialized:
        Steam.run_callbacks()

func unlock_achievement(ach_name: String) -> void:
    if not steam_initialized:
        return

    var already_unlocked := Steam.getAchievement(ach_name)
    if already_unlocked:
        return

    Steam.setAchievement(ach_name)
    Steam.storeStats()
    achievement_unlocked.emit(ach_name)

    var display_name := Steam.getAchievementDisplayAttribute(ach_name, "name")
    print("Achievement unlocked: ", display_name)

func is_achievement_unlocked(ach_name: String) -> bool:
    if not steam_initialized:
        return false
    var result = Steam.getAchievement(ach_name)
    if result is Dictionary:
        return result.get("achieved", false)
    return false

func upload_score(leaderboard_name: String, score: int) -> void:
    if not steam_initialized:
        return

    var handle := Steam.findOrCreateLeaderboard(
        leaderboard_name,
        Steam.LEADERBOARD_SORT_METHOD_DESC,
        Steam.LEADERBOARD_DISPLAY_TYPE_NUMERIC
    )

    if handle:
        Steam.uploadLeaderboardScore(
            handle,
            Steam.LEADERBOARD_UPLOAD_SCORE_METHOD_KEEP_BEST,
            score
        )
        leaderboard_updated.emit(leaderboard_name)

func get_leaderboard_entries(leaderboard_name: String, count: int = 10) -> void:
    if not steam_initialized:
        return

    var handle := Steam.findOrCreateLeaderboard(
        leaderboard_name,
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
```

## Steam Cloud Saves

```gdscript
# CloudSaveManager.gd
extends Node

func save_to_cloud(path: String, data: Dictionary) -> void:
    if not Steam.isSteamRunning():
        # Fallback to local save
        save_local(path, data)
        return

    # user:// maps to Steam Cloud when Steam is active
    var file := FileAccess.open(path, FileAccess.WRITE)
    if file:
        file.store_var(data)
        file.close()
        print("Saved to Steam Cloud: ", path)

func load_from_cloud(path: String) -> Dictionary:
    if not FileAccess.file_exists(path):
        return {}

    if Steam.isSteamRunning() and not Steam.isCloudEnabledForApp():
        push_warning("Steam Cloud not available, trying local")
    elif Steam.isSteamRunning():
        # Force sync before reading
        Steam.forceCloudSync()

    var file := FileAccess.open(path, FileAccess.READ)
    if file:
        var data := file.get_var()
        file.close()
        return data

    return {}

func get_cloud_quota() -> Dictionary:
    if not Steam.isSteamRunning():
        return {"total_bytes": 0, "available_bytes": 0}
    return Steam.getCloudQuota()

func list_cloud_files() -> Array:
    if not Steam.isSteamRunning():
        return []

    var files: Array = []
    var count := Steam.getFileCount()
    for i in range(count):
        var info = Steam.getFileNameAndSize(i)
        files.append({"name": info[0], "size": info[1]})
    return files
```

## Steam Store Page Content

```markdown
# Short Description (max 300 chars)
"A thrilling pixel-art action platformer where you battle through procedurally generated dungeons. Collect loot, upgrade your character, and defeat the eldritch horrors lurking below."

# Long Description

## About the Game
Journey into the depths of the Abyss in this action-packed rogue-lite platformer. Each descent is unique with procedurally generated levels, hundreds of item combinations, and enemies that adapt to your playstyle.

## Key Features
- **Procedural Dungeons**: No two runs are ever the same
- **Deep Item System**: Combine 200+ items for unique builds
- **Challenging Combat**: Master timing-based combat against 50+ enemy types
- **Character Progression**: Permanent upgrades between runs
- **Local Co-op**: Play with a friend in 2-player split-screen
- **Controller Support**: Full gamepad support
- **Steam Achievements**: 50 achievements to unlock
- **Steam Cloud**: Sync your progress across devices

## System Requirements
### Minimum:
- OS: Windows 10
- Processor: Intel Core i3-2100 / AMD FX-6300
- Memory: 4 GB RAM
- Graphics: Intel HD Graphics 4000
- Storage: 2 GB available space
- DirectX: Version 11

### Recommended:
- OS: Windows 11
- Processor: Intel Core i5-6600 / AMD Ryzen 3 1300X
- Memory: 8 GB RAM
- Graphics: NVIDIA GeForce GTX 960 / AMD Radeon R9 380
- Storage: 2 GB available space
- DirectX: Version 12
```

## Steam Achievements Setup

```gdscript
# Achievement definitions (mirrors Steamworks setup)
const ACHIEVEMENTS := {
    "ACH_COMPLETE_TUTORIAL": {
        "name": "First Steps",
        "desc": "Complete the tutorial",
        "icon": "res://assets/achievements/tutorial.png"
    },
    "ACH_DEFEAT_BOSS_1": {
        "name": "Slime Slayer",
        "desc": "Defeat the Slime King",
        "icon": "res://assets/achievements/boss1.png"
    },
    "ACH_COLLECT_100_GOLD": {
        "name": "Bling Bling",
        "desc": "Collect 100 gold coins",
        "hidden": true,
        "icon": "res://assets/achievements/gold.png"
    },
    "ACH_SPEEDRUN": {
        "name": "Speed Demon",
        "desc": "Complete the game in under 1 hour",
        "icon": "res://assets/achievements/speedrun.png"
    },
    "ACH_NO_HIT_BOSS": {
        "name": "Untouchable",
        "desc": "Defeat a boss without taking damage",
        "icon": "res://assets/achievements/nohit.png"
    },
    "ACH_FIND_SECRET": {
        "name": "Secret Seeker",
        "desc": "Find the hidden room in Level 3",
        "hidden": true,
        "icon": "res://assets/achievements/secret.png"
    }
}

func check_achievements() -> void:
    if GameState.bosses_defeated >= 1:
        SteamManager.unlock_achievement("ACH_DEFEAT_BOSS_1")

    if GameState.total_gold_collected >= 100:
        SteamManager.unlock_achievement("ACH_COLLECT_100_GOLD")

    if GameState.play_time < 3600 and GameState.game_completed:
        SteamManager.unlock_achievement("ACH_SPEEDRUN")
```

## Build Upload Script

```bash
# upload_build.bat
@echo off
set STEAM_CMD="C:\steamcmd\steamcmd.exe"
set CONTENT_ROOT="C:\projects\game\build"
set APP_ID=1234567
set USERNAME=your_steam_username

echo Creating build...
%GODOT% --headless --export-release "Windows Desktop" %CONTENT_ROOT%\game.exe
if %errorlevel% neq 0 exit /b %errorlevel%

echo Uploading to Steam...
%STEAM_CMD% +login %USERNAME% +run_app_build %CONTENT_ROOT%\scripts\app_build_%APP_ID%.vdf +quit
```

## app_build.vdf

```vdf
"AppBuild"
{
    "AppID" "1234567"
    "Desc" "Release build %VERSION%"
    "ContentRoot" "C:\\projects\\game\\build"
    "BuildOutput" "C:\\projects\\game\\steam_output"
    "SetLive" "beta"

    "Depots"
    {
        "1234568" // Windows depot
        {
            "FileMapping"
            {
                "LocalPath" "windows\\*"
                "DepotPath" "."
                "recursive" "1"
            }
            "FileExclusion" "*.pdb"
            "FileExclusion" "*.log"
        }

        "1234569" // Shared assets depot
        {
            "FileMapping"
            {
                "LocalPath" "shared\\*"
                "DepotPath" "."
                "recursive" "1"
            }
        }
    }
}
```
