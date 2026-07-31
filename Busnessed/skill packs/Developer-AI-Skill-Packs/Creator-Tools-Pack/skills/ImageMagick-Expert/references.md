# ImageMagick-Expert References

## Official Documentation

- [ImageMagick Documentation](https://imagemagick.org/script/documentation.php) — Complete command reference and usage guides
- [ImageMagick Command-Line Tools](https://imagemagick.org/script/command-line-tools.php) — All command-line tools with examples
- [ImageMagick Options](https://imagemagick.org/script/command-line-options.php) — Complete list of command-line options
- [ImageMagick Color Management](https://imagemagick.org/script/color-management.php) — Color profiles and color space handling
- [ImageMagick Filters](https://imagemagick.org/script/fx.php) — Built-in FX operator language reference
- [ImageMagick Formats](https://imagemagick.org/script/formats.php) — Supported file formats and their capabilities

## Glossary / Terminology

| Term | Definition |
|---|---|
| **Delegate** | External library used by ImageMagick to handle specific formats |
| **Geometry** | Specification syntax for size, position, and cropping |
| **Gravity** | Reference point for positioning (-gravity northwest, center, southeast) |
| **Extent** | Canvas size extension with background fill |
| **Sigma** | Radius value for blur and sharpen operations |
| **Dither** | Algorithm for simulating colors through pattern of available colors |
| **Quantization** | Reduction of color count in an image |
| **Colormap** | Table of indexed colors used in GIF and PNG8 formats |
| **Alpha** | Transparency channel in image data |
| **Composite** | Combining two or more images with blend operations |
| **FX** | ImageMagick's internal expression language for pixel operations |
| **Profile** | Embedded ICC color profile or metadata (EXIF, XMP, IPTC) |
| **Delegate** | External library (libjpeg, libpng, libwebp) for format support |

## Conventions / Naming Standards

- Output files: `inputname_operation.ext` (e.g., `photo_thumb.jpg`)
- Batch outputs: `prefix_%d.ext` for numbered sequences
- Scripts: `process_images.sh`, `batch_convert.ps1`
- Quality suffixes: `_hq.jpg`, `_thumb.png`, `_web.webp`
- Resolution suffixes: `_1920.jpg`, `_1080.jpg`, `_500.jpg`
- Appended operations: `_blur`, `_sepia`, `_grayscale`

## Architecture / Workflow Notes

ImageMagick processes images through a pipeline: Read → Process → Process → ... → Write. Each operation is applied sequentially to the image in memory. The order matters significantly for both performance and result quality.

**Typical pipeline:** `magick input.png -resize 50% -sharpen 0x1 -quality 90 output.jpg`

**Memory flow:** Input → Decode → Pixel cache → Operations → Encode → Output

## Key Tools / Commands

- `magick identify -verbose image.jpg` — Detailed image metadata
- `magick convert` — Single image conversion/processing (legacy: `convert`)
- `magick mogrify` — Batch image processing (modifies in place unless -path used)
- `magick montage` — Create image grids and contact sheets
- `magick compare` — Compare two images and output difference
- `magick composite` — Composite images with blend modes
- `magick -version` — Version and feature support

## Recommended Project Structure

```
image-projects/
├── input/
│   ├── raw/
│   ├── photos/
│   ├── screenshots/
│   └── graphics/
├── output/
│   ├── web/
│   ├── thumbnails/
│   ├── print/
│   ├── social/
│   └── gifs/
├── scripts/
│   ├── batch/
│   ├── presets/
│   └── templates/
├── assets/
│   ├── fonts/
│   ├── overlays/
│   ├── watermarks/
│   └── profiles/
└── logs/
```
