# OBS-Expert Snippets

## Snippet 1: NVENC Encoder Settings for Twitch

**Description:** Optimal NVENC encoder configuration for Twitch streaming.

```
Settings > Output > Streaming:
Encoder: NVIDIA NVENC H.264
Rate Control: CBR
Bitrate: 6000 Kbps
Preset: P5: Slow (quality)
Profile: High
Look-ahead: Enabled
Psycho Visual Tuning: Enabled
GPU: 0
Max B-frames: 2
Keyframe Interval: 2 seconds (auto)
```

**When to use:** For Twitch streaming with NVIDIA GPU maximizing quality within Twitch's 6000 Kbps bitrate limit.

---

## Snippet 2: Microphone Noise Gate Settings

**Description:** Effective noise gate configuration for vocal microphone.

```
Filter: Noise Gate
- Close Threshold: -32 dB
- Open Threshold: -26 dB
- Attack: 25 ms
- Hold: 100 ms
- Release: 150 ms
```

**When to use:** On any microphone source to prevent ambient noise from being transmitted when not speaking.

---

## Snippet 3: Recording CQP Quality Levels

**Description:** CQP quality settings for different recording use cases.

```
CQP 16-18: Archival master quality (large file size)
CQP 18-20: High quality for post-production
CQP 20-23: Good quality for general use (recommended)
CQP 23-28: Smaller files for quick sharing
CQP 28-32: Maximum compression, noticeable quality loss

Rate Control: CQP
Encoder: NVIDIA NVENC H.264
Preset: P6 (slowest, highest quality)
```

**When to use:** CQP 18 for YouTube edits, CQP 23 for daily recording, CQP 28 for long sessions with limited storage.

---

## Snippet 4: Multi-Track Audio Mapping

**Description:** Configure 4-track audio for post-production flexibility.

```
Settings > Output > Recording:
Track 1: Desktop Audio + Mic/Aux (stream mix)
Track 2: Mic/Aux only
Track 3: Desktop Audio only (game + system)
Track 4: Music only (or second mic)

Settings > Audio > Advanced Audio Properties:
- Desktop Audio: Track 1, 3
- Mic/Aux: Track 1, 2
- Music: Track 4
- Game Audio: Track 3 (if separate)
```

**When to use:** When recording content that will be edited in post-production with separate audio control.

---

## Snippet 5: StreamFX Color Correction Filter

**Description:** Apply color correction to webcam using StreamFX filter.

```
Add Filter: StreamFX Color Correction
- Exposure: 0.0 EV
- Contrast: 1.05
- Saturation: 1.10
- Temperature: 5500K (adjust for room lighting)
- Tint: 0
- Highlights: 0.95
- Shadows: 1.05
- Whites: 0.90
- Blacks: 1.10
- Sharpness: 0.3
```

**When to use:** To match webcam color temperature with studio lighting or to create a specific look.

---

## Snippet 6: Browser Source for Twitch Chat

**Description:** Embed Twitch chat overlay in OBS.

```
Source: Browser

URL: https://www.twitch.tv/embed/{{channel}}/chat
Width: 400
Height: 600
Custom CSS:
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
  * { font-family: 'Inter', sans-serif !important; }
  .chat-line__message { font-size: 14px; background: rgba(0,0,0,0.5); }
  .chat-line__username { font-weight: 600; }
  .tw-border-t { border-color: transparent; }
```

**When to use:** To display Twitch chat on stream overlay for viewer interaction visibility.

---

## Snippet 7: Replay Buffer Setup

**Description:** Configure replay buffer for instant highlight capture.

```
Settings > Advanced > Replay Buffer:
- Enable Replay Buffer: Yes
- Maximum Replay Time: 60 seconds
- Maximum Memory: 1000 MB

Hotkey: Ctrl+Shift+R (save replay)
Replay file output: /recordings/replays/

Encoder: Same as recording (NVENC CQP 18)
```

**When to use:** During gameplay streams to save unexpected moments (epic plays, funny reactions) after they happen.

---

## Snippet 8: Performance Stats View

**Description:** Display performance statistics overlay in OBS.

```
View > Stats:
- FPS: Current and average frame rate
- CPU Usage: Encoding and rendering CPU load
- Dropped Frames: Network-related frame loss
- Render Lag: GPU rendering missed frames
- Encoding Lag: Encoder missed frames
- Frame Time: Time to render each frame

Dock this panel for real-time monitoring during stream.
```

