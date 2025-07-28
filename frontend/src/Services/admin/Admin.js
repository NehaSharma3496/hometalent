import axios from "axios";
import * as Config from "../../Utils/config";
const qs = require("qs");

export async function GetVendoreList(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/vendors`, {
      headers: {
        Authorization: `${token}`,
      },
    });

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

export async function GetBlockedVendore(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/vendors/blocked`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetApproveVendor(vendorId, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/vendors/approve`,
      { vendor_id: vendorId },
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
    const endpoint = `${Config.base_url}admin/profile-update-requests`;

    const res = await axios.get(endpoint, {
      params: {
        status: status === "all" ? undefined : status, 
        page,
        limit,
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
  gallery_id,
  action,
  remarks,
  admin_id,
  token
) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/gallery-requests/process`,
      {
        gallery_id,
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

export async function GetPendingVendoreList(token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/vendors/pending`, {
      headers: {
        Authorization: `${token}`,
      },
    });

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

export async function GetActiveVendors(token) {
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
    console.error(
      "Error in GetSponsoredVendorsByCategory:",
      err?.response || err
    );
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

export async function GetAllLeads(token) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/leads?page=1&limit=10`,
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

export async function RemoveGalleryItem(token, id) {
  try {
    let userId = localStorage.getItem("userId");
    const response = await axios.delete(
      `${Config.base_url}gallery/remove/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        data: {
          user_id: userId,
        },
      }
    );

    return response?.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// Admin package api

export async function showPackage(token, id) {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(`${Config.base_url}admin/package`, {
      headers: {
        Authorization: `${token}`,
      },
      data: {
        user_id: userId,
      },
    });

    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
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

    return response.data;
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
    return res.data;
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
    return res.data;
  } catch (err) {
    console.error("GetSinglePackage error:", err);
    return { status: false };
  }
};

// Get All Enquiries
export async function GetAllContactUs(token) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/contact-us?page=1&limit=10`,
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

    return response.data;
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

    return response.data;
  } catch (error) {
    console.error("Error update package:", error);
    return error;
  }
}
