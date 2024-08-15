const express = require('express');
const router = express.Router();
const {
    createOurSpeciality,
  getOurSpeciality,
  getSpecialityByID,
  updateSpecialityStatus,
  deleteOurSpeciality,
  updateSpeciality
} = require('../controllers/specialities');

// Route to add information and image upload
router.post('/upload', createOurSpeciality);

// Route to get all Speciality
router.get('/get', getOurSpeciality);

// Route to get Speciality by ID
router.get('/getByID/:id', getSpecialityByID);

// Route to update Speciality status
router.patch('/updateStatus', updateSpecialityStatus);


// Route to delete Speciality
router.delete('/delete/:id', deleteOurSpeciality);

// Route to update Speciality entry
router.put('/update/:id', updateSpeciality);

module.exports = router;
