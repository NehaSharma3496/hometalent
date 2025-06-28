const express = require('express');
const router = express.Router();
const postController = require('../controllers/post/postController');
 const { verifyToken } = require('../middleware/authMiddleware');


// Route to create a post
router.post('/addPost',verifyToken , postController.createPost);
router.get('/getPost', verifyToken , postController.getUserPosts);
//comment
router.post('/createComment', verifyToken , postController.createComment);
router.get('/getPostDetails/:postId', verifyToken , postController.getPostDetails);



module.exports = router;
