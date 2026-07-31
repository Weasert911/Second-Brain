---
name: ImageMagick-Expert
version: 1.0.0
domain: Creator Tools
activation_description: Load this skill when the user asks about ImageMagick for image conversion, resizing, compositing, batch processing, or image manipulation via command line.
purpose: Provide expert-level guidance on ImageMagick for image processing including conversion, resizing, filters, compositing, batch automation, and metadata handling.
---

## Capabilities

- Convert images between formats (JPEG, PNG, WebP, AVIF, TIFF, BMP, GIF, SVG, PDF)
- Resize and crop with precise geometry specifications, gravity, and extent
- Apply filters and effects: blur, sharpen, edge detect, oil painting, charcoal sketch
- Manipulate colors with threshold, level, curve, colorize, modulate, and negate
- Composite and layer images using blend modes: over, multiply, screen, difference, alpha
- Draw shapes and text annotations with customizable fonts and colors
- Create and optimize GIF animations from image sequences
- Batch process images with mogrify, montage, and convert loop
- Read, write, and strip image metadata (EXIF, XMP, IPTC)
- Apply dithering and quantization for color reduction
- Render SVG vector files to raster formats
- Generate PDF documents from images
- Optimize memory usage for large images
- Create image masks, gradients, and patterns

## Limitations

- Cannot process video files or animated content beyond GIF
- SVG rendering may not match browser rendering precisely
- Complex multi-layer PSD files may not preserve all layer properties
- Memory-intensive operations on very large images (>100MP) may be slow
- Cannot perform AI-powered image generation or recognition
- Unicode text rendering may require specific font configuration

## Required Tools

- ImageMagick 7.1+ installed (magick command)
- Ghostscript for PDF input/output
- Font files for text annotation (optional)
- Python or bash for batch scripting (optional)

## Execution Workflow

1. Determine source format, dimensions, and color space
2. Identify required output: format, size, quality, color profile
3. Select appropriate ImageMagick command (convert, mogrify, identify, montage)
4. Construct command with operations in processing order
5. Apply geometry specifications for resize, crop, or extent
6. Add color manipulation: -colorspace, -level, -brightness-contrast
7. Apply filters or effects as needed
8. Handle metadata: preserve, modify, or strip
9. Set output quality and compression
10. Execute command and verify output
11. Adjust parameters and re-run if needed
12. Integrate into batch script for multiple files

## Decision Tree

- Task type → {Conversion, Resize, Filter, Composite, Batch, Animate, Metadata}
- Output format → {Web (JPEG/WebP/PNG), Print (TIFF), Archive (PNG/TIFF), Vector (SVG/PDF)}
- Image purpose → {Thumbnail, Social media, Print, Web full-size, Icon}
- Color requirement → {sRGB, Adobe RGB, CMYK, Grayscale, Indexed}
- Batch size → {Single file, Few files (<10), Many files, Pattern-based}
- Quality need → {Lossless (PNG/TIFF), High quality JPEG, Small file (WebP/AVIF)}
- Memory concern → {Small (<10MP), Medium, Large (>100MP), Huge (>1GP)}
- Metadata → {Preserve all, Strip all, Modify specific tags}

## Review Checklist

- [ ] Input image analyzed with identify before processing
- [ ] Format conversion produces expected color and quality
- [ ] Geometry specifications produce correct dimensions
- [ ] Color space conversion preserves intended appearance
- [ ] Filters applied with appropriate sigma values
- [ ] Composite layers blend correctly with chosen mode
- [ ] Text annotations are positioned and styled correctly
- [ ] GIF animation frame timing is correct
- [ ] Batch processing covers all intended files
- [ ] Metadata handled according to requirements
- [ ] Output file size within expected range
- [ ] Memory usage stays within available limits

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| "no decode delegate" error | Missing library for format | Install delegate library or use different format |
| JPEG artifacts visible | Compression quality too low | Increase -quality to 90-95 |
| Colors look washed out | Wrong color space assumption | Use -colorspace sRGB explicitly |
| Text not rendered | Font not found | Use -font with full path to font file |
| Batch operation overwrites originals | Mogrify in-place by default | Use -path option to write to different directory |
| Image too large for memory | Limited RAM or 32-bit IM | Use -define registry:temporary-storage or upgrade |
| SVG renders incorrectly | Incomplete SVG support | Convert to PNG via Inkscape first |
| GIF animation too large | Too many frames or high res | Reduce frame rate or colormap colors |
| PDF output has white background | No -flatten applied | Add -flatten or -background none |
| Transparency lost in JPEG | JPEG doesn't support alpha | Use PNG or WebP, or flatten onto background |
| Sharpening creates halos | Sigma too high | Reduce -sharpen sigma (try 0.5-1.0) |
| EXIF data stripped unexpectedly | Default behavior of some operations | Use -strip only when intentional |

## Best Practices

- Always use `magick` command (ImageMagick 7+) instead of legacy `convert`
- Use `-quality 85-95` for high-quality JPEG output
- Apply `-strip` only when metadata must be removed for privacy
- Order operations for efficiency: crop before resize, resize before filter
- Use `-define jpeg:size=WxH` before reading large JPEGs for fast thumbnails
- Preview complex operations with `-verbose` to debug
- Use `-limit memory 2GB -limit map 4GB` for large image processing
- Test single file before running mogrify on directories
- Use `-flatten` for layered formats (PSD, PDF, XCF) to merge layers
- Keep original files when performing destructive edits

## Anti-Patterns

- Using `convert` on ImageMagick 7+ (use `magick` command instead)
- Applying `-resize` before `-crop` (wastes processing on cropped-away pixels)
- Using `-quality 100` thinking it means lossless (JPEG is always lossy)
- Forgetting `-flatten` when converting PSD/PDF to flat formats
- Using `-colorspace sRGB` without understanding input color space
- Applying `-strip` when EXIF copyright data must be preserved
- Using mogrify without `-path` leading to unintentional overwrites
- Processing 16-bit images without adequate memory allocation
- Using -dither incorrectly on indexed-color output
- Assuming all WebP encoders are equal (ImageMagick WebP quality may differ)

## References

Companion files: references.md, examples.md, templates.md, checklists.md, snippets.md
