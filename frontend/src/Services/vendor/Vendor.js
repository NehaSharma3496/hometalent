import axios from "axios";

import * as Config from "../../Utils/config";

// export async function LoginApi(data) {
//   try {
//     const response = await axios.post(`${Config.base_url}user/login`, data);

//     return response.data;
//   } catch (error) {
//     console.log("Error fetching login:", error.message || error);
//     throw error;
//   }
// }

// export async function UserLoginApi(data) {
//   try {
//     const response = await axios.post(
//       `${Config.base_url}api/client/login`,
//       data
//     );

//     return response.data;
//   } catch (error) {
//     console.log("Error fetching login:", error.message || error);
//     throw error;
//   }
// }

// export async function UserSignupApi(data) {
//   try {
//     const response = await axios.post(`${Config.base_url}api/client/add`, data);

//     return response?.data;
//   } catch (error) {
//     // console.log("Error fetching login:", error.response.data.message || error);
//     throw error;
//   }
// }

// export async function UserOtpSubmit(data) {
//   try {
//     const response = await axios.post(`${Config.base_url}api/client/otp_submit`, data);

//     return response.data;
//   } catch (error) {
//     console.log("Error fetching login:", error.message || error);
//     throw error;
//   }
// }

export async function VendorRegister(data) {
  try {
    const response = await axios.post(`${Config.base_url}addUser`, data);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
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

export async function GetStates(token) {
  try {
    const res = await axios.get(`${Config.base_url}vendor/states`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetCities(token, stateId) {
  try {
    const res = await axios.get(
      `${Config.base_url}vendor/cities?state_id=${stateId}`,
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

// export async function GetGallery(token, userId) {
//   try {
//     const res = await axios.get(
//       `${Config.base_url}gallery/my-gallery?user_id=${userId}&status=approved`,
//       {
//         headers: {
//           Authorization: `${token}`,
//         },
//       }
//     );
//     return res?.data;
//   } catch (err) {
//     return err;
//   }
// }

export async function GalleryUpload(data) {
  try {
    const response = await axios.post(`${Config.base_url}gallery/upload`, data);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// export async function RemoveGalleryItem(token, id) {
//   try {
//     const response = await axios.delete(
//       `${Config.base_url}gallery/remove/${id}`,
//       {
//         headers: {
//           Authorization: `${token}`,
//         },
//       }
//     );
//     return response?.data;
//   } catch (error) {
//     throw error?.response?.data || error;
//   }
// }

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

export async function SubmitProfileUpdateRequest(data) {
  try {
    const response = await axios.post(
      `${Config.base_url}vendor/profile-update-request`,
      data
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
}




export async function GetAllVendorLeads(token, id) {
  try {
    const response = await axios.get(
      `${Config.base_url}vendor/my-leads?vendor_id=${id}&page=1&limit=10`,
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

export async function GetGallery(token, userId) {
  try {
    const res = await axios.get(
      `${Config.base_url}gallery/my-gallery?user_id=${userId}&status=approved`,
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
  } catch (err) {
    return err;
  }
}

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

// UpdateGalleryOrder
export async function UpdateGalleryOrder(token, items) {
  try {
    let userId = localStorage.getItem("userId");
    let data = JSON.stringify({
      user_id: userId,
      items: items,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${Config.base_url}gallery/update-order`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    return response?.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

export const getVendorPackages = async (token) => {
  try {
    const response = await axios.get(
      `${Config.base_url}vendor/packages?page=1&limit=100`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching vendor packages:", error);
    throw error;
  }
};

// Suscribe plan vendor

export const subscribeToPackage = async (payload, token) => {
  try {
    const res = await axios.post(
      `${Config.base_url}vendor/subscribe-package`,
      payload,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    console.error("Error subscribing to package", err);
    throw err;
  }
};

export const getVendorPackageHistory = async (token, vendorId, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `http://localhost:8888/vendor/package-history?vendor_id=${vendorId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch vendor package history");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vendor package history:", error);
    throw error;
  }
};



// GET ALL package VENDOR

// Suscribe plan vendor
