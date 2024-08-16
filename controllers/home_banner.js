const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {
  insertBanner,
  getAllHomeBanners,
  updateHomeBannerStatus,
  getHomeBannerByID,
  deleteHomeBannerFromDB,
  getImagePathByID,
  updateHomeBanner
} = require('../model/home_banner');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      let folder = '';
      if (file.fieldname === 'desktop_image') {
          folder = 'uploads/home_banner/desktop';
      } else if (file.fieldname === 'mobile_image') {
          folder = 'uploads/home_banner/mobile';
      } else if (file.fieldname === 'tablet_image') {
          folder = 'uploads/home_banner/tablet';
      }
      cb(null, folder);
  },
  filename: (req, file, cb) => {
      const filename = req.body.filename || Date.now() + path.extname(file.originalname);
      cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const saveHomeBanner = (req, res) => {
  const id = req.params.id;
  const alt_tags_desktop = req.body['alt_tag_desktop'] || [];
  const alt_tags_mobile = req.body['alt_tag_mobile'] || [];
  const alt_tags_tablet = req.body['alt_tag_tablet'] || [];

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
          alt_tag_tablet: alt_tags_tablet[i] || ''
      });
  }

  if (id) {
      banners.forEach((banner, index) => {
        updateHomeBanner(id, banner, (err) => {
              if (err) {
                  console.error('Error updating banner:', err);
                  res.status(500).send('Error updating banner');
                  return;
              }
          });
      });
      res.send('Banners updated successfully');
  } else {
      banners.forEach((banner) => {
          insertBanner(banner, (err) => {
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

// Middleware for handling file upload (using multer)
// const multer = require('multer');
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/home_banner/'),
//     filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
//   })
// });

// // Create new home banner entry
// const createMetaInfo = async (req, res) => {
//   try {
//     upload.single('image')(req, res, async (err) => {
//       if (err) return res.status(400).send(err.message);

//       const {
//         meta_title,
//         meta_keywords,
//         meta_description,
//         heading,
//         alt_tag
//       } = req.body;

//       const image_path = req.file ? req.file.filename : null;

//       try {
//         const result = await createImageEntry(meta_title, meta_keywords, meta_description, heading, alt_tag, image_path);
//         res.status(201).json({ success: true, result });
//       } catch (dbError) {
//         res.status(500).json({ success: false, message: dbError.message });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Get all home banners
const getAllBanners = async (req, res) => {
  try {
    const results = await getAllHomeBanners();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get home banner by ID
const getBannerByID = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const result = await getHomeBannerByID(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update home banner status
const updateBannerStatus = async (req, res) => {
  const { id, status } = req.body;
  if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });

  try {
    const result = await updateHomeBannerStatus(id, status);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete home banner
const deleteBanner = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

  try {
    const imagePath = await getImagePathByID(id);
    if (imagePath) fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'home_banner', imagePath));
    
    await deleteHomeBannerFromDB(id);
    res.status(200).json({ success: true, message: 'Home banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update home banner entry
// const updateBanner = async (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

//   upload.single('image')(req, res, async (err) => {
//     if (err) return res.status(400).send(err.message);

//     const {
//       meta_title,
//       meta_keywords,
//       meta_description,
//       heading,
//       alt_tag
//     } = req.body;
//     const image_path = req.file ? req.file.filename : null;

//     try {
//       const oldImagePath = await getImagePathByID(id);

//       const result = await updateHomeBannerEntry(id, meta_title, meta_keywords, meta_description, heading, alt_tag, image_path);

//       if (oldImagePath && image_path && oldImagePath !== image_path) {
//         fs.unlinkSync(path.join('uploads/home_banner/', oldImagePath));
//       }

//       res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to update data', error: error.message });
//     }
//   });
// };

module.exports = {
  // createMetaInfo,
  getAllBanners,
  getBannerByID,
  updateBannerStatus,
  deleteBanner,
  saveHomeBanner,
  upload
  // updateBanner
};









// // controller/home_banner.js
// const path = require('path');
// const { createImageEntry } = require('../model/home_banner');

// // Middleware for handling file upload (using multer)
// const multer = require('multer');
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, 'uploads/home_banner/');
//         },
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + path.extname(file.originalname));
//         },
//     }),
// });

// const uploadImage = upload.single('image'); // Use multer's single file upload middleware

// const createMetaInfo = async (req, res) => {
//     try {
//         // First handle file upload
//         uploadImage(req, res, async (err) => {
//             if (err) {
//                 return res.status(400).send(err.message); // Handle file upload errors
//             }

//             // After file upload, process meta information
//             const {
//                 meta_title,
//                 meta_keywords,
//                 meta_description,
//                 heading,
//                 alt_tag
//             } = req.body;
            
//             const image_path = req.file ? req.file.filename : null;

//             try {
//                 // Call the function to create an entry in the database
//                 const result = await createImageEntry(meta_title, meta_keywords, meta_description, heading, alt_tag, image_path);
//                 res.status(201).json({ success: true, result });
//             } catch (dbError) {
//                 // Handle database errors
//                 res.status(500).json({ success: false, message: dbError.message });
//             }
//         });
//     } catch (error) {
//         // Handle any unexpected errors
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// module.exports = { createMetaInfo };
