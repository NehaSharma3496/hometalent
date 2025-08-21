// src/components/PaymentSuccess.js
import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, packageInfo } = location.state || {};

  useEffect(() => {
    if (!orderData) {
      navigate("/vendor/allpackages");
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  return (
    <div className="page-content">
      {/* Header with back button */}
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/allpackages">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading text-success">Payment Successful</h2>
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="card p-4 shadow-sm">
        <div className="row">
          <div className="col-md-8 mx-auto text-center">
            <div className="border rounded p-4 bg-light">
              <i className="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
              <h3 className="fw-bold text-success">Transaction Successful 🎉</h3>

              <p className="mt-3 text-muted">
                Your subscription has been activated successfully.
              </p>

              <div className="mt-4 text-start">
                <p className="mb-2">
                  <i className="fa-solid fa-hashtag text-primary me-2"></i>
                  <strong>Home Talent Order ID:</strong>{" "}
                  <span className="text-muted">{orderData?.link_id}</span>
                </p>
                <p className="mb-2">
                  <i className="fa-solid fa-file-invoice text-info me-2"></i>
                  <strong>CashFree Order ID:</strong>{" "}
                  <span className="text-muted">{orderData?.cf_order_id}</span>
                </p>
                <p className="mb-2">
                  <i className="fa-solid fa-indian-rupee-sign text-success me-2"></i>
                  <strong>Amount:</strong>{" "}
                  <span className="badge bg-success fs-6 px-3 py-2">
                    ₹{orderData?.order_amount}
                  </span>
                </p>
                {packageInfo && (
                  <p className="mb-0">
                    <i className="fa-solid fa-box text-warning me-2"></i>
                    <strong>Package:</strong>{" "}
                    <span className="text-dark">{packageInfo?.name}</span>
                  </p>
                )}
              </div>

              <div className="text-center mt-4">
                <button
                  className="btn btn-success px-5"
                  onClick={() => navigate("/vendor/allpackages")}
                >
                  <i className="fa-solid fa-arrow-left me-2"></i> Back to Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
