const db = require('../config/db');

// Create an entry in the our_team table
const addTeam = (name, designation, heading, image_path, description) => {
  const query = 'INSERT INTO our_team ( name, designation, heading, image_path, description) VALUES (?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [ name, designation, heading, image_path, description], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all Our Teams
const getAllOurTeam = () => {
  const query = 'SELECT * FROM our_team';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update Our Team status
const updateOurTeamStatus = (id, status) => {
    
    // Build the query based on the status value
    const query = 'UPDATE our_team SET status = ? WHERE id = ?';
    
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

// Get Our Team by ID
const getOurTeamByID = (id) => {
  const query = 'SELECT * FROM our_team WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Our Team not found'));
      resolve(results[0]);
    });
  });
};

// Delete a Our Team by ID
const deleteOurTeamFromDB = (id) => {
  const query = 'DELETE FROM our_team WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get image path by ID
const getImagePathByID = (id) => {
  const query = 'SELECT image_path FROM our_team WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Our Team not found'));
      resolve(results[0].image_path);
    });
  });
};

// Update Our Team entry
const updateOurTeam = (id, name, designation, heading, image_path, description) => {
  const query = 'UPDATE our_team SET name = ?, designation = ?, heading = ?, image_path = ?, description = ?  WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [ name, designation, heading, image_path, description, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addTeam,
  getAllOurTeam,
  updateOurTeamStatus,
  getOurTeamByID,
  deleteOurTeamFromDB,
  getImagePathByID,
  updateOurTeam
};
