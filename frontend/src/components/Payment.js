// src/components/Payment.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../Services/vendor/paymentService';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(location.state?.orderData);
  const [packageInfo, setPackageInfo] = useState(location.state?.package);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderData || !packageInfo) {
      navigate('/vendor/packages');
      return;
    }

  }, [orderData, packageInfo, navigate]);

  const handlePaymentClick = () => {
    if (orderData?.payment_url) {
      window.open(orderData.payment_url, '_blank');
    }
  };

  return (
    <div className="payment-page">
      <h2>Complete Your Payment</h2>
      <p>Order ID: {orderData?.order_id}</p>
      <p>Package: {packageInfo?.name}</p>
      <p>Amount: ₹{orderData?.amount}</p>
      
      <button onClick={handlePaymentClick} disabled={loading}>
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
};

export default Payment;
