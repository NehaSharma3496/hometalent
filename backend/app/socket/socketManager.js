const socketIO = require("socket.io");

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
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      // Handle admin connection
      socket.on("admin-connect", (adminId) => {
        this.adminSockets.add(socket);
        socket.adminId = adminId;
        console.log("Admin connected:", adminId);
      });

      // Handle vendor connection
      socket.on("vendor-connect", (vendorId) => {
        const vendorKey = String(vendorId);
        this.vendorSockets.set(vendorKey, socket);
        socket.vendorId = vendorKey;
        console.log("Vendor connected:", vendorKey);
      });

      // Handle client connection
      socket.on("client-connect", (clientId) => {
        this.clientSockets.set(clientId, socket);
        socket.clientId = clientId;
        // console.log('Client connected:', clientId);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        // console.log('Client disconnected:', socket.id);

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
    this.adminSockets.forEach((socket) => {
      console.log("Sending notification to admin:", data);
      socket.emit("notification", {
        type,
        data,
        timestamp: new Date().toISOString(),
      });
    });
  }

  // Send notification to specific vendor
  notifyVendor(vendorId, type, data) {
    const vendorKey = String(vendorId);

    const vendorSocket = this.vendorSockets.get(vendorKey);
    // console.log('Sending notification to vendor:', vendorKey, 'Socket:', vendorSocket);
    console.log("Available vendors:", vendorSocket);

    if (vendorSocket && vendorSocket != undefined) {
      vendorSocket.emit("notification", {
        type,
        data,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(
        "No socket for vendor:",
        vendorKey,
        "Available vendors:",
        Array.from(this.vendorSockets.keys())
      );
    }
  }

  // Send notification to all vendors
  notifyAllVendors(type, data) {
    this.vendorSockets.forEach((socket, vendorId) => {
      socket.emit("notification", {
        type,
        data,
        timestamp: new Date().toISOString(),
      });
    });
  }

  // Send notification to specific client
  notifyClient(clientId, type, data) {
    const socket = this.clientSockets.get(clientId);
    if (socket) {
      socket.emit("notification", {
        type,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Vendor registration notification
  vendorRegistered(vendorData, role_id, message) {

    if(role_id == 3){
    this.notifyAdmins("vendor_registration_request", {
      message: message,
      vendor: vendorData,
    });

  }else{
    this.notifyAdmins("vendor_registration_request", {
      message: "Vendor registration request received. Action required",
      vendor: vendorData,
    });
  }
  }

  // Lead submission notification
  leadSubmitted(leadData, vendorId) {
    // Notify the specific vendor
    this.notifyVendor(vendorId, "lead_vendor", {
      message: "New Enquiry has been received.",
      lead: leadData,
    });

    // Notify all admins
    this.notifyAdmins("lead_admin", {
      message: "New Product enquiry has been received.",
      lead: leadData,
      vendor_id: vendorId,
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
    this.notifyAdmins("package_created", {
      message: "New package created",
      package: packageData,
    });
  }

  // Profile update request notification
  profileUpdateRequested(requestData, vendorName) {
    this.notifyAdmins("profile_update_request", {
      message: `Vendor(${vendorName}) profile update request received. Action required`,
      request: requestData,
    });
  }

  // Profile update processed notification
  profileUpdateProcessed(requestData, vendorId, action, role_id, vendorname, empname) {
    // Notify the vendor about their request status
    this.notifyVendor(vendorId, "profile_update_processed", {
      message: `Your profile update request has been ${
        action === "approve" ? "Approved" : "Rejected"
      }.`,
      request: requestData,
      action,
    });

    // Notify admins
    if(role_id == 3){
      this.notifyAdmins('profile_update_processed', {
        message: `Vendor ${vendorname}'s Update Request ${action === "approve" ? "Approved" : "Rejected"} by ${empname}`,
        request: requestData,
        vendor_id: vendorId,
        action
      });
    }
  }

  // Contact us submission notification
  contactUsSubmitted(contactData) {
    this.notifyAdmins("contact_us", {
      message: "New Enquiry request has been received",
      contact: contactData,
    });
  }

  // Vendor package subscription notification
  vendorSubscribed(subscriptionData, planName, vendorName, role_id, empname) {
    // Notify the vendor
    this.notifyVendor(subscriptionData.vendor_id, 'package_subscribed', {
      message: `New Subscription:${planName} subscribed successfully`,
      subscription: subscriptionData
    });

    // Notify admins
    if(role_id == 1){
      this.notifyAdmins('plan_subscribed', {
      message: `New Subscription:${planName} plan subscribed by Vendor(${vendorName}).`,
      subscription: subscriptionData
    });
    }else{
      this.notifyAdmins('plan_subscribed', {
        message: `New Subscription:${planName} assigned to Vendor(${vendorName}) by (${empname}).`,
        subscription: subscriptionData
      });
    }
  }

  // Sponsor rank updated notification
  sponsorRankUpdated(rankData) {
    // Notify the vendor
    this.notifyVendor(rankData.vendor_id, "sponsor_rank_updated", {
      message: "Sponsor rank updated",
      rank: rankData,
    });

    // Notify admins
    this.notifyAdmins("sponsor_rank_updated", {
      message: "Sponsor rank updated",
      rank: rankData,
    });
  }

  // Gallery request submitted by vendor
  galleryRequestSubmitted(vendorId, vendorName, payload) {
    this.notifyAdmins("gallery_request", {
      message: `Vendor(${vendorName}) gallery request received. Action required`,
      data: payload,
      vendor_id: vendorId,
    });
  }

  // Gallery request processed by admin
  galleryRequestProcessed(vendorId, action, payload) {
    this.notifyVendor(vendorId, "gallery_request_processed", {
      message: `Your Gallery update request has been ${
        action === "approve" ? "Approved" : "Rejected"
      }.`,
      data: payload,
      action,
    });
  }

  // Review submitted
  reviewSubmitted(reviewData) {
    if(reviewData.reason !== undefined && reviewData.reason){
      // It's a report 
      this.notifyAdmins("report_submitted", {
        message: "New report has been received.",
        report: reviewData,
      });
      return;
    }else {
      // It's a review
      this.notifyAdmins("review_submitted", {
        message: "New review has been received.",
        review: reviewData,
      });
      
    }
  }

  // Plan expired notifications
  planExpired(vendorId, vendorName, subscriptionData) {
    // Notify vendor
    this.notifyVendor(vendorId, "plan_expired", {
      message: "Plan expired. Please renew to avoid interruption.",
      subscription: subscriptionData,
    });
    // Notify admins
    this.notifyAdmins("plan_expired", {
      message: `Vendor ${vendorName} subscription plan has expired.`,
      subscription: subscriptionData,
    });
  }

  vendorPackageExtended(vendorId, role_id, vendorname, empname, packageData) {

    if(role_id == 3){
      this.notifyAdmins("plan_extend", {
      message: `${empname} has successfully extended the plan ${packageData.package_name} for the vendor ${vendorname}`,
      packageData: packageData,
    });
    }
    // Notify vendor
    this.notifyVendor(vendorId, "plan_extend", {
      message: `Package ${packageData.package_name} extended successfully by Admin for ${packageData.extra_days} days. Valid till ${packageData.new_end_date}.`,
      subscription: packageData,
    });

  }

  feedbackSubmitted(feedbackData) {
    this.notifyAdmins("feedback_submitted", {
      message: "New feedback has been received.",
      feedback: feedbackData,
    });
  }

  approvevendor(type, message, data) {
    this.notifyAdmins(type, {
      message: message,
      data: data,
    });
  }

  updatevendorstatus(type, message, data) {
    this.notifyAdmins(type, {
      message: message,
      data: data,
    });
  }

  blogaction(type, message, data) {
    this.notifyAdmins(type, {
      message: message,
      data: data,
    });
  }
}
module.exports = new SocketManager();
