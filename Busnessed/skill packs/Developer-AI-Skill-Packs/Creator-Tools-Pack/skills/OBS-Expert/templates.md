# OBS-Expert Templates

## Template 1: Scene Collection Template

**Description:** Standard scene collection for gaming streams.

```
Name: GamingScene_{{game_name}}

Scenes:
1. Starting_Soon
   - Sources: Static image (background), Text ({{stream_title}}), Browser ({{alert_service}}), Media ({{intro_video}})
2. {{game_name}}_Fullscreen
   - Sources: Game Capture ({{game_exe}}), Webcam ({{camera_name}}), Browser ({{chat_overlay}}), Browser ({{alert_service}})
3. {{game_name}}_WithCam
   - Sources: Game Capture ({{game_exe}}), Webcam ({{camera_name}}) → Position: {{cam_position}}, Browser ({{chat_overlay}}), Browser ({{alert_service}})
4. BRB
   - Sources: Static image ({{brb_background}}), Text ("Be Right Back!"), Browser ({{alert_service}})
5. Stream_Ending
   - Sources: Static image ({{end_background}}), Text ("Thanks for watching!"), Media ({{outro_video}})

Transitions:
- Stinger: {{stinger_path}} (duration: {{stinger_duration}}ms)
- Cut: Default
- Fade: 200ms

Hotkeys:
- Scene 1-5: Ctrl+1 to Ctrl+5
- Mute Mic: Ctrl+M
- Start/Stop Stream: Ctrl+Shift+B
- Replay Buffer Save: Ctrl+Shift+R
```

**Usage Notes:** Adjust cam position based on game HUD layout. Use same alert service across all scenes for consistent overlay.

---

## Template 2: Audio Filter Chain

**Description:** Optimal audio filter chain for vocal microphone.

```
Name: MicChain_{{mic_name}}

Source: Mic/Aux ({{mic_device}})

Filters (top to bottom):
1. Noise Gate
   - Close Threshold: {{close_threshold}} dB (-32 recommended)
   - Open Threshold: {{open_threshold}} dB (-26 recommended)
   - Attack: {{attack}} ms (25)
   - Release: {{release}} ms (150)
   - Hold: {{hold}} ms (100)
2. Noise Suppression
   - Method: {{suppression_method}} (RNNoise / Speex)
   - Suppression Level: {{suppression_level}} dB (-30)
3. Compressor
   - Ratio: {{ratio}}:1 (4:1)
   - Threshold: {{threshold}} dB (-18)
   - Attack: {{attack}} ms (6)
   - Release: {{release}} ms (60)
   - Output Gain: {{output_gain}} dB (3)
4. Gain
   - Gain: {{gain}} dB (variable, target peak at -6dB)
5. Limiter (optional)
   - Threshold: {{limiter_threshold}} dB (-3)
   - Release: {{release}} ms (10)

Desktop Audio:
- Volume at 80% (background)
- No filters unless noise cancellation needed
```

**Usage Notes:** Apply filter order exactly as shown. Test with speech before streaming. Adjust thresholds based on room noise level.

---

## Template 3: Streaming Encoder Settings

**Description:** Encoder configuration for popular streaming platforms.

```
Name: Stream_{{platform}}_{{quality}}

Settings > Output > Streaming:
Encoder: {{encoder_type}} (NVENC / x264 / AMD / QSV)
Bitrate: {{bitrate}} Kbps
Rate Control: {{rate_control}} (CBR for streaming)
Preset: {{preset}} (P5: Slow for NVENC, Medium for x264)
Profile: {{profile}} (High)
Look-ahead: {{look_ahead}} (Enabled for quality)
Psycho Visual Tuning: {{psycho_tuning}} (Enabled)
GPU: {{gpu}} (0 for main GPU)
Max B-frames: {{b_frames}} (2)

Platform-Specific:
- Twitch: 6000 Kbps, 1080p60, NVENC, Keyframe 2s
- YouTube: 12000 Kbps, 1080p60, NVENC, Keyframe 2s
- Facebook: 8000 Kbps, 1080p30, NVENC, Keyframe 2s
- Custom RTMP: {{custom_kbps}} Kbps, Keyframe {{keyframe_interval}}s

Advanced:
- Color Format: {{color_format}} (NV12 / I420 / P010)
- Color Space: {{color_space}} (Rec.709)
- Color Range: {{color_range}} (Partial)
```

**Usage Notes:** CBR is mandatory for streaming. Test your upload bandwidth before setting bitrate. Reserve 20% overhead for network fluctuations.

---

## Template 4: Recording Settings Template

**Description:** High-quality local recording configuration.

```
Name: Record_{{quality}}_{{purpose}}

Settings > Output > Recording:
Encoder: {{encoder_type}} (NVENC / x264)
Rate Control: {{rate_control}} (CQP / VBR / CBR)
CQP Level: {{cqp_level}} (18 = High, 23 = Default, 28 = Smaller)
Preset: {{preset}} (P5/P6 for NVENC)
Profile: {{profile}} (High)
Max B-frames: {{b_frames}} (2)

Recording Format: {{format}} (MKV / MP4 / MOV / FLV)
Audio Track: {{audio_track}} (1 + additional as needed)
Audio Bitrate: {{audio_bitrate}} (320 Kbps for high quality)

Multi-Track Audio:
- Track 1: {{track1_mix}} (Desktop + Mic)
- Track 2: {{track2_mix}} (Mic only)
- Track 3: {{track3_mix}} (Game audio only)
- Track 4: {{track4_mix}} (Music only)

Remux to MP4: {{remux}} (Auto / Manual / Disabled)
```

