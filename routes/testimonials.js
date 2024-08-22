const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const testimonialController = require('../controllers/testimonials');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');

const router = express.Router();

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'uploads/testimonials',
//         allowed_formats: ['jpg', 'png', 'jpeg'],
//         public_id: (req, file) => file.originalname,
//     },
// });

// const upload = multer({ 
//     storage: storage
// });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        if (file.mimetype.startsWith('image/')) {
            return {
                folder: 'uploads/testimonials',
                allowed_formats: ['jpg', 'png', 'jpeg'],
                public_id: file.originalname
            };
        } else if (file.mimetype.startsWith('video/')) {
            return {
                folder: 'uploads/testimonials',
                allowed_formats: ['mp4', 'mov', 'avi'],
                resource_type: 'video',
                eager: [
                    { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
                    { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
                ],
                eager_async: true,
                public_id: file.originalname
            };
        }
    }
});

const upload = multer({ 
    storage: storage
});

router.post('/addTestimonials', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), (req, res, next) => {
    console.log('Files:', JSON.stringify(req.files, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Proceed with your controller
    testimonialController.createTestimonial(req, res, next);
});



// Routes for testimonials
// router.post('/addTestimonials', upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'video', maxCount: 1 }
// ]), (req, res, next) => {
//     console.log('Files:', JSON.stringify(req.files, null, 2));
// console.log('Body:', JSON.stringify(req.body, null, 2));



//     // Proceed with your controller
//     testimonialController.createTestimonial(req, res, next);
// });

router.put('/updateTestimonials/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), testimonialController.updateTestimonial);
router.get('/getByID/:id', testimonialController.getTestimonialById);
router.get('/getTestimonials', testimonialController.getAllTestimonials);

// Route to update testimonials status
router.patch('/updateStatus', testimonialController.UpdateTestimonialStatus);


// Route to delete testimonials
router.delete('/delete/:id', testimonialController.deleteTestimonial);

module.exports = router;
