import axios from "axios";
import * as Config from "../../Utils/config";
const qs = require("qs");


export async function GetAllAdminNotification() {
  try {
    const res = await axios.get(
      `${Config.base_url}notifications/admin`,
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}


export async function GetAllVendorNotification(vendor_Id) {
  try {
    const res = await axios.get(
      `${Config.base_url}notifications/vendor/${vendor_Id}`,
    );

    return res?.data;
  } catch (err) {
    return err;
  }
}