const path = require('path');
const fs = require('fs');
const {
    addQuery,
    getAllQuery,
    deleteQueryFromDB,
    updateQuery
} = require('../model/query');


// Create new Query entry
const createQuery = async (req, res) => {
  try {
        
      const {
       
        name, phoneNumber, email, user_message
      } = req.body;

      try {
        const result = await addQuery(name, phoneNumber, email, user_message);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
      }
    }
   catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Query
const getQuery = async (req, res) => {
  try {
    const results = await getAllQuery();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Query
const deleteQuery = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
     
    await deleteQueryFromDB(id);
    res.status(200).json({ success: true, message: 'Query deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Query entry
const updateQueryNote = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  const {
      
    note
    } = req.body;
    
    try {

      const result = await updateQuery(id, note);


      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update data', error: error.message });
    }
  };


module.exports = {
  createQuery,
  getQuery,
  deleteQuery,
  updateQueryNote
};
