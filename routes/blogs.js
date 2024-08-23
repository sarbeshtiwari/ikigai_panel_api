const express = require('express');
const router = express.Router();
const {
    createBlog, 
    getBlogs, 
    getBlogById, getBlogBySlugURL, getRecentBlogs,
    updateBlogStatus, 
    deleteBlog, 
    updateBlogs, upload
} = require('../controllers/blogs');

// Route to add information and image upload
router.post('/upload', createBlog);

// Route to get all blog
router.get('/get', getBlogs);

// Route to get blog by ID
router.get('/getByID/:id', getBlogById);

// Route to get blog by ID
router.get('/getBySlug/:slugURL', getBlogBySlugURL);

// Route to get blog by ID
router.get('/getRecentBlogs', getRecentBlogs);

// Route to update blog status
router.patch('/updateStatus', updateBlogStatus);


// Route to delete blog
router.delete('/delete/:id', deleteBlog);

// Route to update blog entry
router.put('/update/:id', updateBlogs);

module.exports = router;