**Usage Notes:** CQP 18 for archival quality, CQP 23 for general use. Use MKV for recording (crash-safe). Remux to MP4 after recording for editing compatibility. Separate audio tracks enable post-production flexibility.

---

## Template 5: Browser Source Overlay Configuration

**Description:** Browser source for stream alerts and overlays.

```
Name: Overlay_{{service}}_{{widget}}

URL: {{overlay_url}}
Width: {{width}} (1920)
Height: {{height}} (1080)

Properties:
- Enable Custom Frame Rate: {{custom_fps}} (30)
- Shutdown source when not visible: {{shutdown_invisible}} (Yes for performance)
- Refresh browser when scene becomes active: {{refresh_active}} (No)
- Navigation: {{navigation}} (None)

CSS Override:
{{css_override}}

Common Services:
- Streamlabs: https://streamlabs.com/widget/{slot}
- StreamElements: https://streamelements.com/overlay/{id}
- OBS.live: Integrated plugin
- Twitch Chat: https://www.twitch.tv/embed/{channel}/chat

Examples:
- Alerts widget for follower/donation/sub notifications
- Chat overlay for displaying Twitch chat on stream
- Donation goal progress bar
- Event list showing recent followers/subs
- Stream schedule overlay
```

**Usage Notes:** Set custom frame rate to 30 FPS to reduce CPU load. Shut down sources when not visible to save resources. Use CSS override for branding colors and fonts.

---

## Template 6: Replay Buffer Configuration

**Description:** Replay buffer for instant highlight capture.

```
Name: ReplayBuffer_{{quality}}

Settings > Advanced > Replay Buffer:
Enable Replay Buffer: Yes
Maximum Replay Time: {{max_time}} seconds (30-120 recommended)
Maximum Memory: {{memory_mb}} MB (500-2000)

Encoder Settings (same as recording):
Encoder: {{encoder_type}}
Rate Control: CQP ({{cqp_level}})
Preset: {{preset}}
Audio Track: 1

Save Command: {{save_hotkey}} (default: Ctrl+Shift+R)

Output:
- File Path: {{output_path}}/replays/
- Format: {{format}} (MKV recommended)
- Quality: High (CQP 18)
```

**Usage Notes:** Set max time to 60 seconds for most use cases. Use dedicated encoder settings matching recording quality. Save replays to SSD for fast writes. Hotkey must be unique to avoid conflicts.

---

## Template 7: Studio Mode Multi-Camera Setup

**Description:** Studio mode configuration for multi-camera production.

```
Name: Studio_{{production_name}}

Cameras:
- Camera 1 (Main): {{cam1_device}} → {{cam1_position}}
- Camera 2 (Close-up): {{cam2_device}} → {{cam2_position}}
- Camera 3 (Wide): {{cam3_device}} → {{cam3_position}}

Studio Mode:
- Program: Active live scene
- Preview: Next scene to transition to

Scene Structure:
1. {{scene_name_1}}: {{scene_sources_1}}
2. {{scene_name_2}}: {{scene_sources_2}}
3. {{scene_name_3}}: {{scene_sources_3}}

Transition Override:
- Scene 1→2: {{transition_1_2}} (Stinger / Cut / Fade)
- Scene 2→3: {{transition_2_3}} (Stinger / Cut / Fade)

Audio Follows Video: {{audio_follow}}
```

**Usage Notes:** Use Studio Mode for professional productions where transition timing matters. Assign dedicated operator for scene switching during complex shows. Preview scene allows checking before going live.

---

## Template 8: Performance Tuning Template

**Description:** Optimize OBS performance for specific hardware.

```
Name: Performance_{{hardware_profile}}

Hardware:
- CPU: {{cpu_model}}
- GPU: {{gpu_model}}
- RAM: {{ram_gb}} GB
- Upload: {{upload_mbps}} Mbps

Settings > Advanced > Video:
- Renderer: {{renderer}} (Direct3D 11 / OpenGL)
- Color Format: {{color_format}} (NV12 for performance)
- YUV Color Range: {{color_range}} (Partial)
- SDR White Level: {{sdr_level}}

Settings > Advanced > Audio:
- Sample Rate: {{sample_rate}} (48 kHz)
- Channels: {{channels}} (Stereo)
- Monitoring Device: {{monitor_device}}

Performance Optimizations:
- Process Priority: {{priority}} (High / Above Normal / Normal)
- Enable Browser Source Hardware Acceleration: {{browser_hw_accel}}
- Disable preview when streaming: {{disable_preview}}
- Limit capture FPS: {{limit_fps}}
- Use GPU scaling: {{gpu_scaling}}
```

**Usage Notes:** Use NV12 color format for best performance. Disable preview in settings for additional FPS while streaming. Process priority High can improve stability on busy systems.
