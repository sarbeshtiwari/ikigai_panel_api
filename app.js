const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 1000;
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const homeBanner = require('./routes/home_banner');
const aboutUs = require('./routes/about');
const ourServices = require('./routes/services');
const ourTeam = require('./routes/team');
const blogs = require('./routes/blogs');
const metaDetails = require('./routes/metaDetails');
const bannerImage = require('./routes/bannerImages');

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/homeBanner', homeBanner);
app.use('/about', aboutUs);
app.use('/services', ourServices);
app.use('/team', ourTeam);
app.use('/blog', blogs);
app.use('/meta', metaDetails);
app.use('/bannerImage', bannerImage);


// Start the server
const server = app.listen(port, () => {
  const address = server.address();
  const host = address.address === '::' ? 'localhost' : address.address;
  const url = `http://${host}:${address.port}`;
  console.log(`Server running at ${url}`);
});