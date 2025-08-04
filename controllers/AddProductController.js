const cloudinary = require('cloudinary');
const AddProduct = require('../model/AddProduct');
const logger = require('../config/logger');

const AddProductController = {

  // Add Product
  addProduct: async (req, res) => {
    const seller_id = req.user._id;
    const { item_name, item_category, item_price, item_dsc, item_qty, item_discount } = req.body;
    const file = req.files.item_image;

    logger.debug(`Add Product Request by seller: ${seller_id}`);
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);

    if (!file) {
      logger.warn('No image file uploaded');
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    try {
      const folder = "Home/images";
      const { options } = { folder };

      logger.debug(`Uploading image to Cloudinary...`);
      const response = await cloudinary.uploader.upload(file.tempFilePath, options);

      logger.debug(`Image uploaded successfully: ${response.secure_url}`);

      const newItem = await AddProduct.create({
        seller_id,
        item_name,
        item_category,
        item_price,
        item_dsc,
        item_qty,
        item_image: response.secure_url,
        item_discount
      });

      logger.info(`Product added: ${newItem._id} by seller: ${seller_id}`);
      
      return res.status(201).json({
        success: true,
        data: newItem,
        message: "Product added successfully"
      });

    } catch (error) {
      logger.error('Failed to add product', error);
      return res.status(500).json({
        success: false,
        message: "Failed to add product",
        error: error.message
      });
    }
  },

  // Update Product
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { item_name, item_price, item_dsc, item_discount, item_image } = req.body;

    logger.debug(`Update Product Request - ID: ${id}`);
    logger.debug(`Update body: ${JSON.stringify(req.body)}`);

    try {
      const updated = await AddProduct.findByIdAndUpdate(
        { _id: id },
        { item_name, item_price, item_dsc, item_discount, item_image },
        { new: true }
      );

      if (!updated) {
        logger.warn(`Product not found for update: ${id}`);
        return res.status(404).json({
          success: false, 
          message: "Product not found" 
        });
      }

      logger.info(`Product updated: ${id}`);
      logger.debug(`Updated product data: ${JSON.stringify(updated)}`);

      return res.status(200).json({
        success: true,
        data: updated,
        message: "Product updated successfully"
      });

    } catch (error) {
      logger.error(`Failed to update product: ${id}`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message
      });
    }
  },

  // Delete Product by ID
  deleteProductByID: async (req, res) => {
    const { id } = req.params;
    logger.debug(`Delete Product Request - ID: ${id}`);

    try {
      const deleted = await AddProduct.findByIdAndDelete(id);

      if (!deleted) {
        logger.warn(`Product not found for delete: ${id}`);
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      logger.info(`Product deleted: ${id}`);
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
      });

    } catch (error) {
      logger.error(`Failed to delete product`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete product",
        error: error.message
      });
    }
  },

  //get product by seller Id
  geProductsBySellerID: async (req, res) => {
    const { id } = req.user;
    logger.debug(`Get Product Request - ID: ${id}`);

    try {
      const data = await AddProduct.find({seller_id : id});

      if (!res) {
        logger.warn(`Products not found for seller ${id}`);
        return res.status(404).json({
          success: false,
          message: "Products not found for seller"
        });
      }

      return res.status(200).json({
        success: true,
        data : data,
        message: "Product fetched successfully"
      });

    } catch (error) {
      logger.error(`Failed to fetch product`, error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error.message
      });
    }
  },
};

module.exports = AddProductController;
