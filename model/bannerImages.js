const db = require('../config/db');

const updateBanner = (query, params, callback) => {
    db.query(query, params, callback);
};

const insertBanner = (query, params, callback) => {
    db.query(query, params, callback);
};

const getBanner = (query, params, callback) => {
    db.query(query, params, callback);
};

// Update Our Banner status
const updateBannerStatus = (id, status) => {
    
    // Build the query based on the status value
    const query = 'UPDATE banner_image SET status = ? WHERE id = ?';
    
    // Determine the parameters for the query
    const params =  [status, id];
    
    // Return a promise that executes the query
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Delete Banner by ID
const deleteBannerFromDB = (id) => {
    const query = 'DELETE FROM banner_image WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

module.exports = {
    updateBanner,
    insertBanner,
    getBanner, updateBannerStatus, deleteBannerFromDB
};
