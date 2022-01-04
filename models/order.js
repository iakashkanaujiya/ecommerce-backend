const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


// Product cart schema 
const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    totalSavings: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const ProductCart = mongoose.model("ProductCart", productCartSchema);


// Order Schema
const orderSchema = new mongoose.Schema({
    items: [productCartSchema],
    orderId: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    totalSavings: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved", "Pending"]
    },
    transactionId: String,
    paymentType: {
        type: String,
        required: true
    },
	placed: Date,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = { ProductCart, Order };