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

export async function GetVendorsByCategory(token, categoryId, cityId) {
  try {
    const res = await axios.get(
      `${Config.base_url}front/vendors-by-category/${categoryId}?city_id=${cityId}`,
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

export async function SubmitLead(data) {
  try {
    const response = await axios.post(
      `${Config.base_url}client/lead`,
      data
    );
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
      `${Config.base_url}gallery/my-gallery?user_id=${userId}&status=approved`,
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


export async function GetVendorsByCategoryHeader(token, categoryId) {
  try {
    const res = await axios.get(
      `${Config.base_url}front/vendors-by-category/${categoryId}`,
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