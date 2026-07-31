# DaVinci-Resolve-Expert Templates

## Template 1: Node Tree Structure for Color Grading

**Description:** Standard node tree layout for professional color grading.

```
Name: NodeTree_{{look_name}}

Structure:
Node 1 (Pre-Grade): Input Color Space Transform (CST)
  → Input: {{input_color_space}}
  → Output: {{working_color_space}}
Node 2 (Noise Reduction): Temporal and spatial noise reduction
  → Temporal Threshold: {{temporal_threshold}}
  → Spatial Threshold: {{spatial_threshold}}
Node 3 (Primary): Lift/Gamma/Gain adjustments
  → Lift: {{lift_rgb}}
  → Gamma: {{gamma_rgb}}
  → Gain: {{gain_rgb}}
Node 4 (Secondary): Qualifier or Window-based correction
  → Qualifier: {{target_color}}
  → Window: {{window_shape}}
Node 5 (Look): Creative grade with curves or LUT
  → LUT: {{creative_lut}}
  → Curve: {{curve_adjustments}}
Node 6 (Output CST): Output Color Space Transform
  → Input: {{working_color_space}}
  → Output: {{output_color_space}}
Node 7 (Final): Film grain, sharpening, or vignette
```

**Usage Notes:** Parallel mix nodes where appropriate. Label each node descriptively. Use node colors (right-click) for visual organization.

---

## Template 2: Fairlight Audio Bus Setup

**Description:** Professional audio routing with buses and sends.

```
Name: FairlightMix_{{project_name}}

Track Routing:
1. Dialogue Track → Bus 1 (Dialogue Bus)
   → EQ: {{dialogue_eq}} (presence boost at 2-4 kHz)
   → Compressor: {{dialogue_compression}} (ratio 3:1)
   → Noise Gate: {{noise_gate_threshold}}
2. Music Track → Bus 2 (Music Bus)
   → EQ: {{music_eq}} (low-pass at 12 kHz)
   → Sidechain: Compressor listening to Dialogue Bus
3. SFX Track → Bus 3 (SFX Bus)
   → Reverb Send: {{reverb_amount}}
   → EQ: {{sfx_eq}}
4. Master Bus
   → Multiband Compressor: {{master_compression}}
   → Limiter: {{limiter_threshold}} dB
   → Loudness Meter: Target {{loudness_target}} LUFS

Settings:
- Sample Rate: {{sample_rate}} Hz
- Bit Depth: {{bit_depth}}
- Buffer Size: {{buffer_size}} samples
```

**Usage Notes:** Route all tracks through buses for centralized processing. Use pre-fader sends for reverb. Apply limiter on master bus as final protection.

---

## Template 3: Delivery Preset Configuration

**Description:** Export preset for common delivery platforms.

```
Name: Deliver_{{platform}}_{{resolution}}

Format: {{container_format}} (QuickTime / MXF / MP4)
Codec: {{video_codec}} (H.264 / H.265 / ProRes / DNxHR)
Resolution: {{width}} x {{height}}
Frame Rate: {{frame_rate}}
Bit Rate: {{bitrate}} Mbps (VBR / CBR)

Audio:
- Codec: {{audio_codec}} (PCM / AAC)
- Channels: {{audio_channels}} (Stereo / 5.1 / Mono)
- Sample Rate: {{sample_rate}} Hz
- Bit Depth: {{bit_depth}}

Advanced:
- Keyframe Interval: {{keyframe_interval}}
- Profile: {{encoding_profile}} (Main / High / Auto)
- Use Optimized Media: {{use_optimized}}
- Export Video: {{export_video}}
- Export Audio: {{export_audio}}
```

**Usage Notes:** YouTube: H.264, 4K, 50 Mbps VBR. Broadcast: ProRes 422 HQ. Cinema: ProRes 4444 or DPX sequence. Social: H.265, 1080p, 15 Mbps.

---

## Template 4: Fusion Lower Third Title

**Description:** Animated lower third title template.

```
Name: LowerThird_{{title_name}}

Fusion Node Tree:
1. Background node → Color: {{background_color}}, Opacity: {{background_opacity}}
2. Rectangle Mask → Size: {{mask_width}} x {{mask_height}}, Soft Edge: {{softness}}
3. Merge nodes (Mask over Background)
4. Text+ node → Text: {{title_text}}, Font: {{font_name}}, Size: {{font_size}}
5. Transform node → Animate Y position from {{start_y}} to {{end_y}}
6. Merge (Text over Background)
7. MediaOut node

Timeline:
- Frame 0-10: Animate in (slide from top)
- Frame 10-{{duration}}: Hold
- Frame {{duration}}-{{duration}}+10: Animate out (fade)

Settings:
- Background: Solid color or gradient
- Text styling: Bold, light stroke, drop shadow
- Animation: Ease in/out (smooth curve)
```

