import axios from "axios";
import * as Config from "../../Utils/config";
const qs = require("qs");

export async function GetVendoreList(token, page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/vendors?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetSponsoredVendors(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/vendors/sponsored`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetBlockedVendore(token, page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/vendors/blocked?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetApproveVendor(vendorId, approval, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/vendors/approve`,
      {
        vendor_id: vendorId,
        approval: approval,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetApproveVendoreList(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/active_vendors`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetProfileUpdateRequests(
  token,
  status = "all",
  page = 1,
  limit = 10
) {
  try {
    const endpoint = `${Config.base_url}admin/profile-update-requests?page=${page}&limit=${limit}`;

    const res = await axios.get(endpoint, {
      params: {
        status: status === "all" ? undefined : status,
      },
      headers: {
        Authorization: token,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetGalleryUpdateRequests({
  token,
  statusFilter,
  page,
  limit,
}) {
  try {
    const endpoint = `${Config.base_url}admin/gallery-requests`;

    const res = await axios.get(endpoint, {
      params: {
        status: statusFilter === "all" ? "" : statusFilter,
        page,
        limit,
      },
      headers: {
        Authorization: `${token}`,
      },
    });

    return res?.data;
  } catch (err) {
    console.error("API error:", err);
    return err;
  }
}

export async function ProcessGalleryUpdateRequests(
  gallery_ids,
  action,
  remarks,
  admin_id,
  token
) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/gallery-requests/process`,
      {
        gallery_ids,
        action,
        remarks,
        admin_id,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    console.error("Gallery process API error:", err.response?.data || err);
    return err.response?.data || { status: false, message: "Request failed" };
  }
}

export async function GetPendingVendoreList(token, page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/vendors/pending?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function UpdateVendorStatus(vendorId, vendorStatus, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/vendors/update-status`,
      { vendor_id: vendorId, status: vendorStatus },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetActiveVendors(token, page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/active_vendors?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function ProcessProfileUpdateRequest(
  requestId,
  action,
  remarks,
  adminId,
  token
) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/profile-update-requests/process`,
      {
        request_id: requestId,
        action,
        remarks,
        admin_id: adminId,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetCategories(token) {
  try {
    const res = await axios.get(`${Config.base_url}vendor/categories`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetSponsoredVendorsByCategory(
  categoryId,
  token,
  page = 1,
  limit = 10
) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/vendors/sponsored?category_id=${categoryId}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return res?.data;
  } catch (err) {
    console.error("Error in GetSponsoredVendorsByCategory:", err);
    return err;
  }
}

export async function UpdateSponsoredRanks(vendors, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/update-sponsor-ranks`,
      { vendors },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    return res?.data;
  } catch (err) {
    console.error("Error in UpdateSponsoredRanks:", err);
    return err;
  }
}

export async function GetAllLeads(token, page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/leads?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return res?.data;
  } catch (err) {
    return err;
  }
}

// delete Api

export async function RemoveGalleryItem(token, data) {
  try {
    let userId = localStorage.getItem("userId");
    const response = await axios.post(
      `${Config.base_url}admin/gallery/remove`, data,
      {
        headers: {
          Authorization: `${token}`,
        },
        // data: data,
      }
    );

    return response?.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// Admin package api

export async function showPackage(token, page = 1, limit = 10) {
  try {
    const response = await axios.get(
      `${Config.base_url}admin/package?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

export async function AssignPackageToVendor(token, vendorId, packageId) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/package/assign`,
      { vendor_id: vendorId, package_id: packageId },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, msg: err.message };
  }
}

// add packeges

export async function CreatePackage(packageData, token) {
  try {
    const response = await axios.post(
      `${Config.base_url}admin/package`,
      packageData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error creating package:", error);
    return error;
  }
}

// delete packages

export async function DeletePackage(packageId, token) {
  try {
    const res = await axios.delete(
      `${Config.base_url}admin/package/${packageId}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res?.data;
  } catch (err) {
    console.error("Error deleting package:", err);
    throw err;
  }
}

// update package Api

export async function UpdatePackage(packageId, data, token) {
  try {
    const res = await axios.put(
      `${Config.base_url}admin/package/${packageId}`,
      data,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Update API response:", res.data);
    return res?.data;
  } catch (err) {
    console.error("Error updating package:", err.response?.data || err);
    throw err;
  }
}

// get all field by package id

export const GetSinglePackage = async (id, token) => {
  try {
    const res = await axios.get(`${Config.base_url}admin/package/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res?.data;
  } catch (err) {
    console.error("GetSinglePackage error:", err);
    return { status: false };
  }
};

// Get All Enquiries
export async function GetAllContactUs(token, page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/contact-us?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return res?.data;
  } catch (err) {
    return err;
  }
}

// admin Dashboard

export async function GetDashboardCounts(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/dashboard-counts`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function ExtendPackage(token, updateData) {
  try {
    const response = await axios.post(
      `${Config.base_url}admin/package/extend-vendor`,
      updateData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error extend package:", error);
    return error;
  }
}

export async function UpdatePackageStatus(token, data) {
  try {
    const response = await axios.post(
      `${Config.base_url}admin/package/update-status`,
      data,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error update package:", error);
    return error;
  }
}

export async function GetRejectedVendor(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/vendors/rejected`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function AddAdminBlog(token, data) {
  try {
    const response = await axios.post(`${Config.base_url}blogs`, data, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error update package:", error);
    return error;
  }
}

export async function GetAllAdminBlog(token, page = 1, limit = 10) {
  try {
    const response = await axios.get(
      `${Config.base_url}blogs?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function UpdateAdminBlog(token, blogId, data) {
  try {
    const res = await axios.put(`${Config.base_url}blogs/${blogId}`, data, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetSingleAdminBlog(token, blogId) {
  try {
    const response = await axios.get(`${Config.base_url}blogs/${blogId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function DeleteAdminBlog(token, blogId) {
  try {
    const response = await axios.delete(`${Config.base_url}blogs/${blogId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function GetExtendPackageHistory(token, vendor_id) {
  try {
    const response = await axios.post(
      `${Config.base_url}admin/packageextendhistory`,
      vendor_id,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error getting package history", error);
    return error;
  }
}

export async function GetProfileUpdateRequestsBlogs(token, request_id) {
  try {
    const response = await axios.post(
      `${Config.base_url}admin/getprofileRequestdata`,
      request_id,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error getting update request logs", error);
    return error;
  }
}

export async function UpdateBlogStatus(blogId, blogStatus, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/vendors/update-status`,
      { blog_id: blogId, status: blogStatus },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function UpdateReviewStatus(reviewId, reviewStatus, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/vendors/update-status`,
      { review_id: reviewId, status: reviewStatus },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetAllReview(token, page = 1, limit = 10) {
  try {
    const response = await axios.get(`${Config.base_url}reviews?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function ApproveReview(reviewId, status) {
  try {
    const response = await axios.put(
      `${Config.base_url}review/${reviewId}/approve`,
      status
    );
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function GetAllFeedBack(token, page = 1, limit = 10) {
  try {
    const response = await axios.get(`${Config.base_url}admin/feedback?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}

// Add vendor gallery item to admin gallery
export const AddToAdminGallery = async (token, data) => {
  try {
    const res = await axios.post(`${Config.base_url}admin/gallery/upload-from-vendor`, data, {
      headers: { Authorization: ` ${token}` },
    });
    return res.data;
  } catch (err) {
    return { status: false, msg: err.message };
  }
};

export const RemoveFromAdminGallery = async (token, data) => {
  try {
    const res = await axios.post(`${Config.base_url}admin/gallery/remove`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return { status: false, msg: err.message };
  }
};

export async function GetAdminGallery(token, userId) {
  try {
    const res = await axios.get(
      `${Config.base_url}gallery/my-gallery?user_id=${userId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return res?.data;
  } catch (error) {
    return error;
  }
}

export async function GetVendorDetails(token, id) {
  try {
    const response = await axios.get(
      `${Config.base_url}admin/user-profile/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
}