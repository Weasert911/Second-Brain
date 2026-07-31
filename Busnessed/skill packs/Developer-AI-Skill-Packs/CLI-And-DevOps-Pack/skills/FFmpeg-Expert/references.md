# FFmpeg-Expert: References

## Official Documentation Summaries
- **FFmpeg Documentation** – Complete command reference and filters
- **FFmpeg Filters** – All available video and audio filters with parameters
- **FFmpeg Codecs** – Supported codecs and their options
- **FFmpeg Protocols** – Input/output protocol support (file, pipe, tcp, rtmp, hls)
- **FFmpeg Examples** – Example commands for common tasks

## Glossary (15+ Terms)
- **Codec** – Compression/decompression algorithm (h.264, h.265, VP9, AV1)
- **Container** – File format holding audio/video streams (MP4, MKV, AVI)
- **Stream** – Continuous media data (video, audio, subtitle)
- **CRF** – Constant Rate Factor for quality-based encoding
- **Keyframe** – Full frame used as reference for delta frames
- **GOP** – Group of Pictures between keyframes
- **Bitrate** – Number of bits processed per unit time
- **Transcoding** – Converting from one codec to another
- **Remuxing** – Changing container without re-encoding
- **Filter graph** – Chain of filters for processing streams
- **Hardware acceleration** – Using GPU for encoding/decoding
- **HLS** – HTTP Live Streaming protocol by Apple
- **DASH** – Dynamic Adaptive Streaming over HTTP
- **PTS/DTS** – Presentation/Decoding Timestamps
- **SAR/DAR** – Sample/Display Aspect Ratio

## Architecture Notes
- FFmpeg uses a pipeline architecture: input → decode → filter → encode → output
- Filters are connected in a graph; each node processes a stream
- Stream copy (-c copy) copies packets without decode/encode (fast, no quality loss)
- Encoding presets trade speed for compression efficiency (ultrafast → veryslow)

## Key Commands / APIs
- `ffmpeg -i input -c:v codec -c:a codec output` – Basic transcoding
- `ffmpeg -i input -filter:v "scale=1280:720" output` – Filter application
- `ffprobe -v quiet -print_format json -show_format -show_streams input` – Media analysis
- `ffmpeg -i input -ss 00:01:00 -t 00:00:30 output` – Trimming
- `ffmpeg -f concat -safe 0 -i filelist.txt -c copy output` – Concatenation
- `ffmpeg -i input -vf "subtitles=subs.srt" output` – Subtitle burning

## Conventions
- Filter syntax: `filter=param1=val1:param2=val2`
- Filter chains separate by `,` for sequential, `;` for parallel
- Stream specifiers: `v:0` (first video), `a:1` (second audio)
- Map syntax: `-map 0:v:0 -map 0:a:1` for selective stream mapping
- Common presets: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow

## Structure Recommendations
```
media/
├── input/              # Source files
├── output/             # Encoded files
├── scripts/            # Batch encoding scripts
├── logs/               # Encoding logs
└── thumbnails/         # Extracted previews
```

## Keyboard Shortcuts
- `q` – Stop encoding (when processing)
- `Ctrl+C` – Interrupt encoding
