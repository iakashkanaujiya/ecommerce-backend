const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { isAdminSignedIn, isAdminAuthenticated, isAdmin } = require("../controllers/adminAuth");
const { getAdminUserById } = require("../controllers/adminUser");
const { 
    getOrderById, 
    createOrder, 
    getAllOrders, 
    getOrderStatus, 
    updateOrderStatus, 
    getOrder, 
    completeOrder
} = require("../controllers/order");

//params
router.param("orderId", getOrderById);
router.param("userId", getUserById);
router.param("adminId", getAdminUserById);

//create
router.post("/order/create/:userId", isSignedIn, isAuthenticated, createOrder);
//get the order
router.get("/order/:orderId", getOrder);

//Get all orders
router.get("/order/all/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, getAllOrders);

//status for order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, getOrderStatus);
// User and Admin can update orders
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, updateOrderStatus);
router.put("/order/:orderId/status/admin/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, updateOrderStatus);

// Update Order
router.post("/order/:orderId/complete/:userId", isSignedIn, isAuthenticated, completeOrder);


module.exports = router;

