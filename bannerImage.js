const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const db = require('./config/db')
const cors = require('cors');

const app = express();
const port = 4000;
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configure Multer for file uploads

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
        // Use the same filename for all images
        const filename = req.body.filename || Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// API to save home banner
app.post('/saveBanner/:id?', upload.fields([
    { name: 'desktop_image', maxCount: 1 },
    { name: 'mobile_image', maxCount: 1 },
    { name: 'tablet_image', maxCount: 1 }
]), (req, res) => {
    const id = req.params.id;

    // Extract alt tags from request body
    const alt_tags_desktop = req.body['alt_tag_desktop'] || [];
    const alt_tags_mobile = req.body['alt_tag_mobile'] || [];
    const alt_tags_tablet = req.body['alt_tag_tablet'] || [];
    const pageType = req.body['pageType'];

    // Handle file paths
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
        banners.forEach((banner, index) => {
            const query = `UPDATE banner_image SET 
                desktop_image_path = ?, 
                mobile_image_path = ?, 
                tablet_image_path = ?, 
                alt_tag_desktop = ?, 
                alt_tag_mobile = ?, 
                alt_tag_tablet = ?,
                pageType = ?
                WHERE id = ?`;
            db.query(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType, id], (err) => {
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
            db.query(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType], (err) => {
                if (err) {
                    console.error('Error inserting banner:', err);
                    res.status(500).send('Error inserting banner');
                    return;
                }
            });
        });
        res.send('Banners added successfully');
    }
});


// API to fetch banner by ID
app.get('/getBanner/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM banner_image WHERE pageType = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching banner:', err);
            res.status(500).send('Error fetching banner');
            return;
        }
        res.json(results[0]);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
