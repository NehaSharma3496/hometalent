import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { GetVendorDetails } from "../../../Services/vendor/Vendor";

export default function VendorDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const token = localStorage.getItem("token");
  const vendorId = location.state?.vendorId;

  const fetchVendor = async () => {
    try {
      const res = await GetVendorDetails(token, vendorId);
      console.log("Vendor API Response:", res);

      if (res?.data?.user) {
        setVendor(res.data.user);
      } else {
        console.error("Invalid response structure", res);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  if (!vendor) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Vendor Profile...</h5>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { key: "facebook_link", icon: "fab fa-facebook-f", color: "#1877f2" },
    { key: "instagram_link", icon: "fab fa-instagram", color: "#e4405f" },
    { key: "twitter_link", icon: "fab fa-twitter", color: "#1da1f2" },
    { key: "linkedin_link", icon: "fab fa-linkedin-in", color: "#0077b5" },
    { key: "youtube_link", icon: "fab fa-youtube", color: "#ff0000" },
    { key: "website_link", icon: "fas fa-globe", color: "#6c757d" },
  ];

  const profileFields = [
    { label: "Email", value: vendor.email, icon: "fas fa-envelope" },
    { label: "Phone", value: vendor.phone, icon: "fas fa-phone" },
    {
      label: "Price Range",
      value: vendor.price_range,
      icon: "fas fa-dollar-sign",
    },
    {
      label: "Experience Since",
      value: vendor.experience_since,
      icon: "fas fa-calendar-alt",
    },
    {
      label: "Pin Code",
      value: vendor.pin_code,
      icon: "fas fa-map-marker-alt",
    },
    { label: "Category IDs", value: vendor.category_id, icon: "fas fa-tags" },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-1">
        <div className="col-md-6 mb-2">
          <div className="add-page-heading-div">
            <Link to="/admin/vendor/allvendors" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0">Vendor Profile</h5>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="p-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="position-relative">
                <img
                  src={vendor.image || "/no-image.png"}
                  alt="Vendor"
                  className="rounded-circle border border-3 border-white shadow"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
            <div className="col">
              <h3 className="mb-2 fw-bold">{vendor.owner_name}</h3>
              <div className="d-flex align-items-center gap-3 mb-2">
                {vendor.profile_name && (
                  <span className="badge bg-primary">
                    {vendor.profile_name}
                  </span>
                )}
                {vendor.experience_since && (
                  <span>
                    <i className="fas fa-calendar-alt me-1"></i>
                    Since {vendor.experience_since}
                  </span>
                )}
              </div>
            </div>
          </div>
            <div className="position-absolute top-0 end-0 p-3">
              <Link
                to="/admin/vendor/vendorpackagedetails"
                className="btn btn-outline-primary btn-sm shadow-sm"
                 state={{ vendorId: vendorId }}
              >
                <i className="fas fa-box-open me-1"></i>
                Vendor Packages
              </Link>
            </div>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-lg-8">
              <h5 className="mb-4 d-flex align-items-center">
                <i className="fas fa-info-circle text-primary me-2"></i>
                Contact Information
              </h5>
              <div className="row g-3">
                {profileFields.map(({ label, value, icon }, i) => (
                  <div key={i} className="col-md-6">
                    <div className="justify-content-between align-items-center p-3 bg-light rounded-3 h-100">
                      <div className="d-flex align-items-center gap-3">
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

          {(vendor.short_description || vendor.long_description) && (
            <div className="mt-4">
              <h5 className="mb-3 d-flex align-items-center">
                <i className="fas fa-file-alt text-info me-2"></i>
                About
              </h5>
              <div className="row">
                {vendor.short_description && (
                  <div className="col-md-6 mb-3">
                    <div className="bg-light p-4 rounded-3 h-100">
                      <h6 className="text-primary mb-2">Short Description</h6>
                      <p className="mb-0 lh-lg">{vendor.short_description}</p>
                    </div>
                  </div>
                )}
                {vendor.long_description && (
                  <div className="col-md-6 mb-3">
                    <div className="bg-light p-4 rounded-3 h-100">
                      <h6 className="text-primary mb-2">Long Description</h6>
                      <p className="mb-0 lh-lg">{vendor.long_description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <h5 className="mb-4 d-flex align-items-center">
              Social Media & Links
            </h5>
            <div className="d-flex flex-wrap gap-3">
              {socialLinks.map(({ key, icon, color }) => {
                const link = vendor[key];
                if (!link) return null;
                const fullUrl = link.startsWith("http")
                  ? link
                  : `https://${link}`;
                return (
                  <div key={key}>
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary rounded-3 p-3 d-flex align-items-center gap-3"
                      style={{ borderColor: color + "30" }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = color + "10";
                        e.target.style.borderColor = color;
                        e.target.style.color = color;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "";
                        e.target.style.borderColor = color + "30";
                        e.target.style.color = "";
                      }}
                    >
                      <i className={icon} style={{ color }}></i>
                    </a>
                  </div>
                );
              })}
              {socialLinks.every(({ key }) => !vendor[key]) && (
                <div className="text-center py-4 w-100">
                  <i className="fas fa-link text-muted mb-2"></i>
                  <p className="text-muted mb-0">No social links added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
