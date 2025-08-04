const logger = require("../config/logger");
const Order = require("../model/Order");
const TrackOrder = require("../model/TrackOrder");

const OrderController = {

  // Order placed by User
  postOrder: async (req, res) => {
    const user_id = req.user._id;
    const {
      seller_id,
      item_id,
      item_category,
      item_name,
      item_price,
      item_dsc,
      item_qty,
      item_image,
      item_discount,
      item_subtotal
    } = req.body;

    try {
      logger.debug('Placing a new order');
      logger.debug(`Request body: ${JSON.stringify(req.body)}`);

      const newOrder = await Order.create({
        user_id,
        seller_id,
        item_id,
        item_name,
        item_category,
        item_price,
        item_dsc,
        item_qty,
        item_image,
        item_discount,
        item_subtotal
      });

      logger.info('Order placed successfully');
      return res.status(201).json({
        success: true,
        data: newOrder,
        message: "Order placed successfully"
      });

    } catch (error) {
      logger.error('Failed to place order', error);
      return res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error.message
      });
    }
  },

  // Get Order by ID
  getOrderById: async (req, res) => {
    const { id } = req.params;

    try {
      logger.debug(`Fetching order by ID: ${id}`);

      const data = await Order.findById(id);

      if (!data) {
        logger.warn(`Order not found: ${id}`);
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      logger.info(`Fetched order: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: data
      });

    } catch (error) {
      logger.error('Failed to fetch order', error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  },

  // Get Orders by User ID
  getMyOrder: async (req, res) => {
    const id = req.user._id;

    try {
      logger.debug(`Fetching orders for user ID: ${id}`);

      const orders = await Order.find({ user_id: id });
      const grandTotal = orders.reduce((sum, order) => sum + order.item_subtotal, 0);

      logger.info(`Fetched ${orders.length} orders for user: ${id}`);
      return res.status(200).json({
        success: true,
        data: orders,
        grandTotal,
        message: "My orders view"
      });

    } catch (error) {
      logger.error('Failed to fetch orders for user', error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message
      });
    }
  },

  // Get Orders by Seller ID
  getSellerOrder: async (req, res) => {
    try {
      const id = req.user._id;
      logger.debug(`Fetching orders for seller ID: ${id}`);

      const data = await Order.find({ seller_id: id });

      logger.info(`Fetched ${data.length} orders for seller: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: data
      });

    } catch (error) {
      logger.error('Failed to fetch orders for seller', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  },

  // Cancel Order by ID
  cancelOrder: async (req, res) => {
    const { id } = req.params;

    try {
      logger.debug(`Canceling order with ID: ${id}`);

      const deleted = await Order.findByIdAndDelete({ _id: id });

      if (!deleted) {
        logger.warn(`Order not found for cancellation: ${id}`);
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      logger.info(`Order cancelled successfully: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Order cancelled"
      });

    } catch (error) {
      logger.error('Failed to cancel order', error);
      return res.status(500).json({
        success: false,
        message: "Failed to cancel order",
        error: error.message
      });
    }
  },

  getAllOrders : async (req, res) => {
    try {
      logger.debug("Request recevied for GetAllOrder");

      const orders = await Order.find({}).sort({updatedAt : -1});

      const ordersWithStatus = await Promise.all(
      orders.map(async (order) => {
        const latestStatus = await TrackOrder
          .find({ order_id: order._id })
          .sort({ changeAt: -1 }); // Get most recent status

        console.log(latestStatus);
        return {
          ...order.toObject(),
          order_status: latestStatus[latestStatus.length-1].order_status
        };
      }));

      logger.info("Order fetched successfuly");
      res.status(200).json({
        success : true,
        data : ordersWithStatus,
        message : "Order fetched successfuly"
      });
    } 
    catch (error) {
      logger.error('Failed to fetched Orders', error);
      res.status(500).json({ 
        success : false,
        error: err.message,
        message : "Failed to fetched Orders"
      });
    }
  }
};

module.exports = OrderController;
