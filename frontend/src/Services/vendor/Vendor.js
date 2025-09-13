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
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${Config.base_url}vendor/profile-update-request`,
    data,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data; 
}


export async function GetAllVendorLeads(token, id, page = 1, limit = 10) {
  try {
    const response = await axios.get(
      `${Config.base_url}vendor/my-leads?vendor_id=${id}&page=${page}&limit=${limit}`,
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

export async function RemoveGalleryItem(token, gallery_ids) {
  try {
    const response = await axios.post(
      `${Config.base_url}gallery/remove`,
      {
        gallery_ids,
      },
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

export async function getVendorPackages(token, page = 1, limit = 10) {
  try {
    const response = await axios.get(
      `${Config.base_url}vendor/packages?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching vendor packages:", error);
    return error;
  }
}

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
    return err;
  }
};

export const getVendorPackageHistory = async (
  token,
  vendorId,
   payment_status,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${Config.base_url}vendor/package-history?vendor_id=${vendorId}&page=${page}&limit=${limit}& payment_status=${ payment_status}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor package history:", error);
    return error;
  }
};


export const GetDashBoardCount = async (vendor_id, token) => {
  try {
    const res = await axios.post(
      `${Config.base_url}vendor/dashboard-counts`,
      vendor_id,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res?.data;
  } catch (err) {
    console.error("Error in getting vendor dashboard", err);
    return err;
  }
};