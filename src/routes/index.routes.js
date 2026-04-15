const express = require('express');
const { getHome, getProducts, getServices, getContact } = require('../controllers/homeController');

const router = express.Router();

router.get('/home', getHome);
router.get('/products', getProducts);
router.get('/services', getServices);
router.get('/contact', getContact);
router.get('/', getHome); // default route

module.exports = router;
