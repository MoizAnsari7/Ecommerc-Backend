const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const logger = require('../config/logger'); // Import logger
require("dotenv").config();

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    logger.warn("Authorization token missing in request headers");
    return res.status(401).json({
        success: false,
        message: 'Authorization token is missing'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    logger.debug(`Decoded token payload: ${JSON.stringify(decoded)}`);

    const user = await Users.findById(decoded.id);

    if (!user) {
      logger.warn(`Token is valid but user not found with ID: ${decoded.id}`);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`User authenticated: ${user.email} (${user._id})`);
    req.user = user;
    next();

  } catch (error) {
    logger.error("Token verification failed", error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
