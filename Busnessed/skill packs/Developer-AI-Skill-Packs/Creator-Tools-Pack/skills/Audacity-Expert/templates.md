# Audacity-Expert Templates

## Template 1: Vocal Processing Chain

**Description:** Standard effect chain for voice recording cleanup.

```
Name: VocProc_{{purpose}}

Effect Order:
1. High-Pass Filter
   - Frequency: {{hp_freq}} Hz (80-100 for male, 100-120 for female)
   - Rolloff: 48 dB/oct
   - Purpose: Remove rumble and low-frequency noise

2. Noise Reduction
   - Noise Profile: Sampled from {{noise_sample_start}} to {{noise_sample_end}}
   - Noise Reduction (dB): {{nr_db}} (12-24)
   - Sensitivity: {{nr_sensitivity}} (6-12)
   - Frequency Smoothing (Hz): {{nr_smoothing}} (1-3)

3. Equalization
   - Preset: {{eq_preset}} (Voice Presence / Telephone / Custom)
   - OR Custom: Low shelf +150Hz, Presence +3dB at 3kHz, High shelf -3dB at 10kHz

4. Compressor
   - Threshold: {{comp_threshold}} dB (-18 to -24)
   - Ratio: {{comp_ratio}}:1 (2:1 to 4:1)
   - Attack: {{comp_attack}} ms (5-10)
   - Release: {{comp_release}} ms (100-200)
   - Make-up Gain: {{comp_makeup}} dB (0-6)

5. Limiter
   - Threshold: {{limiter_threshold}} dB (-3 to 0)
   - Hold: {{limiter_hold}} ms (0-10)

6. Normalize
   - Peak Amplitude: -{{normalize_target}} dB (1-3)
   - Remove DC Offset: Yes
```

**Usage Notes:** Save as chain for one-click application. Adjust noise reduction dB based on noise level. Compressor ratio 3:1 for most voices.

---

## Template 2: Podcast Episode Assembly

**Description:** Structure for editing a podcast episode.

```
Name: Podcast_{{episode_title}}_{{episode_number}}

Tracks:
1. Host Voice (mono, 44100 Hz)
2. Guest Voice (mono, 44100 Hz) [if applicable]
3. Intro Music (stereo, 44100 Hz)
4. Outro Music (stereo, 44100 Hz)
5. Sound Effects (mono/stereo)

Timeline Structure:
- 00:00 – 00:15: Intro music with voiceover
- 00:15 – 00:45: Host introduction and episode overview
- 00:45 – 25:00: Main content (interview/monologue)
- 25:00 – 27:00: Sponsor ad segment
- 27:00 – 42:00: Main content continued
- 42:00 – 44:00: Outro, call to action, credits
- 44:00 – 44:15: Outro music fade out

Label Track: Chapter markers at key transitions

Processing:
- Host voice: {{host_vocal_chain}}
- Guest voice: {{guest_vocal_chain}}
- Music: Low volume (-25dB) during speech, Auto Duck
```

**Usage Notes:** Use Auto Duck for music ducking under speech. Export MP3 192kbps, mono for spoken word. Add ID3 tags: title, artist, episode, podcast name.

---

## Template 3: Noise Reduction Settings

**Description:** Noise reduction configuration for different noise types.

```
Name: NR_{{noise_type}}

Noise Profile: Sampled from {{sample_duration}} seconds of known noise only

Settings by Noise Type:

1. Hiss (tape hiss, air conditioning)
   - NR dB: {{nr_db}} (12-18)
   - Sensitivity: {{sensitivity}} (6)
   - Smoothing: {{smoothing}} (3)

2. Hum (60Hz electrical, ground loop)
   - NR dB: {{nr_db}} (18-24)
   - Sensitivity: {{sensitivity}} (3-4)
   - Smoothing: {{smoothing}} (1-2)
   - Plus: EQ notch filter at 60Hz and harmonics (120, 180Hz)

3. Broadband (fan, traffic, crowd)
   - NR dB: {{nr_db}} (9-15)
   - Sensitivity: {{sensitivity}} (8-10)
   - Smoothing: {{smoothing}} (5-6)

4. Click/Pop (vinyl, digital errors)
   - Use Click Removal instead:
   - Threshold: {{click_threshold}} (150-300)
   - Max Spike Width: {{spike_width}} ms (5-20)

Post-NR: Check for artifacts, reduce NR dB if "underwater" sound appears
```

**Usage Notes:** Less is more with noise reduction. Start with low dB and increase only if needed. Always preview before applying. Combine with EQ for best results.

---

## Template 4: Export Settings for Various Platforms

**Description:** Export configuration for different distribution platforms.

```
Name: Export_{{platform}}

Master Export (Archival):
- Format: WAV (Microsoft)
- Channels: {{channels}} (Mono for voice, Stereo for music)
- Sample Rate: {{sample_rate}} Hz
- Bit Depth: {{bit_depth}} (24-bit recommended)

Podcast Distribution:
- Format: MP3
- Bit Rate: {{mp3_bitrate}} kbps (192 for voice, 256-320 for music)
- Mode: {{mp3_mode}} (Stereo / Joint Stereo / Mono)
- Quality: {{mp3_quality}} (Standard / High)
- Variable Speed: {{vbr}} (Disabled for predictable file size)

YouTube / Video Platforms:
- Format: WAV (Master), MP3 320kbps (Distribution)
- Sample Rate: 48000 Hz
- Bit Depth: 24-bit

Streaming (Spotify, Apple Music):
- Format: WAV (Master), FLAC (Archive)
- Loudness: -14 LUFS Integrated
- True Peak: -1 dBTP

Social Media (TikTok, Instagram):
- Format: MP3
- Bit Rate: 128-192 kbps
- Loudness: -14 LUFS
```

