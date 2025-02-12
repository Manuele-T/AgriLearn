const express = require('express');
const path = require('path'); 
const router = express.Router();

// Import controllers with correct paths
const homeController = require(path.join(__dirname, '../controllers/homeController'));
const cropController = require(path.join(__dirname, '../controllers/cropController'));
const resultController = require(path.join(__dirname, '../controllers/resultController'));

// Home route with Hero Section
router.get('/', (req, res) => {
    res.render('home', { heroImage: '/img/home.jpg' });
});

// Static pages (no Hero by default)
router.get('/about', (req, res) => res.render('about'));
router.get('/agricultureUK', (req, res) => res.render('agricultureUK'));
router.get('/tips', (req, res) => res.render('tips'));
router.get('/analyse', (req, res) => res.render('analyse'));


// Crop details route
router.get('/crops/:cropId', cropController.getCropDetails);

// Upload and results route
router.post('/upload', resultController.uploadImage);

module.exports = router;
