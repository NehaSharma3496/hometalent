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
const uploadHandler = (req, res, next) => {
  const multerUpload = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]);

  multerUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: false,
          msg: 'File too large. Maximum allowed size is 50MB.'
        });
      }
      return res.status(400).json({ status: false, msg: err.message });
    } else if (err) {
      return res.status(400).json({ status: false, msg: err.message });
    }
    next();
  });
};

module.exports = uploadHandler;
