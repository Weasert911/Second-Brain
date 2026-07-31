# Video-Compression-Expert Templates

## Template 1: H.264 Encoding for Web Delivery

**Description:** Standard H.264 encoding for YouTube/Vimeo upload.

```
Name: h264_web_{{target_resolution}}

ffmpeg -i {{input}} \
  -c:v libx264 \
  -crf {{crf}} \
  -preset {{preset}} \
  -tune {{tune}} \
  -profile:v {{profile}} \
  -level {{level}} \
  -pix_fmt yuv420p \
  -vf "scale={{width}}:{{height}}:flags=lanczos" \
  -c:a aac \
  -b:a {{audio_bitrate}}k \
  -movflags +faststart \
  {{output}}

Parameters:
- crf: 18 (high quality) / 20 (good) / 23 (balanced) / 28 (small)
- preset: slow (quality) / medium (balanced) / fast (speed)
- tune: film (live action) / animation (cartoon) / grain (noisy source)
- profile/level: high/4.1 (1080p), high/5.1 (4K), high/5.2 (4K60)
- audio_bitrate: 384 (4K), 192 (1080p), 128 (720p)
```

**Usage Notes:** Start with CRF 18 for high quality. Increase to 20-23 for web delivery. Always use -movflags +faststart for web playback.

---

## Template 2: H.265/HEVC Archival Encoding

**Description:** High-efficiency archival encoding with 10-bit depth.

```
Name: h265_archive_{{quality}}

ffmpeg -i {{input}} \
  -c:v libx265 \
  -crf {{crf}} \
  -preset {{preset}} \
  -pix_fmt yuv420p10le \
  -tag:v hvc1 \
  -x265-params "aq-mode=3:no-sao=1:bframes=8:keyint=250:min-keyint=25" \
  -c:a {{audio_codec}} \
  {{output}}

Parameters:
- crf: 18 (master quality) / 20 (archival) / 24 (efficient)
- preset: slow / slower / veryslow
- audio_codec: flac (lossless archival), aac (practical)
- 10-bit yuv420p10le reduces banding in gradients

Settings explanation:
- aq-mode=3: Auto-variance AQ for better perceptual quality
- no-sao=1: Disable SAO filter (minimal quality gain, faster)
- bframes=8: More efficient compression
```

**Usage Notes:** Use CRF 18 for master archival, CRF 20 for storage-efficient archives. 10-bit essential for material with gradients (sky, shadows, VFX).

---

## Template 3: Hardware NVENC Encoding Presets

**Description:** NVIDIA NVENC encoding for fast GPU-accelerated transcoding.

```
Name: nvenc_{{purpose}}

# H.264 NVENC
ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i {{input}} \
  -vf "scale_cuda={{width}}:{{height}}" \
  -c:v h264_nvenc \
  -preset {{preset}} \
  -rc {{rate_control}} \
  -cq {{cq_level}} \
  -b:v {{bitrate}}K \
  -profile:v {{profile}} \
  -spatial_aq 1 \
  -temporal_aq 1 \
  -rc-lookahead 20 \
  -c:a aac \
  -b:a 128k \
  {{output}}

# H.265 NVENC (-c:v hevc_nvenc instead)

Parameters:
- preset: p1 (fastest) to p7 (slowest/quality)
- rc: constqp (quality), vbr (efficient), cbr (streaming), vbr_hq
- cq: 18-25 for H.264, 20-28 for H.265 (lower = better)
- spatial_aq + temporal_aq: 1 = enabled (improves perceived quality)
```

**Usage Notes:** NVENC P6/P7 for best quality. Enable spatial and temporal AQ. Use -hwaccel cuda for GPU decode + encode pipeline.

---

## Template 4: VP9 Encoding for Web

**Description:** VP9 encoding for YouTube or web delivery.

```
Name: vp9_web_{{resolution}}

ffmpeg -i {{input}} \
  -c:v libvpx-vp9 \
  -crf {{crf}} \
  -b:v {{bitrate}}K \
  -cpu-used {{cpu_used}} \
  -row-mt 1 \
  -tile-columns {{tile_columns}} \
  -frame-parallel 1 \
  -pix_fmt yuv420p \
  -vf "scale={{width}}:{{height}}" \
  -c:a libopus \
  -b:a {{audio_bitrate}}k \
  {{output}}.webm

Parameters:
- crf: 15-35 (lower = better quality, 25 = good starting point)
- cpu-used: 0-5 (0 = best quality, 5 = fastest)
- tile-columns: 0-6 (higher = faster on multi-core)
- Audio: libopus (VP9 container is WebM with Opus audio)

For 2-pass VBR:
ffmpeg -i {{input}} -c:v libvpx-vp9 -b:v 0 -crf 25 -pass 1 -an -f null /dev/null && \
ffmpeg -i {{input}} -c:v libvpx-vp9 -b:v 0 -crf 25 -pass 2 -c:a libopus -b:a 128k output.webm
```

**Usage Notes:** VP9 offers 30-50% better compression than H.264. Use 2-pass for optimal quality. YouTube prefers VP9 uploads for better compression.

---

## Template 5: Bitrate Calculator

**Description:** Estimate file size from encoding parameters.

