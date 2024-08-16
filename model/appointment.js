const db = require('../config/db');

// Create an entry in the appointment table
const addAppointment = (name, phoneNumber, email) => {
  const query = 'INSERT INTO appointment (name, phoneNumber, email) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [name, phoneNumber, email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all Appointments
const getAllAppointment = () => {
  const query = 'SELECT * FROM appointment';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Delete a Query by ID
const deleteAppointmentFromDB = (id) => {
  const query = 'DELETE FROM appointment WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// Update Appointment entry
const updateAppointment = (id, note) => {
  const query = 'UPDATE appointment SET  note = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [note, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addAppointment,
  getAllAppointment,
  deleteAppointmentFromDB,
  updateAppointment
};
