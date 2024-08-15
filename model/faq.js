const db = require('../config/db');

const insertFAQs = (faqs, callback) => {
    const query = 'INSERT INTO faqs (faqQuestion, faqAnswer) VALUES ?';
    const values = faqs.map(faq => [faq.faqQuestion, faq.faqAnswer]);

    db.query(query, [values], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
};

const getFAQs = (callback) => {
    db.query('SELECT * FROM faqs', (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
};

const getFAQsbyId = (id) => {
    const query = 'SELECT * FROM faqs WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Faq not found')); 
            resolve(results[0]);
        });
    });
};

const updatefaqsStatus = (id, status) => {
    const query = 'UPDATE faqs SET status = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [status, id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const deletefaqFromDB = (id) => {
    const query = 'DELETE FROM faqs WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// New method for updating FAQ
const updateFAQ = (id, faqQuestion, faqAnswer, callback) => {
    const query = 'UPDATE faqs SET faqQuestion = ?, faqAnswer = ? WHERE id = ?';
    const values = [faqQuestion, faqAnswer, id];

    db.query(query, values, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
};

module.exports = { insertFAQs, getFAQs, getFAQsbyId, updatefaqsStatus,  deletefaqFromDB, updateFAQ };
