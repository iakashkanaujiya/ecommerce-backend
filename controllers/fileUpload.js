const Upload = require("../models/fileUpload");
const fs = require("fs");

//upload image
exports.uploadImage = (req, res) => {
    var fileInfo = req.files;
    var files = [];

    fileInfo.map((file) => {
        const newFile = {
            fileName: file.filename,
            fileType: file.mimetype,
            fileSize: Math.floor((file.size / 1000).toString()) + " KB",
            src: file.path.replace(/\\/g, "/")
        };
        files.push(newFile);
    });

    Upload.insertMany(files, (err, upload) => {
        if (err) {
            return res.status(404).json({ error: "Failed to save images in database" });
        } else {
            return res.send(upload);
        }
    })
};

//get all images
exports.getAllImages = (req, res) => {
    const limit = req.params.limit ? Math.floor(req.params.limit) : 0;
    Upload.find({}).limit(limit).sort({ $natural: -1 }).exec((err, upload) => {
        if (err) {
            return res.status(404).json({ error: "No image found in Database" });
        } else {
            return res.send(upload);
        }
    });
};

//get a image by id
exports.getImage = (req, res) => {
    const id = req.params.id;
    Upload.findById(id, (err, upload) => {
        if (err) {
            return res.status(404).json({ error: "No image found in the database" });
        } else {
            return res.send(upload);
        }
    });
};

exports.deleteImage = (req, res) => {
    const id = req.params.id;
    Upload.findByIdAndDelete(id, (err, upload) => {
        if (err) {
            res.status(404).json({ error: "Failed to delete the image" });
        } else {
            fs.unlink("public/uploads/" + upload.fileName, (error) => {
                if (error) {
                    return res.status(404).json({ error: "Unable to delete the file" });
                }
            });
            return res.send(upload);
        }
    });
};


