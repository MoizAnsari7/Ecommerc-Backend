const mongoose = require('mongoose');

const AddToCartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',
    required: true
  },

  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  
  item_name: {
    type: String,
    required: true,
  },
  
  item_category: {
    type: String,
    required: true,
  },
  
  item_price: {
    type: Number,
    required: true,
  },
  
  item_dsc: {
    type: String,
    required: true,
  },
  
  item_qty: {
    type: Number,
    required: true,
  },
  
  item_image: {
    type: String,
    required: true,
  },
  
  item_discount: {
    type: String,
    default: null,
  },
  
  item_subtotal: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('AddToCart', AddToCartSchema);
