import axios from "axios";
import * as Config from "../../Utils/config";

const API_BASE_URL = Config.base_url;

const paymentAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

paymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const paymentService = {
  createPaymentOrder: async (vendorId, packageId) => {
    const token = localStorage.getItem("token");
    const res = await paymentAPI.post(
      "/payment/create-order",
      { vendor_id: vendorId, package_id: packageId },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  },
  getPaymentStatus: async (orderId,userid) => {
    const res = await paymentAPI.get(`/payment/status?order_id=${orderId}&user_id=${userid}`);
    return res.data;
  },
};
