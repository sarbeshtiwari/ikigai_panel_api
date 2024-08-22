// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey, tokenExpiry } = require('../config/jwt');
const userModel = require('../model/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

  userModel.getUserByEmail(username, async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: tokenExpiry });
    res.json({ token , tokenExpiry});
  });
};

// Register a new user
const registerUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await userModel.createUser(username, password);
      res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
  login, registerUser
};