```
Formula: File Size (MB) = Duration (seconds) × Bitrate (Mbps) / 8

Example:
- Duration: {{duration_min}} min ({{duration_sec}} seconds)
- Video Bitrate: {{video_bitrate}} Mbps
- Audio Bitrate: {{audio_bitrate}} Kbps ({{audio_bitrate_mbps}} Mbps)
- Total Bitrate: {{total_bitrate}} Mbps
- File Size: {{file_size_mb}} MB

Quick Reference:
| Duration | 5 Mbps | 10 Mbps | 20 Mbps | 50 Mbps |
|----------|--------|---------|---------|---------|
| 1 min    | 37 MB  | 75 MB   | 150 MB  | 375 MB  |
| 10 min   | 375 MB | 750 MB  | 1.5 GB  | 3.75 GB |
| 60 min   | 2.2 GB | 4.4 GB  | 8.8 GB  | 22 GB   |

Bitrate by Platform:
- Twitch 1080p60: CBR 6 Mbps → ~2.7 GB/hour
- YouTube 4K: CRF 18 → ~8-15 Mbps avg → ~4-7 GB/hour
- YouTube 1080p: CRF 20 → ~4-8 Mbps avg → ~2-4 GB/hour
```

**Usage Notes:** Add 10% overhead for container and muxing overhead. CRF encoding varies bitrate by scene complexity. Use calculator before encoding to ensure file size fits storage/delivery constraints.

---

## Template 6: Chroma Subsampling Selection

**Description:** Choose correct chroma subsampling for content type.

```
Name: Chroma_{{content_type}}

Delivery (maximum compatibility):
- pix_fmt: yuv420p (8-bit) or yuv420p10le (10-bit)
- Use for: YouTube, streaming, broadcast, web
- Chroma: 4:2:0 (half color resolution)

Intermediate / Post-production:
- pix_fmt: yuv422p (8-bit) or yuv422p10le (10-bit)
- Use for: Editing proxies, color grading intermediate
- Chroma: 4:2:2 (full horizontal color resolution)

Master / Archival (maximum quality):
- pix_fmt: yuv444p (8-bit) or yuv444p10le (10-bit) or yuv444p12le (12-bit)
- Use for: Film master, VFX plates, screen recording
- Chroma: 4:4:4 (full color resolution)

Conversion: Always use progressive (p) not interlaced (i)

FFmpeg examples:
# 4:2:0 (delivery)
-pix_fmt yuv420p

# 4:2:2 (intermediate)
-pix_fmt yuv422p

# 4:4:4 (master)
-pix_fmt yuv444p
```

**Usage Notes:** 4:2:0 is sufficient for delivery. 4:2:2 for color grading. 4:4:4 only for screen recordings with text. Higher subsampling increases file size by ~30-50%.

---

## Template 7: HDR Encoding Setup

**Description:** HDR10 and HLG encoding parameters.

```
Name: hdr_{{standard}}

HDR10 (PQ, ST.2084):
ffmpeg -i {{input}} \
  -c:v libx265 -crf 18 -preset slow \
  -pix_fmt yuv420p10le -tag:v hvc1 \
  -x265-params "colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc: \
    master-display=G(13250,34500)B(7500,3000)R(34000,16000)WP(15635,16450)L(10000000,1): \
    max-cll={{max_content_light_level}},{{max_frame_average_light_level}}" \
  -c:a aac -b:a 384k \
  {{output}}.mp4

HLG (Hybrid Log-Gamma):
ffmpeg -i {{input}} \
  -c:v libx265 -crf 18 -preset slow \
  -pix_fmt yuv420p10le -tag:v hvc1 \
  -x265-params "colorprim=bt2020:transfer=arib-std-b67:colormatrix=bt2020nc" \
  -c:a aac -b:a 384k \
  {{output}}.mp4

Parameters:
- master-display: Display primaries and white point (in GBR order)
- max-cll: Max Content Light Level, Max Frame Average Light Level (in nits)
- colorprim: bt2020 (required for HDR)
- transfer: smpte2084 (PQ) or arib-std-b67 (HLG)
```

**Usage Notes:** HDR requires compatible displays and players. HDR10 is most common format. HLG for broadcast. Use 10-bit minimum (10-bit is mandatory for HDR).

---

## Template 8: Quality Metrics Validation

**Description:** Validate encoding quality using objective metrics.

```
Name: QC_{{source}}_vs_{{encode}}

# VMAF (recommended, perceptual)
ffmpeg -i {{reference}} -i {{distorted}} -filter_complex \
  "libvmaf=model_path=vmaf_v0.6.1.json:n_threads=12:log_path=quality_log.json:log_fmt=json" \
  -f null -

# SSIM (structural similarity)
ffmpeg -i {{reference}} -i {{distorted}} -filter_complex "ssim" -f null -

# PSNR (peak signal-to-noise ratio)
ffmpeg -i {{reference}} -i {{distorted}} -filter_complex "psnr" -f null -

Interpretation:
| Metric | Excellent | Good | Acceptable | Poor |
|--------|-----------|------|------------|------|
| VMAF   | 95-100    | 90-95| 80-90      | <80  |
| SSIM   | 0.98-1.0  | 0.95-0.98 | 0.90-0.95 | <0.90 |
| PSNR   | 45+ dB    | 40-45| 35-40      | <35  |
```

**Usage Notes:** VMAF best correlates with human perception. Compare same-resolution frames. Encode must match source resolution for valid comparison. Use reference as uncompressed source if available.
