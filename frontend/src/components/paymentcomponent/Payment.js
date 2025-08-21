// src/components/Payment.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(location.state?.orderData);
  const [packageInfo, setPackageInfo] = useState(location.state?.package);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderData || !packageInfo) {
      navigate("/vendor/allpackages");
      return;
    }
  }, [orderData, packageInfo, navigate]);

  const handlePaymentClick = () => {
    if (orderData?.payment_url) {
      setLoading(true);
      window.open(orderData.payment_url, "_blank");
      setTimeout(() => {
        setLoading(false);
        Swal.fire(
          "Payment Initiated",
          "Complete the payment in the new tab",
          "info"
        );
      }, 800);
    }
  };

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/allpackages">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Complete Your Payment</h2>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <div className="row">
          <div className="col-md-8 mx-auto text-center">
            <div className="border rounded p-4 bg-light text-center">
              <div className="mb-3 d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-hashtag text-primary me-2 fs-5"></i>
                <span className="fw-bold me-2">Order ID:</span>
                <span className="text-muted">{orderData?.order_id}</span>
              </div>

              <div className="mb-3 d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-box text-warning me-2 fs-5"></i>
                <span className="fw-bold me-2">Package:</span>
                <span className="text-muted">{packageInfo?.name}</span>
              </div>

              <div className="mb-3 d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-indian-rupee-sign text-success me-2 fs-5"></i>
                <span className="fw-bold me-2">Amount:</span>
                <span className="badge bg-success fs-6 px-3 py-2">
                  ₹{orderData?.amount}
                </span>
              </div>

              <div className="text-center mt-4">
                <button
                  className="btn btn-primary btn-lg px-5 shadow-sm"
                  onClick={handlePaymentClick}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fa fa-spinner fa-spin me-2"></i>{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-credit-card me-2"></i> Proceed
                      to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
