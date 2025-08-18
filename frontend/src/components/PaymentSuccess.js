// src/components/PaymentSuccess.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, packageInfo } = location.state || {};
console.log('PaymentSuccess component:', orderData, packageInfo);
console.log('Location state:',orderData?.cf_order_id, orderData?.order_amount);


  if (!orderData || !packageInfo) {
    navigate('/vendor/allpackages');
    return null;
  }

  return (
    <div className="payment-success">
      <h1>Payment Successful 🎉</h1>
      <p>Your subscription has been activated.</p>
      <p><strong>Home Talent Order ID:</strong> {orderData?.link_id}</p>
      <p><strong>CashFree Order ID:</strong> {orderData?.cf_order_id}</p>
      <p><strong>Amount:</strong> ₹{orderData?.order_amount}</p>

      <button onClick={() => navigate('/vendor/allpackages')}>
        Back to Packages
      </button>
    </div>
  );
};

export default PaymentSuccess;
