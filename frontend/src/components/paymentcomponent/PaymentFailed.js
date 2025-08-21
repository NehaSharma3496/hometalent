import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData || {};

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/allpackages">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading text-danger">Payment Failed</h2>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <div className="row">
          <div className="col-md-8 mx-auto text-center">
            <div className="border rounded p-4 bg-light">
              <i className="fa-solid fa-circle-xmark text-danger fs-1 mb-3"></i>
              <h3 className="fw-bold text-danger">Transaction Failed</h3>

              <p className="mt-3 text-muted">
                Unfortunately, your payment for Order{" "}
                <b>{orderData?.link_id || "N/A"}</b> was not successful.
              </p>

              <div className="mt-4">
                <button
                  className="btn btn-outline-danger px-4 me-2"
                  onClick={() => navigate("/vendor/allpackages")}
                >
                  <i className="fa-solid fa-arrow-left me-2"></i> Back to
                  Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
