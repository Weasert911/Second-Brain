# DaVinci-Resolve-Expert Snippets

## Snippet 1: Create a New Color Managed Project

**Description:** Project settings for ACES color managed workflow.

```
Project Settings > Color Management:
- Color Processing Mode: ACEScct
- ACES Version: 1.3
- Input Color Space: Use timeline
- Timeline Color Space: ACEScct
- Output Color Space: Rec.709
- Lookup LUT: None
- SDR Preview: Disabled
```

**When to use:** When starting projects with log footage from ARRI, RED, or Sony cameras requiring standardized color pipeline.

---

## Snippet 2: Primary Grade Node Setup

**Description:** Three-node serial grade structure for primary correction.

```
Node 1: Lift wheels — set black point
  Lift: R 0.95 G 0.97 B 1.00 (slight blue in shadows)
Node 2: Gamma wheels — adjust midtones
  Gamma: R 1.02 G 1.00 B 0.98 (slight warmth)
Node 3: Gain wheels — set white point
  Gain: R 0.98 G 1.00 B 1.02 (slight cool in highlights)
```

**When to use:** Standard approach for balancing exposure and color cast in any clip.

---

## Snippet 3: Apply PowerGrade to All Clips

**Description:** Copy grade from one clip to all timeline clips.

```
1. Select source clip with desired grade
2. Ctrl+C to copy grade
3. Select all target clips (Ctrl+A in timeline)
4. Ctrl+Shift+V to paste grade
5. Verdict: Adjust Lift/Gamma/Gain per clip for continuity
```

**When to use:** When establishing a consistent look across an entire timeline or scene.

---

## Snippet 4: Fairlight Sidechain Compression

**Description:** Duck music under dialogue using sidechain compression.

```
1. Route Dialogue track to Bus 1
2. Route Music track to Bus 2
3. On Music Bus, add Compressor effect
4. Compressor Settings:
   - Sidechain: Bus 1 (Dialogue)
   - Ratio: 4:1
   - Threshold: -20 dB
   - Attack: 5 ms
   - Release: 200 ms
   - Makeup: 2 dB
5. Adjust threshold until music ducks naturally with speech
```

**When to use:** In any video with background music and spoken dialogue to ensure voice clarity.

---

## Snippet 5: Fusion Merge Node Setup

**Description:** Basic merge node composite for title overlay.

```
1. MediaIn (Background footage)
2. Text+ node → Text: "Lower Third Title"
   - Font: Arial Bold, Size: 48, Color: White
   - Stroke: 1px black, Softness: 0.5
3. Rectangle Mask → Width: 0.5, Height: 0.08
4. Merge (Mask → Background) with Multiply blend
5. Merge (Text → Background Mask) with Normal blend
6. MediaOut
```

**When to use:** When creating custom lower thirds or text overlays without importing external graphics.

---

## Snippet 6: Temporal Noise Reduction

**Description:** Reduce noise in underexposed or high-ISO footage.

```
Color Page > Motion Effects:
- Temporal NR:
  - Frames: 2
  - Threshold: 20
  - Motion Estimation: Better
- Spatial NR:
  - Mode: Better
  - Radius: 4
  - Threshold: 10
- Luma Mix: 100
- Chroma Mix: 100
```

**When to use:** On low-light footage or high-ISO recordings to reduce grain while preserving detail.

---

## Snippet 7: Export YouTube 4K Preset

**Description:** Delivery preset optimized for YouTube 4K upload.

```
Deliver Page:
- Format: MP4
- Codec: H.264
- Resolution: 3840 x 2160
- Frame Rate: Same as project
- Quality: Restrict to 50000 Kbps
- Encode Profile: Auto
- Key Frames: Auto
- Audio Codec: AAC
- Audio Bitrate: 320 Kbps
- Advanced: Force Debayer (if applicable)
```

**When to use:** For final YouTube uploads balancing quality and file size.

---

## Snippet 8: Curves for Film Emulation

**Description:** S-curve adjustment for film contrast rolloff.

```
Curves Node:
- Shadows: Drop by 0.05 (crush slightly)
- Lift: Maintain
- Midtones: Boost contrast (steeper angle)
- Shoulder: Roll off (reduce slope)
- Highlights: Drop by 0.05 (soft clip)

RGB Curves:
- Red: Slight S-curve for organic look
- Green: Near-linear with slight mid boost
- Blue: Reduce lift, reduce gain (film fade)
```

