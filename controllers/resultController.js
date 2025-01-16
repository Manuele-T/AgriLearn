const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Analyze uploaded image
exports.uploadImage = [
    upload.single('image'), // Middleware for handling file upload
    (req, res) => {
        const filePath = req.file.path;

        // Simulate ML model's output (replace this with real ML logic)
        const analysisResult = {
            cropName: "Tomato", // Example
            status: "Healthy"   // Example
        };

        res.render('results', { title: "Analysis Results", ...analysisResult });
    }
];
