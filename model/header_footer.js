
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

const getLogoStatus = () => {
    const query = 'SELECT logo FROM header_footer';
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
};

const updateFormData = async (data) => {
    
    return new Promise((resolve, reject) => {
        const { logo, buttons, phone_number, footer_title, footer_description, address, contact_phones, email, id} = data;
        console.log(data);
        const query = 'UPDATE header_footer SET  logo = ?, buttons = ?, phone_number = ?, footer_title = ?, footer_description = ? , address = ?, contact_phones = ?, email = ? WHERE id = ?'
        const values = [logo, JSON.stringify(buttons), phone_number, footer_title, footer_description, address, contact_phones, email, id];

        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    saveFormData, getAllDetails, getLogoStatus, updateFormData
};