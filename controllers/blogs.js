const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { 
    addBlogs, 
    getAllBlogs, 
    updateBlogsStatus, 
    getBlogsById, 
    deleteBlogFromDB, 
    getImagePathById, 
    updateBlog 
} = require('../model/blogs');

//to handle file upload
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/blogs'),
        filename: (req, file, cb) => cb (null, Date.now() + path.extname(file.originalname))
    })
});

//add blog
const createBlog = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) return res.status(400).send(err.message);

            const {
                blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data
            } = req.body;

            const image_path = req.file ? req.file.filename :null;

            try {
                const result = await addBlogs ( blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data, image_path);
                res.status(201).json({success: true, result});
            } catch (dbError) {
                res.status(500).json({success: false, message: dbError.message});
            }
        });
    } catch (error){
        res.status(500).json({success: false, message: error.message});
    }
};

//get all blogs
const getBlogs = async (req, res) => {
    try{
        const results = await getAllBlogs();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

//get blog by ID
const getBlogById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({success: false, message: 'Invalid ID'});

    try {
        const result = await getBlogsById(id);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
};

// Update blog status
const updateBlogStatus = async (req, res) => {
    const { id, status } = req.body;
    if (id === undefined || status === undefined) return res.status(400).json({ success: false, message: 'Invalid request: id and status are required' });
  
    try {
      const result = await updateBlogsStatus(id, status);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// Delete blog
const deleteBlog = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    try {
      const imagePath = await getImagePathById(id);
      if (imagePath) fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'blogs', imagePath));
      
      await deleteBlogFromDB(id);
      res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// Update our team entry
const updateBlogs = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
  
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);
  
      const {
         blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data
    } = req.body;
      const image_path = req.file ? req.file.filename : null;
  
      try {
        const oldImagePath = await getImagePathById(id);
  
        const result = await updateBlog(id,  blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data, image_path);
  
        if (oldImagePath && image_path && oldImagePath !== image_path) {
          fs.unlinkSync(path.join('uploads/blogs/', oldImagePath));
        }
  
        res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update data', error: error.message });
      }
    });
};

module.exports = {
    createBlog, getBlogs, getBlogById, updateBlogStatus, deleteBlog, updateBlogs
}