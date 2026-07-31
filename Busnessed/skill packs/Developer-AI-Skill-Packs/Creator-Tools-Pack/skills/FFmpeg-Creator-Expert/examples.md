# FFmpeg-Creator-Expert Examples

## Beginner Example: Convert Video to H.264

**Goal:** Convert an MOV file to H.264 MP4 for web upload.

```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**Explanation:** `-c:v libx264` selects H.264 encoder, `-crf 23` sets good quality, `-preset medium` balances speed/size, `-c:a aac -b:a 128k` encodes audio, `-movflags +faststart` optimizes for web streaming.

**Key Techniques:** Basic transcoding, CRF rate control, web optimization.

---

## Intermediate Example: Create a Compilation with Intro/Outro

**Goal:** Concatenate multiple clips with an intro video and fade transitions.

```bash
ffmpeg -i intro.mp4 -i clip1.mp4 -i clip2.mp4 -i clip3.mp4 -i outro.mp4 \
  -filter_complex "[0]fade=t=out:st=3:d=1[v0]; \
    [1]fade=t=in:st=0:d=1,fade=t=out:st=8:d=1[v1]; \
    [2]fade=t=in:st=0:d=1,fade=t=out:st=10:d=1[v2]; \
    [3]fade=t=in:st=0:d=1,fade=t=out:st=6:d=1[v3]; \
    [4]fade=t=in:st=0:d=1[v4]; \
    [v0][v1][v2][v3][v4]concat=n=5:v=1:a=1[out]" \
  -map "[out]" -c:v libx264 -crf 20 -c:a aac output.mp4
```

**Explanation:** Uses filter_complex to apply fade in/out to each clip, then concatenates all 5 clips into a single output stream with proper audio sync.

**Key Techniques:** Filter complex graphs, fade transitions, concatenation.

---

## Advanced Example: Hardware-Accelerated Multi-Format Production

**Goal:** Produce multiple output versions from a single 4K source with hardware acceleration.

```bash
REM Analyze source
ffprobe -v error -show_entries stream=index,codec_name,codec_type,width,height -of default=noprint_wrappers=1:nokey=1 source_4k.mkv

REM 4K H.265 for archival
ffmpeg -hwaccel cuda -i source_4k.mkv -c:v hevc_nvenc -preset p7 -cq 18 -c:a copy -map 0 4k_archive.mkv

REM 1080p H.264 for web
ffmpeg -hwaccel cuda -i source_4k.mkv -vf "scale=1920:1080:flags=lanczos" -c:v h264_nvenc -preset p5 -cq 22 -c:a aac -b:a 128k -movflags +faststart 1080p_web.mp4

REM 720p H.264 for mobile
ffmpeg -hwaccel cuda -i source_4k.mkv -vf "scale=1280:720:flags=lanczos" -c:v h264_nvenc -preset p5 -cq 25 -c:a aac -b:a 96k 720p_mobile.mp4

REM Extract thumbnail at 10 seconds
ffmpeg -i source_4k.mkv -ss 00:00:10 -vframes 1 -vf "scale=1920:1080" thumbnail.png
```

**Explanation:** Uses CUDA hardware acceleration. First pass creates high-quality HEVC archive. Second and third create web-optimized H.264 at lower resolutions. Fourth extracts a thumbnail frame.

**Key Techniques:** Hardware acceleration, multi-resolution encoding, thumbnail extraction, NVENC/HEVC.

---

## Production Example: Batch Processing Script for Social Media

**Goal:** Process all videos in a folder with platform-specific presets.

```powershell
# batch_social.ps1
$inputDir = "C:\media\input"
$outputDir = "C:\media\output"
$presets = @{
    "youtube" = @("1920:1080", "21", "h264_nvenc", "p5")
    "tiktok"  = @("1080:1920", "24", "h264_nvenc", "p5")
    "igreel"  = @("1080:1080", "23", "h264_nvenc", "p5")
}

Get-ChildItem $inputDir -Filter *.mp4 | ForEach-Object {
    $baseName = $_.BaseName
    foreach ($preset in $presets.Keys) {
        $res = $presets[$preset][0]
        $cq = $presets[$preset][1]
        $enc = $presets[$preset][2]
        $pre = $presets[$preset][3]
        $outPath = "$outputDir\$preset\$($baseName)_$preset.mp4"
        New-Item -ItemType Directory -Force -Path "$outputDir\$preset"
        ffmpeg -i $_.FullName -vf "scale=$res:force_original_aspect_ratio=decrease,pad=$res:(ow-iw)/2:(oh-ih)/2" -c:v $enc -preset $pre -cq $cq -c:a aac -b:a 128k -movflags +faststart $outPath
    }
}
```

**Explanation:** PowerShell script iterates all MP4 files in input directory, creates output variants for YouTube (landscape), TikTok (vertical), and Instagram Reels (square) using hardware encoding.

**Key Techniques:** Batch scripting, platform-specific scaling, automated pipeline, PowerShell automation.
