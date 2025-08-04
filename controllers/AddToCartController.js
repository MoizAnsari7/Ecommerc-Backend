const logger = require('../config/logger'); // Correct logger import
const AddToCart = require('../model/AddToCart');

const AddToCartController = {

  // Add Item to Cart
  addToCart: async (req, res) => {
    const user_id = req.user._id;
    const { item_id, item_name, item_category, item_price, item_dsc, item_qty, item_image, item_discount } = req.body;
    
    logger.debug(`Add to cart request received for user: ${user_id}`);
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);

    try {
      // Calculate the subtotal
      const item_total = item_price * item_qty;
      const item_disc = (item_total / 100) * item_discount;
      const item_subtotal = item_total - item_disc;

      const data = await AddToCart.create({
        user_id,
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


      // Optionally, you can store it in the session if needed
      // let cartItems = req.session.cartItems || [];
      // cartItems.push(data);
      // req.session.cartItems = cartItems;

      // Calculate the grand total
      // let grandTotal = 0;
      // cartItems.forEach(cartItem => {
      //   grandTotal += cartItem.item_subtotal;
      // });

      logger.info(`Item added to cart for user: ${user_id}`);
      return res.status(201).json({
        success: true,
        message: "Cart Data Added",
        data: data
      });
      
    } catch (error) {
      logger.error(`Failed to add product to cart`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to add product to cart",
        error: error.message
      });
    }
  },

  // Get Cart Data for All Users
  getCartData: async (req, res) => {
    try {
      logger.debug('Fetching all cart data...');
      const addCart = await AddToCart.find({});
      
      let grandTotal = 0;
      addCart.forEach(cartItem => {
        grandTotal += cartItem.item_subtotal;
      });

      logger.info("Fetched cart data for all users");
      return res.status(200).json({
        success: true,
        message: "Cart Data View",
        data: addCart,
        grandTotal
      });
    } catch (error) {
      logger.error('Failed to fetch cart data', error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart data",
        error: error.message
      });
    }
  },

  // Get Cart Data by User ID
  getCartDataByUserId: async (req, res) => {
    const id = req.user._id;

    try {
      logger.debug(`Fetching cart data for user: ${id}`);
      const addCart = await AddToCart.find({ user_id: id });
      
      let grandTotal = 0;
      addCart.forEach(cartItem => {
        grandTotal += cartItem.item_subtotal;
      });

      logger.info("Fetched cart data");
      return res.status(200).json({
        success: true,
        message: "Cart Data View",
        data: addCart,
        grandTotal
      });

    } catch (error) {
      logger.error("Failed to fetch cart data", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart data for user",
        error: error.message
      });
    }
  },

  // Update Quantity (Increase)
  updateQuantityPlus: async (req,res) => {
    const { id } = req.params;

    try {
      logger.debug(`Updating quantity plus of cart data for user: ${id}`);
      const updateQuantity = await AddToCart.findById(id);

      if (!updateQuantity) {
        logger.warn(`Cart item not found to increase quantity: ${id}`);
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      updateQuantity.item_qty += 1;

      const item_total = updateQuantity.item_price * updateQuantity.item_qty;
      const item_disc = (item_total / 100) * updateQuantity.item_discount;
      updateQuantity.item_subtotal = item_total - item_disc;

      const data = await AddToCart.findByIdAndUpdate(
        { _id: id },
        updateQuantity,
        { new: true }
      );

      logger.info(`Increased quantity for cart item: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Cart Quantity Updated",
        result: data
      });

    } catch (error) {
      logger.error(`Failed to increase cart quantity for item: ${id}`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to update cart quantity",
        error: error.message
      });
    }
  },

  // Update Quantity (Decrease)
  updateQuantityMinus: async (req, res) => {
    const { id } = req.params;

    try {
      logger.debug(`Updating quantity minus of cart data for user: ${id}`);
      const updateQuantity = await AddToCart.findById(id);

      if (!updateQuantity) {
        logger.warn(`Cart item not found to decrease quantity: ${id}`);
        return res.status(404).json({
          success: false,
          message: "Item not found in cart"
        });
      }

      updateQuantity.item_qty -= 1;

      // Delete the item if quantity is zero
      if (updateQuantity.item_qty === 0) {
        const data = await AddToCart.findByIdAndDelete(id);
        logger.info(`Cart item deleted as quantity reached 0: ${id}`);
        return res.status(200).json({
          success: true,
          message: "Cart Quantity Updated",
          result: data
        });
      }

      const item_total = updateQuantity.item_price * updateQuantity.item_qty;
      const item_disc = (item_total / 100) * updateQuantity.item_discount;
      updateQuantity.item_subtotal = item_total - item_disc;
      
      const data = await AddToCart.findByIdAndUpdate(
        { _id: id },
        updateQuantity,
        { new: true }
      );

      logger.info(`Decreased quantity for cart item: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Cart Quantity Updated",
        result: data
      });

    } catch (error) {
      logger.error(`Failed to decrease cart quantity for item: ${id}`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to update cart quantity",
        error: error.message
      });
    }
  },

  // Delete Cart Item
  deleteCartItem: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      logger.warn('Delete cart request received without ID');
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    try {
      await AddToCart.findByIdAndDelete(id);

      logger.info(`Cart item deleted: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Cart Item deleted",
      });

    } catch (error) {
      logger.error(`Failed to delete cart item: ${id}`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete cart item",
        error: error.message
      });
    }
  },

  // Truncate Table by User IDs
  truncateTable: async (req, res) => {
    const { id } = req.params;
    const userIds = id.split(',');

    try {
      logger.info(`Truncating cart data for users: ${userIds.join(', ')}`);
      await AddToCart.deleteMany({ user_id: { $in: userIds } });

      return res.status(200).json({
        success: true,
        message: "Add To Carts Table has been truncated"
      });
      
    } catch (error) {
      logger.error('Failed to truncate Add To Carts Table', error);
      return res.status(500).json({
        success: false,
        message: "Failed to truncate Add To Carts Table",
        error: error.message
      });
    }
  }
};

module.exports = AddToCartController;
