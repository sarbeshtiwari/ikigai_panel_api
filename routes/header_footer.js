const express = require('express');
const router = express.Router();
const { submitForm, getDetails } = require('../controllers/header_footer');

// Define route for form submission
router.post('/submit',  submitForm);

router.get('/get', getDetails);

module.exports = router;
