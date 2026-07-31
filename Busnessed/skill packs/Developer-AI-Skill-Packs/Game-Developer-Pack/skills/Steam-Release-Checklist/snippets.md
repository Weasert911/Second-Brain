# Steam Release Checklist - Snippets

## Initialize Steam

```gdscript
Steam.steamInit()
Steam.run_callbacks()
```

## Check Running

```gdscript
if Steam.isSteamRunning():
    print("Steam is running")
```

## Player Info

```gdscript
var id := Steam.getSteamID()
var name := Steam.getPersonaName()
var level := Steam.getPlayerSteamLevel()
```

## Achievement

```gdscript
Steam.setAchievement("ACH_NAME")
Steam.storeStats()
var unlocked := Steam.getAchievement("ACH_NAME")
```

## Leaderboard

```gdscript
var handle := Steam.findOrCreateLeaderboard("HighScore", 1, 0)
Steam.uploadLeaderboardScore(handle, 0, score)
Steam.downloadLeaderboardEntries(handle, 0, 1, 10)
```

## Rich Presence

```gdscript
Steam.setRichPresence("steam_display", "#Status_Playing")
Steam.setRichPresence("steam_player_group", lobby_id)
```

## Overlay

```gdscript
Steam.activateGameOverlay("friends")
Steam.activateGameOverlayToWebPage("https://example.com")
```

## Cloud Save

```gdscript
Steam.isCloudEnabledForApp()
Steam.forceCloudSync()
var quota := Steam.getCloudQuota()
```

## Screenshot

```gdscript
Steam.triggerScreenshot()
```

## DLC

```gdscript
if Steam.isDLCInstalled(dlc_id):
    print("DLC installed")
```
