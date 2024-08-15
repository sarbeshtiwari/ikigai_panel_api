const express = require('express');
const router = express.Router();
const { upload, saveBanner, getBannerById } = require('../controllers/bannerImages');

// Routes
router.post('/saveBanner/:id?', upload.fields([
    { name: 'desktop_image', maxCount: 1 },
    { name: 'mobile_image', maxCount: 1 },
    { name: 'tablet_image', maxCount: 1 }
]), saveBanner);

router.get('/getBanner/:id', getBannerById);

module.exports = router;
