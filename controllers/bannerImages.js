const bannerModel = require('../model/bannerImages'); // Corrected path

const handleFiles = (files, body) => {
    const desktopImagePath = files['desktop_image'];
    const mobileImagePath = files['mobile_image'];
    const tabletImagePath = files['tablet_image'];

    return {
        desktop_image_path: desktopImagePath,
        mobile_image_path: mobileImagePath,
        tablet_image_path: tabletImagePath,
        alt_tag_desktop: body['alt_tag_desktop'] || '',
        alt_tag_mobile: body['alt_tag_mobile'] || '',
        alt_tag_tablet: body['alt_tag_tablet'] || '',
        pageType: body['pageType']
    };
};

exports.createOrUpdateBanner = (req, res) => {
    const id = req.params.id;
    const banner = handleFiles(req.files, req.body);

    if (id) {
        // Update existing banner
        bannerModel.updateBanner(id, banner, (err) => {
            if (err) {
                console.error('Error updating banner:', err);
                return res.status(500).send('Error updating banner');
            }
            res.send('Banners updated successfully');
        });
    } else {
        // Insert new banner
        bannerModel.addBanner(banner, (err) => {
            if (err) {
                console.error('Error inserting banner:', err);
                return res.status(500).send('Error inserting banner');
            }
            res.send('Banners added successfully');
        });
    }
};

exports.fetchBannerById = (req, res) => {
    const id = req.params.id;
    bannerModel.getBannerById(id, (err, results) => {
        if (err) {
            console.error('Error fetching banner:', err);
            return res.status(500).send('Error fetching banner');
        }
        if (results.length === 0) {
            return res.status(404).send('Banner not found');
        }
        res.json(results[0]);
    });
};