**When to use:** When emulating film stock characteristics in digital footage.

---

## Snippet 9: Create Optimized Media

**Description:** Generate optimized media for smooth timeline playback.

```
1. Media Pool: Select all clips
2. Right-click > Generate Optimized Media
3. Project Settings > Master Settings > Optimized Media:
   - Resolution: Half (for 4K → 1080p proxy)
   - Format: DNxHR LB
4. Wait for background generation to complete
5. Playback > Use Optimized Media: Auto
```

**When to use:** When editing high-resolution footage (4K, 6K, 8K) on systems without real-time playback capability.

---

## Snippet 10: Keyboard Shortcut Presets

**Description:** Essential keyboard shortcuts for speed editing.

```
Edit Page:
- Ctrl+I / O: Set In/Out point
- F9: Ripple overwrite
- F10: Overwrite
- F11: Insert
- F12: Replace
- Shift+F12: Fit to Fill
- [ ]: Trim start/end one frame
- Shift+[ ]: Trim 10 frames
Color Page:
- H: Highlight (luma) mode
- Alt+S: Show/hide nodes
- Alt+W: Show/hide wavefrom
- Ctrl+D: Dynamic mode for wheels
```

**When to use:** Learning these shortcuts cuts editing time by 40-60% compared to mouse-only workflow.

---

## Snippet 11: Project Backup Script

**Description:** Manual project backup procedure.

```
1. File > Project Manager
2. Right-click project > Backup
3. Options:
   - Backup all: Yes
   - Include media: No (only for small projects)
   - Destination: /backups/Resolve/Projects/
4. Repeat when:
   - Before major color changes
   - After rough cut completion
   - After picture lock
   - Before final render
```

**When to use:** Regular intervals during post-production to prevent data loss.

---

## Snippet 12: Audio Metering Settings

**Description:** Configure audio meters for broadcast loudness.

```
Fairlight > Meter Settings:
- Scale: Digital (dBFS)
- Reference Level: -18 dBFS = 0 VU
- Loudness Standard: ITU-R BS.1770-4
- Target Level: -14 LUFS (web), -23 LUFS (broadcast)
- Tolerance: ±0.5 LU
- True Peak Limit: -2 dBTP (web), -1 dBTP (broadcast)
```

**When to use:** Before final audio mix to ensure loudness compliance with platform specifications.

---

## Snippet 13: Render Cache Strategy

**Description:** Configure render cache for optimal performance.

```
Playback > Render Cache:
- Mode: User (cache selected or marked clips)
- Cache Color Output: Enabled (for color page)
- Cache Fusion Output: Enabled (for Fusion page)
- Maximum Cache Size: 50 GB
- Location: Same as project files or fast SSD

Cache Only:
- Clips with effects
- Color-graded clips
- Fusion composites
- Speed changes/retimed clips
```

**When to use:** To maintain real-time playback on complex timelines with effects, grades, and composites.

---

## Snippet 14: Export with Subtitles Burn-In

**Description:** Export video with subtitles embedded into frame.

```
Deliver Page:
- Subtitle Settings:
  - Export Subtitles: Burn Into Video
  - Subtitle Source: Timeline subtitles
  - Font: Arial
  - Size: 24
  - Position: Bottom center
  - Color: White with 0.5 opacity black outline
  - Background: None

OR: Export separate SRT:
  - Export Subtitles: Separate File
  - Format: SRT
```

**When to use:** When delivering for platforms that do not support separate subtitle files or for accessibility compliance.

---

## Snippet 15: Collaborative Workflow Setup

**Description:** Configure project for multi-editor collaboration.

```
1. File > Project Manager > Right-click > Enable Collaborative
2. Set up Resolve database on server (PostgreSQL)
3. All editors connect to same database
4. Assign timeline segments to specific users:
   - User 1: Scenes 1-3 (locked to others)
   - User 2: Scenes 4-6 (locked to others)
5. Use bins for shared media access
6. Chat via Project > Collaboration > Chat
7. Changes sync in real-time
```

**When to use:** In post-production houses or teams where multiple editors work on the same project simultaneously.
