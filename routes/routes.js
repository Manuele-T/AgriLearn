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
router.get('/allcrops', (req, res) => res.render('allcrops'));

router.get('/crops/apple', (req, res) => res.render('crops/apple'));
router.get('/crops/blueberry', (req, res) => res.render('crops/blueberry'));
router.get('/crops/cherry', (req, res) => res.render('crops/cherry'));
router.get('/crops/bellpepper', (req, res) => res.render('crops/bellpepper'));
router.get('/crops/potato', (req, res) => res.render('crops/potato'));
router.get('/crops/strawberry', (req, res) => res.render('crops/strawberry'));
router.get('/crops/tomato', (req, res) => res.render('crops/tomato'));
router.get('/crops/raspberry', (req, res) => res.render('crops/raspberry'));

// Crop details route
router.get('/crops/:cropId', cropController.getCropDetails);

// Upload and results route
router.post('/upload', resultController.uploadImage);

module.exports = router;
