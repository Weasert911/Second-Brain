# FFmpeg-Expert: Templates

## 1. Basic Transcode Template
```
Name: basic-transcode
Description: Basic video transcoding to common format
Template:
ffmpeg -i "{{INPUT_FILE}}" \
  -c:v libx264 -crf {{CRF}} -preset {{PRESET}} \
  -c:a aac -b:a {{AUDIO_BITRATE}} \
  -movflags +faststart \
  "{{OUTPUT_FILE}}.mp4"
Usage Notes: CRF: 18-28 (lower=better quality), PRESET: medium/slow/veryslow, AUDIO_BITRATE: 128k/192k/256k. +faststart for web streaming.
```

## 2. Video Compression Template
```
Name: video-compress
Description: Compress video for web/social media
Template:
ffmpeg -i "{{INPUT_FILE}}" \
  -vf "scale={{WIDTH}}:{{HEIGHT}}:force_original_aspect_ratio=decrease,pad={{WIDTH}}:{{HEIGHT}}:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -crf {{CRF}} -preset {{PRESET}} \
  -c:a aac -b:a {{AUDIO_BITRATE}} -ac 2 \
  -movflags +faststart \
  "{{OUTPUT_FILE}}.mp4"
Usage Notes: WIDTH=1280, HEIGHT=720 for 720p. Scale fits within dimensions, pad adds black bars for exact size. CRF=28 for smaller files.
```

## 3. Audio Extraction Template
```
Name: audio-extract
Description: Extract audio track from video
Template:
ffmpeg -i "{{INPUT_FILE}}" \
  -vn \
  -c:a {{AUDIO_CODEC}} \
  -b:a {{BITRATE}} \
  -map 0:a:{{STREAM_INDEX}} \
  "{{OUTPUT_FILE}}.{{EXTENSION}}"
Usage Notes: AUDIO_CODEC: libmp3lame/aac/flac/opus, BITRATE: 192k/256k/320k. STREAM_INDEX: 0 for first audio track. EXTENSION: mp3/m4a/flac/ogg.
```

## 4. Subtitle Burn-In Template
```
Name: subtitle-burn
Description: Burn subtitles directly into video
Template:
ffmpeg -i "{{INPUT_FILE}}" \
  -vf "subtitles={{SUBTITLE_FILE}}" \
  -c:v libx264 -crf {{CRF}} -preset {{PRESET}} \
  -c:a copy \
  "{{OUTPUT_FILE}}.mp4"
Usage Notes: Subtitles are rendered as part of the video (cannot be turned off). Use .srt or .ass format. Requires re-encoding video. Text styling from .ass files is preserved.
```

## 5. Thumbnail Generation Template
```
Name: thumbnail-gen
Description: Generate thumbnails from video at intervals
Template:
# Single thumbnail at specific time
ffmpeg -ss {{TIME}} -i "{{INPUT_FILE}}" -vframes 1 -q:v {{QUALITY}} "{{OUTPUT}}.jpg"

# Sprite sheet (multiple thumbnails)
ffmpeg -i "{{INPUT_FILE}}" \
  -vf "fps=1/{{INTERVAL_SECONDS}},scale={{WIDTH}}:{{HEIGHT}},tile={{COLS}}x{{ROWS}}" \
  -q:v {{QUALITY}} "{{OUTPUT}}_sprite.jpg"

# Scene detection thumbnails
ffmpeg -i "{{INPUT_FILE}}" \
  -vf "select='gt(scene,{{THRESHOLD}})',scale={{WIDTH}}:{{HEIGHT}},setpts=N/FRAME_RATE/TB" \
  -vsync vfr "{{OUTPUT}}_%03d.jpg"
Usage Notes: TIME: 00:01:30, QUALITY: 2-31 (2=best), THRESHOLD: 0.3-0.5 for scene change detection. Sprite sheet creates single image with grid of thumbnails.
```

## 6. HLS Streaming Template
```
Name: hls-stream
Description: Create HLS adaptive bitrate stream
Template:
ffmpeg -i "{{INPUT_FILE}}" \
  -filter_complex "\
    [0:v]split=3[v1][v2][v3]; \
    [v1]scale={{WIDTH_1}}:{{HEIGHT_1}}[v1out]; \
    [v2]scale={{WIDTH_2}}:{{HEIGHT_2}}[v2out]; \
    [v3]scale={{WIDTH_3}}:{{HEIGHT_3}}[v3out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 {{BITRATE_1}} -maxrate:v:0 {{MAX_1}} -bufsize:v:0 {{BUF_1}} \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 {{BITRATE_2}} -maxrate:v:1 {{MAX_2}} -bufsize:v:1 {{BUF_2}} \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 {{BITRATE_3}} -maxrate:v:2 {{MAX_3}} -bufsize:v:2 {{BUF_3}} \
  -map 0:a -c:a aac -b:a 128k -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -master_pl_name master.m3u8 \
  "{{OUTPUT_DIR}}/rendition_%v.m3u8"
Usage Notes: Creates 1080p, 720p, 480p renditions. Adjust bitrates for content type. Use -hls_playlist_type event for live-like, vod for on-demand.
```

## 7. GIF Creation Template
```
Name: create-gif
Description: Create animated GIF from video segment
Template:
ffmpeg -ss {{START_TIME}} -t {{DURATION}} -i "{{INPUT_FILE}}" \
  -vf "fps={{FPS}},scale={{WIDTH}}:{{HEIGHT}}:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop {{LOOP}} \
  "{{OUTPUT_FILE}}.gif"
Usage Notes: FPS=10, WIDTH=480 for good quality/size balance. LOOP=0 for infinite, -1 for no loop. Palette generation improves color quality significantly.
```

## 8. Batch Processing Template
```
Name: batch-process
Description: Batch transcode all files in a directory
Template:
#!/bin/bash
INPUT_DIR="{{INPUT_DIR}}"
OUTPUT_DIR="{{OUTPUT_DIR}}"
EXTENSION="{{EXTENSION}}"
mkdir -p "$OUTPUT_DIR"

for file in "$INPUT_DIR"/*.{{EXTENSION}}; do
    basename=$(basename "$file")
    filename="${basename%.*}"
    output="$OUTPUT_DIR/${filename}_{{SUFFIX}}.mp4"

    echo "Processing: $basename"
    ffmpeg -i "$file" \
      {{FFMPEG_OPTS}} \
      -y "$output"
done

echo "Done: processed $(ls "$INPUT_DIR"/*.{{EXTENSION}} 2>/dev/null | wc -l) files"
Usage Notes: Use quotes for file paths with spaces. Add -y to overwrite without prompt. Use -progress pipe:2 for progress monitoring in CI.
