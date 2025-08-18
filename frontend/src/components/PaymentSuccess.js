// src/components/PaymentSuccess.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, packageInfo } = location.state || {};

  if (!orderData || !packageInfo) {
    navigate('/vendor/mypackages');
    return null;
  }

  return (
    <div className="payment-success">
      <h1>Payment Successful 🎉</h1>
      <p>Your subscription has been activated.</p>
      <p><strong>Order ID:</strong> {orderData.order_id}</p>
      <p><strong>Package:</strong> {packageInfo.name}</p>
      <p><strong>Amount:</strong> ₹{orderData.amount}</p>

      <button onClick={() => navigate('/vendor/packages')}>
        Back to Packages
      </button>
    </div>
  );
};

export default PaymentSuccess;
