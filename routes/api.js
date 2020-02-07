const multer = require("multer");
const express = require("express");
const path = require("path");
const PagesController = require("../controller/pagesController");
const router = express.Router();
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.dirname(__dirname) + "/public/uploads/");
    },
    // destination: path.dirname(__dirname) + "/public/uploads/",
    filename: function(req, file, cb) {
        var name = Date.now() + "-" + file.originalname;
        cb(null, name);
        req.file = name;
    }
});
const upload = multer({ storage: storage });

router.post(
    "/execute",
    upload.fields([{ name: "file" }]),
    PagesController.execute
);

module.exports = router;