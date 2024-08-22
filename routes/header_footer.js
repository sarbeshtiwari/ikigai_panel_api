const express = require('express');
const router = express.Router();
const { submitForm, getDetails, updateDetails } = require('../controllers/header_footer');

// Define route for form submission
router.post('/submit',  submitForm);

router.get('/get', getDetails);

router.put('/update/:id', updateDetails);

module.exports = router;
