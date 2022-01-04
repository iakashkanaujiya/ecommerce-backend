const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subCategorySchema = new mongoose.Schema({
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    image: {
        type: Object,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Subcategory", subCategorySchema);