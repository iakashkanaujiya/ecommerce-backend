const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: {
        type: ObjectId,
        ref: "Subcategory",
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    variation: Object
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);