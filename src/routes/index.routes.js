const express = require('express');
const multer  = require('multer');
const { getHome, getProducts, getServices, getContact, getAbout, getBlog, getChangelog, getPrivacy, getTerms } = require('../controllers/homeController');
const { submitCareers } = require('../controllers/careersController');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        cb(null, allowed.includes(file.mimetype));
    },
});

router.get('/', getHome);
router.get('/home', getHome);
router.get('/products', getProducts);
router.get('/services', getServices);
router.get('/contact', getContact);
router.get('/about', getAbout);
router.get('/blog', getBlog);
router.get('/changelog', getChangelog);
router.get('/privacy', getPrivacy);
router.get('/terms', getTerms);

router.post('/api/careers', upload.single('resume'), submitCareers);
router.post('/api/contact', submitContact);

module.exports = router;
