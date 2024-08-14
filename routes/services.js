const express = require('express');
const router = express.Router();
const {
    createOurServices,
    getOurServices,
    getServicesByID,
    updateServicesStatus,
    updateServicesOnHomeStatus,
    updateServicesOnTopStatus,
    deleteOurServices,
    updateServices
} = require('../controllers/services');

// Route to add information and image upload
router.post('/upload', createOurServices);

// Route to get all about
router.get('/get', getOurServices);

// Route to get about by ID
router.get('/getByID/:id', getServicesByID);

// Route to update about status
router.patch('/updateStatus', updateServicesStatus);

// Route to update about on home status
router.patch('/updateOnHomeStatus', updateServicesOnHomeStatus);

// Route to update about on top status
router.patch('/updateOnTopStatus', updateServicesOnTopStatus);

// Route to delete about
router.delete('/delete/:id', deleteOurServices);

// Route to update about entry
router.put('/update/:id', updateServices);

module.exports = router;
