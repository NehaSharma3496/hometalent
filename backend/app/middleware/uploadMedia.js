const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Filter for only images and video files
const mediaFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg", "image/png", "image/jpg", "image/webp",
    "video/mp4", "video/mpeg", "video/quicktime",
    "video/x-msvideo", "video/x-matroska"
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed."), false);
  }
};

// ✅ Create media path if not exist
const mediaPath = path.join(__dirname, "../media");
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}

// ✅ Multer disk storage
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

// ✅ Accept both fields: image and video
const uploadMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

module.exports = uploadMedia;
