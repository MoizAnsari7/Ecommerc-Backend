const logger = require('../config/logger');
const Item = require('../model/Item');

const itemsController = {

  // Post New Item
  postData: async (req, res) => {
    try {
        const seller_id = req.user._id;
        const { item_name, item_category, item_price, item_discount, item_image, item_dsc, item_qty } = req.body;

        logger.debug('Posting a new item');
        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        const item = await Item.create({ seller_id, item_name, item_category, item_price, item_discount, item_image, item_dsc, item_qty });

        logger.info('Item posted successfully');
        return res.status(201).json({
            message: "Item Has Been Posted",
            data: item
        });

    } catch (error) {
        logger.error('Failed to post item', error);
        return res.status(500).json({
            success: false,
            message: "Failed to post item",
            error: error.message
        });
    }
  },

  // Get All Items
  getData: async (req, res) => {
    try {
      logger.debug('Fetching all items');
      
      const items = await Item.find({});
      
      logger.info(`Fetched ${items.length} items successfully`);
      return res.status(200).json({
        success: true,
        data: items,
        message: "Fetched items successfully"
      });

    } catch (error) {
        logger.error('Failed to fetch items', error);
        return res.status(500).json({
            message: "Failed to fetch items",
            error: error.message
        });
    }
  },

  // Get Single Item by ID
  editProduct: async (req, res) => {
    try {
      const itemId = req.params.id;
      logger.debug(`Fetching item by ID: ${itemId}`);

      const item = await Item.findById(itemId);

      if (!item) {
        logger.warn(`Item not found: ${itemId}`);
        return res.status(404).json({
          success: false,
          message: "Item not found"
        });
      }

      logger.info(`Fetched item: ${itemId} successfully`);
      return res.status(200).json({
        success: true,
        message: "Fetched item successfully",
        data: item
      });

    } catch (error) {
      logger.error('Failed to fetch item', error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch item",
        error: error.message
      });
    }
  },

  // Update Item
  updateProducts: async (req, res) => {
    try {
        const id = req.params.id;
        const { item_name, item_category, item_price, item_discount, item_dsc, item_image, item_qty } = req.body;

        logger.debug(`Updating item with ID: ${id}`);
        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        const item = await Item.findById(id);

        if (!item) {
          logger.warn(`Item not found for update: ${id}`);
          return res.status(404).json({
            success: false,
            message: "Item not found"
          });
        }

        item.item_name = item_name || item.item_name;
        item.item_category = item_category || item.item_category;
        item.item_price = item_price || item.item_price;
        item.item_discount = item_discount || item.item_discount;
        item.item_dsc = item_dsc || item.item_dsc;
        item.item_image = item_image || item.item_image;
        item.item_qty = item_qty || item.item_qty;

        const updatedItem = await Item.findByIdAndUpdate({_id: id}, item, {new: true});

        logger.info(`Item updated successfully: ${id}`);
        return res.status(200).json({
            success: true,
            data: updatedItem,
            message: "Updated Successfully"
        });

    } catch (error) {
        logger.error('Failed to update item', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update item",
            error: error.message
        });
    }
  },

  // Delete Item
  deleteProduct: async (req, res) => {
    try {
        const itemId = req.params.id;
        logger.debug(`Deleting item with ID: ${itemId}`);

        const deleted = await Item.findByIdAndDelete(itemId);

        if (!deleted) {
            logger.warn(`Item not found for deletion: ${itemId}`);
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        logger.info(`Item deleted successfully: ${itemId}`);
        return res.status(200).json({
            success: true,
            message: "Item Has Been Deleted" 
        });

    } catch (error) {
        logger.error('Failed to delete item', error);
        return res.status(500).json({
            message: "Failed to delete item",
            error: error.message
        });
    }
  }
};

module.exports = itemsController;
