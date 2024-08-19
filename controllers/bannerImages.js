
const path = require('path');
const db = require('../model/bannerImages');




// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder = '';
//         if (file.fieldname === 'desktop_image') {
//             folder = 'uploads/banner_image/desktop';
//         } else if (file.fieldname === 'mobile_image') {
//             folder = 'uploads/banner_image/mobile';
//         } else if (file.fieldname === 'tablet_image') {
//             folder = 'uploads/banner_image/tablet';
//         }
//         cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//         const filename = req.body.filename || Date.now() + path.extname(file.originalname);
//         cb(null, filename);
//     }
// });

// Controller methods
const saveBanner = async (req, res) => {
    const id = req.params.id;

    const alt_tags_desktop = req.body['alt_tag_desktop'] || [];
    const alt_tags_mobile = req.body['alt_tag_mobile'] || [];
    const alt_tags_tablet = req.body['alt_tag_tablet'] || [];
    const pageType = req.body['pageType'];

    const desktopImagePaths = req.files['desktop_image'] || [];
    const mobileImagePaths = req.files['mobile_image'] || [];
    const tabletImagePaths = req.files['tablet_image'] || [];

    const banners = [];
    for (let i = 0; i < Math.max(desktopImagePaths.length, mobileImagePaths.length, tabletImagePaths.length); i++) {
        banners.push({
            desktop_image_path: desktopImagePaths[i] ? desktopImagePaths[i].path : '',
            mobile_image_path: mobileImagePaths[i] ? mobileImagePaths[i].path : '',
            tablet_image_path: tabletImagePaths[i] ? tabletImagePaths[i].path : '',
            alt_tag_desktop: alt_tags_desktop[i] || '',
            alt_tag_mobile: alt_tags_mobile[i] || '',
            alt_tag_tablet: alt_tags_tablet[i] || '',
            pageType: pageType,
        });
    }

    try {
        if (id) {
            // Update existing banners
            await Promise.all(banners.map(banner => {
                const query = `UPDATE banner_image SET 
                    desktop_image_path = ?, 
                    mobile_image_path = ?, 
                    tablet_image_path = ?, 
                    alt_tag_desktop = ?, 
                    alt_tag_mobile = ?, 
                    alt_tag_tablet = ?,
                    pageType = ?
                    WHERE id = ?`;
                return new Promise((resolve, reject) => {
                    db.updateBanner(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType, id], (err) => {
                        if (err) {
                            console.error('Error updating banner:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }));
            res.send('Banners updated successfully');
        } else {
            // Insert new banners
            await Promise.all(banners.map(banner => {
                const query = `INSERT INTO banner_image (desktop_image_path, mobile_image_path, tablet_image_path, alt_tag_desktop, alt_tag_mobile, alt_tag_tablet, pageType) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
                return new Promise((resolve, reject) => {
                    db.insertBanner(query, [banner.desktop_image_path, banner.mobile_image_path, banner.tablet_image_path, banner.alt_tag_desktop, banner.alt_tag_mobile, banner.alt_tag_tablet, banner.pageType], (err) => {
                        if (err) {
                            console.error('Error inserting banner:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }));
            res.send('Banners added successfully');
        }
    } catch (error) {
        console.error('Unhandled error in saveBanner:', error);
        res.status(500).send('Internal Server Error');
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
        res.json(results);
    });
};


// Update our Banner status
const UpdateBannerStatus = async (req, res) => {
    const { id, status } = req.body;
    if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await db.updateBannerStatus(id, status);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Delete Banner us
  const deleteBanner = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    try {
      
      await db.deleteBannerFromDB(id);
      res.status(200).json({ success: true, message: 'our Banner deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Export the controller methods and middleware
module.exports = {
  
    saveBanner,
    getBannerById, UpdateBannerStatus, deleteBanner
};
