const express = require("express");
const router = express.Router();
const { getProductById, createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, getAllUniqueCategories, searchProduct } = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isAdminSignedIn, isAdminAuthenticated, isAdmin } = require("../controllers/adminAuth");
const { getAdminUserById } = require("../controllers/adminUser");

// all of params
router.param("productId", getProductById);
router.param("userId", getUserById);
router.param("adminId", getAdminUserById);

// create the product
router.post("/product/create/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, createProduct);
// update the product
router.put("/product/:productId/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, updateProduct);
// delete the product
router.delete("/product/:productId/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, deleteProduct);

// get the product
router.get("/product/:productId", getProduct);
// Search the product
router.get("/products/search", searchProduct);
//listing all the products
router.get("/products", getAllProducts);

//get All Unique Categories
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
