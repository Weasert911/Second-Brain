# ImageMagick-Expert Templates

## Template 1: Web Image Optimization

**Description:** Optimize images for web with multiple output formats.

```
Name: web_optimize_{{format}}

magick {{input}} \
  -resize {{width}}x{{height}}^ \
  -gravity {{gravity}} \
  -extent {{width}}x{{height}} \
  -colorspace sRGB \
  -quality {{quality}} \
  -strip \
  {{output}}.{{format}}

Parameters:
- format: jpg, png, webp, avif
- quality: JPEG 80-90, PNG 95-100, WebP 80-95, AVIF 80-95
- gravity: center, north, south, east, west
- width/height: target dimensions in pixels
- strip: removes EXIF for smaller files (omit if copyright needed)
```

**Usage Notes:** Use sRGB colorspace for web. Strip metadata for smallest file size. WebP offers 25-35% smaller files than JPEG at same quality.

---

## Template 2: Thumbnail Generation

**Description:** Generate consistent thumbnails with center crop.

```
Name: thumbnail_{{size}}

magick {{input}} \
  -resize {{size}}x{{size}}^ \
  -gravity center \
  -extent {{size}}x{{size}} \
  -unsharp 0x1 \
  -quality {{quality}} \
  {{output}}

Sizes:
- Icon: 100x100, q: 80
- Small thumb: 200x200, q: 85
- Medium thumb: 400x400, q: 85
- Large thumb: 800x800, q: 90

Batch mode:
magick mogrify -path {{output_dir}} -resize {{size}}x{{size}}^ -gravity center -extent {{size}}x{{size}} -quality {{quality}} {{input_dir}}/*.jpg
```

**Usage Notes:** The ^ flag ensures minimum covering crop. Unsharp filter compensates for softening during resize. Use path option with mogrify to preserve originals.

---

## Template 3: Composite Watermark

**Description:** Apply watermark or logo overlay to images.

```
Name: watermark_{{position}}

magick {{input}} \
  \( {{watermark}} -resize {{wm_width}} -background none -gravity {{gravity}} -geometry +{{x}}+{{y}} \) \
  -compose {{blend_mode}} -composite \
  -flatten \
  {{output}}

Parameters:
- position: northwest, north, northeast, west, center, east, southwest, south, southeast
- watermark: PNG with transparency recommended
- wm_width: scale watermark to this width (preserves aspect)
- x, y: offset from gravity reference point
- blend_mode: over, multiply, screen, overlay, difference

Example positions:
- Bottom right: southeast +20+20
- Top left: northwest +10+10
- Center: center +0+0
```

**Usage Notes:** Use PNG for watermark with transparency. Resize watermark relative to image size. Test blend mode for desired visibility.

---

## Template 4: Batch Format Conversion

**Description:** Convert all images in folder to different format.

```
Name: batch_convert_{{target_format}}

# Single directory, preserve structure
magick mogrify -path {{output_dir}} -format {{target_format}} -quality {{quality}} {{input_dir}}/*.{{source_format}}

# Recursive with subdirectories
Get-ChildItem -Path {{input_dir}} -Filter *.{{source_format}} -Recurse | ForEach-Object {
    $relPath = $_.DirectoryName.Replace("{{input_dir}}", "")
    $outDir = "{{output_dir}}$relPath"
    New-Item -ItemType Directory -Force -Path $outDir
    magick $_.FullName -quality {{quality}} -colorspace sRGB "$outDir\$($_.BaseName).{{target_format}}"
}

Common conversions:
- PNG to JPEG (loses transparency, use -background white)
- TIFF to JPEG (lossy compression for web)
- WebP to PNG (preserves quality)
- HEIC to JPEG (requires delegate)
- SVG to PNG (rasterize at specific resolution)
```

**Usage Notes:** PNG to JPEG requires -flatten to handle transparency. TIFF to JPEG is ideal for web. Use -strip to remove metadata from converted files.

---

## Template 5: Image Effects and Filters

**Description:** Apply creative effects and filters to images.