**When to use:** During stream to monitor performance issues and identify bottlenecks.

---

## Snippet 9: Scene Collection Backup

**Description:** Manual backup of scene collections and profiles.

```
Export:
1. Scene Collections:
   Path: %appdata%\obs-studio\basic\scenes\
   Copy entire folder to backup location
2. Profiles:
   Path: %appdata%\obs-studio\basic\profiles\
   Copy entire folder to backup location
3. Plugins:
   Path: %appdata%\obs-studio\plugins\
   Note plugin versions for reinstallation
```

**When to use:** Before major OBS updates, hardware changes, or scene collection restructuring.

---

## Snippet 10: NDI Source Configuration

**Description:** Add NDI source for remote video input.

```
1. Install OBS-NDI plugin
2. Restart OBS
3. Add new Source > NDI Source
4. Select NDI source from dropdown:
   - Sources on local network auto-discover
   - Also supports OBS NDI output from other instances
5. Configure:
   - Color Space: Rec. 709
   - Color Range: Partial
   - Deinterlacing: Disabled
6. Position and scale within scene as needed
```

**When to use:** When receiving video from another PC (gaming PC, remote guest, second camera operator) over local network.

---

## Snippet 11: VLC Source Playlist

**Description:** Use VLC source for playlist media playback.

```
Source: VLC Video Source
Properties:
- Playlist: Add files/folder
- Looping: Yes
- Shuffle: No
- Subtitle: Embedded
- Enable Hardware Decoding: Yes

Scenes: Use for intermission loops, background videos, or commercial breaks.
```

**When to use:** For looping background video content during breaks, intermissions, or as scene backgrounds.

---

## Snippet 12: Audio Ducking Setup

**Description:** Automatically lower music volume when mic is active.

```
1. Add Compressor filter to Music audio source
2. Compressor Settings:
   - Sidechain: Microphone source
   - Ratio: 5:1
   - Threshold: -30 dB
   - Attack: 10 ms
   - Release: 300 ms
   - Makeup Gain: 0 dB
3. Adjust threshold until music ducks smoothly
```

**When to use:** When playing background music during commentary to automatically lower music when speaking.

---

## Snippet 13: Auto-Configuration Report

**Description:** Run and interpret the auto-configuration wizard.

```
Tools > Auto-Configuration Wizard:
1. Select: "Optimize for streaming" or "Recording only"
2. Enter streaming service (if applicable)
3. Select resolution/FPS target
4. Wizard tests bandwidth and hardware
5. Applies recommended settings

Review output in log:
- Bandwidth: {{measured_bps}} Kbps
- Recommended bitrate: {{recommended_bps}} Kbps
- Encoder: {{selected_encoder}}
- Resolution: {{selected_resolution}}
```

**When to use:** When setting up OBS for the first time or after hardware changes to get baseline settings.

---

## Snippet 14: Stream Announcement Overlay

**Description:** Browser source for custom stream start countdown.

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: transparent; font-family: 'Segoe UI', sans-serif; }
    .container {
      width: 1920px; height: 1080px;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    h1 { font-size: 72px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
    p { font-size: 36px; color: rgba(255,255,255,0.8); }
  </style>
</head>
<body>
  <div class="container">
    <div>
      <h1>{{stream_title}}</h1>
      <p>Starting soon... {{countdown}} minutes</p>
      <p>Follow and subscribe!</p>
    </div>
  </div>
</body>
</html>
```

**When to use:** As a browser source for the Starting Soon scene to build anticipation before stream begins.

---

## Snippet 15: OBS Log Analyzer

**Description:** Check OBS log for issues after test stream.

```
1. File > View Log > Open Log Directory
2. Find recent log file
3. Upload to: https://obsproject.com/tools/analyzer
4. Review analysis report:
   - Warning flags
   - Encoding/rendering lag
   - Dropped frames percentage
   - Audio issues
   - Recommendation adjustments
5. Apply recommended changes and retest

Key metrics:
- Dropped frames: <0.1% = Excellent, <1% = Acceptable, >1% = Action needed
- Render lag: 0% required
- Encoding lag: 0% required
```

**When to use:** When troubleshooting streaming or recording issues to identify root causes.
