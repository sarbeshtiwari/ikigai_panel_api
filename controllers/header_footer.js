const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const { saveFormData, getAllDetails } = require('../model/header_footer');
const path = require('path');
const fs = require('fs');

// Setup Multer for file uploads
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/header',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => file.originalname,
    },
});
const upload = multer({ storage: storage });

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return result;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        throw error;
    }
};

// Handle form submission
const submitForm = async (req, res) => {
    
    try {
        upload.single('logo')(req, res, async (err) => {
            if (err) return res.status(400).send(err.message);

            const logo = req.file ? req.file.path : null;

            if (!logo) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            try {
                // Upload to Cloudinary
                const cloudinaryResult = await uploadToCloudinary(logo);
                const logoUrl = cloudinaryResult.secure_url;

                const { phoneNumber, footerTitle, footerDescription, address, contactPhones, email } = req.body;
                const buttons = JSON.parse(req.body.buttons);

                const result = await saveFormData({
                    logo: logoUrl,
                    buttons,
                    phoneNumber,
                    footerTitle,
                    footerDescription,
                    address,
                    contactPhones,
                    email
                });
                
                res.status(201).json({ success: true, result });
            } catch (dbError) {
                console.error('Database Error:', dbError);
                res.status(500).json({ success: false, message: 'Database Error: ' + dbError.message });
            } finally {
                fs.unlink(logo, (err) => {
                    if (err) console.error('Failed to delete temporary file:', err);
                });
            }
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// Get all  
const getDetails = async (req, res) => {
    try {
      const results = await getAllDetails();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };


module.exports = {
    submitForm, getDetails
};
