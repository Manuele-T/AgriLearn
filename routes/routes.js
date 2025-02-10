const express = require('express');
const path = require('path'); 
const router = express.Router();

// Import controllers with correct paths
const homeController = require(path.join(__dirname, '../controllers/homeController'));
const cropController = require(path.join(__dirname, '../controllers/cropController'));
const resultController = require(path.join(__dirname, '../controllers/resultController'));

// Home route
router.get('/', homeController.getHomePage);

// Static pages (no controller needed)
router.get('/about', (req, res) => res.render('about'));
router.get('/mission', (req, res) => res.render('mission'));
router.get('/agricultureUK', (req, res) => res.render('agricultureUK'));
router.get('/tips', (req, res) => res.render('tips'));

// Crop details route
router.get('/crops/:cropId', cropController.getCropDetails);

// Upload and results route
router.post('/upload', resultController.uploadImage);

module.exports = router;

