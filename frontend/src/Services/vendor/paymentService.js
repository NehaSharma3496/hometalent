import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888/api';

const paymentAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

paymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const paymentService = {
  createPaymentOrder: async (vendorId, packageId) => {
    const res = await paymentAPI.post('/payment/create-order', {
      vendor_id: vendorId,
      package_id: packageId,
    });
    return res.data;
  },
  getPaymentStatus: async (orderId) => {
    const res = await paymentAPI.get(`/payment/status?order_id=${orderId}`);
    return res.data;
  },
};
