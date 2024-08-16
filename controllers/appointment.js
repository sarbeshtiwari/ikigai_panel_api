const path = require('path');
const fs = require('fs');
const {
    addAppointment,
    getAllAppointment,
    deleteAppointmentFromDB,
    updateAppointment
} = require('../model/appointment');


// Create new Appointment entry
const createAppointment = async (req, res) => {
  try {
        
      const {
       
        name, phoneNumber, email
      } = req.body;

      try {
        const result = await addAppointment(name, phoneNumber, email);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        res.status(500).json({ success: false, message: dbError.message });
      }
    }
   catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Appointment
const getAppointment = async (req, res) => {
  try {
    const results = await getAllAppointment();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
     
    await deleteAppointmentFromDB(id);
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Appointment entry
const updateAppointmentNote = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  const {
      
    note
    } = req.body;
    
    try {

      const result = await updateAppointment(id, note);


      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update data', error: error.message });
    }
  };


module.exports = {
  createAppointment,
  getAppointment,
  deleteAppointment,
  updateAppointmentNote
};
