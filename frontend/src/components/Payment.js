// src/components/Payment.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../Services/vendor/paymentService';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(location.state?.orderData);
  const [packageInfo, setPackageInfo] = useState(location.state?.package);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderData || !packageInfo) {
      navigate('/vendor/packages');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await paymentService.getPaymentStatus(orderData.order_id);
        if (response.data.order_status === 'PAID') {
          setPaymentStatus('completed');
          setTimeout(() => {
            navigate('/payment-success', { 
              state: { orderData, packageInfo } 
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
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
      <h4>Status: {paymentStatus}</h4>
    </div>
  );
};

export default Payment;
