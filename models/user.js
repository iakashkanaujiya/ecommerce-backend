const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

// Address Schema
const addressSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  address1: {
    type: String,
    required: true,
    trim: true
  },
  address2: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  primaryPhone: {
    type: String,
    required: true,
    trim: true
  },
  secondaryPhone: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);

// User Schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  phone: {
    type: String,
    maxlength: 32,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true
  },
  userInfo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "blocked"]
  },
  sessionToken: {
    type: String
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { Address, User };
