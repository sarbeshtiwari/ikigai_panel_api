// Function to insert a new testimonial

const db = require('../config/db');


const createTestimonial = (data, callback) => {
    const query = `
        INSERT INTO testimonials (image_path, alt_tag, video_path, videoURL, status)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [data.image_path, data.alt_tag, data.video_path, data.videoURL, false];
    db.query(query, values, callback);
};

// Function to update a testimonial by ID
const updateTestimonial = (id, data, callback) => {
    const query = `
        UPDATE testimonials 
        SET image_path = ?, alt_tag = ?, video_path = ?, videoURL = ?
        WHERE id = ?
    `;
    const values = [data.image_path, data.alt_tag, data.video_path, data.videoURL, id];
    db.query(query, values, callback);
};

// Function to fetch a testimonial by ID
const getTestimonialById = (id, callback) => {
    const query = 'SELECT * FROM testimonials WHERE id = ?';
    db.query(query, [id], callback);
};

// Function to fetch all testimonials
const getAllTestimonials = (callback) => {
    const query = 'SELECT * FROM testimonials';
    db.query(query, callback);
};


// Delete a Testimonial by ID
const deleteTestimonialFromDB = (id) => {
    const query = 'DELETE FROM testimonials WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };
  
  // Get image path by ID
  const getImagePathByID = (id) => {
    const query = 'SELECT image_path, video_path FROM testimonials WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error('Testimonial not found'));
        resolve(results[0].image_path, results[0].video_path);
      });
    });
  };


  // Update Testimonial status
const updateTestimonialStatus = (id, status) => {
    
    // Build the query based on the status value
    const query = 'UPDATE testimonials SET status = ? WHERE id = ?';
    
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
module.exports = {
    createTestimonial,
    updateTestimonial,
    getTestimonialById, 
    getAllTestimonials, deleteTestimonialFromDB, getImagePathByID,  updateTestimonialStatus
};