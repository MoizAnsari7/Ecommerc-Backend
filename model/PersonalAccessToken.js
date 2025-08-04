// models/PersonalAccessToken.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const personalAccessTokenSchema = new Schema({
  tokenableType: {
    type: String,
    required: true
  },
  tokenableId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'tokenableType' // supports polymorphic relations
  },
  name: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    maxlength: 64
  },
  abilities: {
    type: [String], // storing abilities as an array of strings
    default: []
  },
  lastUsedAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // includes createdAt and updatedAt
});

module.exports = mongoose.model('PersonalAccessToken', personalAccessTokenSchema);
