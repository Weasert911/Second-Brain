# Video-Compression-Expert Snippets

## Snippet 1: Analyze Source Media

**Description:** Get complete stream info from source file.

```bash
ffprobe -v error -show_entries stream=index,codec_name,codec_type,width,height,bit_rate,pix_fmt -of default=noprint_wrappers=1:nokey=1 input.mkv
```

**When to use:** Before encoding to determine source properties and plan encoding strategy.

---

## Snippet 2: CRF Value Quick Reference

**Description:** CRF value recommendations per codec and use case.

```
H.264 (x264): 18 = master, 21 = high quality, 23 = good, 26 = web, 28 = mobile
H.265 (x265): 20 = master, 23 = high quality, 25 = good, 28 = web, 30 = mobile
VP9: 25 = master, 30 = good, 35 = web
AV1: 30 = master, 35 = good, 40 = web
NVENC: 18 = high quality, 22 = good, 26 = web

Note: CRF values are NOT comparable between codecs
H.265 at CRF 20 ≈ H.264 at CRF 17 (same quality, ~40% smaller)
```

**When to use:** Starting point for CRF selection — adjust based on content complexity and source quality.

---

## Snippet 3: 2-Pass VBR for Consistent Bitrate

**Description:** Two-pass encoding for target bitrate with optimal quality.

```bash
REM First pass (log analysis, no output)
ffmpeg -i input.mp4 -c:v libx264 -b:v 5000k -preset slow -pass 1 -an -f mp4 NUL

REM Second pass (actual encoding)
ffmpeg -i input.mp4 -c:v libx264 -b:v 5000k -preset slow -pass 2 -c:a aac -b:a 192k -movflags +faststart output.mp4
```

**When to use:** When you need to hit a specific bitrate (e.g., 5 Mbps for streaming) while maintaining optimal quality distribution.

---

## Snippet 4: ProRes for Editing Intermediate

**Description:** Encode to ProRes for video editing workflow.

```bash
ffmpeg -i source.mp4 -c:v prores_ks -profile:v 3 -vendor ap10 -pix_fmt yuv422p10le -c:a pcm_s16le output.mov
```

**When to use:** Creating editing proxies from compressed sources for smoother performance in video editors.

---

## Snippet 5: DNxHD/DNxHR for Avid/DaVinci

**Description:** Avid DNxHD/DNxHR encoding for editing.

```bash
REM DNxHD 1080p (220 Mbps)
ffmpeg -i source.mp4 -c:v dnxhd -profile:v dnxhd_220 -b:v 220M -pix_fmt yuv422p -c:a pcm_s16le output.mov

REM DNxHR HQ (4K)
ffmpeg -i source.mp4 -c:v dnxhd -profile:v dnxhr_hq -pix_fmt yuv422p -c:a pcm_s16le output.mov
```

**When to use:** Creating DaVinci Resolve or Avid Media Composer compatible intermediate files.

---

## Snippet 6: VMAF Quality Score

**Description:** Calculate VMAF score comparing encoded vs source.

```bash
ffmpeg -i original.mkv -i encoded.mp4 -filter_complex "libvmaf=model_path=vmaf_v0.6.1.json:log_path=vmaf_log.json:log_fmt=json" -f null -
```

**When to use:** Objective quality evaluation to validate encoding settings maintain perceptual quality.

---

## Snippet 7: File Size Estimation Formula

**Description:** Estimate file size before encoding.

```python
# Python calculator
duration = 600  # 10 minutes in seconds
video_bitrate = 8000  # Kbps
audio_bitrate = 192   # Kbps
total_bitrate = video_bitrate + audio_bitrate
size_mb = (duration * total_bitrate) / (8 * 1024)
print(f"Estimated size: {size_mb:.1f} MB")
# Output: Estimated size: 600.0 MB
```

**When to use:** Pre-encode planning to ensure output fits delivery or storage constraints.

---

## Snippet 8: Constant Quantization with NVENC

**Description:** NVENC CQP encoding for consistent quality.

```bash
ffmpeg -hwaccel cuda -i input.mkv -c:v h264_nvenc -preset p6 -rc constqp -qp 20 -spatial_aq 1 -temporal_aq 1 -c:a aac -b:a 128k output.mp4
```

**When to use:** Hardware-accelerated encoding with consistent quality (similar to CRF) when quality is priority over file size.

---

## Snippet 9: Batch Encode with PowerShell

**Description:** Batch encode all videos in a folder with same settings.

```powershell
Get-ChildItem -Path "C:\input" -Filter *.mp4 | ForEach-Object {
    $output = "C:\output\" + $_.BaseName + "_compressed.mp4"
    ffmpeg -i $_.FullName -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart $output
}
```

**When to use:** Processing multiple files with identical encoding settings for batch production.

---

## Snippet 10: Audio-Only Encode (Replace)

**Description:** Replace audio track in video with processed version.

```bash
ffmpeg -i video.mp4 -i processed_audio.wav -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 -shortest output.mp4
```

**When to use:** When video is already compressed but audio needs replacement from separately processed source.

---

## Snippet 11: Compare H.264 vs H.265 Size

**Description:** Quick comparison of codec efficiency.

```bash
REM Encode both, compare file sizes
ffmpeg -i source.mkv -c:v libx264 -crf 20 -preset slow -c:a aac h264.mp4
ffmpeg -i source.mkv -c:v libx265 -crf 22 -preset slow -c:a aac -tag:v hvc1 h265.mp4

REM Check sizes and visual quality
ls -la h264.mp4 h265.mp4
# H.265 typically 30-40% smaller than H.264 at similar quality
```

**When to use:** Decision-making between H.264 (compatibility) and H.265 (efficiency) for specific use case.

---

## Snippet 12: Tone Map HDR to SDR

**Description:** Convert HDR content to SDR with proper tone mapping.

```bash
ffmpeg -i hdr_input.mkv -vf "zscale=transfer=linear,tonemap=hable,format=yuv420p,zscale=transfer=bt709" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k sdr_output.mp4
```

**When to use:** Converting HDR10/HLG content to SDR for playback on non-HDR displays.

---

## Snippet 13: Denoise Before Encoding

**Description:** Apply denoising filter to improve compression efficiency.

```bash
ffmpeg -i noisy_source.mp4 -vf "hqdn3d=4:3:6:4" -c:v libx264 -crf 20 -preset slow -c:a copy -movflags +faststart output.mp4
```

**When to use:** Noisy/grainy sources compress poorly — denoising improves compression efficiency and reduces banding.

---

## Snippet 14: Keyframe Interval for Streaming

**Description:** Set keyframe interval for adaptive streaming.

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 20 -preset medium -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 128k -movflags +faststart output.mp4

# -g 48: keyframe every 48 frames (2 seconds at 24fps)
# -keyint_min 48: minimum keyframe distance
# -sc_threshold 0: disable scene change detection for consistent keyframes
```

**When to use:** HLS/DASH streaming where consistent keyframe intervals are required for seamless quality switching.

---

## Snippet 15: Check Hardware Encoder Availability

**Description:** Verify hardware encoders available in FFmpeg.

```bash
REM Check available encoders
ffmpeg -hide_banner -encoders | findstr "nvenc qsv amf videotoolbox"

REM Test NVENC specifically
ffmpeg -hide_banner -f lavfi -i color=c=black:s=1920x1080:d=5 -c:v h264_nvenc -preset p6 test_nvenc.mp4 -y

REM Check GPU info (Windows)
nvidia-smi
```

**When to use:** Verifying hardware acceleration setup before encoding pipeline implementation.
