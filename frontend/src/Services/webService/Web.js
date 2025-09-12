import axios from "axios";
import * as Config from "../../Utils/config";

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

export async function GetStateCity(token) {
  try {
    const res = await axios.get(`${Config.base_url}front/state_city_list`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function SubmitLead(data) {
  try {
    const response = await axios.post(`${Config.base_url}client/lead`, data);
    console.log(response.body);
    console.log("Lead submitted successfully", response);
    return response;
  } catch (error) {
    return error;
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
  } catch (error) {
    return error;
  }
}

export async function SubmitContactData(data) {
  try {
    const response = await axios.post(
      `${Config.base_url}client/contact-us`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function GetVendorsByCategory(token, categoryId, cityId) {
  try {
    const catId = categoryId || "";

    const cityQuery = cityId ? `?city_id=${cityId}` : "";

    const res = await axios.get(
      `${Config.base_url}front/vendors-by-category/${catId}${cityQuery}`,
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

export async function GetAllApprovedReview(token) {
  try {
    const response = await axios.get(
      `${Config.base_url}reviews/active-approved`,
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

export async function SubmitFeedback(data) {
  try {
    const response = await axios.post(
      `${Config.base_url}client/feedback`,
      data
    );
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function VerifyOtp(data) {
  try {
    const response = await axios.post(`${Config.base_url}admin/sendotp`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
}
export async function SubmitReview(data) {
  try {
    const response = await axios.post(`${Config.base_url}review`, data);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function SubmitReport(data) {
  try {
    const response = await axios.post(`${Config.base_url}report`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function Submitotp(data) {
  try {
    const response = await axios.post(
      `${Config.base_url}send-otp-review`,
      data
    );
    return response?.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function GetReport(token) {
  try {
    const response = await axios.get(`${Config.base_url}reports`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function GetReviewCount(token, vendorId) {
  try {
    const response = await axios.get(`${Config.base_url}vendor/rating_average/${vendorId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}
