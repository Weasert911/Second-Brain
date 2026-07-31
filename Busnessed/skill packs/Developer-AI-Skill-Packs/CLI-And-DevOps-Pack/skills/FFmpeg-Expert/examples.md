# FFmpeg-Expert: Examples

## Beginner: Basic Transcoding
```bash
# Analyze source
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

# Simple h.264 transcode to smaller file
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# Extract audio
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3

# Create thumbnail at 10 seconds
ffmpeg -i input.mp4 -ss 00:00:10 -vframes 1 thumbnail.jpg
```
**Explanation**: First analyze source to understand its properties. Basic transcoding uses libx264 with CRF 23 (good quality/size balance). Audio extracted as MP3. Thumbnail generated from a specific timestamp.

## Intermediate: Filter Graph for Complex Processing
```bash
# Scale, crop, add watermark, and trim
ffmpeg -i input.mp4 \
  -filter_complex "\
    [0:v]scale=1280:720, \
          crop=640:720:(iw-640)/2:0, \
          drawtext=text='Watermark':fontsize=24:fontcolor=white@0.5:x=10:y=10 \
    [outv]; \
    [0:a]volume=1.5[outa]" \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -crf 20 -preset slow \
  -c:a aac -b:a 192k \
  output.mp4

# Concat multiple clips
echo "file 'clip1.mp4'
file 'clip2.mp4'
file 'clip3.mp4'" > clips.txt
ffmpeg -f concat -safe 0 -i clips.txt -c copy merged.mp4
```
**Explanation**: Complex filter graph chains scale → crop → drawtext for video, and volume boost for audio. Concat demuxer merges clips without re-encoding (stream copy) when codecs match.

## Advanced: Hardware-Accelerated Streaming Pipeline
```bash
# GPU-accelerated encoding with NVIDIA NVENC
ffmpeg -hwaccel cuda -hwaccel_output_format cuda \
  -i input.mp4 \
  -c:v h264_nvenc -preset p4 -tune hq \
  -b:v 5M -maxrate 8M -bufsize 10M \
  -c:a aac -b:a 128k \
  -vf "scale_cuda=1920:1080" \
  output.mp4

# HLS streaming with multiple renditions
ffmpeg -i input.mp4 \
  -filter_complex "\
    [0:v]split=3[v1][v2][v3]; \
    [v1]scale=1920:1080[v1out]; \
    [v2]scale=1280:720[v2out]; \
    [v3]scale=854:480[v3out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 8M -maxrate:v:0 10M -bufsize:v:0 12M \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 4M -maxrate:v:1 5M -bufsize:v:1 6M \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 1.5M -maxrate:v:2 2M -bufsize:v:2 3M \
  -map 0:a -c:a aac -b:a 128k -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -master_pl_name master.m3u8 \
  stream/rendition_%v.m3u8
```
**Explanation**: Hardware acceleration with CUDA for NVIDIA GPUs dramatically speeds up encoding. HLS streaming generates multiple quality renditions (1080p, 720p, 480p) with adaptive bitrate for HTTP Live Streaming. Outputs playlists compatible with all modern video players.

## Production: Batch Transcoding Script
```bash
#!/bin/bash
set -euo pipefail

INPUT_DIR="./source"
OUTPUT_DIR="./encoded"
CODEC="${1:-libx264}"
CRF="${2:-23}"
PRESET="${3:-medium}"
THREADS=4

mkdir -p "$OUTPUT_DIR" "$INPUT_DIR"
shopt -s nullglob
files=("$INPUT_DIR"/*.{mp4,mkv,mov,avi})

for input in "${files[@]}"; do
    basename=$(basename "$input")
    filename="${basename%.*}"
    output="$OUTPUT_DIR/${filename}_${CODEC}_crf${CRF}.mp4"

    echo "Processing: $basename -> $output"

    if [ -f "$output" ]; then
        echo "  Skipping (already exists): $output"
        continue
    fi

    logfile="$OUTPUT_DIR/${filename}.log"
    ffmpeg -i "$input" \
        -c:v "$CODEC" -crf "$CRF" -preset "$PRESET" \
        -c:a aac -b:a 128k -movflags +faststart \
        -progress pipe:2 -y \
        "$output" 2>"$logfile"

    fps=$(grep "fps=" "$logfile" | tail -1 | awk -F'=' '{print $2}')
    size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output" 2>/dev/null)
    echo "  Done: $((size / 1048576))MB, avg ${fps}fps"
done

echo "Batch complete. Processed ${#files[@]} files."
```
**Explanation**: Production batch script with parallel-ready logic. Skips existing outputs (resume capability). Logs each encoding to separate file. Reports file sizes and average FPS. Configurable codec, CRF, and preset via parameters.
