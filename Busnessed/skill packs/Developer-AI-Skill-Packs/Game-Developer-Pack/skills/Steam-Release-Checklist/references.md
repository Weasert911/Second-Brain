# Steam Release Checklist - References

## Steamworks SDK Integration

### GodotSteam Setup
```gdscript
# Install GodotSteam GDExtension or module
# https://github.com/GodotSteam/GodotSteam

# Initialize Steam
func _ready() -> void:
    Steam.steamInit()
    if Steam.isSteamRunning():
        print("Steam initialized for user: ", Steam.getPersonaName())
    else:
        print("Steam not running, running in offline mode")

# Check Steam initialization
func _process(delta: float) -> void:
    Steam.run_callbacks()
```

### Common Steam Functions
```gdscript
# User info
var name: String = Steam.getPersonaName()
var level: int = Steam.getPlayerSteamLevel()
var id: int = Steam.getSteamID()

# Overlay
Steam.activateGameOverlay("friends")
Steam.activateGameOverlayToWebPage("https://example.com")

# Rich presence
Steam.setRichPresence("steam_display", "#Status_Playing")
Steam.setRichPresence("steam_player_group", lobby_id)
```

## Achievements

### Achievement Setup
```gdscript
# Define achievements in Steamworks Partner site
# Register them with names like "ACH_WIN_ONE_GAME"

# Unlock achievement
func unlock_achievement(achievement_name: String) -> void:
    Steam.setAchievement(achievement_name)
    Steam.storeStats()

# Check achievement
func is_achievement_unlocked(achievement_name: String) -> bool:
    var result = Steam.getAchievement(achievement_name)
    return result

# Get achievement display info
func get_achievement_details(achievement_name: String) -> Dictionary:
    var achieved = Steam.getAchievement(achievement_name)
    var name = Steam.getAchievementDisplayAttribute(achievement_name, "name")
    var desc = Steam.getAchievementDisplayAttribute(achievement_name, "desc")
    return {
        "achieved": achieved,
        "name": name,
        "description": desc
    }

# Reset achievements (for testing)
Steam.resetAllStats(true)  # true = also resets achievements
```

### Achievement Types
| Type | Description | Example |
|------|-------------|---------|
| Progression | Linear progress | "Reach Level 10" |
| Cumulative | Count-based | "Kill 1000 enemies" |
| Exploration | Discovery-based | "Visit all areas" |
| Challenge | Skill-based | "Complete game in under 2 hours" |
| Secret | Hidden until unlocked | "Find the hidden room" |

## Leaderboards

### Leaderboard Setup
```gdscript
# In Steamworks: create leaderboard with name "HighScore"
# Types: None, Ascending (lowest first), Descending (highest first)

# Find or create leaderboard
var leaderboard_handle: int = Steam.findOrCreateLeaderboard("HighScore", Steam.LEADERBOARD_SORT_METHOD_DESC, Steam.LEADERBOARD_DISPLAY_TYPE_NUMERIC)

# Upload score
func upload_score(score: int) -> void:
    Steam.uploadLeaderboardScore(leaderboard_handle, Steam.LEADERBOARD_UPLOAD_SCORE_METHOD_KEEP_BEST, score)

# Download scores
func get_top_scores(count: int = 10) -> void:
    Steam.downloadLeaderboardEntries(leaderboard_handle, Steam.LEADERBOARD_DATA_REQUEST_GLOBAL, 1, count)

# Get scores around user
func get_friend_scores() -> void:
    Steam.downloadLeaderboardEntries(leaderboard_handle, Steam.LEADERBOARD_DATA_REQUEST_GLOBAL_AROUND_USER, -5, 5)
```

## Steam Cloud Saves

### Cloud Save Setup
```gdscript
# Steam Cloud automatically syncs userdata/
# Save files to: Steam.userdata(SteamID, app_id)/remote/

# Check cloud availability
func can_use_cloud() -> bool:
    return Steam.isCloudEnabledForApp()

# Get cloud file info
func get_cloud_files() -> Array:
    var file_count = Steam.getFileCount()
    var files = []
    for i in range(file_count):
        var info = Steam.getFileNameAndSize(i)
        files.append({"name": info[0], "size": info[1]})
    return files

# Force sync
Steam.forceCloudSync()

# Cloud quota
var quota = Steam.getCloudQuota()
var total_bytes = quota.get("total_bytes", 0)
var available_bytes = quota.get("available_bytes", 0)
```

