# Video-Compression-Expert Examples

## Beginner Example: Compress Video for YouTube Upload

**Goal:** Compress a high-bitrate source to YouTube-optimized H.264.

```bash
REM Analyze source
ffprobe -v error -show_streams source_4k.mov

REM Encode for YouTube 4K
ffmpeg -i source_4k.mov -c:v libx264 -crf 18 -preset slow -tune film ^
  -profile:v high -level 5.2 -pix_fmt yuv420p ^
  -c:a aac -b:a 384k ^
  -movflags +faststart ^
  youtube_4k.mp4

REM Also create 1080p version
ffmpeg -i source_4k.mov -vf "scale=1920:1080:flags=lanczos" ^
  -c:v libx264 -crf 20 -preset medium -tune film ^
  -profile:v high -level 4.1 -pix_fmt yuv420p ^
  -c:a aac -b:a 192k ^
  -movflags +faststart ^
  youtube_1080p.mp4
```

**Explanation:** CRF 18 for 4K master, slight CRF increase for 1080p. Lanczos scaling for quality. `-movflags +faststart` enables web streaming. High profile with appropriate level for resolution.

**Key Techniques:** CRF rate control, resolution scaling, profile/level matching, web optimization.

---

## Intermediate Example: Multi-Platform Encoding Pipeline

**Goal:** Produce versions for different platforms from a single master.

```bash
REM Analyze master
ffprobe -v error -show_entries stream=codec_name,width,height,bit_rate -of default=noprint_wrappers=1:nokey=1 master.mov

REM Archival master (H.265, high quality)
ffmpeg -i master.mov -c:v libx265 -crf 18 -preset slow -x265-params "aq-mode=3" ^
  -pix_fmt yuv420p10le -tag:v hvc1 ^
  -c:a flac ^
  archive_master.mkv

REM YouTube 4K (H.264, high quality)
ffmpeg -i master.mov -c:v libx264 -crf 18 -preset slow -tune film ^
  -pix_fmt yuv420p -profile:v high -level 5.2 ^
  -c:a aac -b:a 384k -movflags +faststart ^
  youtube_4k.mp4

REM Twitch stream (NVENC, 1080p60, CBR)
ffmpeg -i master.mov -vf "scale=1920:1080:flags=lanczos" ^
  -c:v h264_nvenc -preset p5 -rc cbr -b:v 6000k -minrate 6000k -maxrate 6000k -bufsize 12000k ^
  -pix_fmt yuv420p -profile:v high -g 120 ^
  -c:a aac -b:a 160k ^
  twitch_1080p60.mp4

REM TikTok/Reels (vertical crop, lower bitrate)
ffmpeg -i master.mov -vf "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos" ^
  -c:v libx264 -crf 23 -preset fast ^
  -pix_fmt yuv420p -profile:v main -level 4.0 ^
  -c:a aac -b:a 128k -movflags +faststart ^
  tiktok_vertical.mp4
```

**Key Techniques:** Multi-format pipeline, codec selection per platform, CRF vs CBR, vertical cropping, platform-specific bitrate targeting.

---

## Advanced Example: HDR to SDR Tone Mapping and HDR Encode

**Goal:** Process HDR source to both HDR10 and SDR outputs.

```bash
REM Analyze HDR source
ffprobe -v error -show_streams source_hdr.mkv

REM HDR10 encode (10-bit, H.265, PQ)
ffmpeg -i source_hdr.mkv -c:v libx265 -crf 18 -preset slow ^
  -pix_fmt yuv420p10le -tag:v hvc1 ^
  -x265-params "colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc:master-display=G(13250,34500)B(7500,3000)R(34000,16000)WP(15635,16450)L(10000000,1):max-cll=1000,400" ^
  -c:a aac -b:a 384k ^
  hdr10_output.mkv

REM SDR tone map (HDR → SDR, Rec.709)
ffmpeg -i source_hdr.mkv -vf "zscale=transfer=linear,tonemap=hable:param=0.5,zscale=transfer=bt709,format=yuv420p,zscale=primaries=bt709" ^
  -c:v libx264 -crf 18 -preset slow -tune film ^
  -pix_fmt yuv420p -profile:v high ^
  -c:a aac -b:a 384k -movflags +faststart ^
  sdr_output.mp4

REM Calculate VMAF quality score
ffmpeg -i hdr10_output.mkv -i source_hdr.mkv -filter_complex "libvmaf=model_path=vmaf_v0.6.1.pkl" -f null -
```

**Key Techniques:** HDR10 mastering with proper metadata, tone mapping algorithms (hable), BT.2020 to BT.709 conversion, VMAF quality measurement.

---

## Production Example: Batch Encoding System with Quality Control

**Goal:** Automated batch encoding system with quality checks.

```python
# batch_encoder.py
import subprocess, json, os

SOURCE_DIR = "C:/media/source/"
OUTPUT_DIR = "C:/media/output/"
PRESETS = {
    "archival": {"codec": "libx265", "crf": 18, "preset": "slow", "pix_fmt": "yuv420p10le", "audio": "flac", "ext": "mkv"},
    "youtube_4k": {"codec": "libx264", "crf": 18, "preset": "slow", "pix_fmt": "yuv420p", "res": "3840x2160", "audio": "aac", "abitrate": "384k", "ext": "mp4"},
    "youtube_1080p": {"codec": "libx264", "crf": 20, "preset": "medium", "pix_fmt": "yuv420p", "res": "1920x1080", "audio": "aac", "abitrate": "192k", "ext": "mp4"},
}

for file in os.listdir(SOURCE_DIR):
    if file.endswith(('.mov', '.mp4', '.mkv')):
        basename = os.path.splitext(file)[0]
        for preset_name, preset in PRESETS.items():
            cmd = ['ffmpeg', '-i', os.path.join(SOURCE_DIR, file)]
            if 'res' in preset:
                cmd.extend(['-vf', f'scale={preset["res"]}:flags=lanczos'])
            cmd.extend(['-c:v', preset['codec'], '-crf', str(preset['crf']), '-preset', preset['preset']])
            cmd.extend(['-pix_fmt', preset['pix_fmt'], '-c:a', preset['audio']])
            if preset['audio'] == 'aac':
                cmd.extend(['-b:a', preset['abitrate']])
            cmd.extend(['-movflags', '+faststart'])
            cmd.append(os.path.join(OUTPUT_DIR, preset_name, f'{basename}_{preset_name}.{preset["ext"]}'))
            print(f"Encoding {file} → {preset_name}")
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"ERROR: {file} {preset_name}: {result.stderr}")
```

**Explanation:** Python script automates multi-format production. Processes all files in source directory through each preset (archival, YouTube 4K, YouTube 1080p). Handles errors gracefully with logging.

**Key Techniques:** Python automation, multi-preset encoding pipeline, error handling, organized output structure.
