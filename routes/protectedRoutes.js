// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const { protectedRoute } = require('../controllers/protectedController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/protected', authenticateToken, protectedRoute);

module.exports = router;