**Usage Notes:** Keep master WAV at highest quality. Create delivery copies at platform-specific settings. Use loudness normalization for streaming platforms.

---

## Template 5: Multi-Track Mix Template

**Description:** Standard track layout for multi-track mixing.

```
Name: Mix_{{project_name}}

Master Bus Settings:
- Sample Rate: {{sample_rate}} Hz
- Bit Depth: {{bit_depth}} (32-bit float recommended for processing)
- Master Volume: -{{master_level}} dB (leave 3dB headroom)

Track 1: {{track1_name}}
  - Source: {{track1_source}}
  - Volume: {{track1_volume}} dB
  - Pan: {{track1_pan}}
  - Effects: {{track1_effects}}

Track 2: {{track2_name}}
  - Source: {{track2_source}}
  - Volume: {{track2_volume}} dB
  - Pan: {{track2_pan}}
  - Effects: {{track2_effects}}

[Add more tracks as needed]

Export:
- Master: {{master_format}} at {{master_bitrate}}
- Stems: {{stems_export}} (WAV, 24-bit, individual tracks)
```

**Usage Notes:** Keep master level with headroom. Export stems for backup or external mixing. Label all tracks clearly. Use color coding for track types.

---

## Template 6: Label Track for Chapters

**Description:** Create label track for podcast/video chapters.

```
Name: Chapters_{{episode_title}}

Label Track Format:
Time (HH:MM:SS) | Label Text
{{start_time_1}} | {{chapter_title_1}}
{{start_time_2}} | {{chapter_title_2}}
{{start_time_3}} | {{chapter_title_3}}
{{start_time_4}} | {{chapter_title_4}}
{{start_time_5}} | {{chapter_title_5}}

Example:
00:00:00 | Introduction
00:01:30 | Topic 1: Interview with Guest
00:15:00 | Topic 2: Deep Dive Discussion
00:30:00 | Sponsor Break
00:32:00 | Topic 3: Audience Questions
00:45:00 | Final Thoughts + Outro

Export labels:
File > Export > Export Labels... → .txt file
Import labels:
File > Import > Labels... → from .txt file

Usage: Podcast apps use labels for chapter navigation.
YouTube timestamps in description: format as "0:00 Title"
```

**Usage Notes:** Place labels at natural transition points. Keep chapter titles descriptive but concise (under 60 characters). Use consistent formatting.

---

## Template 7: Batch Processing Chain

**Description:** Chain preset for batch processing audio files.

```
Name: Chain_{{purpose}}

Chain Steps:
1. Normalize
   - Peak Amplitude: -1 dB
   - Remove DC Offset: Yes
   - Apply: Entire project

2. High-Pass Filter
   - Frequency: {{hp_freq}} Hz
   - Rolloff: 48 dB/oct
   - Apply: Entire project

3. Equalization
   - Preset: {{eq_preset}} (or custom curve)
   - Apply: Entire project

4. Compressor
   - Threshold: {{threshold}} dB
   - Ratio: {{ratio}}:1
   - Attack: {{attack}} ms
   - Release: {{release}} ms
   - Apply: Entire project

5. Normalize (final)
   - Peak Amplitude: -1 dB
   - Apply: Entire project

6. Export
   - Format: {{export_format}}
   - Options: {{export_options}}
   - Output: Same folder as input / {{custom_path}}
```

**Usage Notes:** Test chain on single file first. Use "Apply Entire Project" for consistency. Export to different folder to preserve originals.

---

## Template 8: Recording Session Setup

**Description:** Configuration for a clean recording session.

```
Name: Record_{{session_name}}_{{date}}

Hardware Setup:
- Input Device: {{input_device}} (audio interface)
- Recording Channels: {{channels}} (1=Mono, 2=Stereo)
- Sample Rate: {{sample_rate}} Hz
- Bit Depth: {{bit_depth}}

Recording Levels:
- Target Peak: -6 dB (minimum)
- Target RMS: -18 dB (average)
- Input Gain: {{gain_setting}}
- Monitor: {{monitor_setting}} (On/Off, Muted during record)

Environment:
- Room: {{room_description}}
- Microphone: {{mic_model}} at {{mic_distance}}cm
- Pop Filter: {{pop_filter}} (Yes/No)
- Acoustic Treatment: {{treatment}} (None/Basic/Professional)

Checklist:
- [ ] Phantom power on (if condenser mic)
- [ ] Headphones connected (not speakers)
- [ ] Background noise sources off (AC, fans, appliances)
- [ ] Mobile phones in airplane mode
- [ ] Record 30 seconds of room tone for noise profile
- [ ] Test recording level with normal speaking voice
```

**Usage Notes:** Always record room tone for noise reduction reference. Keep levels below clipping (never exceed 0 dB). Leave 30 seconds of silence before and after recording for editing handles.
