const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const {
  addAbout,
  getAllAboutUs,
  updateAboutUsStatus,
  updateAboutUsOnHomeStatus,
  updateAboutUsOnTopStatus,
  getAboutUsByID,
  deleteAboutUsFromDB,
  getImagePathByID,
  updateAboutUs
} = require('../model/about');

// Middleware for handling file upload (using multer)
const multer = require('multer');
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/about_us/'),
//     filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
//   })
// });

// Create new about us entry

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads/about_us',
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

const createAboutUs = async (req, res) => {
  try {
    
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);
      const tempFilePath = req.file ? req.file.path : null; // Updated to use path

      if (!tempFilePath) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      
      const {
       
        heading,
        description
      } = req.body;

      const cloudinaryResult = await uploadToCloudinary(tempFilePath);
      const image_path = cloudinaryResult.secure_url;
      try {
        const result = await addAbout(heading, description, image_path);
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

// Get all about us
const getAboutUs = async (req, res) => {
  try {
    const results = await getAllAboutUs();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get about us by ID
const getAboutByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const result = await getAboutUsByID(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update about us status
const updateAboutStatus = async (req, res) => {
  const { id, status } = req.body;
  if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });

  try {
    const result = await updateAboutUsStatus(id, status);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update about us Home status
const updateAboutOnHomeStatus = async (req, res) => {
    const { id, on_home } = req.body;
    if (id === undefined || on_home === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await updateAboutUsOnHomeStatus(id, on_home);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// Update about us Top status
const updateAboutOnTopStatus = async (req, res) => {
    const { id, on_top } = req.body;
    if (id === undefined || on_top === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await updateAboutUsOnTopStatus(id, on_top);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Delete about us
const deleteAboutUs = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const imagePath = await getImagePathByID(id);
    if (imagePath) await deleteFromCloudinary(imagePath);
    
    await deleteAboutUsFromDB(id);
    res.status(200).json({ success: true, message: 'about us deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update about us entry
const updateAbout = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).send(err.message);

    const {
      
      heading,
      description
    } = req.body;
    const newImageFile = req.file;
    const newImagePath = newImageFile ? newImageFile.path : null;
    let newImagePublicId = newImageFile ? newImageFile.filename : null;

    try {
      const oldImagePath = await getImagePathById(id);
      let cloudinaryResult;

      // Upload new image to Cloudinary if provided
      if (newImagePath) {
        cloudinaryResult = await uploadToCloudinary(newImagePath);
        newImagePublicId = cloudinaryResult.secure_url;

        // Remove old image from Cloudinary if it exists and is different
        if (oldImagePath && oldImagePath !== newImagePublicId) {
          await deleteFromCloudinary(oldImagePath);
        }
      }

      const result = await updateAboutUs(id, heading, description, image_path);

      if (newImagePath) {
        fs.unlink(newImagePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      }

      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update data', error: error.message });
    }
  });
};

module.exports = {
  createAboutUs,
  getAboutUs,
  getAboutByID,
  updateAboutStatus,
  updateAboutOnHomeStatus,
  updateAboutOnTopStatus,
  deleteAboutUs,
  updateAbout
};
