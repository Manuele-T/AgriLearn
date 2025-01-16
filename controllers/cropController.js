const cropsDB = require('../models/cropModel');

// Get details for a specific crop
exports.getCropDetails = (req, res) => {
    const cropId = req.params.cropId; // Extract crop ID from URL
    cropsDB.findOne({ _id: cropId }, (err, crop) => {
        if (err || !crop) {
            console.error("Error fetching crop:", err || "Crop not found");
            return res.status(404).render('error', { title: "Error", message: "Crop not found" });
        }
        res.render('crop', { title: crop.name, crop }); // Render crop page with data
    });
};
