const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const {
    addServices,
    getAllOurServices,
    updateOurServicesStatus,
    updateOurServicesOnHomeStatus,
    updateOurServicesOnTopStatus,
    getOurServicesByID,
    deleteOurServicesFromDB,
    getImagePathByID,
    updateOurServices
} = require('../model/services');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'uploads/our_services',
      allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp'],
      resource_type: file.mimetype.startsWith('image/svg') ? 'raw' : 'image',
      format: 'svg',
      public_id: file.originalname, 
    };
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

// Create new Our Services entry
const createOurServices = async (req, res) => {
  upload.fields([
    { name: 'image_path', maxCount: 1 },
    { name: 'home_image_path', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).send(err.message);
    }

    // Extract Cloudinary URLs or public IDs from the request
    const image_path = req.files['image_path'] ? req.files['image_path'][0].path : null;
    const home_image_path = req.files['home_image_path'] ? req.files['home_image_path'][0].path : null;

    // Extract other fields from the request body
    const {
      heading,
      home_data,
      description,
    } = req.body;

    try {
      // Call your function to add the entry to the database
      const result = await addServices(
        heading,
        home_image_path,
        home_data,
        image_path,
        description     
      );

      res.status(201).json({ success: true, result });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      res.status(500).json({ success: false, message: dbError.message });
    }
  });
};


// Get all Our Services
const getOurServices = async (req, res) => {
  try {
    const results = await getAllOurServices();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Our Services by ID
const getServicesByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const result = await getOurServicesByID(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Our Services status
const updateServicesStatus = async (req, res) => {
  const { id, status } = req.body;
  if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });

  try {
    const result = await updateOurServicesStatus(id, status);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Our Services Home status
const updateServicesOnHomeStatus = async (req, res) => {
    const { id, on_home } = req.body;
    if (id === undefined || on_home === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await updateOurServicesOnHomeStatus(id, on_home);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// Update Our Services Top status
const updateServicesOnTopStatus = async (req, res) => {
    const { id, on_top } = req.body;
    if (id === undefined || on_top === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await updateOurServicesOnTopStatus(id, on_top);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Delete Our Services
const deleteOurServices = async (req, res) => {
    
    const id = parseInt(req.params.id, 10);
    console.log(id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    try {
      // Fetch the image paths from the database
      const { imagePath, homeImagePath } = await getImagePathByID(id);
  
      // Delete image files if they exist
      if (imagePath) {
        if (imagePath) await deleteFromCloudinary(imagePath);
      }
  
      if (homeImagePath) {
        if (homeImagePath) await deleteFromCloudinary(homeImagePath);
      }
  
      // Delete the record from the database
      await deleteOurServicesFromDB(id);
  
      res.status(200).json({ success: true, message: 'Our Services deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Update Our Services entry
// const updateServices = async (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
//     upload.fields([
//       { name: 'image_path', maxCount: 1 },
//       { name: 'home_image_path', maxCount: 1 }
//     ])(req, res, async (err) => {
//       if (err) {
//         console.error('Upload Error:', err);
//         return res.status(400).send(err.message);
//       }
  
//       // Extract Cloudinary URLs or public IDs from the request
//       const image_path = req.files['image_path'] ? req.files['image_path'][0].path : null;
//       const home_image_path = req.files['home_image_path'] ? req.files['home_image_path'][0].path : null;
  
//       const {
       
//         heading,
//         home_data,
//         description
//       } = req.body;
  
  
//       try {
//         // Fetch old image paths from the database
//         const { oldImagePath, oldHomeImagePath } = await getImagePathByID(id);
  
//         // Update the entry in the database
//         const result = await updateOurServices(
//           id,
         
//           heading,
//           home_image_path,
//           home_data,
//           image_path,
//           description
          
//         );
  
//         // Delete old image files if they exist and are different from new ones
//         if (oldImagePath && image_path && oldImagePath !== image_path) {
//           const oldImageFilePath = path.join('uploads/our_services/', oldImagePath);
//           if (fs.existsSync(oldImageFilePath)) {
//             fs.unlinkSync(oldImageFilePath);
//           }
//         }
  
//         if (oldHomeImagePath && home_image_path && oldHomeImagePath !== home_image_path) {
//           const oldHomeImageFilePath = path.join('uploads/our_services/', oldHomeImagePath);
//           if (fs.existsSync(oldHomeImageFilePath)) {
//             fs.unlinkSync(oldHomeImageFilePath);
//           }
//         }
  
//         res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
//       } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to update data', error: error.message });
//       }
//     });
//   };


const updateServices = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  upload.fields([
      { name: 'image_path', maxCount: 1 },
      { name: 'home_image_path', maxCount: 1 }
  ])(req, res, async (err) => {
      if (err) {
          console.error('Upload Error:', err);
          return res.status(400).send(err.message);
      }

      // Extract file paths if provided
      const newImagePath = req.files['image_path'] ? req.files['image_path'][0].path : null;
      const newHomeImagePath = req.files['home_image_path'] ? req.files['home_image_path'][0].path : null;

      const {
          heading,
          home_data,
          description
      } = req.body;

      try {
          // Fetch old image paths from the database
          const { oldImagePath, oldHomeImagePath } = await getImagePathByID(id);
          console.log(oldImagePath);
          console.log(oldHomeImagePath);

          // Prepare updated fields
          const updateFields = {
              heading: heading,
              home_data: home_data,
              description: description,
              image_path: newImagePath || oldImagePath,
              home_image_path: newHomeImagePath || oldHomeImagePath
          };

          // Update the entry in the database
          const result = await updateOurServices(
              id,
              updateFields.heading,
              updateFields.home_image_path,
              updateFields.home_data,
              updateFields.image_path,
              updateFields.description
          );

          // Delete old image files if they exist and are different from new ones
          if (oldImagePath && newImagePath && oldImagePath !== newImagePath) {
              const oldImageFilePath = path.join('uploads/our_services/', oldImagePath);
              if (fs.existsSync(oldImageFilePath)) {
                  fs.unlinkSync(oldImageFilePath);
              }
          }

          if (oldHomeImagePath && newHomeImagePath && oldHomeImagePath !== newHomeImagePath) {
              const oldHomeImageFilePath = path.join('uploads/our_services/', oldHomeImagePath);
              if (fs.existsSync(oldHomeImageFilePath)) {
                  fs.unlinkSync(oldHomeImageFilePath);
              }
          }

          res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
      } catch (error) {
          res.status(500).json({ success: false, message: 'Failed to update data', error: error.message });
      }
  });
};


  

module.exports = {
  createOurServices,
  getOurServices,
  getServicesByID,
  updateServicesStatus,
  updateServicesOnHomeStatus,
  updateServicesOnTopStatus,
  deleteOurServices,
  updateServices
};
