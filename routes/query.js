const express = require('express');
const router = express.Router();
const {
    createQuery,
    getQuery,
    deleteQuery,
    updateQueryNote
} = require('../controllers/query');

// Route to add information
router.post('/upload', createQuery);

// Route to get all Query
router.get('/get', getQuery);

// Route to delete Query
router.delete('/delete/:id', deleteQuery);

// Route to update Query entry
router.put('/update/:id', updateQueryNote);

module.exports = router;
