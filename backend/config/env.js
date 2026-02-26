const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/biofund-connect',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d'
};
