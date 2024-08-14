const db = require('../config/db');

// Create an entry in the about_us table
const addAbout = (heading, description, image_path) => {
  const query = 'INSERT INTO about_us (heading, description, image_path) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [heading, description, image_path], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all About Uss
const getAllAboutUs = () => {
  const query = 'SELECT * FROM about_us';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update About Us status
const updateAboutUsStatus = (id, status) => {
    console.log('Updating status to:', status);
    
    // Build the query based on the status value
    const query = status === 0 
        ? 'UPDATE about_us SET status = ?, on_home = 0, on_top = 0 WHERE id = ?'
        : 'UPDATE about_us SET status = ? WHERE id = ?';
    
    // Determine the parameters for the query
    const params = status === 0
        ? [status, id]
        : [status, id];
    
    // Return a promise that executes the query
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


// Update About Us On home status
const updateAboutUsOnHomeStatus = async (id, on_home) => {
    try {
        if (on_home) {
            // Set all records' on_home to false
            await new Promise((resolve, reject) => {
                const query = 'UPDATE about_us SET on_home = false WHERE on_home = true';
                db.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        }

        // Update the specific record
        const query = 'UPDATE about_us SET on_home = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [on_home, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

    } catch (err) {
        // Handle errors if necessary
        console.error('Error updating about_us:', err);
        throw err; // Optionally rethrow or handle error as needed
    }
};


// Update About Us on top status
const updateAboutUsOnTopStatus = async (id, on_top) => {

    try {
        if (on_top) {
            // Set all records' on_top to false
            await new Promise((resolve, reject) => {
                const query = 'UPDATE about_us SET on_top = false WHERE on_top = true';
                db.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        }

        // Update the specific record
        const query = 'UPDATE about_us SET on_top = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [on_top, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

    } catch (err) {
        // Handle errors if necessary
        console.error('Error updating about_us:', err);
        throw err; // Optionally rethrow or handle error as needed
    }

    // const query = 'UPDATE about_us SET on_top = ? WHERE id = ?';
    // return new Promise((resolve, reject) => {
    //   db.query(query, [on_top, id], (err, results) => {
    //     if (err) return reject(err);
    //     resolve(results);
    //   });
    // });
};

// Get About Us by ID
const getAboutUsByID = (id) => {
  const query = 'SELECT * FROM about_us WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('About Us not found'));
      resolve(results[0]);
    });
  });
};

// Delete a About Us by ID
const deleteAboutUsFromDB = (id) => {
  const query = 'DELETE FROM about_us WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get image path by ID
const getImagePathByID = (id) => {
  const query = 'SELECT image_path FROM about_us WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('About Us not found'));
      resolve(results[0].image_path);
    });
  });
};

// Update About Us entry
const updateAboutUs = (id, heading, description, image_path) => {
  const query = 'UPDATE about_us SET  heading = ?, description = ?, image_path = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [heading, description, image_path, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addAbout,
  getAllAboutUs,
  updateAboutUsStatus,
  updateAboutUsOnHomeStatus,
  updateAboutUsOnTopStatus,
  getAboutUsByID,
  deleteAboutUsFromDB,
  getImagePathByID,
  updateAboutUs
};
