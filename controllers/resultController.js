const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const convert = require("heic-convert");

// Set up multer storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Set up file filter to allow only JPEG, PNG, HEIC, HEIF
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Only JPEG, PNG, HEIC, and HEIF are allowed."), false);
  }
};

// Final multer setup: storage, size limit, file filter
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

module.exports.uploadImage = [
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("❌ Upload error:", err.message);
        return res.status(400).render("analyse", { 
          title: "Analyse Your Leaf", 
          error: err.message 
        });
      }
      if (!req.file) {
        return res.status(400).render("analyse", { 
          title: "Analyse Your Leaf", 
          error: "No file uploaded. Please select an image." 
        });
      }
      next();
    });
  },
  async (req, res) => {
    let filePath = req.file.path;
    const outputFilePath = `uploads/${Date.now()}-converted.jpg`;

    console.log("Original filename:", req.file.originalname);
    console.log("MIME type:", req.file.mimetype);
    console.log("File path:", filePath);

    try {
      // Detect file extension
      const fileExt = path.extname(req.file.originalname).toLowerCase();

      // HEIC/HEIF conversion
      if (
        req.file.mimetype.includes("heic") ||
        req.file.mimetype.includes("heif") ||
        fileExt === ".heic" ||
        fileExt === ".heif"
      ) {
        console.log("🔄 Converting HEIC/HEIF to JPEG...");
        const inputBuffer = fs.readFileSync(filePath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: "JPEG",
        });
        fs.writeFileSync(outputFilePath, outputBuffer);
        filePath = outputFilePath;
        console.log("✅ HEIC/HEIF conversion done! New file:", filePath);
      }
      // PNG conversion
      else if (req.file.mimetype.includes("png") || fileExt === ".png") {
        console.log("🔄 Converting PNG to JPEG...");
        await sharp(filePath)
          .toFormat("jpeg")
          .toFile(outputFilePath);
        filePath = outputFilePath;
        console.log("✅ PNG conversion done! New file:", filePath);
      }

      // Send file to Python server
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

      // Render analysis result and show uploaded image
      res.render("results", {
        title: "Analysis Results",
        cropName: analysisResult.result,
        status: analysisResult.confidence,
        imagePath: "/" + filePath // Pass image path to view
      });

      // Delete files after 30 seconds
      setTimeout(() => {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          if (filePath !== req.file.path && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          console.log("🗑️ Files deleted after 10 seconds!");
        } catch (unlinkError) {
          console.error("❌ Error deleting file after delay:", unlinkError);
        }
      }, 10000);

    } catch (err) {
      console.error("❌ Error processing image:", err);
      res.status(500).send("Error processing the image");

      // Attempt cleanup on error immediately
      try {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        if (filePath && filePath !== req.file.path && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (unlinkError) {
        console.error("❌ Error deleting file after failure:", unlinkError);
      }
    }
  },
];
