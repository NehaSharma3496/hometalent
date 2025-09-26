import axios from "axios";
import * as Config from "../../Utils/config";
const qs = require("qs");

export async function GetAllAdminNotification(page = 1, limit = 10) {
  try {
    const res = await axios.get(
      `${Config.base_url}notifications/admin?page=${page}&limit=${limit}`
    );
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function GetAllVendorNotification(
  vendor_Id,
  page = 1,
  limit = 10
) {
  try {
    const res = await axios.get(
      `${Config.base_url}notifications/vendor/${vendor_Id}?page=${page}&limit=${limit}`
    );
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function Settings() {
  try {
    const res = await axios.get(`${Config.base_url}admin/settings`);
    return res?.data;
  } catch (error) {
    return error;
  }
}
