const db = require('../config/db')
const bcrypt = require('bcryptjs');

const getUserByEmail = (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  };

  const saltRounds = 10; // Number of salt rounds for hashing

// Function to create a new user with hashed password
const createUser = async (username, password) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  } catch (error) {
    throw error;
  }
};
  
  module.exports = {
    getUserByEmail, createUser
  };