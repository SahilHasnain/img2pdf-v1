const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const IMAGE_FOLDER = "./images";
const OUTPUT_FOLDER = "./pdf";

// Supported image extensions
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

async function getImageFiles() {
  if (!fs.existsSync(IMAGE_FOLDER)) {
    console.error(`Error: ${IMAGE_FOLDER} folder not found`);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGE_FOLDER);
  const imageFiles = files
    .filter((file) =>
      IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()),
    )
    .sort();

  if (imageFiles.length === 0) {
    console.error(`No images found in ${IMAGE_FOLDER}`);
    process.exit(1);
  }

  return imageFiles;
}

async function convertToSinglePDF(imageFiles) {
  console.log("Converting all images to a single PDF...");

  const pdfDoc = await PDFDocument.create();

  for (const imageFile of imageFiles) {
    const imagePath = path.join(IMAGE_FOLDER, imageFile);
    const imageBytes = fs.readFileSync(imagePath);
    const ext = path.extname(imageFile).toLowerCase();

    let image;
    if (ext === ".png") {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      image = await pdfDoc.embedJpg(imageBytes);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    console.log(`  Added: ${imageFile}`);
  }

  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(OUTPUT_FOLDER, "combined.pdf");
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`\nSuccess! Created: ${outputPath}`);
  console.log(`Total pages: ${imageFiles.length}`);
}

async function convertToMultiplePDFs(imageFiles) {
  console.log("Converting each image to a separate PDF...");

  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
  }

  for (const imageFile of imageFiles) {
    const pdfDoc = await PDFDocument.create();
    const imagePath = path.join(IMAGE_FOLDER, imageFile);
    const imageBytes = fs.readFileSync(imagePath);
    const ext = path.extname(imageFile).toLowerCase();

    let image;
    if (ext === ".png") {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      image = await pdfDoc.embedJpg(imageBytes);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    const pdfBytes = await pdfDoc.save();
    const outputName =
      path.basename(imageFile, path.extname(imageFile)) + ".pdf";
    const outputPath = path.join(OUTPUT_FOLDER, outputName);
    fs.writeFileSync(outputPath, pdfBytes);

    console.log(`  Created: ${outputPath}`);
  }

  console.log(`\nSuccess! Created ${imageFiles.length} PDF files`);
}

async function main() {
  const mode = process.argv[2];

  if (!mode || !["single", "multiple"].includes(mode)) {
    console.log("Usage:");
    console.log("  node convert.js single    - Convert all images to one PDF");
    console.log(
      "  node convert.js multiple  - Convert each image to separate PDFs",
    );
    console.log("\nOr use npm scripts:");
    console.log("  npm run convert:single");
    console.log("  npm run convert:multiple");
    process.exit(1);
  }

  const imageFiles = await getImageFiles();
  console.log(`Found ${imageFiles.length} images\n`);

  if (mode === "single") {
    await convertToSinglePDF(imageFiles);
  } else {
    await convertToMultiplePDFs(imageFiles);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
