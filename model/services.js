const db = require('../config/db');

// Create an entry in the our_services table
const addServices = ( heading, home_image_path, home_data, image_path, description) => {
  const query = 'INSERT INTO our_services ( heading, home_image_path, home_data, image_path, description) VALUES (?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.query(query, [ heading, home_image_path, home_data, image_path, description], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

// Get all Our Servicess
const getAllOurServices = () => {
  const query = 'SELECT * FROM our_services';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update Our Services status
const updateOurServicesStatus = (id, status) => {
    console.log('Updating status to:', status);
    
    // Build the query based on the status value
    const query = status === 0 
        ? 'UPDATE our_services SET status = ?, on_home = 0, on_top = 0 WHERE id = ?'
        : 'UPDATE our_services SET status = ? WHERE id = ?';
    
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


// Update Our Services On home status
const updateOurServicesOnHomeStatus = async (id, on_home) => {
    try {
        if (on_home) {
            // Set all records' on_home to false
            await new Promise((resolve, reject) => {
                const query = 'UPDATE our_services SET on_home = false WHERE on_home = true';
                db.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        }

        // Update the specific record
        const query = 'UPDATE our_services SET on_home = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [on_home, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

    } catch (err) {
        // Handle errors if necessary
        console.error('Error updating our_services:', err);
        throw err; // Optionally rethrow or handle error as needed
    }
};


// Update Our Services on top status
const updateOurServicesOnTopStatus = async (id, on_top) => {

    try {
        if (on_top) {
            // Set all records' on_top to false
            await new Promise((resolve, reject) => {
                const query = 'UPDATE our_services SET on_top = false WHERE on_top = true';
                db.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        }

        // Update the specific record
        const query = 'UPDATE our_services SET on_top = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [on_top, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

    } catch (err) {
        // Handle errors if necessary
        console.error('Error updating our_services:', err);
        throw err; // Optionally rethrow or handle error as needed
    }

    // const query = 'UPDATE our_services SET on_top = ? WHERE id = ?';
    // return new Promise((resolve, reject) => {
    //   db.query(query, [on_top, id], (err, results) => {
    //     if (err) return reject(err);
    //     resolve(results);
    //   });
    // });
};

// Get Our Services by ID
const getOurServicesByID = (id) => {
  const query = 'SELECT * FROM our_services WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Our Services not found'));
      resolve(results[0]);
    });
  });
};

// Delete a Our Services by ID
const deleteOurServicesFromDB = (id) => {
  const query = 'DELETE FROM our_services WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get image path by ID
const getImagePathByID = (id) => {
  const query = 'SELECT image_path, home_image_path FROM our_services WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Our Services not found'));
      console.log(results[0].home_image_path)
      resolve(results[0].image_path, results[0].home_image_path);
    });
  });
};

// Update Our Services entry
const updateOurServices = (id,  heading, home_image_path, home_data, image_path, description) => {
  const query = 'UPDATE our_services SET heading = ?, home_image_path = ?, home_data = ?, image_path = ?, description = ?  WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [ heading, home_image_path, home_data, image_path, description, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  addServices,
  getAllOurServices,
  updateOurServicesStatus,
  updateOurServicesOnHomeStatus,
  updateOurServicesOnTopStatus,
  getOurServicesByID,
  deleteOurServicesFromDB,
  getImagePathByID,
  updateOurServices
};
