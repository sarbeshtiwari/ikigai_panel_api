const db = require('../config/db');

// Create an entry in the meta_details table
const addmetaDetails = (meta_title, meta_keyword, meta_description, otherMeta, pageType) => {
  const query = 'INSERT INTO meta_details ( meta_title, meta_keyword, meta_description, otherMeta, pageType) VALUES (?, ?, ?, ?, ?)';
  console.log(meta_title);
  return new Promise((resolve, reject) => {
    db.query(query, [ meta_title, meta_keyword, meta_description, otherMeta, pageType], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all  metaDetailss
const getAllmetaDetails = () => {
  const query = 'SELECT * FROM meta_details';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// Get  metaDetails by pageType
const getmetaDetailsByPageType = (pageType) => {
  const query = 'SELECT * FROM meta_details WHERE pageType = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [pageType], (err, results) => {
      if (err) return reject(err);
      // if (results.length === 0) return reject(new Error(' metaDetails not found'));
      resolve(results[0]);
    });
  });
};

// Update  metaDetails entry
const updatemetaDetails = (meta_title, meta_keyword, meta_description, otherMeta, pageType) => {
  const query = 'UPDATE meta_details SET meta_title = ?, meta_keyword = ?, meta_description = ?, otherMeta = ?  WHERE pageType = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [meta_title, meta_keyword, meta_description, otherMeta, pageType], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addmetaDetails,
  getAllmetaDetails,
  getmetaDetailsByPageType,
  updatemetaDetails
};
