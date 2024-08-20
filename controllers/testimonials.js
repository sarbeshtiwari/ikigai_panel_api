const testimonialModel = require('../model/testimonials');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/testimonials',
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'], // Add other formats if needed
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ storage: storage });

const deleteFromCloudinary = async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      throw error;
    }
  };
  

// Create a new testimonial
const createTestimonial = async (req, res) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const { alt_tag, videoURL } = req.body;

    if (!req.files) {
        return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;

    try {
        const testimonialData = {
            image_path: imageFile ? imageFile.path : null,
            alt_tag,
            video_path: videoFile ? videoFile.path : null,
            videoURL
        };

        await testimonialModel.createTestimonial(testimonialData);

        res.status(201).json({ success: true, message: 'Testimonial created successfully.' });
    } catch (error) {
        console.error('Server Error:', error); // Log entire error object
        console.error('Error Message:', error.message); // Log error message
        console.error('Error Stack:', error.stack); // Log stack trace for debugging
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// Update an existing testimonial
const updateTestimonial = (req, res) => {
    const id = req.params.id;
    const { alt_tag, videoURL} = req.body;
    const image_path = req.files['image'] ? req.files['image'][0].filename : null;
    const video_path = req.files['video'] ? req.files['video'][0].filename : null;

    const testimonialData = { image_path, alt_tag, video_path, videoURL};

    testimonialModel.updateTestimonial(id, testimonialData, (err, results) => {
        if (err) {
            console.error('Error updating testimonial:', err);
            return res.status(500).json({ success: false, message: 'Failed to update testimonial.' });
        }
        res.status(200).json({ success: true, message: 'Testimonial updated successfully.' });
    });
};

// Fetch a testimonial by ID
const getTestimonialById = (req, res) => {
    const id = req.params.id;

    testimonialModel.getTestimonialById(id, (err, results) => {
        if (err) {
            console.error('Error fetching testimonial:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch testimonial.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Testimonial not found.' });
        }
        res.status(200).json({ success: true, data: results[0] });
    });
};

// Fetch all testimonials
const getAllTestimonials = (req, res) => {
    testimonialModel.getAllTestimonials((err, results) => {
        if (err) {
            console.error('Error fetching testimonials:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch testimonials.' });
        }
        res.status(200).json({ success: true, data: results });
    });
};


// Update our Testimonial status
const UpdateTestimonialStatus = async (req, res) => {
    const { id, status } = req.body;
    if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await testimonialModel.updateTestimonialStatus(id, status);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Delete Testimonial us
  const deleteTestimonial = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    try {
      const { imagePath, videoPath} = await testimonialModel.getImagePathByID(id);
      if (imagePath) await deleteFromCloudinary(imagePath);
      if (videoPath) await deleteFromCloudinary(videoPath);
      
      await testimonialModel.deleteTestimonialFromDB(id);
      res.status(200).json({ success: true, message: 'our Testimonial deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

module.exports = {
    createTestimonial,
    updateTestimonial,
    getTestimonialById,
    getAllTestimonials,
    UpdateTestimonialStatus, deleteTestimonial
};
