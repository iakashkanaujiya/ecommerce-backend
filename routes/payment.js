const express = require("express");
const router = express.Router();
const {isSignedIn, isAuthenticated} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { initiatePaytmTransaction, getPaytmTransactionStatus, verifyPaytmChecksumHash } = require("../controllers/payment/paytm/paytmPayment");

router.param("userId", getUserById);

router.get("/create-paytm-transaction/:userId", isSignedIn, isAuthenticated, initiatePaytmTransaction);
router.post("/verify-paytm-checksum", verifyPaytmChecksumHash);
router.get("/paytm-transaction-status", getPaytmTransactionStatus);

module.exports = router;