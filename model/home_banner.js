const db = require('../config/db');

// // Create an entry in the home_banner table
// const createImageEntry = (meta_title, meta_keywords, meta_description, heading, alt_tag, image_path) => {
//   const query = 'INSERT INTO home_banner (meta_title, meta_keywords, meta_description, heading, alt_tag, image_path) VALUES (?, ?, ?, ?, ?, ?)';
//   return new Promise((resolve, reject) => {
//     db.query(query, [meta_title, meta_keywords, meta_description, heading, alt_tag, image_path], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.insertId);
//       }
//     });
//   });
// };

// Function to insert a new banner
const insertBanner = (bannerData, callback) => {
  const query = `INSERT INTO home_banner (desktop_image_path, mobile_image_path, tablet_image_path, alt_tag_desktop, alt_tag_mobile, alt_tag_tablet) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [bannerData.desktop_image_path, bannerData.mobile_image_path, bannerData.tablet_image_path, bannerData.alt_tag_desktop, bannerData.alt_tag_mobile, bannerData.alt_tag_tablet], callback);
};

// Get all home banners
const getAllHomeBanners = () => {
  const query = 'SELECT * FROM home_banner';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update home banner status
const updateHomeBannerStatus = (id, status) => {
  const query = 'UPDATE home_banner SET status = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [status, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get home banner by ID
const getHomeBannerByID = (id) => {
  const query = 'SELECT * FROM home_banner WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Home banner not found'));
      resolve(results[0]);
    });
  });
};

// Delete a home banner by ID
const deleteHomeBannerFromDB = (id) => {
  const query = 'DELETE FROM home_banner WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get image path by ID
const getImagePathByID = (id) => {
  const query = 'SELECT image_path FROM home_banner WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Home banner not found'));
      resolve(results[0].image_path);
    });
  });
};

// // Update home banner entry
// const updateHomeBannerEntry = (id, meta_title, meta_keywords, meta_description, heading, alt_tag, image_path) => {
//   const query = 'UPDATE home_banner SET meta_title = ?, meta_keywords = ?, meta_description = ?, heading = ?, alt_tag = ?, image_path = ? WHERE id = ?';
//   return new Promise((resolve, reject) => {
//     db.query(query, [meta_title, meta_keywords, meta_description, heading, alt_tag, image_path, id], (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// };
// Function to update an existing banner
const updateHomeBanner = (id, bannerData, callback) => {
  const query = `UPDATE home_banner SET 
                  desktop_image_path = ?, 
                  mobile_image_path = ?, 
                  tablet_image_path = ?, 
                  alt_tag_desktop = ?, 
                  alt_tag_mobile = ?, 
                  alt_tag_tablet = ? 
                  WHERE id = ?`;
  db.query(query, [bannerData.desktop_image_path, bannerData.mobile_image_path, bannerData.tablet_image_path, bannerData.alt_tag_desktop, bannerData.alt_tag_mobile, bannerData.alt_tag_tablet, id], callback);
};

module.exports = {
  insertBanner,
  getAllHomeBanners,
  updateHomeBannerStatus,
  getHomeBannerByID,
  deleteHomeBannerFromDB,
  getImagePathByID,
  updateHomeBanner
};












// // model/home_banner.js

// const db = require('../config/db');

// // Function to create an entry in the home_banner table
// const createImageEntry = (meta_title, meta_keywords, meta_description, heading, alt_tag, image_path) => {
//   const query = 'INSERT INTO home_banner (meta_title, meta_keywords, meta_description, heading, alt_tag, image_path) VALUES (?, ?, ?, ?, ?, ?)';

//   // Return a Promise
//   return new Promise((resolve, reject) => {
//     db.query(query, [meta_title, meta_keywords, meta_description, heading, alt_tag, image_path], (err, results) => {
//       if (err) {
//         reject(err); // Reject the Promise if there's an error
//       } else {
//         resolve(results.insertId); // Resolve the Promise with the inserted ID
//       }
//     });
//   });
// };


// // Function to get all home banners
// const getAllHomeBanners = (callback) => {
//     const query = 'SELECT * FROM home_banner';
//     db.query(query, (err, results) => {
//         if (err) return callback(err);
//         callback(null, results);
//     });
// };


// //update status

// const updateHomeBannerStatus = (id, status) => {
//   console.log(`id:`, id);
//   console.log(`status:`, status);
//   return new Promise((resolve, reject) => {
//       const query = 'UPDATE home_banner SET status = ? WHERE id = ?';
//       db.query(query, [status, id], (err, results) => {
//           if (err) return reject(err);
//           resolve(results);
//       });
//   });
// };



// module.exports = { createImageEntry, getAllHomeBanners, updateHomeBannerStatus};
