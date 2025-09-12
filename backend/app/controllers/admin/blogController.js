const { Blog } = require('../../models');

exports.createBlog = async (req, res) => {
  try {
    
    const { title, short_description, long_description } = req.body;

    if (!title || !short_description || !long_description) {
      return res.status(400).json({ status: false, msg: 'All fields are required' });
    }

    const imageFile = req.files?.image?.[0];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const image = imageFile ? `${baseUrl}/media/${imageFile.filename}` : null;

    const blog = await Blog.create({
      title,
      image, // should be full URL (you can construct it using req.protocol + req.get('host') if needed)
      short_description,
      long_description
    });

    return res.json({ status: true, msg: 'Blog created successfully', data: blog });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    return res.json({ status: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ status: false, msg: 'Blog not found' });
    return res.json({ status: true, data: blog });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title,short_description, long_description } = req.body;

    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ status: false, msg: 'Blog not found' });
    
    const imageFile = req.files?.image?.[0];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const image = imageFile ? `${baseUrl}/media/${imageFile.filename}` : null;

    await blog.update({
      title: title || blog.title,
      image: image || blog.image,
      short_description: short_description || blog.short_description,
      long_description: long_description || blog.long_description,
    });

    return res.json({ status: true, msg: 'Blog updated successfully', data: blog });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ status: false, msg: 'Blog not found' });

    await blog.destroy();
    return res.json({ status: true, msg: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
