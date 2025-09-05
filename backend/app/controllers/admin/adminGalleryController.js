const { User, Gallery, VendorPackageSubscription, Package, Notification } = require('../../models');
const fs = require('fs');
const path = require('path');
const socketManager = require('../../socket/socketManager');

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

    return res.json({ 
      status: true, 
      data: {
        gallery: gallery.rows,
        total: gallery.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(gallery.count / limit)
      }
    });

  } catch (error) {
    return res.json({ status: false, msg: error.message });
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

    const addedInfo = gallery.rows.map(item => {
      let adminRemarks = null;
      try {
        adminRemarks = item.admin_remarks ? JSON.parse(item.admin_remarks) : null;
      } catch (e) { /* ignore JSON parse error */ }
      return {
        ...item.toJSON(),
        admin_remarks: adminRemarks
      };
    });

    console.log("Gallery fetched:", addedInfo);
    
    return res.json({ 
      status: true,  
      data: {
        gallery: gallery.rows,
        total: gallery.count,
        current_page: parseInt(page),
        total_pages: Math.ceil(gallery.count / limit)
      }
    });

  } catch (error) {
    return res.json({ status: false, msg: error.message });
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
    const { gallery_ids, action, admin_id, remarks } = req.body;

    // ✅ Validate inputs
    if (!gallery_ids || !Array.isArray(gallery_ids) || gallery_ids.length === 0 || !action || !admin_id) {
      return res.status(400).json({
        status: false,
        msg: 'gallery_ids (array), action, and admin_id are required'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        status: false,
        msg: 'Action must be either "approve" or "reject"'
      });
    }

    // ✅ Fetch gallery items by IDs
    const galleryItems = await Gallery.findAll({
      where: { id: gallery_ids }
    });

    if (!galleryItems.length) {
      return res.status(404).json({
        status: false,
        msg: 'No matching gallery items found'
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // ✅ Update all matching gallery items
    await Promise.all(
      galleryItems.map(item =>
        item.update({
          status: newStatus,
          admin_remarks: remarks || null,
          admin_id,
          processed_at: new Date()
        })
      )
    );

    // Notify vendor via socket and persist notification
    try {
      const vendorId = galleryItems[0].user_id;
      const vendor = await User.findByPk(vendorId, { attributes: ['owner_name','profile_name'] });
      const vendorName = vendor?.owner_name || vendor?.profile_name || 'Vendor';
      socketManager.galleryRequestProcessed(vendorId, action, { items: gallery_ids });
      await Notification.create({
        user_id: vendorId,
        user_type: 'vendor',
        type: 'gallery_request_processed',
        title: 'Gallery Request',
        message: `Your Gallery update request has been ${action === 'approve' ? 'Approved' : 'Rejected'}.`,
        metadata: { gallery_ids, remarks }
      });
    } catch (e) { console.error('Failed to notify/persist vendor notification for gallery process:', e.message); }

    res.json({
      status: true,
      msg: `Gallery items ${action}d successfully`,
      updated_count: galleryItems.length,
      data: galleryItems.map(item => ({
        id: item.id,
        status: item.status,
        processed_at: item.processed_at
      }))
    });

  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
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

    const now = new Date();
    const subscriptions = await VendorPackageSubscription.findAll({
      where: { vendor_id: user_id, payment_status: 'completed' },
      include: [
        {
          model: Package,
          as: 'Package',
          required: true
        }
      ],
      order: [['end_date', 'DESC']]
    });

    const running_packages = [];
    const expired_packages = [];
    let subscribed_package = null;

    subscriptions.forEach(sub => {
      const isRunning = sub.start_date <= now && sub.end_date >= now;
      const isExpired = sub.end_date < now;
      const isUpcoming = sub.start_date > now;

      if (isRunning) {
        running_packages.push({
          id: sub.id,
          start_date: sub.start_date,
          end_date: sub.end_date,
          payment_status: sub.payment_status,
          package: sub.Package
        });

        if (!subscribed_package) {
          subscribed_package = {
            id: sub.id,
            start_date: sub.start_date,
            end_date: sub.end_date,
            payment_status: sub.payment_status,
            package: sub.Package
          };
        }
      } else if (isExpired) {
        expired_packages.push({
          id: sub.id,
          start_date: sub.start_date,
          end_date: sub.end_date,
          payment_status: sub.payment_status,
          package: sub.Package
        });
      }
    });

    // If no running package, get the next upcoming one for `subscribed_package`
    if (!subscribed_package) {
      const futureSub = subscriptions.find(sub => sub.start_date > now);
      if (futureSub) {
        subscribed_package = {
          id: futureSub.id,
          start_date: futureSub.start_date,
          end_date: futureSub.end_date,
          payment_status: futureSub.payment_status,
          package: futureSub.Package
        };
      }
    }

    res.json({ 
      status: true, 
      data: {
        user,
        subscribed_package,     // current running or next
        running_packages,       // only currently running
        expired_packages        // only expired
      }
    });

  } catch (error) {
    res.json({ status: false, msg: error.message });
  }
}; 

exports.uploadFromVendorToAdmin = async (req, res) => {
  try {
    const { admin_id, file_path, file_type, file_name, file_size, source_vendor_id } = req.body;

    if (!admin_id || !file_path || !file_type) {
      return res.status(400).json({ status: false, msg: "Missing required fields" });
    }

    // Copy vendor's file into admin's gallery
    const galleryItem = await Gallery.create({
      user_id: admin_id,     // 👈 admin ka ID
      file_name,
      file_type,
      file_path,
      file_size,
      status: "approved",    // admin files auto-approved
      sort_order: 0,
      admin_remarks: source_vendor_id ? JSON.stringify({ source_vendor_id }) : null,
    });

    return res.json({
      status: true,
      msg: "File added to Admin Gallery successfully",
      data: galleryItem,
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

// Remove file from Admin Gallery
exports.removeFromAdminGallery = async (req, res) => {
  try {
    const { id, admin_id } = req.body;

    if (!id || !admin_id) {
      return res.status(400).json({ status: false, msg: "Missing id or admin_id" });
    }

    // Sirf admin ke gallery ka file delete karo
    const deleted = await Gallery.destroy({
      where: {
        id: id,
        user_id: admin_id,
      },
    });

    if (!deleted) {
      return res.status(404).json({ status: false, msg: "File not found or not owned by admin" });
    }

    res.json({ status: true, msg: "File removed from Admin Gallery" });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

