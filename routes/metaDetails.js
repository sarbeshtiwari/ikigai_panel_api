const express = require('express');
const router = express.Router();
const {
    createMetaDetails,
  getMetaDetails,
  getMetaByPageType,
  updateMeta
} = require('../controllers/metaDetails');

// Route to add information and image upload
router.post('/upload', createMetaDetails);

// Route to get all Team
router.get('/get', getMetaDetails);

// Route to get Team by ID
router.get('/getByID/:id', getMetaByPageType);

// Route to update Team entry
router.put('/update/:id', updateMeta);

module.exports = router;
