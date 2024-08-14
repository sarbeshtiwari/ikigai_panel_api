const express = require('express');
const router = express.Router();
const {
  // createMetaInfo,
  getAllBanners,
  getBannerByID,
  updateBannerStatus,
  deleteBanner,
  // updateBanner
} = require('../controllers/home_banner');

// // Route to handle meta information and image upload
// router.post('/upload', createMetaInfo);

// Route to get all home banners
router.get('/get', getAllBanners);

// Route to get home banner by ID
router.get('/getByID/:id', getBannerByID);

// Route to update home banner status
router.patch('/updateStatus', updateBannerStatus);

// Route to delete home banner
router.delete('/delete/:id', deleteBanner);

// // Route to update home banner entry
// router.put('/update/:id', updateBanner);

module.exports = router;

