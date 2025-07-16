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

// ✅ Accept multiple images and videos for gallery
const galleryUploadHandler = (req, res, next) => {
  console.log('=== GalleryUpload middleware called ===');
  console.log('Request headers:', req.headers['content-type']);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  const multerUpload = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  }).any(); // Accept any field name

  multerUpload(req, res, function (err) {
    console.log('=== Multer processing complete ===');
    console.log('Multer error:', err);
    console.log('Request files:', req.files);
    
    if (err instanceof multer.MulterError) {
      console.log('Multer error code:', err.code);
      console.log('Unexpected field:', err.field);
      console.log('Full error details:', err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: false,
          msg: 'File too large. Maximum allowed size is 50MB.'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        console.log('Handling LIMIT_UNEXPECTED_FILE error');
        console.log('Field that caused error:', err.field);
        
        // Try to continue processing anyway
        console.log('Attempting to continue processing...');
      } else {
        return res.status(400).json({ status: false, msg: err.message });
      }
    } else if (err) {
      console.log('Non-multer error:', err);
      return res.status(400).json({ status: false, msg: err.message });
    }
    
    // Organize files by type
    const organizedFiles = {
      images: [],
      videos: []
    };
    
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'files');
      req.files.forEach((file, index) => {
        console.log(`File ${index + 1}:`, {
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });
        
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');
        
        if (isImage) {
          organizedFiles.images.push(file);
          console.log('Added to images array');
        } else if (isVideo) {
          organizedFiles.videos.push(file);
          console.log('Added to videos array');
        } else {
          console.log('Unknown file type:', file.mimetype);
        }
      });
    } else {
      console.log('No files found in req.files');
    }
    
    // Replace req.files with organized structure
    req.files = organizedFiles;
    
    // Log the files that were successfully uploaded
    console.log('=== Final organized files ===');
    console.log('Images:', req.files.images.length);
    console.log('Videos:', req.files.videos.length);
    console.log('Total files processed:', req.files.images.length + req.files.videos.length);
    
    next();
  });
};

module.exports = galleryUploadHandler; 