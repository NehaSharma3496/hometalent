const express = require('express');
const router = express.Router();
const blogController = require('../controllers/admin/blogController');
const uploadMedia = require('../middleware/UploadMedia');

router.post('/blogs', uploadMedia, blogController.createBlog);
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.put('/blogs/:id', uploadMedia, blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;
