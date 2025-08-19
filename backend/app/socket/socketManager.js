const socketIO = require('socket.io');

class SocketManager {
  constructor() {
    this.io = null;
    this.adminSockets = new Set();
    this.vendorSockets = new Map(); // vendor_id -> socket
    this.clientSockets = new Map(); // client_id -> socket
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {

      // Handle admin connection
      socket.on('admin-connect', (adminId) => {
        this.adminSockets.add(socket);
        socket.adminId = adminId;
        console.log('Admin connected:', adminId);
      });

      // Handle vendor connection
      socket.on('vendor-connect', (vendorId) => {
        const vendorKey = String(vendorId);
        this.vendorSockets.set(vendorKey, socket);
        socket.vendorId = vendorKey;
        console.log('Vendor connected:', vendorKey);
      });

      // Handle client connection
      socket.on('client-connect', (clientId) => {
        this.clientSockets.set(clientId, socket);
        socket.clientId = clientId;
        console.log('Client connected:', clientId);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove from admin sockets
        if (this.adminSockets.has(socket)) {
          this.adminSockets.delete(socket);
        }

        // Remove from vendor sockets
        if (socket.vendorId) {
          this.vendorSockets.delete(socket.vendorId);
        }

        // Remove from client sockets
        if (socket.clientId) {
          this.clientSockets.delete(socket.clientId);
        }
      });
    });

    return this.io;
  }

  // Send notification to all admins
  notifyAdmins(type, data) {
    this.adminSockets.forEach(socket => {
      socket.emit('notification', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Send notification to specific vendor
  notifyVendor(vendorId, type, data) {
    const vendorKey = String(vendorId);
    const vendorSocket = this.vendorSockets.get(vendorKey);
    console.log('Sending notification to vendor:', vendorKey, 'Socket:', vendorSocket);
    
    if (vendorSocket && vendorSocket != undefined) {
      vendorSocket.emit('notification', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('No socket for vendor:', vendorKey, 'Available vendors:', Array.from(this.vendorSockets.keys()));
    }
  }

  // Send notification to all vendors
  notifyAllVendors(type, data) {
    this.vendorSockets.forEach((socket, vendorId) => {
      socket.emit('notification', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Send notification to specific client
  notifyClient(clientId, type, data) {
    const socket = this.clientSockets.get(clientId);
    if (socket) {
      socket.emit('notification', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Vendor registration notification
  vendorRegistered(vendorData) {
    this.notifyAdmins('vendor_registered', {
      message: 'New vendor registered',
      vendor: vendorData
    });
  }

  // Lead submission notification
  leadSubmitted(leadData, vendorId) {
    // Notify the specific vendor
    this.notifyVendor(vendorId, 'new_lead', {
      message: 'New lead received',
      lead: leadData
    });

    // Notify all admins
    this.notifyAdmins('new_lead', {
      message: 'New lead submitted',
      lead: leadData,
      vendor_id: vendorId
    });
  }

  // Package created notification
  packageCreated(packageData) {
    // Notify all vendors about new package
    this.notifyAllVendors('new_package', {
      message: 'New package available',
      package: packageData
    });

    // Notify all admins
    this.notifyAdmins('package_created', {
      message: 'New package created',
      package: packageData
    });
  }

  // Profile update request notification
  profileUpdateRequested(requestData) {
    this.notifyAdmins('profile_update_request', {
      message: 'New profile update request',
      request: requestData
    });
  }

  // Profile update processed notification
  profileUpdateProcessed(requestData, vendorId, action) {
    // Notify the vendor about their request status
    this.notifyVendor(vendorId, 'profile_update_processed', {
      message: `Profile update request ${action}`,
      request: requestData,
      action
    });

    // Notify admins
    this.notifyAdmins('profile_update_processed', {
      message: `Profile update request ${action}`,
      request: requestData,
      vendor_id: vendorId,
      action
    });
  }

  // Contact us submission notification
  contactUsSubmitted(contactData) {
    this.notifyAdmins('contact_us_submitted', {
      message: 'New contact us submission',
      contact: contactData
    });
  }

  // Vendor package subscription notification
  vendorSubscribed(subscriptionData) {
    // Notify the vendor
    this.notifyVendor(subscriptionData.vendor_id, 'package_subscribed', {
      message: 'Package subscription successful',
      subscription: subscriptionData
    });

    // Notify admins
    this.notifyAdmins('vendor_subscribed', {
      message: 'Vendor subscribed to package',
      subscription: subscriptionData
    });
  }

  // Sponsor rank updated notification
  sponsorRankUpdated(rankData) {
    // Notify the vendor
    this.notifyVendor(rankData.vendor_id, 'sponsor_rank_updated', {
      message: 'Sponsor rank updated',
      rank: rankData
    });

    // Notify admins
    this.notifyAdmins('sponsor_rank_updated', {
      message: 'Sponsor rank updated',
      rank: rankData
    });
  }
}

module.exports = new SocketManager(); 