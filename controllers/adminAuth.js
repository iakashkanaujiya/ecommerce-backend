require('dotenv').config();
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.adminSignup = (req, res) => {
    const admin = new Admin(req.body);
    admin.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Signup failed, please try again"
            });
        } else {
            return res.json(user);
        }
    });
};

const generateAccessToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

exports.adminSignin = (req, res) => {
    const { email, password } = req.body;

    Admin.findOne({ email }, (err, user) => {
        if (err || !user) return res.status(400).json({
            error: "No user account exists"
        });

        if (!user.authenticate(password)) return res.status(403).json({
            error: "Email or Password don't match"
        });

        const token = generateAccessToken(user._id);
        res.cookie("token", token, { maxAge: 25 * 60 * 60 * 1000 });
        const { _id, firstname, lastname, email, role } = user;
        return res.json({ user: { _id, firstname, lastname, email, role }, token: token });
    });
};

exports.adminSignout = (req, res) => {
    res.clearCookie("token");
    return res.json({message: "User Sign Out"});
}

exports.isAdminSignedIn = expressJwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth"
});

exports.isAdminAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Session expired"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({error: "You're not allowed, please contact admin"});
    }
    next();
};