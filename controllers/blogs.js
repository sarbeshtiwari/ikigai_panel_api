const path = require('path');
const fs = require('fs');
const multer = require('multer');
const im = require('../config/im');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/im');
const { 
    addBlogs, 
    getAllBlogs, 
    updateBlogsStatus, 
    getBlogsById, 
    deleteBlogFromDB, 
    getImagePathById, 
    updateBlog 
} = require('../model/blogs');

// //to handle file upload
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => cb(null, 'uploads/blogs'),
//         filename: (req, file, cb) => cb (null, Date.now() + path.extname(file.originalname))
//     })
// });

// //add blog
// const createBlog = async (req, res) => {
//     try {
//         upload.single('image')(req, res, async (err) => {
//             if (err) return res.status(400).send(err.message);

//             const {
//                 blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data
//             } = req.body;

//             const image_path = req.file ? req.file.filename :null;

//             try {
//                 const result = await addBlogs ( blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data, image_path);
//                 res.status(201).json({success: true, result});
//             } catch (dbError) {
//                 res.status(500).json({success: false, message: dbError.message});
//             }
//         });
//     } catch (error){
//         res.status(500).json({success: false, message: error.message});
//     }
// };

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads/blogs',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

  

  const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return result;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw error;
  }
};



// Add blog
// controllers/blogs.js
const createBlog = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);

      const tempFilePath = req.file ? req.file.path : null; // Updated to use path

      if (!tempFilePath) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(tempFilePath);
        const image_path = cloudinaryResult.secure_url;

        // Add blog to database
        const {
          blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data
        } = req.body;

        const result = await addBlogs(blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data, image_path);
        res.status(201).json({ success: true, result });
      } catch (dbError) {
        console.error('Database Error:', dbError); // More detailed logging
        res.status(500).json({ success: false, message: 'Database Error: ' + dbError.message });
      } finally {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      }
    });
  } catch (error) {
    console.error('Server Error:', error); // More detailed logging
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};







//   app.post("/api/upload", upload.single("file"), async (req, res) => {
//     try {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       res.status(200).json({ url: result.secure_url, public_id: result.public_id });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Upload failed" });
//     }
//   });


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
      if (imagePath) await deleteFromCloudinary(imagePath);
      
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
    
    const newImageFile = req.file;
    const newImagePath = newImageFile ? newImageFile.path : null;
    let newImagePublicId = newImageFile ? newImageFile.filename : null;

    try {
      // Get the current image path from the database
      const oldImagePath = await getImagePathById(id);
      let cloudinaryResult;

      // Upload new image to Cloudinary if provided
      if (newImagePath) {
        cloudinaryResult = await uploadToCloudinary(newImagePath);
        newImagePublicId = cloudinaryResult.secure_url;

        // Remove old image from Cloudinary if it exists and is different
        if (oldImagePath && oldImagePath !== newImagePublicId) {
          await deleteFromCloudinary(oldImagePath);
        }
      }

      // Update the blog entry in the database
      const result = await updateBlog(id, blogName, blogBy, blogDate, blogTags, blogLink, alt_tag, content, schema_data, newImagePublicId);

      // Delete the temporary file
      if (newImagePath) {
        fs.unlink(newImagePath, (err) => {
          if (err) console.error('Failed to delete temporary file:', err);
        });
      }

      res.json({ message: 'Data updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
      console.error('Update Error:', error);
      res.status(500).json({ message: 'Failed to update data', error: error.message });
    }
  });
};

module.exports = {
    createBlog, getBlogs, getBlogById, updateBlogStatus, deleteBlog, updateBlogs, upload,
}