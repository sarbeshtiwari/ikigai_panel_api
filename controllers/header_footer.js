const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const { saveFormData, getAllDetails, getLogoStatus, updateFormData } = require('../model/header_footer');
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

  const updateDetails = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    try {
        upload.single('logo')(req, res, async (err) => {
            if (err) return res.status(400).send(err.message);

            // Retrieve the uploaded logo file path if available
            const logoPath = req.file ? req.file.path : null;

            let logoUrl = null;

            try {
                // If no new logo file is uploaded, check the existing logo URL from the database

                if (!logoPath) {
                    const existingLogo = await getLogoStatus();
                   
                    if (existingLogo) {
                        logoUrl = existingLogo;

                        console.log(logoUrl);
                    } else {
                        return res.status(400).json({ success: false, message: 'No file uploaded and no existing logo found' });
                    }
                } else {
                    // Upload the new logo image to Cloudinary
                    const cloudinaryResult = await uploadToCloudinary(logoPath);
                    logoUrl = cloudinaryResult.secure_url;
                }

                // Parse the form data
                const { phone_number, footer_title, footer_description, address, contact_phones, email, logo } = req.body;
                const buttons = JSON.parse(req.body.buttons);
                console.log(req.body);

                // Save form data including the logo URL
                const result = await updateFormData({
                    logo,
                    buttons,
                    phone_number,
                    footer_title,
                    footer_description,
                    address,
                    contact_phones,
                    email,
                    id
                });

                res.status(201).json({ success: true, result });
            } catch (dbError) {
                console.error('Database Error:', dbError);
                res.status(500).json({ success: false, message: 'Database Error: ' + dbError.message });
            } finally {
                // Clean up the uploaded logo file if it was uploaded
                if (logoPath) {
                    fs.unlink(logoPath, (err) => {
                        if (err) console.error('Failed to delete temporary file:', err);
                    });
                }
            }
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};


module.exports = {
    submitForm, getDetails, updateDetails
};
