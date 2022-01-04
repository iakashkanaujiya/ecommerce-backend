const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
    getUserById,
    getUser,
    updateUser,
    userPurchaseList,
    addUserAddress,
    getUserAddress,
    updateUserAddress,
    getAddress,
    deleteUserAddress
} = require("../controllers/user");


// Middleware
router.param("userId", getUserById);

// Get the User
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
// Update User
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// Add user Shipping Adress
router.post("/user/address/:userId", isSignedIn, isAuthenticated, addUserAddress);
// Get Address
router.get("/address", getAddress);
// Delete Address
router.delete("/user/address/:userId", isSignedIn, isAuthenticated, deleteUserAddress);
// Get User Shipping Address
router.get("/user/address/:userId", isSignedIn, isAuthenticated, getUserAddress);
// Update user Address
router.put("/user/address/:userId", isSignedIn, isAuthenticated, updateUserAddress);

// User's Orders List
router.get("/user/orders/:userId", isSignedIn, isAuthenticated, userPurchaseList);
module.exports = router;