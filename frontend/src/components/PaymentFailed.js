import React from "react";
import { useLocation } from "react-router-dom";
export default function PaymentFailed() {
  const location = useLocation();
  const orderData = location.state?.orderData || {};
  if (!orderData) {
    return <h2>No order data available</h2>;
  }
  console.log("PaymentFailed component:", orderData);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">Payment Failed ❌</h1>
      <p className="mt-4 text-gray-600">
        Unfortunately, your payment for Order <b>{orderData?.link_id}</b> was not successful.
      </p>
   
    </div>
  );
}
