const { User, Gallery } = require('../../models');
const { commonEmail } = require("../../helper/commonEmail");
const fs = require('fs');
const path = require('path');

// Upload gallery files (vendor)
exports.uploadGalleryFiles = async (req, res) => {
  try {
    const { user_id } = req.body;
    
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    if (!user_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'user_id is required' 
      });
    }
    
    if (!req.files || (!req.files.images && !req.files.videos)) {
      return res.status(400).json({ 
        status: false, 
        msg: 'No files uploaded' 
      });
    }

    const uploadedFiles = [];

    // Handle images
    if (req.files.images) {
      for (const file of req.files.images) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const image = file ? `${baseUrl}/media/${file.filename}` : null;
        const galleryItem = await Gallery.create({
          user_id,
          file_name: file.originalname,
          file_type: 'image',
          file_path: image,
          file_size: file.size,
          status: 'pending'
        });
        uploadedFiles.push(galleryItem);
      }
    }

    // Handle videos
    if (req.files.videos) {
      for (const file of req.files.videos) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const video = file ? `${baseUrl}/media/${file.filename}` : null;
        const galleryItem = await Gallery.create({
          user_id,
          file_name: file.originalname,
          file_type: 'video',
          file_path: video,
          file_size: file.size,
          status: 'pending'
        });
        uploadedFiles.push(galleryItem);
      }
    }

    res.json({ 
      status: true, 
      msg: `${uploadedFiles.length} files uploaded successfully. Waiting for admin approval.`,
      data: {
        uploaded_count: uploadedFiles.length,
        files: uploadedFiles.map(file => ({
          id: file.id,
          file_name: file.file_name,
          file_type: file.file_type,
          status: file.status
        }))
      }
    });

  } catch (error) {
    console.error('Gallery upload error:', error);
    res.json({ status: false, msg: error.message });
  }
};

// Get user's gallery (vendor)
exports.getUserGallery = async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'user_id is required' 
      });
    }

    const whereClause = { user_id };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereClause.status = status;
    }

    const gallery = await Gallery.findAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'owner_name', 'profile_name']
        }
      ]
    });

    res.json({ 
      status: true, 
      data: gallery 
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Remove gallery item (vendor)
exports.removeGalleryItem = async (req, res) => {
  try {
    const { gallery_ids } = req.body;
    console.log("gallery_ids", gallery_ids);

    if (!gallery_ids || !Array.isArray(gallery_ids) || gallery_ids.length === 0) {
      return res.status(400).json({
        status: false,
        msg: 'No gallery IDs provided'
      });
    }

    const galleryItems = await Gallery.findAll({
      where: { id: gallery_ids }
    });

    if (!galleryItems.length) {
      return res.status(404).json({
        status: false,
        msg: 'Gallery items not found'
      });
    }

    // Delete files from disk
    for (const item of galleryItems) {
      const filePath = path.join(__dirname, '../../media', item.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete records from DB
    await Gallery.destroy({
      where: { id: gallery_ids }
    });

    res.json({
      status: true,
      msg: 'Gallery items removed successfully'
    });

  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

// Update gallery sort order (vendor)
exports.updateGalleryOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body; // Array of {id, sort_order}
    
    if (!user_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'user_id is required' 
      });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ 
        status: false, 
        msg: 'Items array is required' 
      });
    }

    for (const item of items) {
      await Gallery.update(
        { sort_order: item.sort_order },
        { where: { id: item.id, user_id } }
      );
    }

    res.json({ 
      status: true, 
      msg: 'Gallery order updated successfully' 
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
}; 