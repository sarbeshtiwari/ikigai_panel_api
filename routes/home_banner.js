const express = require('express');
const router = express.Router();

const {
  // createMetaInfo,
  saveHomeBanner,
  getAllBanners,
  getBannerByID,
  updateBannerStatus,
  deleteBanner,
  // updateBanner
} = require('../controllers/home_banner');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      // Determine the folder based on the field name
    //   let folder;
    //   switch (file.fieldname) {
    //     case 'desktop_image':
    //       folder = 'uploads/banner_image/desktop';
    //       break;
    //     case 'mobile_image':
    //       folder = 'uploads/banner_image/mobile';
    //       break;
    //     case 'tablet_image':
    //       folder = 'uploads/banner_image/tablet';
    //       break;
    //     default:
    //       folder = 'uploads/banner_image';
    //   }
  
    //   return {
        folder: 'uploads/home_banner',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => file.originalname,
    //   };
    },
});

const upload = multer({ storage: storage });

// // Route to handle meta information and image upload
// router.post('/upload', createMetaInfo);
// Routes for home banner
router.post('/upload/:id?', upload.fields([
  { name: 'desktop_image', maxCount: 1 },
  { name: 'mobile_image', maxCount: 1 },
  { name: 'tablet_image', maxCount: 1 }
]), saveHomeBanner);

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

