const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery/galleryController');
const galleryUpload = require('../middleware/GalleryUpload');
const multer = require('multer');

// Gallery routes for vendors
router.post('/upload', galleryUpload, galleryController.uploadGalleryFiles);
router.get('/my-gallery', galleryController.getUserGallery);
router.post('/remove', galleryController.removeGalleryItem);
router.put('/update-order', galleryController.updateGalleryOrder);

// Test route to check if middleware is working
router.post('/test-upload', galleryUpload, (req, res) => {
  console.log('Test upload - Request body:', req.body);
  console.log('Test upload - Request files:', req.files);
  res.json({ 
    status: true, 
    msg: 'Test upload successful',
    body: req.body,
    files: req.files ? Object.keys(req.files) : 'No files'
  });
});

// Debug route to see raw request with multer parsing
router.post('/debug', multer().any(), (req, res) => {
  console.log('=== DEBUG ROUTE ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  
  // Log each file in detail
  if (req.files && req.files.length > 0) {
    console.log('=== FILES DETAIL ===');
    req.files.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer ? 'Buffer present' : 'No buffer'
      });
    });
  } else {
    console.log('No files found in request');
  }
  
  res.json({
    status: true,
    msg: 'Debug info logged',
    headers: req.headers,
    body: req.body,
    files: req.files ? req.files.map(f => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })) : []
  });
});

module.exports = router; 