# Audacity-Expert Snippets

## Snippet 1: Noise Reduction Workflow

**Description:** Proper noise reduction technique.

```
1. Select 2-3 seconds of pure noise (no speech/music)
2. Effect > Noise Reduction > Get Noise Profile
3. Select entire track (Ctrl+A)
4. Effect > Noise Reduction (reopens with profile loaded)
5. Settings:
   - Noise Reduction (dB): 12-18 (start low, increase if needed)
   - Sensitivity: 6.00
   - Frequency Smoothing (Hz): 3
6. Preview, adjust, then Apply
7. If "underwater" effect appears, undo and reduce dB
```

**When to use:** On any recording with consistent background noise (hiss, hum, fan, room tone).

---

## Snippet 2: Compressor for Voice

**Description:** Smooth dynamics for vocal recordings.

```
Effect > Compressor:
- Threshold: -18 dB
- Ratio: 3:1
- Attack: 10 ms
- Release: 150 ms
- Make-up Gain: 0 dB (adjust manually after)
- Compress based on: Peaks
- Apply

Then: Effect > Normalize to -1 dB
```

**When to use:** Voice tracks with varying volume levels to ensure consistent loudness.

---

## Snippet 3: High-Pass Filter for Voice

**Description:** Remove low-frequency rumble from voice recordings.

```
Effect > High-Pass Filter:
- Frequency: 80 Hz (male voice)
- OR: 100 Hz (female voice)
- Rolloff: 48 dB/octave
- Apply

Alternatively for aggressive cleanup:
Effect > Equalization: Select "Rumble" preset
```

**When to use:** Removing mic stand bumps, HVAC rumble, wind noise, or proximity effect from voice tracks.

---

## Snippet 4: Create Chain for Batch Processing

**Description:** Set up and run a batch processing chain.

```
1. File > Edit Chains > Add
2. Name: "Podcast_Vocal_Cleanup"
3. Insert Steps in order:
   - Normalize: -1 dB, Remove DC Offset
   - High-Pass Filter: 80 Hz, 48 dB/oct
   - Equalization: Voice Presence preset
   - Compressor: -18 dB, 3:1, 10ms, 150ms
   - Normalize: -1 dB
   - Export as MP3: 192 kbps, Joint Stereo
4. Apply Chain to Files > Select files > Run
```

**When to use:** Processing multiple voice files with identical effect chain for consistent output.

---

## Snippet 5: Auto Duck for Music Under Speech

**Description:** Automatically lower music volume when voice is present.

```
1. Import voice track and music track
2. Select music track
3. Effect > Auto Duck
4. Settings:
   - Ducking Threshold: -30 dB
   - Ducking Amount: -12 dB
   - Ducking Attack: 10 ms
   - Ducking Release: 500 ms
   - Source Track: Voice track
5. Preview and adjust ducking amount as needed
6. Apply
```

**When to use:** Podcast intros, voiceovers with background music, or any mix where music ducks under speech.

---

## Snippet 6: Remove Silence Between Phrases

**Description:** Automatically remove gaps in speech.

```
Effect > Truncate Silence:
- Silence Detection:
  - Minimum Silence Duration: 0.5 seconds
  - Silence Level: -30 dB
- Truncation:
  - Truncate To: 0.3 seconds
  - or Compress: 50% of original

Alternative: Effect > Silence Finder (marks silence)
Then manually delete or compress labeled regions
```

**When to use:** Tightening up podcast episodes or interviews by removing long pauses.

---

## Snippet 7: De-Esser for Sibilance

**Description:** Reduce harsh sibilance (S, Sh, Ch sounds).

```
Effect > Spectral Multi Notch (or use EQ):
1. Select a sibilant section
2. Analyze spectrogram: sibilance appears at 5-8 kHz
3. Effect > Equalization:
   - Create notch at 6-7 kHz
   - Width: 1-2 semitones
   - Depth: -6 to -12 dB
4. OR: Effect > Low-Pass Filter at 8000 Hz (gentle)

Better: Use dedicated De-esser VST plugin
```

**When to use:** Vocal tracks with aggressive sibilance that distorts on playback systems.

---

## Snippet 8: Click Removal for Vinyl/Old Recordings

**Description:** Remove clicks and pops from recordings.

```
Effect > Click Removal:
- Threshold: 200 (lower = more aggressive)
- Max Spike Width: 10 ms
- Clicking: Increased

Preview mode: Listen to isolated clicks only
Adjust threshold until clicks are removed without affecting music

For extreme cases:
- Apply multiple passes with lower threshold
- Use spectral selection for stubborn clicks
```

**When to use:** Restoring vinyl rips, old tape recordings, or any audio with click/pop artifacts.

