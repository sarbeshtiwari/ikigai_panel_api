const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const multer = require('multer');
const {
    addTeam,
    getAllOurTeam,
    updateOurTeamStatus,
    getOurTeamByID,
    deleteOurTeamFromDB,
    getImagePathByID,
    updateOurTeam
} = require('../model/team');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads/our_team',
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

// Create new our team entry
const createOurTeam = async (req, res) => {
  try {
    
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);

      
      const {
        name, designation, heading, description
      } = req.body;

      
      const tempFilePath = req.file ? req.file.path : null; // Updated to use path

      if (!tempFilePath) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(tempFilePath);
        const image_path = cloudinaryResult.secure_url;

        const result = await addTeam(name, designation, heading, image_path, description);
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

// Get all Team us
const getOurTeam = async (req, res) => {
  try {
    const results = await getAllOurTeam();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get our team by ID
const getTeamByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const result = await getOurTeamByID(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update our team status
const updateTeamStatus = async (req, res) => {
  const { id, status } = req.body;
  if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });

  try {
    const result = await updateOurTeamStatus(id, status);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Team us
const deleteOurTeam = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const imagePath = await getImagePathByID(id);
    if (imagePath) await deleteFromCloudinary(imagePath);
    
    await deleteOurTeamFromDB(id);
    res.status(200).json({ success: true, message: 'our team deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update our team entry
const updateTeam = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).send(err.message);

    const {
      name, designation, heading, description
    } = req.body;
    
    const newImagePath = req.file ? req.file.path : null;
    let image_path = null; // Default to null

    try {
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
        // No new image uploaded; keep the old image URL
        image_path = oldImagePath;
      }

      const result = await updateOurTeam(id, name, designation, heading, image_path, description);

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
  createOurTeam,
  getOurTeam,
  getTeamByID,
  updateTeamStatus,
  deleteOurTeam,
  updateTeam
};
