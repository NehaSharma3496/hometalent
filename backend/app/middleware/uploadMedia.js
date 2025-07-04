const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ File filter for images and videos only
const mediaFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "video/mp4",
        "video/mpeg",
        "video/quicktime", // for .mov
        "video/x-msvideo", // for .avi
        "video/x-matroska" // for .mkv
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed."), false);
    }
};

// ✅ Define storage path
const mediaPath = path.join(__dirname, "../attachment");
if (!fs.existsSync(mediaPath)) {
    fs.mkdirSync(mediaPath, { recursive: true });
}

// ✅ Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, mediaPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, `media-${timestamp}-${base}${ext}`);
    },
});

// ✅ Multer instance allowing both image/video
const uploadMedia = multer({
    storage: storage,
    fileFilter: mediaFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // optional: max 50MB
    }
}).single('file'); // You can change the field name as needed

module.exports = uploadMedia;
