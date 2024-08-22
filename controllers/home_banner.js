const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/im');
const {
  insertBanner,
  getAllHomeBanners,
  updateHomeBannerStatus,
  getHomeBannerByID,
  deleteHomeBannerFromDB,
  getImagePathByID,
  updateHomeBanner
} = require('../model/home_banner');

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw error;
  }
};

const saveHomeBanner = (req, res) => {
  const id = req.params.id;
  const alt_tags_desktop = req.body['alt_tag_desktop'] || [];
  const alt_tags_mobile = req.body['alt_tag_mobile'] || [];
  const alt_tags_tablet = req.body['alt_tag_tablet'] || [];

  const desktopImagePaths = req.files['desktop_image'] || [];
  const mobileImagePaths = req.files['mobile_image'] || [];
  const tabletImagePaths = req.files['tablet_image'] || [];

  // Ensure arrays are of the same length
  const maxLength = Math.max(desktopImagePaths.length, mobileImagePaths.length, tabletImagePaths.length);
  const banners = [];

  for (let i = 0; i < maxLength; i++) {
    banners.push({
      desktop_image_path: desktopImagePaths[i] ? desktopImagePaths[i].path : '',
      mobile_image_path: mobileImagePaths[i] ? mobileImagePaths[i].path : '',
      tablet_image_path: tabletImagePaths[i] ? tabletImagePaths[i].path : '',
      alt_tag_desktop: alt_tags_desktop || '',
      alt_tag_mobile: alt_tags_mobile || '',
      alt_tag_tablet: alt_tags_tablet || ''
    });
  }

  // Check if all banners are empty
  const allBannersEmpty = banners.every(banner =>
    !banner.desktop_image_path && 
    !banner.mobile_image_path && 
    !banner.tablet_image_path &&
    !banner.alt_tag_desktop && 
    !banner.alt_tag_mobile && 
    !banner.alt_tag_tablet
  );

  if (allBannersEmpty) {
    return res.status(400).send('Select at least one image and its alt tag');
  }

  const processBanner = (banner, callback) => {
    if (id) {
      let updateCount = 0;
      banners.forEach((banner, index) => {
        updateHomeBanner(id, banner, (err) => {
          if (err) {
            console.error('Error updating banner:', err);
            res.status(500).send('Error updating banner');
            return;
          }
          updateCount++;
          if (updateCount === banners.length) {
            res.send('Banners updated successfully');
          }
        });
      });
    } else {
      let insertCount = 0;
      banners.forEach((banner) => {
        insertBanner(banner, (err) => {
          if (err) {
            console.error('Error inserting banner:', err);
            res.status(500).send('Error inserting banner');
            return;
          }
          insertCount++;
          if (insertCount === banners.length) {
            res.send('Banners added successfully');
          }
        });
      });
    }
  };

  let processedCount = 0;
  const totalBanners = banners.length;

  if (totalBanners > 0) {
    banners.forEach(banner => {
      processBanner(banner, (err) => {
        if (err) {
          console.error('Error processing banner:', err);
          res.status(500).send('Error processing banner');
          return;
        }
        processedCount++;
        if (processedCount === totalBanners) {
          res.send(id ? 'Banners updated successfully' : 'Banners added successfully');
        }
      });
    });
  } else {
    res.status(400).send('No banners to process');
  }
};

// const saveHomeBanner = (req, res) => {
//   const id = req.params.id;
//   const alt_tags_desktop = req.body['alt_tag_desktop'] || [];
//   const alt_tags_mobile = req.body['alt_tag_mobile'] || [];
//   const alt_tags_tablet = req.body['alt_tag_tablet'] || [];

//   const desktopImagePaths = req.files['desktop_image'] || [];
//   const mobileImagePaths = req.files['mobile_image'] || [];
//   const tabletImagePaths = req.files['tablet_image'] || [];

//   const banners = [];
//   for (let i = 0; i < desktopImagePaths.length; i++) {
//     banners.push({
//       desktop_image_path: desktopImagePaths[i] ? desktopImagePaths[i].path : '',
//       mobile_image_path: mobileImagePaths[i] ? mobileImagePaths[i].path : '',
//       tablet_image_path: tabletImagePaths[i] ? tabletImagePaths[i].path : '',
//       alt_tag_desktop: alt_tags_desktop || '',
//       alt_tag_mobile: alt_tags_mobile || '',
//       alt_tag_tablet: alt_tags_tablet || ''
//     });
//   }

//   // Check if all banners are empty
//   const allBannersEmpty = banners.every(banner => 
//     !banner.desktop_image_path && 
//     !banner.mobile_image_path && 
//     !banner.tablet_image_path &&
//     !banner.alt_tag_desktop && 
//     !banner.alt_tag_mobile && 
//     !banner.alt_tag_tablet
//   );

//   if (allBannersEmpty) {
//     return res.status(400).send('Select at least one image and its alt tag');
//   }

//   if (id) {
//     let updateCount = 0;
//     banners.forEach((banner, index) => {
//       updateHomeBanner(id, banner, (err) => {
//         if (err) {
//           console.error('Error updating banner:', err);
//           res.status(500).send('Error updating banner');
//           return;
//         }
//         updateCount++;
//         if (updateCount === banners.length) {
//           res.send('Banners updated successfully');
//         }
//       });
//     });
//   } else {
//     let insertCount = 0;
//     banners.forEach((banner) => {
//       insertBanner(banner, (err) => {
//         if (err) {
//           console.error('Error inserting banner:', err);
//           res.status(500).send('Error inserting banner');
//           return;
//         }
//         insertCount++;
//         if (insertCount === banners.length) {
//           res.send('Banners added successfully');
//         }
//       });
//     });
//   }
// };


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
    const {desktopimagePath, mobile, tablet} = await getImagePathByID(id);
    if (desktopimagePath) await deleteFromCloudinary(desktopimagePath);
    if (mobile) await deleteFromCloudinary(mobile);
    if (tablet) await deleteFromCloudinary(tablet);
    
    await deleteHomeBannerFromDB(id);
    res.status(200).json({ success: true, message: 'Home banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  getAllBanners,
  getBannerByID,
  updateBannerStatus,
  deleteBanner,
  saveHomeBanner,  
};




