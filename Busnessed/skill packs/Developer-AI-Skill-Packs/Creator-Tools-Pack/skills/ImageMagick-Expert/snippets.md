# ImageMagick-Expert Snippets

## Snippet 1: Image Info and Analysis

**Description:** Get detailed information about an image.

```bash
magick identify -verbose input.jpg
```

**When to use:** Before processing to check dimensions, color space, bit depth, compression, and metadata.

---

## Snippet 2: Resize with Aspect Ratio and Crop

**Description:** Resize image to fill exact dimensions with center crop.

```bash
magick input.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 90 output.jpg
```

**When to use:** Creating consistent-sized thumbnails or cover images where exact dimensions are required.

---

## Snippet 3: Batch Convert to WebP

**Description:** Convert all JPEGs in folder to WebP format.

```bash
magick mogrify -path output/webp -format webp -quality 85 -define webp:method=6 *.jpg
```

**When to use:** Modernizing website images to WebP format for better compression and faster loading.

---

## Snippet 4: Add Drop Shadow to Product Image

**Description:** Create a realistic drop shadow for object images.

```bash
magick input.png \( +clone -background black -shadow 60x8+5+5 \) +swap -background white -layers merge +repage output.png
```

**When to use:** E-commerce product photos, UI elements, or any cutout image needing depth.

---

## Snippet 5: Create Image with Text Overlay

**Description:** Add text annotation to image with styling.

```bash
magick input.jpg -font Arial-Bold -pointsize 48 -fill white -stroke black -strokewidth 2 -gravity south -annotate +0+20 "Copyright 2026" output.jpg
```

**When to use:** Adding copyright notices, captions, dates, or branding text to images.

---

## Snippet 6: Auto-Orient and Normalize

**Description:** Auto-correct orientation and normalize exposure.

```bash
magick input.jpg -auto-orient -auto-level -auto-gamma -colorspace sRGB -quality 90 output.jpg
```

**When to use:** Processing camera photos with varying orientation, exposure, and color balance.

---

## Snippet 7: Create Image Strip / Contact Sheet

**Description:** Combine multiple images into a single strip.

```bash
magick montage image1.jpg image2.jpg image3.jpg -tile 3x1 -geometry +2+2 -background black strip.jpg
```

**When to use:** Creating comparison views, before/after composites, or contact sheets for review.

---

## Snippet 8: Remove EXIF and Metadata

**Description:** Strip all metadata from image for privacy or file size.

```bash
magick input.jpg -strip -quality 90 output.jpg
```

**When to use:** Before uploading images to web to remove GPS location, camera serial, and personal data.

---

## Snippet 9: Apply Color Overlay / Tint

**Description:** Apply a color tint overlay to an image.

```bash
magick input.jpg -fill "rgba(255, 100, 50, 0.3)" -colorize 50%% output.jpg
```

**When to use:** Creating duotone effects, brand color overlays, or mood adjustments.

---

## Snippet 10: Round Corners on Image

**Description:** Apply rounded corners to an image.

```bash
magick input.jpg -matte \( +clone -alpha transparent -draw "roundrectangle 0,0,%[w],%[h],40,40" \) -compose DstIn -composite output.png
```

**When to use:** Creating profile pictures, thumbnail cards, or UI elements with rounded corners.

---

## Snippet 11: Compare Two Images

**Description:** Calculate visual difference between two images.

```bash
magick compare -metric AE original.jpg modified.jpg diff.png
```

**When to use:** Quality control, verifying compression artifacts, or detecting unauthorized modifications.

---

## Snippet 12: Create Pattern / Tile

**Description:** Create a seamless repeating pattern.

```bash
magick -size 100x100 xc:red xc:white xc:blue +append -write mpr:tile +delete -size 400x400 tile:mpr:tile pattern.png
```

**When to use:** Generating background patterns, textures, or placeholder images for web design.

---

## Snippet 13: Convert PDF to Images

**Description:** Convert PDF pages to individual images.

```bash
magick -density 150 input.pdf -quality 90 -resize 1920x^ -colorspace sRGB output_%02d.jpg
```

**When to use:** Creating preview images from PDF documents for web galleries or thumbnails.

---

## Snippet 14: Batch Rename with Sequence Number

**Description:** Rename processed images with sequential numbering.

```bash
magick mogrify -path output -set filename:seq "%[fx:page_num+1]" -strip "input_*.jpg"
```

**When to use:** When batch processing produces files that need sequential renaming for order preservation.

---

## Snippet 15: Image Compression Test

**Description:** Test different quality levels to find optimal balance.

```bash
for /L %i in (50,10,100) do magick input.jpg -quality %i -strip test_q%i.jpg
```

**When to use:** When determining the best quality/size tradeoff for a specific image type or platform requirement.
