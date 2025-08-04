const logger = require("../config/logger");
const trackMyOrder = require("../model/TrackOrder");

const TrackOrderController = {
    // Get Tracking Info by Order ID
    getOrderTracking: async (req, res) => {
        try {
            const { id } = req.params;

            logger.debug(`Fetching tracking info for order ID: ${id}`);

            const tracking = await trackMyOrder.find({ order_id: id })
                .sort({ changeAt: 1 }) // oldest first
                .populate('changeBy', 'name'); // populate user name

            if (!tracking || tracking.length === 0) {
                logger.warn(`No tracking info found for order ID: ${id}`);
                return res.status(404).json({
                    success: false,
                    message: 'No tracking info found for this order'
                });
            }

            logger.info(`Tracking info fetched for order ID: ${id}`);
            res.status(200).json({
                success: true,
                message: "Tracking info fetched",
                data: tracking[tracking.length - 1] // last update
            });
        } catch (error) {
            logger.error(`Error fetching tracking for order ID: ${req.params.id}`, error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update Order Status
    updateOrderStatus: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status, userType } = req.body;
            const userId = req.user._id; // from auth middleware

            logger.debug(`Status update request for order ID: ${orderId} by user ${userId}, body: ${JSON.stringify(req.body)}`);

            const validStatuses = ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
            if (!validStatuses.includes(status)) {
                logger.warn(`Invalid status value "${status}" provided for order ID: ${orderId}`);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status value'
                });
            }

            const newTracking = new trackMyOrder({
                order_id: orderId,
                order_status: status,
                changeBy: userId,
                userType,
            });

            await newTracking.save();

            logger.info(`Order status updated to "${status}" for order ID: ${orderId} by user ${userId}`);
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully'
            });

        } catch (error) {
            logger.error("Error updating order status", error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

module.exports = TrackOrderController;
