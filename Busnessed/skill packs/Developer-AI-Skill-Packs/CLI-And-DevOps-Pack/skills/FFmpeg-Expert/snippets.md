# FFmpeg-Expert: Snippets

## 1. Analyze Media File
```bash
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4
```
**When to use**: Get comprehensive information about a media file before processing.

## 2. Web-Optimized H.264
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```
**When to use**: Encode video for web delivery with fast streaming start.

## 3. Compress for Social Media
```bash
ffmpeg -i input.mp4 -vf "scale=-2:720" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k output.mp4
```
**When to use**: Reduce file size for social media uploads while maintaining acceptable quality.

## 4. Extract Audio
```bash
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3
```
**When to use**: Extract audio track from a video file as MP3.

## 5. Trim Without Re-encoding
```bash
ffmpeg -ss 00:01:30 -to 00:02:45 -i input.mp4 -c copy output.mp4
```
**When to use**: Cut a segment from a video quickly without quality loss (stream copy).

## 6. Generate Thumbnail
```bash
ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 -q:v 3 thumbnail.jpg
```
**When to use**: Extract a single frame as a JPEG thumbnail at a specific timestamp.

## 7. Create GIF from Video
```bash
ffmpeg -ss 00:00:05 -t 3 -i input.mp4 -vf "fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif
```
**When to use**: Convert a short video segment to an animated GIF with good color quality.

## 8. Add Subtitles (Burn-in)
```bash
ffmpeg -i input.mp4 -vf "subtitles=subtitles.srt" -c:a copy output.mp4
```
**When to use**: Permanently embed subtitles into the video stream.

## 9. Scale Video
```bash
ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" output.mp4
```
**When to use**: Scale video to exact dimensions while preserving aspect ratio with padding.

## 10. Hardware-Accelerated Encoding
```bash
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc -preset p4 -cq 23 -c:a aac output.mp4
```
**When to use**: Leverage NVIDIA GPU for faster encoding with acceptable quality.

## 11. Batch Process Directory
```bash
for f in *.mp4; do ffmpeg -i "$f" -c:v libx264 -crf 23 "compressed/${f%.mp4}.mp4"; done
```
**When to use**: Process all video files in a directory with the same settings.

## 12. Create HLS Stream
```bash
ffmpeg -i input.mp4 -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls output.m3u8
```
**When to use**: Create HTTP Live Streaming segments for web streaming.

## 13. Merge Audio and Video
```bash
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -shortest output.mp4
```
**When to use**: Replace or add an audio track to an existing video file.

## 14. Speed Up/Slow Down Video
```bash
ffmpeg -i input.mp4 -filter:v "setpts=0.5*PTS" -filter:a "atempo=2.0" output.mp4
```
**When to use**: Change playback speed (0.5×PTS = 2× speed, 2.0×PTS = 0.5× speed).

## 15. Concatenate Videos (Same Codec)
```bash
echo "file '1.mp4'\nfile '2.mp4'" > files.txt && ffmpeg -f concat -safe 0 -i files.txt -c copy merged.mp4
```
**When to use**: Join multiple video files with the same codecs without re-encoding.
