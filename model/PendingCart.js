const mongoose = require('mongoose');

const PendingCartSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
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
    type: String, // Consider using Number if prices are used in calculations
    required: true,
  },
  item_dsc: {
    type: String,
    required: true,
  },
  item_qty: {
    type: String, // Consider using Number
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
    type: String, // Consider using Number
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('PendingCart', PendingCartSchema);
