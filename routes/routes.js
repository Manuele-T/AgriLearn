const express = require('express');
const path = require('path'); // Add path module
const router = express.Router();

// Import controllers with correct paths
const homeController = require(path.join(__dirname, '../controllers/homeController'));
const cropController = require(path.join(__dirname, '../controllers/cropController'));
const resultController = require(path.join(__dirname, '../controllers/resultController'));

// Home route
router.get('/', homeController.getHomePage);

// Crop details route
router.get('/crops/:cropId', cropController.getCropDetails);

// Upload and results route
router.post('/upload', resultController.uploadImage);

module.exports = router;