```
Name: effect_{{effect_name}}

# Grayscale
magick {{input}} -colorspace Gray {{output}}

# Sepia tone
magick {{input}} -sepia-tone {{intensity}}% {{output}}
# intensity: 0-100 (80=recommended vintage look)

# Blur
magick {{input}} -blur 0x{{sigma}} {{output}}
# sigma: 2 (light), 5 (medium), 10 (heavy)

# Sharpen
magick {{input}} -sharpen 0x{{sigma}} {{output}}
# sigma: 0.5 (light), 1.0 (medium), 2.0 (strong)

# Oil painting effect
magick {{input}} -paint {{radius}} {{output}}
# radius: 1-5 (lower = more detail retained)

# Charcoal sketch
magick {{input}} -charcoal 0x{{factor}} {{output}}
# factor: 1-5 (higher = more abstract)

# Vignette
magick {{input}} -background black -vignette {{radius}}x{{sigma}} {{output}}
# radius: 0-50% of image, sigma: 0-50

# Polaroid effect
magick {{input}} -polaroid {{angle}} {{output}}
# angle: rotation degrees
```

**Usage Notes:** Apply effects after resizing for faster processing. Combine multiple effects in sequence. Test sigma values to find sweet spot for each image.

---

## Template 6: GIF Animation Creation

**Description:** Create animated GIF from image sequence.

```
Name: gif_anim_{{name}}

# From PNG sequence
magick frame_*.png -delay {{delay}} -loop {{loop}} -layers Optimize {{output}}.gif
# delay: 10 (100fps), 20 (50fps), 100 (10fps)
# loop: 0 (infinite), 1+ (number of repeats)

# From existing images with transitions
magick img1.jpg img2.jpg img3.jpg \
  -delay {{delay}} -loop 0 \
  -morph {{morph_frames}} \
  -layers Optimize \
  {{output}}.gif
# morph_frames: number of transition frames between images

# Optimization
magick {{input}}.gif -fuzz {{fuzz}}% -layers Optimize {{output}}_optimized.gif
# fuzz: 5-15% for color similarity threshold
```

**Usage Notes:** Reduce color count with -colors 128 or -colors 256 for smaller files. Use -layers Optimize for frame optimization. Keep dimensions reasonable (<800px).

---

## Template 7: Metadata Management

**Description:** Read, preserve, strip, or modify image metadata.

```
Name: metadata_{{action}}

# Read all metadata
magick identify -verbose {{input}}

# List only EXIF data
magick identify -format "%[EXIF:*]" {{input}}

# Strip all metadata
magick {{input}} -strip {{output}}

# Preserve metadata during conversion
magick {{input}} -quality {{quality}} +profile "*" {{output}}
# +profile "*" preserves existing profiles

# Add copyright metadata
magick {{input}} -set Copyright "{{copyright_text}}" {{output}}

# Set EXIF data
magick {{input}} -define exif:DateTimeOriginal="{{datetime}}" {{output}}

# Remove specific profile
magick {{input}} -profile "{{profile_name}}" {{output}}

# Extract embedded ICC profile
magick {{input}} {{input}}.icc
```

**Usage Notes:** Use +profile "*" to preserve ICC profiles during resize/conversion. Strip metadata for web uploads (privacy/size). Always keep copyright attribution.

---

## Template 8: Montage / Contact Sheet

**Description:** Create image grids and contact sheets.

```
Name: montage_{{layout}}

# Simple grid
magick montage {{input1}} {{input2}} {{input3}} {{input4}} \
  -tile {{cols}}x{{rows}} \
  -geometry {{thumb_width}}x{{thumb_height}}+{{spacing}}+{{spacing}} \
  -title "{{title}}" \
  -pointsize {{title_size}} \
  {{output}}.jpg

# Contact sheet with labels
magick montage *.jpg \
  -tile {{cols}}x{{rows}} \
  -geometry {{width}}x{{height}}+{{h_space}}+{{v_space}} \
  -label "%f" \
  -pointsize {{label_size}} \
  {{output}}.jpg

# With border and shadow
magick montage *.jpg \
  -tile 4x \
  -geometry 200x200+10+10 \
  -background "{{bg_color}}" \
  -shadow \
  -frame 5 \
  {{output}}.jpg
```

**Usage Notes:** Use -label "%f" for filenames under thumbnails. Tiles auto-flow to rows with 4x (4 columns, unlimited rows). For e-commerce QC sheets, use 3x4 tiles with product ID labels.
