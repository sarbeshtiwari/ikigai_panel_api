const path = require('path');
const fs = require('fs');
const {
    addmetaDetails,
    getAllmetaDetails,
    getmetaDetailsByPageType,
    updatemetaDetails
} = require('../model/metaDetails');


// Create new Meta Details entry
const createMetaDetails = async (req, res) => {
  try {
    const {
        meta_title, meta_keyword, meta_description, otherMeta, pageType
      } = req.body;


      try {
        const result = await addmetaDetails(meta_title, meta_keyword, meta_description, otherMeta, pageType);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
      }
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Meta 
const getMetaDetails = async (req, res) => {
  try {
    const results = await getAllmetaDetails();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Meta Details by ID
const getMetaByPageType = async (req, res) => {
  const id = req.params.id;
//   if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const result = await getmetaDetailsByPageType(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Meta Details entry
const updateMeta = async (req, res) => {
  const pageType = req.params.id;
  // if (isNaN(pageType)) return res.status(400).json({ success: false, message: 'Invalid ID' });
 

  const {
    meta_title, meta_keyword, meta_description, otherMeta
  } = req.body;
    try {

      const result = await updatemetaDetails(meta_title, meta_keyword, meta_description, otherMeta, pageType);

      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update data', error: error.message });
    }
  
};

module.exports = {
  createMetaDetails,
  getMetaDetails,
  getMetaByPageType,
  updateMeta
};
