const mongoose = require('mongoose');

const FailedJobSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
    required: true,
  },
  connection: {
    type: String,
    required: true,
  },
  queue: {
    type: String,
    required: true,
  },
  payload: {
    type: String, // or Mixed if storing objects
    required: true,
  },
  exception: {
    type: String,
    required: true,
  },
  failed_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('FailedJob', FailedJobSchema);
