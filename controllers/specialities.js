const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const {
    addSpeciality,
    getAllOurSpeciality,
    updateOurSpecialityStatus,
    getOurSpecialityByID,
    deleteOurSpecialityFromDB,
    getImagePathByID,
    updateOurSpeciality
} = require('../model/specialities');

// Middleware for handling file upload (using multer)
const multer = require('multer');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads/our_specialities',
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

// Create new our Speciality entry
const createOurSpeciality = async (req, res) => {
  try {
    
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);

      const tempFilePath = req.file ? req.file.path : null; // Updated to use path

      if (!tempFilePath) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      const {
        heading, content, schema_data
      } = req.body;

      const cloudinaryResult = await uploadToCloudinary(tempFilePath);
      const image_path = cloudinaryResult.secure_url;

      try {
        const result = await addSpeciality(heading, content, schema_data, image_path);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
      } finally {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Speciality us
const getOurSpeciality = async (req, res) => {
  try {
    const results = await getAllOurSpeciality();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get our Speciality by ID
const getSpecialityByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const result = await getOurSpecialityByID(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update our Speciality status
const updateSpecialityStatus = async (req, res) => {
  const { id, status } = req.body;
  if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });

  try {
    const result = await updateOurSpecialityStatus(id, status);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Speciality us
const deleteOurSpeciality = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const imagePath = await getImagePathByID(id);
      if (imagePath) await deleteFromCloudinary(imagePath);
    
    await deleteOurSpecialityFromDB(id);
    res.status(200).json({ success: true, message: 'our Speciality deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update our Speciality entry
const updateSpeciality = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).send(err.message);

    const {
      heading, content, schema_data
    } = req.body;
    
    const newImagePath = req.file ? req.file.path : null;
    let image_path = null; // Default to null

    try {
      // Fetch the current image path from the database
      const oldImagePath = await getImagePathByID(id);
      let cloudinaryResult;

      // Upload new image to Cloudinary if provided
      if (newImagePath) {
        cloudinaryResult = await uploadToCloudinary(newImagePath);
        image_path = cloudinaryResult.secure_url;

        // Remove old image from Cloudinary if it exists and is different
        if (oldImagePath && oldImagePath !== image_path) {
          await deleteFromCloudinary(oldImagePath);
        }
      } else {
        // No new image uploaded; use the old image URL
        image_path = oldImagePath;
      }

      // Update the database with the new data
      const result = await updateOurSpeciality(id, heading, content, schema_data, image_path);

      // Clean up temporary file if a new image was uploaded
      if (newImagePath) {
        fs.unlink(newImagePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      }

      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
      console.error('Update Error:', error);
      res.status(500).json({ message: 'Failed to update data', error: error.message });
    }
  });
};


module.exports = {
  createOurSpeciality,
  getOurSpeciality,
  getSpecialityByID,
  updateSpecialityStatus,
  deleteOurSpeciality,
  updateSpeciality
};
