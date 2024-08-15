
const faqModel = require('../model/faq');

const createOrUpdateFAQs = (req, res) => {
    const faqs = req.body;

    if (!Array.isArray(faqs)) {
        return res.status(400).json({ error: 'Invalid input format. Must be an array.' });
    }

    faqModel.insertFAQs(faqs, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to insert data' });
        }
        res.status(201).json({ message: 'FAQs added successfully', data: results });
    });
};

const getFAQs = (req, res) => {
    faqModel.getFAQs((err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        res.status(200).json(results);
    });
};

const getFAQsbyID = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({success: false, message: 'Invalid ID'});

    try {
        const result = await faqModel.getFAQsbyId(id);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
};

// Update Faq status
const updateFaqStatus = async (req, res) => {
    const { id, status } = req.body;
    if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await faqModel.updatefaqsStatus(id, status);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Faq
const deleteFaq = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    try {
     
      await faqModel.deletefaqFromDB(id);
      res.status(200).json({ success: true, message: 'Faq deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// New function for updating FAQ
const updateFAQ = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const {faqQuestion, faqAnswer} = req.body;

    // if (!id || !faq.faqQuestion || !faq.faqAnswer) {
    //     return res.status(400).json({ error: 'Invalid input. Must provide id, faqQuestion, and faqAnswer.' });
    // }

    faqModel.updateFAQ(id, faqQuestion, faqAnswer, (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Failed to update data' });
        }
        res.status(200).json({ message: 'FAQ updated successfully', data: results });
    });
};

module.exports = { createOrUpdateFAQs, getFAQs, getFAQsbyID, deleteFaq, updateFaqStatus, updateFAQ };
