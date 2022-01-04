const Admin = require("../models/admin");

exports.getAdminUserById = (req, res, next, id) => {
    Admin.findById(id).exec((err, user) => {
        if(err) return res.status(400).json({error: "No user found"});
        req.profile = user;
        next();
    });
};

exports.getAdminUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
};