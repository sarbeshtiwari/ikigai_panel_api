const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointment,
    deleteAppointment,
    updateAppointmentNote
} = require('../controllers/appointment');

// Route to add information
router.post('/upload', createAppointment);

// Route to get all Appointment
router.get('/get', getAppointment);

// Route to delete Appointment
router.delete('/delete/:id', deleteAppointment);

// Route to update Appointment entry
router.put('/update/:id', updateAppointmentNote);

module.exports = router;
