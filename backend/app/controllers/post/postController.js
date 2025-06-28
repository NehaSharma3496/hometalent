const {
  Post,
  User,
  Comment,
} = require("../../models");

// const { commonEmail } = require("../../helper/commonEmail");

// Create a new post
exports.createPost = async (req, res) => {

    console.log("req.body", req.body);
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user after token verification

    try {
        const post = await Post.create({ title, content, userId });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all posts for a user
exports.getUserPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const posts = await Post.findAll({
            where: { userId },
            include: [
                {
                    model: User, // User model ko include karna
                    attributes: ['id', 'username', 'email'], // Kya fields chahiye, wo specify karen
                },
            ],
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated


    try {
        const comments = await Comment.create({
            content,
            userId,
            postId,
        });

        res.status(201).json(comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPostDetails = async (req, res) => {
    const postId = req.params.postId; 
     console.log("postId ",postId)
    try {
        const postDetails = await Comment.findAll({
            where: { postId : postId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email'],
                },
                {
                    model: Post,
                    attributes: ['content'], 
                    include: [
                        {
                            model: User, 
                            attributes: ['id', 'username'],
                        },
                    ],
                },
            ],
        });

        if (!postDetails) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(postDetails);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
