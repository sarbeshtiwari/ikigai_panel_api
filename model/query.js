const db = require('../config/db');

// Create an entry in the user_query table
const addQuery = (name, phoneNumber, email, user_message) => {
  const query = 'INSERT INTO user_query (name, phoneNumber, email, user_message) VALUES (?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [name, phoneNumber, email, user_message], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all Querys
const getAllQuery = () => {
  const query = 'SELECT * FROM user_query';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Delete a Query by ID
const deleteQueryFromDB = (id) => {
  const query = 'DELETE FROM user_query WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// Update Query entry
const updateQuery = (id, note) => {
  console.log(id , note)
  const query = 'UPDATE user_query SET  note = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [note, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addQuery,
  getAllQuery,
  deleteQueryFromDB,
  updateQuery
};
