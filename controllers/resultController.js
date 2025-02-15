const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const convert = require("heic-convert");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

module.exports.uploadImage = [
  upload.single("image"),
  async (req, res) => {
    let filePath = req.file.path;
    const outputFilePath = `uploads/${Date.now()}-converted.jpg`;

    // Log details to see what’s really being uploaded
    console.log("Original filename:", req.file.originalname);
    console.log("MIME type:", req.file.mimetype);
    console.log("File path:", filePath);

    try {
      // 1) Detect HEIC by MIME or extension
      const fileExt = path.extname(req.file.originalname).toLowerCase();

      // Convert HEIC if either MIME or file extension indicates HEIC
      if (
        req.file.mimetype.includes("heic") ||
        req.file.mimetype.includes("heif") ||
        fileExt === ".heic" ||
        fileExt === ".heif"
      ) {
        console.log("🔄 Converting HEIC/HEIF to JPEG...");

        // Read & convert with 'heic-convert'
        const inputBuffer = fs.readFileSync(filePath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: "JPEG",
        });

        fs.writeFileSync(outputFilePath, outputBuffer);
        filePath = outputFilePath; // Use the new JPEG path

        console.log("✅ HEIC/HEIF conversion done! New file:", filePath);
      }
      // 2) Convert PNG with sharp (optional)
      else if (req.file.mimetype.includes("png") || fileExt === ".png") {
        console.log("🔄 Converting PNG to JPEG...");

        await sharp(filePath)
          .toFormat("jpeg")
          .toFile(outputFilePath);

        filePath = outputFilePath; // Use the new JPEG path

        console.log("✅ PNG conversion done! New file:", filePath);
      }

      // 3) Send the (possibly converted) file to Python
      const fetch = (...args) =>
        import("node-fetch").then(({ default: fetch }) => fetch(...args));

      const form = new FormData();
      form.append("image", fs.createReadStream(filePath));

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      });

      const analysisResult = await response.json();

      // 4) Cleanup: Delete both the original & converted files
      try {
        fs.unlinkSync(req.file.path); // Delete the original uploaded file
        if (filePath !== req.file.path) {
          fs.unlinkSync(filePath); // Delete the converted file if different
        }
        console.log("🗑️ Files deleted successfully!");
      } catch (unlinkError) {
        console.error("❌ Error deleting file:", unlinkError);
      }

      // 5) Render results
      res.render("results", {
        title: "Analysis Results",
        cropName: analysisResult.result,
        status: analysisResult.confidence,
      });

    } catch (err) {
      console.error("❌ Error processing image:", err);
      res.status(500).send("Error processing the image");

      // Cleanup in case of errors
      try {
        fs.unlinkSync(req.file.path); // Ensure the original file is deleted
        if (filePath !== req.file.path) {
          fs.unlinkSync(filePath); // Delete the converted file if different
        }
      } catch (unlinkError) {
        console.error("❌ Error deleting file after failure:", unlinkError);
      }
    }
  },
];
