const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed MIME types
const allowedMimeTypes = [
  "image/jpeg", "image/png", "image/jpg", "image/webp",
  "video/mp4", "video/mpeg", "video/quicktime",
  "video/x-msvideo", "video/x-matroska"
];

const mediaFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image and video files are allowed."), false);
};

// Create media folder if missing
const mediaPath = path.join(__dirname, "../media");
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaPath),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `media-${timestamp}-${base}${ext}`);
  },
});

// Main upload middleware
const uploadHandler = (req, res, next) => {
  const upload = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max single file
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "gallery" } // unlimited files allowed
  ]);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: false,
          msg: "File too large. Max 5MB for images and 20MB for videos.",
        });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          status: false,
          msg: "Unexpected file field received.",
        });
      }
      return res.status(400).json({ status: false, msg: err.message });
    } else if (err) {
      return res.status(400).json({ status: false, msg: err.message });
    }

    // ✅ Perform custom size validation for gallery
    const galleryFiles = req.files?.gallery || [];
    const maxImageSize = 5 * 1024 * 1024;       // 5 MB
    const maxTotalVideoSize = 20 * 1024 * 1024; // 20 MB
    let totalVideoSize = 0;

    for (const file of galleryFiles) {
      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");

      if (isImage && file.size > maxImageSize) {
        return res.status(400).json({
          status: false,
          msg: `Image "${file.originalname}" exceeds 5MB limit.`,
        });
      }

      if (isVideo) totalVideoSize += file.size;
    }

    if (totalVideoSize > maxTotalVideoSize) {
      return res.status(400).json({
        status: false,
        msg: `Total gallery video size exceeds 20MB (currently ${(totalVideoSize / 1024 / 1024).toFixed(2)}MB).`,
      });
    }

    // ✅ Everything valid — continue to controller
    next();
  });
};

module.exports = uploadHandler;
