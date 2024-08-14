const express = require('express');
const router = express.Router();
const {
    createAboutUs,
    getAboutUs,
    getAboutByID,
    updateAboutStatus,
    updateAboutOnHomeStatus,
    updateAboutOnTopStatus,
    deleteAboutUs,
    updateAbout
} = require('../controllers/about');

// Route to add information and image upload
router.post('/upload', createAboutUs);

// Route to get all about
router.get('/get', getAboutUs);

// Route to get about by ID
router.get('/getByID/:id', getAboutByID);

// Route to update about status
router.patch('/updateStatus', updateAboutStatus);

// Route to update about on home status
router.patch('/updateOnHomeStatus', updateAboutOnHomeStatus);

// Route to update about on top status
router.patch('/updateOnTopStatus', updateAboutOnTopStatus);

// Route to delete about
router.delete('/delete/:id', deleteAboutUs);

// Route to update about entry
router.put('/update/:id', updateAbout);

module.exports = router;
