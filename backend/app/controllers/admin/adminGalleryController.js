const { User, Gallery, VendorPackageSubscription, Package } = require('../../models');
const fs = require('fs');
const path = require('path');

// Upload admin gallery files (no approval needed)
exports.uploadAdminGalleryFiles = async (req, res) => {
  try {
    const { admin_id } = req.body;
    
    if (!admin_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'admin_id is required' 
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
          user_id: admin_id,
          file_name: file.originalname,
          file_type: 'image',
          file_path: image,
          file_size: file.size,
          status: 'approved', // Admin files are auto-approved
          sort_order: 0
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
          user_id: admin_id,
          file_name: file.originalname,
          file_type: 'video',
          file_path: video,
          file_size: file.size,
          status: 'approved', // Admin files are auto-approved
          sort_order: 0
        });
        uploadedFiles.push(galleryItem);
      }
    }

    res.json({ 
      status: true, 
      msg: `${uploadedFiles.length} files uploaded successfully to admin gallery.`,
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
    res.json({ status: false, msg: error.message });
  }
};

// Get admin's gallery
exports.getAdminGallery = async (req, res) => {
  try {
    const { admin_id } = req.query;
    
    if (!admin_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'admin_id is required' 
      });
    }

    const gallery = await Gallery.findAll({
      where: { 
        user_id: admin_id,
        status: 'approved' // Only show approved items for admin
      },
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({ 
      status: true, 
      data: gallery 
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Remove admin gallery item
exports.removeAdminGalleryItem = async (req, res) => {
  try {
    const { admin_id } = req.body;
    const { gallery_id } = req.params;
    
    if (!admin_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'admin_id is required' 
      });
    }

    const galleryItem = await Gallery.findOne({
      where: { id: gallery_id, user_id: admin_id }
    });

    if (!galleryItem) {
      return res.status(404).json({ 
        status: false, 
        msg: 'Gallery item not found' 
      });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '../../media', galleryItem.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await galleryItem.destroy();

    res.json({ 
      status: true, 
      msg: 'Admin gallery item removed successfully' 
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Update admin gallery sort order
exports.updateAdminGalleryOrder = async (req, res) => {
  try {
    const { admin_id, items } = req.body; // Array of {id, sort_order}
    
    if (!admin_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'admin_id is required' 
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
        { where: { id: item.id, user_id: admin_id } }
      );
    }

    res.json({ 
      status: true, 
      msg: 'Admin gallery order updated successfully' 
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get all admin galleries (for super admin)
exports.getAllAdminGalleries = async (req, res) => {
  try {
    const { admin_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { status: 'approved' };
    if (admin_id) {
      whereClause.user_id = admin_id;
    }

    const gallery = await Gallery.findAndCountAll({
      where: whereClause,
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'owner_name', 'profile_name', 'email', 'phone']
        }
      ]
    });

    res.json({ 
      status: true, 
      data: {
        gallery: gallery.rows,
        total: gallery.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(gallery.count / limit)
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get all gallery requests (for admin approval)
exports.getAllGalleryRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const gallery = await Gallery.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'owner_name', 'profile_name', 'email', 'phone']
        }
      ]
    });

    res.json({ 
      status: true, 
      data: {
        gallery: gallery.rows,
        total: gallery.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(gallery.count / limit)
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get pending gallery requests
exports.getPendingGalleryRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const gallery = await Gallery.findAndCountAll({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'owner_name', 'profile_name', 'email', 'phone']
        }
      ]
    });

    res.json({ 
      status: true, 
      data: {
        gallery: gallery.rows,
        total: gallery.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(gallery.count / limit)
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Process gallery request (approve/reject)
exports.processGalleryRequest = async (req, res) => {
  try {
    const { gallery_id, action, admin_id, remarks } = req.body;
    
    if (!gallery_id || !action || !admin_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'gallery_id, action, and admin_id are required' 
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ 
        status: false, 
        msg: 'Action must be either "approve" or "reject"' 
      });
    }

    const galleryItem = await Gallery.findByPk(gallery_id);
    if (!galleryItem) {
      return res.status(404).json({ 
        status: false, 
        msg: 'Gallery item not found' 
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    await galleryItem.update({
      status: newStatus,
      admin_remarks: remarks || null,
      admin_id: admin_id,
      processed_at: new Date()
    });

    res.json({ 
      status: true, 
      msg: `Gallery request ${action}d successfully`,
      data: {
        id: galleryItem.id,
        status: newStatus,
        processed_at: galleryItem.processed_at
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
};

// Get user complete profile with gallery
exports.getUserCompleteProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ 
        status: false, 
        msg: 'user_id is required' 
      });
    }

    const user = await User.findByPk(user_id, {
      include: [
        {
          model: Gallery,
          as: 'gallery',
          where: { status: 'approved' },
          required: false,
          order: [['sort_order', 'ASC'], ['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ 
        status: false, 
        msg: 'User not found' 
      });
    }

    // Fetch package subscriptions
    const now = new Date();
    const subscriptions = await VendorPackageSubscription.findAll({
      where: { vendor_id: user_id, payment_status: 'completed' },
      include: [
        {
          model: Package,
          as: 'Package', // Use the alias as defined in the association
          required: true
        }
      ],
      order: [['end_date', 'DESC']]
    });

    // Separate running and expired packages
    const running_packages = [];
    const expired_packages = [];
    subscriptions.forEach(sub => {
      if (sub.start_date <= now && sub.end_date >= now) {
        running_packages.push({
          id: sub.id,
          start_date: sub.start_date,
          end_date: sub.end_date,
          payment_status: sub.payment_status,
          package: sub.Package
        });
      } else if (sub.end_date < now) {
        expired_packages.push({
          id: sub.id,
          start_date: sub.start_date,
          end_date: sub.end_date,
          payment_status: sub.payment_status,
          package: sub.Package
        });
      }
    });

    res.json({ 
      status: true, 
      data: {
        user,
        running_packages,
        expired_packages
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
}; 