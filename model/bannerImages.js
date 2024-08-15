const db = require('../config/db');

const updateBanner = (query, params, callback) => {
    db.query(query, params, callback);
};

const insertBanner = (query, params, callback) => {
    db.query(query, params, callback);
};

const getBanner = (query, params, callback) => {
    db.query(query, params, callback);
};

module.exports = {
    updateBanner,
    insertBanner,
    getBanner
};
