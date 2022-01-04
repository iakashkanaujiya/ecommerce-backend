const Product = require("../models/product/product");
const _ = require("lodash");
const { populate } = require("../models/product/product");

// Create product
exports.createProduct = (req, res) => {
    // Create Product Model
    const product = new Product(req.body);
    // Save product into database
    product.save((err, product) => {
        if (err) return res.status(400).json({ error: "Unable to create the product" });
        return res.json(product);
    });
};

// get the product by id
exports.getProductById = (req, res, next, id) => {
    // this id is coming from the productId parameter
    Product.findById(id)
        .populate("category")
        .populate("subCategory")
        .exec((err, product) => {
            if (err) return res.status(400).json({ error: "No product fouund" });
            req.product = product;
            next();
        });
};

// Get product
exports.getProduct = (req, res) => {
    res.json(req.product);
};

// search product
exports.searchProducts = (req, res) => {
    const query = req.query;
    console.log(query);
};

// listing the products
exports.getAllProducts = (req, res) => {
    // limit the products 
    let limit = req.query.limit ? parseInt(req.query.limit) : 0;
    //sort the products by id
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    //filter by category
    let filterByCategory = req.query.filterByCategory;
    // filter bu subCategory
    let filterBySubCategory = req.query.filterBySubCategory && req.query.filterBySubCategory;

    // find the product
    if (filterByCategory) {
        Product.find({ category: filterByCategory })
            .populate("category")
            .populate("subCategory")
            .sort([[sortBy, "1"]])
            .limit(limit)
            .exec((err, products) => {
                if (err) {
                    return res.status(400).json({ error: "Failed to find the products" });
                }
                return res.json(products);
            });
    } else if (filterBySubCategory) {
        Product.find({ subCategory: filterBySubCategory })
            .populate("category")
            .populate("subCategory")
            .sort([[sortBy, "1"]])
            .limit(limit)
            .exec((err, products) => {
                if (err) {
                    return res.status(400).json({ error: "Failed to find the products" });
                }
                return res.json(products);
            });
    } else {
        Product.find()
            .populate("category")
            .populate("subCategory")
            .sort([[sortBy, "1"]])
            .limit(limit)
            .exec((err, products) => {
                if (err) {
                    return res.status(400).json({ error: "Failed to find the products" });
                }
                return res.json(products);
            });
    }
};

// Search product
exports.searchProduct = (req, res) => {
    let search = req.query.search;
    Product.find({ name: { $regex: search, $options: '$i' } })
        .populate("category")
        .populate("subCategory")
        .sort([["name", "1"]])
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({ error: "Failed to search the products" });
            }
            return res.json(products);
        });
};

// get All Unique Categories
exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({ error: "No category found" });
        }
        return res.json(category);
    });
};

// update the product
exports.updateProduct = (req, res) => {
    Product.findByIdAndUpdate(
        { _id: req.product._id },
        { $set: req.body },
        (err, product) => {
            if (err) {
                return res.status(400).json({ error: "Product updation failed" });
            } else {
                return res.json(product);
            }
        }
    );
};

// delete the product
exports.deleteProduct = (req, res) => {
    // get the product data from the req.product object
    const product = req.product;
    // use mongose remove method to remove the product data from the database
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({ error: "Falied to delete the product" });
        }
        return res.json(deletedProduct);
    });
};


