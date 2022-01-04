const Category = require("../models/category/category");
const SubCategory = require("../models/category/subCategory");

//create category
exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({ error: "Not able to save the category in database" });
        }
        return res.json(category);
    });
};

// getCategory by id
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: "Category not found" });
        }
        req.category = category;
        next();
    });
};

// get one category
exports.getCategory = (req, res) => {
    return res.json(req.category);
};

//get all the category
exports.getAllCategory = (req, res) => {
    Category.find({}).exec((err, categoryItems) => {
        if (err) {
            return res.status(400).json({ error: "No category found" });
        }
        return res.json(categoryItems);
    });
};

//update the category
exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.image = req.body.image;
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({ error: "Falied to update the category" });
        }
        return res.json(category);
    });
};

//delete the category
exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({ error: "Falied to delete the category" });
        }
        return res.json(category);
    });
};

// Create Sub Category
exports.createSubCategory = (req, res) => {
    const subCategory = new SubCategory(req.body);
    subCategory.save((err, subCategory) => {
        if (err) {
            return res.status(400).json({ error: "Not able to save the category in database" });
        } else {
            return res.json(subCategory);
        }
    });
};

// Get a Sub Category
exports.getSubCategory = (req, res) => {
    SubCategory.findById(req.params.subCategoryId)
    .populate("category", "name _id")
    .exec((err, subCategory) => {
        if (err) {
            return res.status(400).json({ error: "No category found" });
        } else {
            return res.json(subCategory);
        }
    });
};

// Get all Sub Categories
exports.getAllSubCategories = (req, res) => {
    SubCategory.find({})
        .populate("category", "name _id")
        .exec((err, subCategories) => {
            if (err) {
                return res.status(400).json({ error: "Opps! something went wrong" });
            } else {
                return res.json(subCategories)
            }
        })
};

// Get all unique SubCategories
exports.getUniqueSubCategories = (req, res) => {
    SubCategory.find(
        { category: req.category._id },
        (err, subCategories) => {
            if (err) {
                return res.status(400).json({ error: "Failed to load the Sub Categories" });
            } else {
                return res.json(subCategories);
            }
        }
    );
};

// update SubCategory
exports.updateSubCategory = (req, res) => {
    const { subCategoryId } = req.params;
    SubCategory.findByIdAndUpdate(
        { _id: subCategoryId },
        { $set: req.body },
        (err, subCategory) => {
            if (err) {
                return res.status(400).json({ error: "Failed to update the Sub Category" });
            } else {
                return res.json(subCategory);
            }
        }
    );
};

// delete Sub Category 
exports.deleteSubCategory = (req, res) => {
    const { subCategoryId } = req.params;
    SubCategory.findByIdAndRemove(
        { _id: subCategoryId },
        (err, subCategory) => {
            if (err) {
                return res.status(400).json({ error: "Failed to delete the Sub Category" });
            } else {
                return res.json(subCategory);
            }
        }
    );
};