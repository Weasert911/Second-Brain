# FFmpeg-Creator-Expert Templates

## Template 1: H.264 Encoding for Web

**Description:** Optimized H.264 encoding for web distribution.

```
Name: h264_web_{{preset}}

ffmpeg -i {{input}} \
  -c:v libx264 \
  -crf {{crf}} \
  -preset {{preset}} \
  -tune {{tune}} \
  -profile:v {{profile}} \
  -level {{level}} \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac \
  -b:a {{audio_bitrate}}k \
  {{output}}

Parameters:
- crf: 18-28 (18=high quality, 23=good, 28=smaller)
- preset: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow, placebo
- tune: film, animation, grain, stillimage, fastdecode, zerolatency
- profile: baseline, main, high
- level: 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 5.2
- audio_bitrate: 128-320 (128 for web, 320 for music)
```

**Usage Notes:** Use -movflags +faststart for web playback. Avoid placebo preset — gains are marginal. Profile high with level 4.1 for maximum compatibility.

---

## Template 2: H.265/HEVC Archival Encoding

**Description:** High-efficiency encoding for archival storage.

```
Name: h265_archive_{{quality}}

ffmpeg -i {{input}} \
  -c:v libx265 \
  -crf {{crf}} \
  -preset {{preset}} \
  -x265-params "aq-mode=3:no-sao=1:bframes=8:keyint=250:min-keyint=25" \
  -pix_fmt {{pix_fmt}} \
  -tag:v hvc1 \
  -c:a {{audio_codec}} \
  -b:a {{audio_bitrate}}k \
  {{output}}

Parameters:
- crf: 18-28 for 8-bit, 20-30 for 10-bit
- preset: medium, slow, slower, veryslow
- pix_fmt: yuv420p (8-bit), yuv420p10le (10-bit)
- audio_codec: libfdk_aac, aac, flac, copy
- x265-params: aq-mode=3 (auto-variance), no-sao=1 (disable SAO filter)
```

**Usage Notes:** Use 10-bit (yuv420p10le) for banding-free gradients. CRF 20 for most content. Use -tag:v hvc1 for QuickTime compatibility.

---

## Template 3: Hardware-Accelerated NVENC Encoding

**Description:** NVIDIA NVENC encoding for fast GPU-accelerated transcoding.

```
Name: nvenc_{{preset_name}}

Platform: {{platform}} (Windows, Linux)
GPU: {{gpu_model}} (NVIDIA GTX/RTX series)

REM H.264
ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i {{input}} \
  -c:v h264_nvenc \
  -preset {{preset}} \
  -rc {{rate_control}} \
  -cq {{cq_level}} \
  -b:v {{bitrate}}K \
  -profile:v {{profile}} \
  -spatial_aq {{spatial_aq}} \
  -temporal_aq {{temporal_aq}} \
  -c:a aac \
  -b:a 128k \
  {{output}}

REM H.265 (use hevc_nvenc instead)
-c:v hevc_nvenc

Parameters:
- preset: p1 (fastest) to p7 (slowest/quality)
- rc: constqp, vbr, cbr, cbr_ld, vbr_minqp
- cq: 1-51 (lower = better, 18-25 recommended)
- spatial_aq: 1 (enabled), 0 (disabled) — improves spatial quality
- temporal_aq: 1 (enabled), 0 (disabled) — improves temporal quality
```

**Usage Notes:** NVENC supports up to 8 concurrent sessions on RTX cards. Enable spatial and temporal AQ for quality. Use vbr with cq for VBR quality control.

---

## Template 4: Video Filter Chain

**Description:** Common video filter combinations for processing.

```
Name: filters_{{purpose}}

# Scale to 1080p with aspect ratio preservation
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2"

# Crop center 16:9 from 4:3 source
-vf "crop=iw*9/16:ih"

# Overlay logo in bottom-right corner
-vf "overlay=W-w-10:H-h-10"

# Add text watermark
-vf "drawtext=text='{{watermark_text}}':fontfile={{font_path}}:fontsize=24:fontcolor=white@0.5:x=10:y=10"

# Rotate 90 degrees clockwise
-vf "transpose=1"

# Concatenate two videos
-filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]"

# Stabilize shaky footage
-vf "vidstabdetect=shakiness=5:accuracy=15:result=transforms.trf"
# Then second pass:
-vf "vidstabtransform=input=transforms.trf:zoom=1:smoothing=30"
```

**Usage Notes:** Order filters from input to output. Heavy filters (stabilize, denoise) should be early. Scale after crop to save processing.

---

## Template 5: GIF Creation from Video

**Description:** Create optimized GIF from video clip.

