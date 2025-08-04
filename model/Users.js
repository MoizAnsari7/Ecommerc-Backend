const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true,
    default : null
  },
  
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows nulls even with `unique`
    default: null
  },
  
  phone: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  
  email_verified_at: {
    type: Date,
    default: null
  },
  
  password: {
    type: String,
    required : true
  },

  role : {
    type : String,
    enum : ["User", "Seller"],
    require : true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt like Laravel's $table->timestamps()
});

module.exports = mongoose.model('User', UsersSchema);
