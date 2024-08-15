
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq');

// Create or Update FAQ
router.post('/addFaq', faqController.createOrUpdateFAQs);

// Get FAQs
router.get('/getFaq', faqController.getFAQs);

router.get('/getFaqById/:id', faqController.getFAQsbyID);

// Route to update Faq status
router.patch('/updateStatus', faqController.updateFaqStatus);


// Route to delete Faq
router.delete('/delete/:id', faqController.deleteFaq);

// Update FAQ by ID
router.put('/updateFaq/:id', faqController.updateFAQ);

module.exports = router;