**Usage Notes:** Save as Fusion Template (.setting) for reuse. Adjust animation timing based on VO duration. Keep text readable at 1080p.

---

## Template 5: Color Space Transform Setup

**Description:** CST configuration for common camera formats.

```
Name: CST_{{source_camera}}_to_{{target_space}}

Input CST (Node 1):
- Input Color Space: {{input_color_space}} (ARRI LogC / S-Log3 / V-Log / RED Log3G10 / BMD Film)
- Input Gamma: {{input_gamma}}
- Output Color Space: {{working_color_space}} (DaVinci Wide Gamut / ACEScct)
- Output Gamma: {{working_gamma}}

Output CST (Last Node):
- Input Color Space: {{working_color_space}}
- Input Gamma: {{working_gamma}}
- Output Color Space: {{output_color_space}} (Rec.709 / Rec.2020 / DCI-P3)
- Output Gamma: {{output_gamma}}

Tone Mapping:
- Method: {{tone_map_method}} (None / Luminance Mapping / Reinhard)
- Highlight Rolloff: {{rolloff}} (0.0 = none, 1.0 = maximum)
- Saturation Compression: {{sat_compression}}
```

**Usage Notes:** Match input CST to camera metadata. Test output CST on calibrated monitor. DaVinci Wide Gamut as intermediate preserves maximum color information.

---

## Template 6: Multi-Cam Sync Setup

**Description:** Configuration for multi-camera synchronization.

```
Name: MultiCam_{{project_name}}_{{take}}

Sources:
- Camera A: {{camera_a_clip}} (timecode: {{tc_a}})
- Camera B: {{camera_b_clip}} (timecode: {{tc_b}})
- Camera C: {{camera_c_clip}} (timecode: {{tc_c}})
- Audio: {{audio_clip}} (timecode: {{tc_audio}})

Sync Method: {{sync_method}} (Timecode / Audio / In/Out Point)
Angle Names: {{angle_names}}

Timeline:
- Resolution: {{timeline_resolution}}
- Frame Rate: {{frame_rate}}
- Starting Timecode: {{start_tc}}

Settings:
- Audio Sync: {{audio_sync}} (Waveform alignment)
- Multi-Cam Source: Created in Media Pool
- Angle Toggle: Keys 1-9 for camera switching
```

**Usage Notes:** Timecode sync is most reliable. For non-timecode sources, use audio waveform sync. Add handles for trimmed angles.

---

## Template 7: Adjustment Layer Effects

**Description:** Adjustment layer for global effects across timeline.

```
Name: AdjLayer_{{effect_name}}

Structure:
1. Create adjustment layer clip (Effects Library > Toolbox > Adjustment Layer)
2. Place over targeted timeline section
3. Apply effects to adjustment layer:

Effects to Apply:
- {{effect_1}}: {{effect_1_params}}
- {{effect_2}}: {{effect_2_params}}
- {{effect_3}}: {{effect_3_params}}

Common Uses:
- Global color grade across multiple clips
- Film grain overlay
- Letterbox/cinematic bars
- Vignette or edge darkening
- Blur transition between scenes

Duration: {{start_frame}} to {{end_frame}}
Blend Mode: {{blend_mode}} (Normal / Overlay / Soft Light)
Opacity: {{opacity}}%
```

**Usage Notes:** Adjustment layers affect all clips underneath. Use multiple tracks for different effect layers. Render cache adjustment layers for real-time playback.

---

## Template 8: Project Archive Settings

**Description:** Complete project archive including media, LUTs, and PowerGrades.

```
Name: Archive_{{project_name}}_v{{version}}

Export Path: {{archive_path}}/{{project_name}}_v{{version}}/

Include:
- Project File (.drp): Yes
- Media: {{include_media}} (Copy All / Optimized Only / None)
- Render Cache: {{include_cache}}
- LUTs: {{include_luts}}
- PowerGrades: {{include_powergrades}}
- Fusion Templates: {{include_fusion_templates}}
- Still Frames: {{include_stills}}

Archive Notes:
- {{archive_notes}}

File Manager → Project Manager:
- Right-click project → Archive
- Select destination and options
- Verify archive integrity after creation
```

**Usage Notes:** Archive after project delivery for long-term storage. Include media only if re-grading or re-editing is expected. Store LUTs separately for cross-project use.
