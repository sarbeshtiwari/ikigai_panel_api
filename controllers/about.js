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

const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract the public_id from the URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    console.log(publicId);
    
    // Delete the image using the public_id
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw error;
  }
};

const extractPublicIdFromUrl = (url) => {
  // Extract the public_id from the Cloudinary URL
  const regex = /\/image\/upload\/(?:v\d+\/)?(.*?)(?:\.[a-z0-9]+)?$/i;
  
  const match = url.match(regex);
  return match ? match[1] : null;
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
      console.log(cloudinaryResult.public_id);
      const image_path = cloudinaryResult.secure_url;
      try {
        const result = await addAbout(heading, description, image_path);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
      } 
      finally {
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
    
    const newImagePath = req.file ? req.file.path : null;
    let image_path = null; // Initialize image_path to null

    try {
      const oldImagePath = await getImagePathByID(id);

      if (newImagePath) {
        // Upload new image to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(newImagePath);
        image_path = cloudinaryResult.secure_url;

        // Remove old image from Cloudinary if it exists and is different
        if (oldImagePath && oldImagePath !== image_path) {
          await deleteFromCloudinary(oldImagePath);
        }

        // Clean up temporary file
        fs.unlink(newImagePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      } else {
        // If no new image, keep the old image path
        image_path = oldImagePath;
      }

      // Update the data with the new or existing image path
      const result = await updateAboutUs(id, heading, description, image_path);

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
