const db = require('../config/db');

// Create an entry in the our_specialities table
const addSpeciality = (heading, content, schema_data, image_path) => {
  const query = 'INSERT INTO our_specialities (heading, content, schema_data, image_path) VALUES (?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [ heading, content, schema_data, image_path], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all Our Specialitys
const getAllOurSpeciality = () => {
  const query = 'SELECT * FROM our_specialities';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update Our Speciality status
const updateOurSpecialityStatus = (id, status) => {
    
    // Build the query based on the status value
    const query = 'UPDATE our_specialities SET status = ? WHERE id = ?';
    
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

// Get Our Speciality by ID
const getOurSpecialityByID = (id) => {
  const query = 'SELECT * FROM our_specialities WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Our Speciality not found'));
      resolve(results[0]);
    });
  });
};

// Delete a Our Speciality by ID
const deleteOurSpecialityFromDB = (id) => {
  const query = 'DELETE FROM our_specialities WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get image path by ID
const getImagePathByID = (id) => {
  const query = 'SELECT image_path FROM our_specialities WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Our Speciality not found'));
      resolve(results[0].image_path);
    });
  });
};

// Update Our Speciality entry
const updateOurSpeciality = (id, heading, content, schema_data, image_path) => {
  const query = 'UPDATE our_specialities SET heading = ?, content = ?, schema_data = ?, image_path = ?  WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [ heading, content, schema_data, image_path, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addSpeciality,
  getAllOurSpeciality,
  updateOurSpecialityStatus,
  getOurSpecialityByID,
  deleteOurSpecialityFromDB,
  getImagePathByID,
  updateOurSpeciality
};
