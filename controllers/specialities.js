const path = require('path');
const fs = require('fs');
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
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/our_specialities/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  })
});

// Create new our Speciality entry
const createOurSpeciality = async (req, res) => {
  try {
    
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);

      
      const {
        heading, content, schema_data
      } = req.body;

      const image_path = req.file ? req.file.filename : null;

      try {
        const result = await addSpeciality(heading, content, schema_data, image_path);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
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
    if (imagePath) fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'our_specialities', imagePath));
    
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
    const image_path = req.file ? req.file.filename : null;

    try {
      const oldImagePath = await getImagePathByID(id);

      const result = await updateOurSpeciality(id, heading, content, schema_data, image_path);

      if (oldImagePath && image_path && oldImagePath !== image_path) {
        fs.unlinkSync(path.join('uploads/our_specialities/', oldImagePath));
      }

      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
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
