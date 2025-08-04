const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({ 
    seller_id :{
        type :mongoose.Schema.Types.ObjectId,
        ref:'User',
        required : true
    },
    item_name: { 
        type: String,
        required: true 
    },

    item_category: {
        type: String,
        required: true 
    },

    item_price: {
        type: Number,
        required: true 
    },

    item_dsc: {
        type: String, 
        required: true
    },

    item_qty: {
        type: Number,
        required: true
    },
    item_image: {
        type: String,
        required: true
    },
    item_discount: {
        type: String,
        default: null 
    }
})

module.exports = mongoose.model('Item', ItemSchema)