const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Acts like primary key
  },
  token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: null, // nullable in Laravel
  }
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
