require('dotenv').config();

const jwtConfig = {
  secretKey: process.env.JWT_SECRET_KEY || 'default_secret_key', // Use a default key if the env variable is missing
  tokenExpiry: process.env.JWT_TOKEN_EXPIRY || '10m' // Default to 10 minutes if not set
};

module.exports = jwtConfig;
