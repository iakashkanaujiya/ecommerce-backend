const express = require("express");
const router = express.Router();
const { signout, signin, signup, isSignedIn, verifySessionToken } = require("../controllers/auth");
const { adminSignup, adminSignin, adminSignout } = require("../controllers/adminAuth");

//user signup
router.post("/signup", signup);
//user signin
router.post("/signin", signin);
// token
router.post("/token", verifySessionToken);
//test route
router.get("/testroute", isSignedIn, (req, res) => {
    res.json(req.auth);
});
//user signout
router.get("/signout", signout);


// Admin Signup
router.post("/admin/signup", adminSignup);
//Admin signin
router.post("/admin/signin", adminSignin);
//user signout
router.get("admin/signout", adminSignout);


module.exports = router;