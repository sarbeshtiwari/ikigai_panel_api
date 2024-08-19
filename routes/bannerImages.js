const express = require('express');
const router = express.Router();
const { saveBanner, getBannerById, UpdateBannerStatus, deleteBanner } = require('../controllers/bannerImages');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const multer = require('multer');

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
        folder: 'uploads/banner_image',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => file.originalname,
    //   };
    },
});

const upload = multer({ storage: storage });


// Routes
router.post('/saveBanner/:id?', upload.fields([
    { name: 'desktop_image', maxCount: 1 },
    { name: 'mobile_image', maxCount: 1 },
    { name: 'tablet_image', maxCount: 1 }
]), saveBanner);

router.get('/getBanner/:id', getBannerById);

// Route to update Banner status
router.patch('/updateStatus', UpdateBannerStatus);


// Route to delete Banner
router.delete('/delete/:id', deleteBanner);

module.exports = router;