---

## Snippet 9: Change Pitch Without Speed

**Description:** Adjust pitch without affecting playback speed.

```
Effect > Change Pitch:
- Semitones: {{semitones}} (positive = higher, negative = lower)
- Use high quality: Yes
- Enable FFT: Yes

OR: Effect > Sliding Stretch (for gradual pitch changes)
```

**When to use:** Correcting slightly flat/sharp vocals, creating harmony parts, or adjusting music key.

---

## Snippet 10: Change Tempo Without Pitch

**Description:** Adjust playback speed without changing pitch.

```
Effect > Change Tempo:
- Beats per minute: {{bpm}} (or Percent Change: {{percent}}%)
- Use high quality: Yes

OR: Effect > Sliding Stretch (for gradual tempo changes)
```

**When to use:** Matching audio to video length, adjusting music to specific duration, or slowing speech for clarity.

---

## Snippet 11: Vocal Isolation/Reduction

**Description:** Remove or isolate vocals from mixed audio.

```
Effect > Vocal Reduction and Isolation:
- Action: Isolate Vocals / Remove Vocals / Custom
- Bass: Reduce/Keep (for karaoke)
- Amount: 60-80% (higher = more aggressive)

For better results:
1. Duplicate original track
2. Apply Vocal Isolation to one copy
3. Apply Vocal Removal to other copy
4. Use both for composite

Limitations: Works best on stereo mixes with center-panned vocals
```

**When to use:** Creating karaoke tracks, isolating vocals for remixing, or extracting dialogue from mixed audio.

---

## Snippet 12: Spectrogram View for Precision Editing

**Description:** Use spectrogram for visual frequency-based editing.

```
View > Spectrogram (or Shift+F)
- Shows frequency content over time
- Dark = quiet, Bright = loud at that frequency

Spectral Selection:
1. Switch to Spectrogram view
2. Click and drag to select a frequency range over time
3. Apply effects only to selected frequencies:
   - Delete/Silence: Remove specific noise frequencies
   - Amplify: Boost/reduce specific frequencies
   - EQ with selection: No effect needed, works automatically

Tips:
- Use for removing bird chirps, phone rings, coughs
- Click sounds show as vertical lines
- Hum shows as horizontal lines at 60/120/180Hz
```

**When to use:** Precision removal of specific sounds (coughs, phone rings, birds) without affecting surrounding audio.

---

## Snippet 13: Loudness Normalization for Streaming

**Description:** Normalize to streaming platform loudness standards.

```
Effect > Loudness Normalization:
- Normalize to: -14 LUFS (web/streaming)
  OR -23 LUFS (broadcast/TV)
- Enable True Peak Limiting: Yes
- True Peak Limit: -2 dBTP (web) or -1 dBTP (broadcast)
- Apply

Then verify with:
Analyze > Loudness Analyzer:
- Check Integrated Loudness matches target
- Check Short-term Loudness range
- Check True Peak within limits
```

**When to use:** Final audio preparation for distribution to streaming platforms (YouTube, Spotify, Apple Podcasts).

---

## Snippet 14: Label Track for Chapters

**Description:** Create and export chapter labels.

```
1. Tracks > Add New > Label Track
2. Play audio, press Ctrl+M at each chapter point
3. Type chapter name in label
4. Edit labels: Drag to adjust timing
5. Export: File > Export > Export Labels...
   - Saves as .txt file
6. Import: File > Import > Labels...

Label format in text file:
0.000000	90.000000	Introduction
90.000000	300.000000	Main Topic
300.000000	450.000000	Deep Dive

YouTube format for description:
0:00 Introduction
1:30 Main Topic
5:00 Deep Dive
```

**When to use:** Adding navigation chapters to podcasts, audiobooks, tutorials, or YouTube videos.

---

## Snippet 15: Fade In/Out and Crossfade

**Description:** Apply fades for smooth transitions.

```
Fade In: Effect > Fade In
- Applies to selection start
- Default: linear fade over selection

Fade Out: Effect > Fade Out
- Applies to selection end
- Default: linear fade

Crossfade:
1. Overlap two clips on different tracks
2. Select overlapping region
3. Effect > Crossfade (or Crossfade Out + Crossfade In)
4. Types: Constant Gain (classic), Constant Power (smooth)

Envelope Fade (manual):
1. Select track, click Envelope tool
2. Click on envelope line to add control points
3. Drag points to create custom fade curve
4. Green line = gain envelope

Adjustable Fade (custom):
Effect > Adjustable Fade:
- Start dB: -60 (fade from silence)
- End dB: 0 (fade to full volume)
```

**When to use:** Smooth transitions between clips, music intro/outro, and podcast segment transitions.
