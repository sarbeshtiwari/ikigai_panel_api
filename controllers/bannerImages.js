const multer = require('multer');
const path = require('path');
const db = require('../model/bannerImages');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';
        if (file.fieldname === 'desktop_image') {
            folder = 'uploads/banner_image/desktop';
        } else if (file.fieldname === 'mobile_image') {
            folder = 'uploads/banner_image/mobile';
        } else if (file.fieldname === 'tablet_image') {
            folder = 'uploads/banner_image/tablet';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename || Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Controller methods
const saveBanner = (req, res) => {
    const id = req.params.id;

    const alt_tags_desktop = req.body['alt_tag_desktop'] || [];
    const alt_tags_mobile = req.body['alt_tag_mobile'] || [];
    const alt_tags_tablet = req.body['alt_tag_tablet'] || [];
    const pageType = req.body['pageType'];

    const desktopImagePaths = req.files['desktop_image'] || [];
    const mobileImagePaths = req.files['mobile_image'] || [];
    const tabletImagePaths = req.files['tablet_image'] || [];

    const banners = [];
    for (let i = 0; i < desktopImagePaths.length; i++) {
        banners.push({
            desktop_image_path: desktopImagePaths[i] ? desktopImagePaths[i].filename : '',
            mobile_image_path: mobileImagePaths[i] ? mobileImagePaths[i].filename : '',
            tablet_image_path: tabletImagePaths[i] ? tabletImagePaths[i].filename : '',
            alt_tag_desktop: alt_tags_desktop[i] || '',
            alt_tag_mobile: alt_tags_mobile[i] || '',
            alt_tag_tablet: alt_tags_tablet[i] || '',
            pageType: pageType,
        });
    }

    if (id) {
        // Update existing banners
        banners.forEach((banner) => {
            const query = `UPDATE banner_image SET 
                desktop_image_path = ?, 
                mobile_image_path = ?, 
                tablet_image_path = ?, 
                alt_tag_desktop = ?, 
                alt_tag_mobile = ?, 
                alt_tag_tablet = ?,
                pageType = ?
                WHERE id = ?`;
            db.updateBanner(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType, id], (err) => {
                if (err) {
                    console.error('Error updating banner:', err);
                    res.status(500).send('Error updating banner');
                    return;
                }
            });
        });
        res.send('Banners updated successfully');
    } else {
        // Insert new banners
        banners.forEach((banner) => {
            const query = `INSERT INTO banner_image (desktop_image_path, mobile_image_path, tablet_image_path, alt_tag_desktop, alt_tag_mobile, alt_tag_tablet, pageType) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.insertBanner(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType], (err) => {
                if (err) {
                    console.error('Error inserting banner:', err);
                    res.status(500).send('Error inserting banner');
                    return;
                }
            });
        });
        res.send('Banners added successfully');
    }
};

const getBannerById = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM banner_image WHERE pageType = ?';
    db.getBanner(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching banner:', err);
            res.status(500).send('Error fetching banner');
            return;
        }
        res.json(results[0]);
    });
};

// Export the controller methods and middleware
module.exports = {
    upload,
    saveBanner,
    getBannerById
};