```
Name: gif_{{description}}

# Step 1: Generate color palette
ffmpeg -i {{input}} -ss {{start_time}} -t {{duration}} \
  -vf "fps={{fps}},scale={{width}}:{{height}}:flags=lanczos,palettegen=max_colors=256:stats_mode=full" \
  -y palette.png

# Step 2: Create GIF with palette
ffmpeg -i {{input}} -i palette.png -ss {{start_time}} -t {{duration}} \
  -lavfi "fps={{fps}},scale={{width}}:{{height}}:flags=lanczos [x]; [x][1:v] paletteuse=dither={{dither}}" \
  -y {{output}}.gif

Parameters:
- fps: 10, 15, 20, 30 (10-15 recommended for small files)
- width: {{width}} (480, 640, 800 recommended)
- dither: bayer, ordered, error_diffusion, none
- palette stats_mode: full (best), diff (fast)
```

**Usage Notes:** Keep GIF duration under 10 seconds. Use 10-15 FPS for good quality at reasonable file size. Error diffusion dithering produces best quality.

---

## Template 6: Audio Processing

**Description:** Common audio processing tasks.

```
Name: audio_{{task}}

# Extract audio to MP3
ffmpeg -i {{input}} -vn -c:a libmp3lame -b:a {{bitrate}}k {{output}}.mp3

# Extract audio to WAV
ffmpeg -i {{input}} -vn -c:a pcm_s16le {{output}}.wav

# Adjust volume (2x = +6dB)
ffmpeg -i {{input}} -af "volume={{factor}}" {{output}}

# Normalize audio peak
ffmpeg -i {{input}} -af "loudnorm=I=-14:LRA=7:TP=-2" {{output}}

# Mix two audio files
ffmpeg -i {{audio1}} -i {{audio2}} -filter_complex "amix=inputs=2:duration=longest" {{output}}

# Remove silence
ffmpeg -i {{input}} -af "silenceremove=start_periods=1:start_duration=1:start_threshold=-50dB:stop_periods=1:stop_duration=2:stop_threshold=-50dB" {{output}}

# Speed up audio without pitch change
ffmpeg -i {{input}} -af "atempo={{rate}}" {{output}}
# rate: 0.5 (half speed) to 2.0 (double speed)
```

**Usage Notes:** Always test loudnorm target values. Use atempo for speed changes, not -filter:a "asetrate". Audio normalization before mixing prevents clipping.

---

## Template 7: Subtitle Handling

**Description:** Subtitle processing commands.

```
Name: subtitles_{{task}}

# Burn subtitles into video
ffmpeg -i {{video}} -vf "subtitles={{subtitle_file}}" -c:a copy {{output}}

# Extract subtitles from container
ffmpeg -i {{input}} -map 0:s:{{track}} {{output}}.srt

# Convert SRT to ASS
ffmpeg -i {{input}}.srt {{output}}.ass

# Add soft subtitles to MP4
ffmpeg -i {{video}} -i {{subtitle}}.srt -c copy -c:s mov_text -metadata:s:s:0 language={{lang}} {{output}}.mp4

# Hardcode ASS subtitles with styling
ffmpeg -i {{video}} -vf "ass={{subtitle_file}}" -c:a copy {{output}}

# Extract subtitles from specific language
ffmpeg -i {{input}} -map 0:s:m:language:{{lang}} {{output}}.srt
```

**Usage Notes:** Burn-in for platforms that don't support soft subs. mov_text for MP4, srt for MKV/MP4 compatibility. ASS supports advanced styling (position, font, effects).

---

## Template 8: Streaming (HLS/DASH) Preparation

**Description:** Create adaptive streaming manifests for web delivery.

```
Name: stream_{{resolution_level}}

# HLS with multiple quality levels
ffmpeg -i {{input}} \
  -filter_complex \
    "[0:v]split=3[v1][v2][v3]; \
    [v1]scale=1920:1080[v1out]; \
    [v2]scale=1280:720[v2out]; \
    [v3]scale=854:480[v3out]" \
  -map [v1out] -c:v:0 h264_nvenc -preset p5 -cq 20 -b:v:0 5000k \
  -map [v2out] -c:v:1 h264_nvenc -preset p5 -cq 23 -b:v:1 2500k \
  -map [v3out] -c:v:2 h264_nvenc -preset p5 -cq 26 -b:v:2 1000k \
  -map a:0 -c:a aac -b:a 128k \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  stream_%v.m3u8

# DASH with segment duration
ffmpeg -i {{input}} \
  -map 0:v -map 0:a \
  -c:v libx264 -crf 23 -preset medium -g 48 -keyint_min 48 \
  -c:a aac -b:a 128k \
  -f dash -seg_duration 4 \
  -adaptation_sets "id=0,streams=v id=1,streams=a" \
  manifest.mpd
```

**Usage Notes:** HLS for Apple/iOS compatibility, DASH for Android/web. Match segment duration across variants for seamless switching. Use keyframe-aligned GOP sizes.
