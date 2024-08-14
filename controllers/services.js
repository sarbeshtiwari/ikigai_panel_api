const path = require('path');
const fs = require('fs');
const multer = require('multer');
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

// Middleware for handling file upload (using multer)

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/our_services/'),
      filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
  }).fields([
    { name: 'image_path', maxCount: 1 },
    { name: 'home_image_path', maxCount: 1 }
  ]);

// Create new Our Services entry
const createOurServices = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);
  
      // Extract file paths
      const image_path = req.files['image_path'] ? req.files['image_path'][0].filename : null;
      const home_image_path = req.files['home_image_path'] ? req.files['home_image_path'][0].filename : null;
  
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
        const imageFilePath = path.join(__dirname, '..', 'uploads', 'our_services', imagePath);
        if (fs.existsSync(imageFilePath)) {
          fs.unlinkSync(imageFilePath);
        }
      }
  
      if (homeImagePath) {
        const homeImageFilePath = path.join(__dirname, '..', 'uploads', 'our_services', homeImagePath);
        if (fs.existsSync(homeImageFilePath)) {
          fs.unlinkSync(homeImageFilePath);
        }
      }
  
      // Delete the record from the database
      await deleteOurServicesFromDB(id);
  
      res.status(200).json({ success: true, message: 'Our Services deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Update Our Services entry
const updateServices = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
  
      const {
       
        heading,
        home_data,
        description
      } = req.body;
  
      const image_path = req.files['image_path'] ? req.files['image_path'][0].filename : null;
      const home_image_path = req.files['home_image_path'] ? req.files['home_image_path'][0].filename : null;
  
      try {
        // Fetch old image paths from the database
        const { oldImagePath, oldHomeImagePath } = await getImagePathByID(id);
  
        // Update the entry in the database
        const result = await updateOurServices(
          id,
         
          heading,
          description,home_data,
          image_path,
          home_image_path
        );
  
        // Delete old image files if they exist and are different from new ones
        if (oldImagePath && image_path && oldImagePath !== image_path) {
          const oldImageFilePath = path.join('uploads/our_services/', oldImagePath);
          if (fs.existsSync(oldImageFilePath)) {
            fs.unlinkSync(oldImageFilePath);
          }
        }
  
        if (oldHomeImagePath && home_image_path && oldHomeImagePath !== home_image_path) {
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
