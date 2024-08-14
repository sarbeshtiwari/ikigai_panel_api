const path = require('path');
const fs = require('fs');
const {
    addTeam,
    getAllOurTeam,
    updateOurTeamStatus,
    getOurTeamByID,
    deleteOurTeamFromDB,
    getImagePathByID,
    updateOurTeam
} = require('../model/team');

// Middleware for handling file upload (using multer)
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/our_team/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  })
});

// Create new our team entry
const createOurTeam = async (req, res) => {
  try {
    
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);

      
      const {
        name, designation, heading, description
      } = req.body;

      const image_path = req.file ? req.file.filename : null;

      try {
        const result = await addTeam(name, designation, heading, image_path, description);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
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
    if (imagePath) fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'our_team', imagePath));
    
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
    const image_path = req.file ? req.file.filename : null;

    try {
      const oldImagePath = await getImagePathByID(id);

      const result = await updateOurTeam(id, name, designation, heading, image_path, description);

      if (oldImagePath && image_path && oldImagePath !== image_path) {
        fs.unlinkSync(path.join('uploads/our_team/', oldImagePath));
      }

      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
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
