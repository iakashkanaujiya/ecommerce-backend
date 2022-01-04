const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage, getAllImages, getImage, deleteImage } = require("../controllers/fileUpload");
const { isAdminSignedIn, isAdminAuthenticated, isAdmin } = require("../controllers/adminAuth");
const { getAdminUserById } = require("../controllers/adminUser");
const fs = require("fs");


//multer file uploader
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        let uploadedFileName;
        fs.access("public/uploads/" + file.originalname.replace(/\s/g, "-"), (err) => {
            if (err) {
                uploadedFileName = file.originalname.replace(/\s/g, "-");
            } else {
                uploadedFileName = Date.now() + "." + file.originalname.replace(/\s/g, "-");
            }
            cb(null, uploadedFileName);
        });
    }
});

const filter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jfif' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        callback(null, true)
    } else {
        callback(new Error('Image type not supported!'), false);
    }
};

var fileUpload = multer({ storage: storage, fileFilter: filter });

// params
router.param("adminId", getAdminUserById);

//upload image
router.post("/image/upload/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, fileUpload.array('image'), uploadImage);
//delete Image
router.delete("/image/:id/:adminId", isAdminSignedIn, isAdminAuthenticated, isAdmin, deleteImage);

//get all images
router.get("/images", getAllImages);
//get single image
router.get("/image/:id", getImage);

module.exports = router;