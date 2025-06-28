const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");


const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("application/pdf")) {
        cb(null, true);
    } else {
        cb("Please upload only pdf.", false);
    }
};

const imagepathhh = path.join(__dirname, "../");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(imagepathhh, "attachment"));
    },
    filename: (req, file, cb) => {
        cb(null, `attachment-${file.originalname}`);
    },
});

const uploadFile = multer({
    storage: storage, fileFilter: imageFilter,
    limits: {
        fieldNameSize: 100,
        fieldSize: 10 * 1024 * 1024,
    },
});

module.exports = uploadFile;
