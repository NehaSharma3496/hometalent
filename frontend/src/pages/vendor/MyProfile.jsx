import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendorDetails, GetCategories } from "../../Services/vendor/Vendor";

export default function MyProfile() {
  const [vendor, setVendor] = useState(null);
  const [category, setCategory] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false); // 🔹 Toggle for Read More
  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");

  const fetchVendor = async () => {
    try {
      const res = await GetVendorDetails(token, vendorId);
      if (res?.data?.user) {
        setVendor(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await GetCategories(token);
      setCategory(res?.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const getCategoryNameById = (id) => {
    const cat = category.find((c) => String(c.id) === String(id));
    return cat ? cat.name : "Not provided";
  };

  useEffect(() => {
    if (token && vendorId) {
      fetchVendor();
      fetchCategory();
    }
  }, [token, vendorId]);

  if (!vendor) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h5 className="text-muted">Loading Your Profile...</h5>
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
    { label: "Price Range", value: vendor.price_range, icon: "fas fa-inr" },
    { label: "Experience Since", value: vendor.experience_since, icon: "fas fa-calendar-alt" },
    { label: "Pin Code", value: vendor.pin_code, icon: "fas fa-map-marker-alt" },
    { label: "Category Name", value:vendor.category_name, icon: "fas fa-tags" },
  ];

  const maxLength = 150;
  const longDescription = vendor.long_description || "";
  const displayText =
    !showFullDescription && longDescription.length > maxLength
      ? longDescription.substring(0, maxLength) + "..."
      : longDescription;

  return (
    <div className="page-content container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4 flex-wrap">
        <div className="d-flex align-items-center">
          <Link to="/vendor/dashboard" className="me-2 text-decoration-none text-dark">
            <i className="fa fa-arrow-left"></i>
          </Link>
          <h5 className="mb-0 fw-bold">My Profile</h5>
        </div>
        <Link to="/vendor/updateprofile" className="btn btn-primary btn-sm ms-md-3 mt-2 mt-md-0">
          <i className="fa fa-edit me-1"></i> Update Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden profile-card">
        <div className="d-flex justify-content-between align-items-center p-4 flex-wrap profile-header">
          {/* Left Side - Image + Info */}
          <div className="d-flex align-items-center text-center text-md-start flex-wrap">
            <img
              src={vendor.image || "/no-image.png"}
              alt="Vendor"
              className="rounded-circle border border-3 border-white shadow me-3 mb-3 mb-md-0"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div>
              <h3 className="fw-bold mb-1">{vendor.owner_name}</h3>
              {vendor.experience_since && (
                <p className="text-muted mb-0">
                  <i className="fas fa-calendar-alt me-1"></i> Since {vendor.experience_since}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Button */}
          <Link to="/vendor/mypackages" className="btn btn-outline-primary btn-sm mt-3 mt-md-0">
            <i className="fas fa-box-open me-1"></i> My Packages
          </Link>
        </div>


        {/* Contact Information */}
        <div className="card-body p-3 p-md-4">
          <h5 className="mb-3">
            <i className="fas fa-info-circle text-primary me-2"></i> Contact Information
          </h5>
          <div className="row g-3">
            {profileFields.map(({ label, value, icon }, i) => (
              <div key={i} className="col-lg-6 col-12">
                <div className="p-3 border rounded-3 bg-light h-100 w-100">
                  <div className="d-flex align-items-center mb-2">
                    <i className={`${icon} text-primary me-2`}></i>
                    <strong>{label}</strong>
                  </div>
                  <div>{value || "Not provided"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* About Section */}
          {(vendor.short_description || vendor.long_description) && (
            <div className="mt-4">
              <h5 className="mb-3">
                <i className="fas fa-file-alt text-info me-2"></i> About
              </h5>
              <div className="row">
                {vendor.short_description && (
                  <div className="col-md-6 col-12 mb-3">
                    <div className="bg-light p-3 rounded-3 h-100">
                      <h6 className="text-primary">Short Description</h6>
                      <p className="mb-0">{vendor.short_description}</p>
                    </div>
                  </div>
                )}
                {vendor.long_description && (
                  <div className="col-md-6 col-12 mb-3">
                    <div className="bg-light p-3 rounded-3 h-100 position-relative">
                      <h6 className="text-primary">Long Description</h6>


                      <p className="mb-0">
                        {showFullDescription
                          ? vendor.long_description
                          : vendor.long_description.slice(0, 120) + (vendor.long_description.length > 120 ? "..." : "")}
                      </p>


                      {vendor.long_description.length > 120 && (
                        <button
                          className="btn-readmore mt-2"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                          {showFullDescription ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="mt-4">
            <h5 className="mb-3">Social Media & Links</h5>
            <div className="d-flex flex-wrap gap-2">
              {socialLinks.map(({ key, icon, color }) => {
                const link = vendor[key];
                if (!link) return null;
                const fullUrl = link.startsWith("http") ? link : `https://${link}`;
                return (
                  <a
                    key={key}
                    href={fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-light border d-flex align-items-center gap-2 px-3 py-2"
                    style={{ color }}
                  >
                    <i className={icon}></i>
                  </a>
                );
              })}
            </div>
            {socialLinks.every(({ key }) => !vendor[key]) && (
              <p className="text-muted mt-3 text-center">No social links added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
