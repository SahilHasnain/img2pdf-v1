# Image to PDF Converter

Convert images to PDF documents with two modes: single combined PDF or multiple individual PDFs.

## Installation

```bash
npm install
```

## Setup

Create an `images` folder and place your images there:

```bash
mkdir images
```

Supported formats: JPG, JPEG, PNG

## Usage

### Scenario 1: Convert all images to ONE PDF (multiple pages)

```bash
npm run convert:single
```

Or:

```bash
node convert.js single
```

Output: `pdf/combined.pdf` with all images as separate pages

### Scenario 2: Convert each image to SEPARATE PDFs

```bash
npm run convert:multiple
```

Or:

```bash
node convert.js multiple
```

Output: Individual PDF files in `pdf/` folder (one per image)

## Example

```bash
# Add images to the images folder
images/
  ├── page1.jpg
  ├── page2.jpg
  └── page3.png

# Run single PDF conversion
npm run convert:single

# Result: pdf/combined.pdf (3 pages)
```
