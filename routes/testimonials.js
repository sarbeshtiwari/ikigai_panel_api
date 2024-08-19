const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const testimonialController = require('../controllers/testimonials');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');

const router = express.Router();
// const upload = multer({ storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = 'uploads/testimonials/';
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// }) });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/testimonials',
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'],
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

// Routes for testimonials
router.post('/addTestimonials', upload.fields([{ name: 'image' }, { name: 'video' }]), testimonialController.createTestimonial);
// router.put('/updateTestimonials/:id', upload.fields([{ name: 'image' }, { name: 'video' }]), testimonialController.updateTestimonial);
router.get('/getByID/:id', testimonialController.getTestimonialById);
router.get('/getTestimonials', testimonialController.getAllTestimonials);

// Route to update testimonials status
router.patch('/updateStatus', testimonialController.UpdateTestimonialStatus);


// Route to delete testimonials
router.delete('/delete/:id', testimonialController.deleteTestimonial);

module.exports = router;
