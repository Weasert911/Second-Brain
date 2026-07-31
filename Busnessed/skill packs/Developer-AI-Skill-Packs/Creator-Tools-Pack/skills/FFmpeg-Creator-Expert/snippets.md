# FFmpeg-Creator-Expert Snippets

## Snippet 1: Analyze Media File

**Description:** Get detailed information about a media file.

```bash
ffprobe -v error -show_format -show_streams -print_format json input.mp4
```

**When to use:** Before encoding to understand source codec, bitrate, resolution, duration, and stream layout.

---

## Snippet 2: Compress Video for Web (H.264)

**Description:** Compress video to H.264 with good quality-to-size ratio.

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**When to use:** For web upload (YouTube, Vimeo) where H.264 compatibility is required and file size matters.

---

## Snippet 3: Extract Frames for Thumbnails

**Description:** Extract frames at regular intervals from video.

```bash
ffmpeg -i input.mp4 -vf "fps=1/10,scale=1920:1080" -q:v 2 thumbnails/thumbnail_%04d.jpg
```

**When to use:** Generating thumbnail options for video chapters or gallery previews at 10-second intervals.

---

## Snippet 4: Crop Video to Center

**Description:** Crop video to desired dimensions from center.

```bash
ffmpeg -i input.mp4 -vf "crop=1080:1080:(iw-1080)/2:(ih-1080)/2" -c:v libx264 -crf 23 -c:a copy output.mp4
```

**When to use:** Creating square 1:1 videos for Instagram or cropping 16:9 to vertical 9:16 for TikTok/Reels.

---

## Snippet 5: Add Blurred Background (Vertical)

**Description:** Add blurred background for vertical video from horizontal source.

```bash
ffmpeg -i input.mp4 -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:v libx264 -crf 23 -c:a copy output.mp4
```

**When to use:** Converting horizontal 16:9 content to vertical 9:16 for TikTok, Reels, or Shorts with blur fill.

---

## Snippet 6: Add Watermark Overlay

**Description:** Overlay a PNG logo on video.

```bash
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=W-w-10:H-h-10:format=auto" -c:v libx264 -crf 23 -c:a copy output.mp4
```

**When to use:** Adding channel logo or branding watermark to video content in the bottom-right corner.

---

## Snippet 7: Concatenate Multiple Videos

**Description:** Join video files with matching codec parameters.

```bash
REM Create file list
echo file 'clip1.mp4' > filelist.txt
echo file 'clip2.mp4' >> filelist.txt
echo file 'clip3.mp4' >> filelist.txt

REM Concatenate
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4
```

**When to use:** When compiling multiple video segments into a single continuous file without re-encoding.

---

## Snippet 8: Create Slow Motion Video

**Description:** Create smooth slow-motion video using frame interpolation.

```bash
ffmpeg -i input.mp4 -vf "minterpolate=fps=60:mi_mode=mci" -c:v libx264 -crf 18 -preset slow -c:a copy -r 60 output.mp4
```

**When to use:** Converting standard footage to smooth slow motion (e.g., 30fps to 60fps with interpolation).

---

## Snippet 9: Extract Audio from Video

**Description:** Extract audio track to separate file.

```bash
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3
```

**When to use:** When you need an audio-only version for podcast, music listening, or audio editing.

---

## Snippet 10: Batch Resize All Videos in Folder

**Description:** Resize all MP4 files in folder to 1080p.

```bash
for %%f in (*.mp4) do (
  ffmpeg -i "%%f" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 23 -c:a aac -b:a 128k "resized_%%f"
)
```

**When to use:** Processing multiple videos to consistent resolution for a playlist, course, or compilation.

---

## Snippet 11: Create Chapter Markers

**Description:** Add chapter markers to video from metadata file.

```bash
REM Create chapters.txt:
;FFMETADATA1
[CHAPTER]
TIMEBASE=1/1000
START=0
END=60000
title=Introduction
[CHAPTER]
TIMEBASE=1/1000
START=60000
END=120000
title=Main Content

REM Apply chapters
ffmpeg -i input.mp4 -i chapters.txt -map_metadata 1 -codec copy output.mp4
```

**When to use:** Adding navigation chapters to long-form content for YouTube chapter markers or DVD authoring.

---

## Snippet 12: Video Stabilization

**Description:** Stabilize shaky handheld footage.

```bash
REM First pass: detect motion
ffmpeg -i input.mp4 -vf "vidstabdetect=shakiness=10:accuracy=15:result=transforms.trf" -f null -

REM Second pass: apply stabilization
ffmpeg -i input.mp4 -vf "vidstabtransform=input=transforms.trf:zoom=1:smoothing=30,unsharp=5:5:0.8:3:3:0.4" -c:v libx264 -crf 20 -c:a copy output.mp4
```

**When to use:** Shaky handheld footage, action camera videos, or any footage with unwanted camera movement.

---

## Snippet 13: Color Space Conversion

**Description:** Convert between color spaces and bit depths.

```bash
REM Rec.709 to Rec.2020 for HDR
ffmpeg -i input.mp4 -vf "zscale=t=linear:npl=100,zscale=p=bt2020:m=bt2020nc:t=smpte2084,format=yuv420p10le" -c:v libx265 -crf 20 -tag:v hvc1 -c:a copy output_hdr.mp4

REM HDR to SDR tone mapping
ffmpeg -i input_hdr.mp4 -vf "zscale=t=linear:npl=100,zscale=p=bt709:m=bt709:t=bt709,format=yuv420p" -c:v libx264 -crf 20 -c:a copy output_sdr.mp4
```

**When to use:** Converting SDR content to HDR for modern displays, or tone-mapping HDR to SDR for compatibility.

---

## Snippet 14: Create Split-Screen Video

**Description:** Combine two videos side-by-side.

```bash
ffmpeg -i left.mp4 -i right.mp4 -filter_complex "[0:v]scale=960:1080[l];[1:v]scale=960:1080[r];[l][r]hstack=inputs=2" -c:v libx264 -crf 23 -c:a aac -b:a 128k -map 0:a -map 1:a output.mp4
```

**When to use:** Comparison videos, reaction videos, or multi-angle presentations.

---

## Snippet 15: Trim Video Without Re-encoding

**Description:** Cut video segment preserving original quality.

```bash
REM Using re-encoding for precise cuts:
ffmpeg -i input.mp4 -ss 00:01:30 -to 00:05:00 -c:v libx264 -crf 18 -c:a copy -copyts output.mp4

REM Or stream copy for fast, quality-preserving trim:
ffmpeg -ss 00:01:30 -i input.mp4 -t 00:03:30 -c copy -avoid_negative_ts make_zero output.mp4
```

**When to use:** Trimming start/end of video without losing quality (stream copy) or encoding for precise cuts.
