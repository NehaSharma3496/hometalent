import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { paymentService } from "../Services/vendor/paymentService";

const PaymentCallback = () => {
  const userid = localStorage.getItem("userId");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("order_id");
  let orderData; 
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await paymentService.getPaymentStatus(orderId,userid);
        orderData = res?.data[0];
        console.log("Payment verification response:", orderData);
        
        if (res?.data[0]?.order_status === "PAID") {
          navigate("/vendor/payment-success", { state: { orderData } });
        } else {
          navigate("/vendor/payment-failed", { state: { orderData } });
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        navigate("/vendor/payment-failed", { state: { orderData } });
      }
    };

    if (orderId) verifyPayment();
  }, [orderId, navigate]);

  return <h2>Verifying your payment...</h2>;
};

export default PaymentCallback;
