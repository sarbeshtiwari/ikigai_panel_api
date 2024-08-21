
const db = require('../config/db')

const saveFormData = async (data) => {
    
    return new Promise((resolve, reject) => {
        const { logo, buttons, phoneNumber, footerTitle, footerDescription, address, contactPhones, email } = data;
        const query = `
            INSERT INTO header_footer (logo, buttons, phone_number, footer_title, footer_description, address, contact_phones, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [logo, JSON.stringify(buttons), phoneNumber, footerTitle, footerDescription, address, contactPhones, email];

        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const getAllDetails = () => {
    const query = 'SELECT * FROM header_footer';
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

module.exports = {
    saveFormData, getAllDetails
};