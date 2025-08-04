const mongoose = require("mongoose");

const TrackOrderSchema = new mongoose.Schema({
    order_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
        required : true
    },
    order_status : {
        type : String,
        enum: ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled" ],
        require : true
    },
    changeBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    changeAt : {
        type : Date,
        default : Date.now()
    },
    userType : {
        type : String,
        required : true
    }

})

module.exports = mongoose.model("TrackOrder", TrackOrderSchema);