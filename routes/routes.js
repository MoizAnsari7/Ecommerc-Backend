const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController.js');
const AddProductController = require('../controllers/AddProductController.js');
const AddToCartController = require('../controllers/AddToCartController.js');
const UsersController = require("../controllers/UsersController.js");
const PendingCartController = require('../controllers/PendingCartController.js');
const OrderController = require('../controllers/OrderController.js');
const TrackOrder = require("../controllers/TrackOrderController.js");

const auth = require("../middleware/auth.js");

//users routes
router.post('/userSignup', UsersController.userRegister);
router.post('/userLogin', UsersController.userLogin);
router.put('/editUserProfile', auth, UsersController.editProfile);
router.get('/getUserProfile', auth, UsersController.getProfile);
router.get('/getAllUsers', UsersController.getAllUsers);                                    //admin ke liye auth nahi lagaya

// Item routes
router.post('/itemPost', auth, itemsController.postData);
router.get('/itemGet', itemsController.getData);
router.get('/itemGet/:id', itemsController.editProduct);
router.put('/updateitem/:id', auth, itemsController.updateProducts);
router.delete('/deleteProduct/:id', auth, itemsController.deleteProduct);

// AddProduct routes
router.post('/addProduct',auth , AddProductController.addProduct);
router.get('/geProductsBySellerID',auth, AddProductController.geProductsBySellerID);        //add new route
router.put('/updateProduct/:id', auth, AddProductController.updateProduct);
router.delete('/deleteProductByID/:id',auth, AddProductController.deleteProductByID);

// Cart routes
router.post('/addCart', auth, AddToCartController.addToCart);
router.get('/getAllCartData', AddToCartController.getCartData);                             //admin ke liye auth nahi lagaya
router.get('/getCartData', auth, AddToCartController.getCartDataByUserId);      
router.put('/updateQtyPlus/:id', auth, AddToCartController.updateQuantityPlus);
router.put('/updateQtyMinus/:id', auth, AddToCartController.updateQuantityMinus);
router.delete('/deleteCartItem/:id', auth, AddToCartController.deleteCartItem);
router.delete('/addToCartsTruncate/:id', AddToCartController.truncateTable);

// Pending cart routes
router.post('/addPending', PendingCartController.addPendingCarts);
router.get('/truncateTable/:id', PendingCartController.truncateTableById);
router.get('/truncateTable', PendingCartController.truncateTable);
router.get('/getLocalData', PendingCartController.getLocalcartData);
router.put('/updateQtyPlusLocal/:id', PendingCartController.updateLocalQuantityPlus);
router.put('/updateQtyMinusLocal/:id', PendingCartController.updateLocalQuantityMinus);

router.post('/postOrder', auth, OrderController.postOrder);
router.get('/getOrderById/:id', auth, OrderController.getOrderById);
router.get('/getMyOrder', auth, OrderController.getMyOrder);
router.get('/getSellerOrder', auth, OrderController.getSellerOrder);
router.get('/getAllOrders', OrderController.getAllOrders);                                  //admin ke liye auth nahi lagaya

router.post('/updateOrder/:id', auth, TrackOrder.updateOrderStatus);
router.get('/trackOrder/:id', auth, TrackOrder.getOrderTracking);

module.exports = router;
