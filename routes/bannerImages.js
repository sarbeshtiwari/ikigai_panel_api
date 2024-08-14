// routes/bannerRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const bannerController = require('../controllers/bannerImages');

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';
        if (file.fieldname === 'desktop_image') {
            folder = 'uploads/banner_image/desktop';
        } else if (file.fieldname === 'mobile_image') {
            folder = 'uploads/banner_image/mobile';
        } else if (file.fieldname === 'tablet_image') {
            folder = 'uploads/banner_image/tablet';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename || Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Define routes
router.post('/saveBanner/:id?', upload.fields([
    { name: 'desktop_image', maxCount: 1 },
    { name: 'mobile_image', maxCount: 1 },
    { name: 'tablet_image', maxCount: 1 }
]), bannerController.createOrUpdateBanner);

router.get('/fetchBanner/:id', bannerController.fetchBannerById);

module.exports = router;
