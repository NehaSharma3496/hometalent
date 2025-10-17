const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Allow only images and videos
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

// ✅ Ensure upload folder exists
const mediaPath = path.join(__dirname, "../media");
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

// ✅ Limits (allow up to 20MB max single file just in case)
const upload = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).any();

// ✅ Custom size validation
const checkFileSizes = (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const maxImageSize = 5 * 1024 * 1024;   // 5MB per image
  const maxTotalVideoSize = 20 * 1024 * 1024; // 20MB total for all videos

  let totalVideoSize = 0;

  for (const file of req.files) {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (isImage && file.size > maxImageSize) {
      return res.status(400).json({
        status: false,
        msg: `Image "${file.originalname}" exceeds 5MB limit.`,
      });
    }

    if (isVideo) {
      totalVideoSize += file.size;
    }
  }

  if (totalVideoSize > maxTotalVideoSize) {
    return res.status(400).json({
      status: false,
      msg: `Total video upload size exceeds 20MB limit (currently ${(totalVideoSize / 1024 / 1024).toFixed(2)}MB).`,
    });
  }

  next();
};

// ✅ Main middleware handler
const galleryUploadHandler = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: false,
          msg: "A single file is too large (max 20MB for video, 5MB for image).",
        });
      }
      return res.status(400).json({ status: false, msg: err.message });
    } else if (err) {
      return res.status(400).json({ status: false, msg: err.message });
    }

    // Organize files by type
    const organizedFiles = { images: [], videos: [] };
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.mimetype.startsWith("image/")) organizedFiles.images.push(file);
        else if (file.mimetype.startsWith("video/")) organizedFiles.videos.push(file);
      });
    }

    req.files = organizedFiles;

    // ✅ Run total size check
    checkFileSizes(req, res, next);
  });
};

module.exports = galleryUploadHandler;
