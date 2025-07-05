const multer = require("multer");
const path = require("path");
const fs = require("fs");

// File filter for images only
const imageFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Please upload only images."), false);
    }
};

// Define storage configuration
const imagePath = path.join(__dirname, "../attachment"); // Adjust as needed
if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagePath);
    },
    filename: (req, file, cb) => {
        cb(null, `e_sign-${Date.now()}-${file.originalname}`);
    },
});

// Multer instance
const uploadImg = multer({ 
    storage: storage, 
    fileFilter: imageFilter 
}).single('files[0]'); // Expecting the field name 'image'


module.exports = uploadImg;