### Steam Cloud Path
```gdscript
# Godot user:// maps to Steam Cloud when Steam is active
# Save normally with user:// path
func save_game(data: Dictionary) -> void:
    var file := FileAccess.open("user://savegame.sav", FileAccess.WRITE)
    file.store_var(data)
    file.close()
```

## DRM and Anti-Tamper

### Steam CEG (Custom Executable Generation)
```gdscript
# Enable in Steamworks > App > Security
# CEG encrypts your executable
# Requires: Steam client to decrypt at runtime
# Implement additional checks:

func verify_steam_ownership() -> bool:
    if not Steam.isSteamRunning():
        return false
    if not Steam.isSubscribed():
        return false
    return true
```

## Store Page Optimization

### Capsule Art Requirements
| Image | Size (px) | Usage |
|-------|-----------|-------|
| Header Capsule | 460x215 | Game search results |
| Small Capsule | 231x87 | Small grid view |
| Main Capsule | 616x353 | Store front page |
| Hero Capsule | 1920x620 | Game page header |
| Library Capsule | 600x900 | Library grid |
| Library Hero | 3840x1240 | Library details |
| Page Background | 1438x810 | Store page background |

### Store Page Sections
```
- Title and short description
- Capsule art (header)
- Screenshots (min 5)
- Trailer/Video
- Long description (with formatting)
- System requirements
- Tags and genres
- Price and release date
- Reviews and ratings
- DLC and editions
```

## Build Distribution

### Depot Configuration
```gdscript
# Steamworks > App > Depots
# Typical depot setup:
# Depot 1: Windows build (binary + assets)
# Depot 2: macOS build
# Depot 3: Linux build
# Depot 4: Dedicated server (optional)
# Depot 5: DLC 1 content (optional)
```

### Branch Management
```
default: Main release branch
beta: Public beta test branch
beta_private: Private beta (password protected)
development: Internal testing
prototype: Early builds
```

### Upload Command
```bash
# SteamPipe CLI
steamcmd +login username password +run_app_build path/to/build.vdf +quit
```

## Early Access

### Early Access Requirements
- Functional game with core features
- Clear roadmap for full release
- Active development status
- Communication with community
- Expected timeline to full release

### Store Page for Early Access
- "Early Access" badge
- Description of current state
- Roadmap of planned features
- Known issues and limitations
- Feedback process

## Update Management

### Update Types
| Type | Frequency | Content |
|------|-----------|---------|
| Hotfix | Days | Critical bug fixes |
| Patch | Weeks | Bug fixes, small features |
| Content Update | Months | New content, features |
| Major Update | Quarters | Large features, overhauls |
| Expansion | >1 year | Major DLC content |

### Patch Notes
```markdown
## Version 1.2.3
### New Features
- Added new weapon type: Plasma Rifle
- New enemy variant: Fire Elemental

### Bug Fixes
- Fixed crash when loading save file with corrupted data
- Fixed audio desync in boss cutscene
- Fixed achievement not triggering on first kill

### Balance Changes
- Reduced shotgun spread from 15 to 12 degrees
- Increased health pickup from 25 to 30 HP
```

## Community Features

### Steam Community
```gdscript
# Open community hub
Steam.activateGameOverlay("community")

# Create screenshot
Steam.triggerScreenshot()

# Workshop item (if applicable)
Steam.createItem(app_id, Steam.WORKSHOP_FILE_TYPE_MANUAL)
Steam.submitItemUpdate(handle, "Update notes")
```

### Forums and Discussions
- Monitor community forums daily
- Designate community managers
- Create pinned FAQ and known issues
- Collect and categorize feedback
- Regular developer updates

## Pricing

### Regional Pricing
| Region | Suggested % of USD |
|--------|-------------------|
| North America | 100% |
| Europe | 80-100% |
| UK | 80-90% |
| Australia | 90-100% |
| Japan | 85-95% |
| Latin America | 40-60% |
| Russia/CIS | 30-50% |
| Southeast Asia | 40-60% |
| India | 25-40% |
| Turkey | 20-35% |
