import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetVendorDetails } from "../../../Services/admin/Admin";
// import { image_baseurl } from "../../../Utils/config";

export default function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId"); 
  const navigate = useNavigate();

  const fetchEmployee = async () => {
    try {
      const res = await GetVendorDetails(token, vendorId);
      if (res?.data?.user) {
        setEmployee(res?.data?.user);
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  useEffect(() => {
    if (token && vendorId) {
      fetchEmployee();
    }
  }, [token, vendorId]);

  if (!employee) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Employee Profile...</h5>
        </div>
      </div>
    );
  }

  const profileFields = [
    { label: "Name", value: employee.profile_name, icon: "fas fa-user" },
    { label: "Email", value: employee.email, icon: "fas fa-envelope" },
    { label: "Phone", value: employee.phone, icon: "fas fa-phone" },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h5 className="add-page-heading mb-0">My Profile</h5>
          </div>
        </div>
        {/* <div className="col-md-6 text-md-end">
          <Link to="/admin/updateemployee" className="btn btn-primary btn-sm">
            <i className="fa fa-edit me-1"></i> Update Profile
          </Link>
        </div> */}
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="p-4 d-flex align-items-center">
          <div className="col-auto">
            <div className="position-relative">
              <img
                src={
                //   employee.image
                //     ? `${image_baseurl}${employee.image}`:
                     "https://cdn-icons-png.flaticon.com/512/149/149071.png" // 🔹 Default admin avatar
                }
                alt="Employee"
                className="rounded-circle border border-3 border-white shadow"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="col ms-3">
            <h3 className="mb-1 fs-4 fw-bold">{employee.profile_name}</h3>
            {/* <span className="badge bg-primary">{employee.profile_name}</span> */}
          </div>
        </div>

        <div className="card-body p-4">
          <h5 className="mb-4 d-flex align-items-center fs-6">
            <i className="fas fa-info-circle text-primary me-2"></i>
            Contact Information
          </h5>
          <div className="row g-3">
            {profileFields?.map(({ label, value, icon }, i) => (
              <div key={i} className="col-md-6 mb-2">
                <div className="p-3 bg-light rounded-3 h-100">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="text-primary fs-5">
                      <i className={icon}></i>
                    </div>
                    <div className="fw-semibold">{label}</div>
                  </div>
                  <div className="fw-medium">{value || "Not provided"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
