const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Setup middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// API endpoint to handle form data
app.post('/api/submit', upload.single('logo'), (req, res) => {
    const { phoneNumber, footerTitle, footerDescription, address, contactPhones, email } = req.body;
    const logo = req.file ? req.file.path : null;
    const buttons = JSON.parse(req.body.buttons);

    // Handle data here (e.g., save to database)

    console.log({
        logo,
        buttons,
        phoneNumber,
        footerTitle,
        footerDescription,
        address,
        contactPhones,
        email
    });

    res.json({ message: 'Data received successfully!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
