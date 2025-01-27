const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Analyze uploaded image
module.exports.uploadImage = [
    upload.single("image"), // Middleware for handling file upload
    async (req, res) => {
        const filePath = req.file.path;

        try {
            // Dynamically import node-fetch
            const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

            // Prepare the image for the Python server
            const form = new FormData();
            form.append("image", fs.createReadStream(filePath));

            // Send the image to the Python server
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                body: form,
                headers: form.getHeaders()
            });

            // Parse the Python server's response
            const analysisResult = await response.json();

            // Render the results page with the data
            res.render("results", {
                title: "Analysis Results",
                cropName: analysisResult.result,
                status: analysisResult.confidence
            });
        } catch (err) {
            console.error("Error communicating with ML server:", err);
            res.status(500).send("Error processing the image");
        }
    }
];
