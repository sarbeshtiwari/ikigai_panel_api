const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const testimonialController = require('../controllers/testimonials');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/testimonials',
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi'],
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ 
    storage: storage
});


// Routes for testimonials
router.post('/addTestimonials', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), (req, res, next) => {
    console.log('Files:', JSON.stringify(req.files, null, 2));
console.log('Body:', JSON.stringify(req.body, null, 2));



    // Proceed with your controller
    testimonialController.createTestimonial(req, res, next);
});
router.put('/updateTestimonials/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), testimonialController.updateTestimonial);
router.get('/getByID/:id', testimonialController.getTestimonialById);
router.get('/getTestimonials', testimonialController.getAllTestimonials);

// Route to update testimonials status
router.patch('/updateStatus', testimonialController.UpdateTestimonialStatus);


// Route to delete testimonials
router.delete('/delete/:id', testimonialController.deleteTestimonial);

module.exports = router;
