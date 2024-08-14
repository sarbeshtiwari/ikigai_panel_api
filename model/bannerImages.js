// models/bannerModel.js
const mysql = require('mysql2');
const db = require('../config/db');

// Function to add a new banner

   // Function to add a new banner
const addBanner = (banner, callback) => {
    const query = `INSERT INTO banner_image 
                    (desktop_image_path, mobile_image_path, tablet_image_path, alt_tag_desktop, alt_tag_mobile, alt_tag_tablet, pageType, status, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, false, NOW(), NOW())`;
    db.query(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType], callback);
};



// Function to update an existing banner
// Function to update an existing banner
const updateBanner = (id, banner, callback) => {
    const query = `UPDATE banner_image SET 
                    desktop_image_path = ?, 
                    mobile_image_path = ?, 
                    tablet_image_path = ?, 
                    alt_tag_desktop = ?, 
                    alt_tag_mobile = ?, 
                    alt_tag_tablet = ?, 
                    pageType = ?, 
                    updated_at = NOW() 
                    WHERE id = ?`;
    db.query(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType, id], callback);
};



// Function to fetch a banner by ID
const getBannerById = (id, callback) => {
    const query = 'SELECT * FROM banner_image WHERE pageType = ?';
    db.query(query, [id], callback);
};

module.exports = {
    addBanner,
    updateBanner,
    getBannerById
};
