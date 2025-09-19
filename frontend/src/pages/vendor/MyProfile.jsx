import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { GetVendorDetails, GetCategories } from "../../Services/vendor/Vendor";

export default function MyProfile() {
  const [vendor, setVendor] = useState(null);
  const [category, setCategory] = useState([]);
  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (token && vendorId) {
      fetchVendor();
      fetchCategory();
    }
  }, [token, vendorId]);

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
    {
      label: "Category Name",
      value: vendor.category_name,
      icon: "fas fa-tags",
    },
    { label: "State", value: vendor.State?.name, icon: "fas fa-map" },
    { label: "City", value: vendor.City?.name, icon: "fas fa-city" },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-1">
        <div className="col-md-6 mb-2">
          <div className="add-page-heading-div">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h5 className="add-page-heading mb-0">My Profile</h5>
          </div>
        </div>
        <div className="col-md-6 text-md-end">
          <Link to="/vendor/updateprofile" className="btn btn-primary btn-sm">
            <i className="fa fa-edit me-1"></i> Update Profile
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="p-4 position-relative">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="position-relative">
                <img
                  src={vendor.image || "/no-image.png"}
                  alt="Vendor"
                  className="rounded-circle border border-3 border-white shadow"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  onClick={() => setShowImage(true)}
                />
              </div>
            </div>
            <div className="col">
              <h3 className="mb-2 fs-4 fw-bold">{vendor.owner_name}</h3>
              <div className="d-flex align-items-center gap-3 mb-2">
                {(vendor.profile_name || vendor.owner_name) && (
                  <span className="badge bg-primary">
                    {vendor.profile_name || vendor.owner_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          {/* <div className="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2">
            <Link
              to="/vendor/mypackages"
              className="btn btn-outline-primary btn-sm shadow-sm"
            >
              <i className="fas fa-box-open me-1"></i> My Packages
            </Link>
          </div> */}

 <div className="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2">
            <Link
              to="/vendor/mypackages"
              className="btn btn-outline-primary btn-sm shadow-sm"
              state={{ vendorId: vendorId }}
            >
              <i className="fas fa-box-open me-1"></i>
              My Packages
            </Link>

            <Link
              to={`/vendor/gallery`}
              className="btn btn-outline-primary btn-sm shadow-sm d-flex align-items-center justify-content-start gap-1"
            >
              <i className="fas fa-images"></i>
              <span>Gallery</span>
            </Link>

            <Link
              to={`/vendor/leads/all`}
              className="btn btn-outline-primary btn-sm shadow-sm d-flex align-items-center justify-content-start gap-1"
              state={{ vendorId: vendorId }}
            >
              <i className="fas fa-user-friends"></i>
              <span>Leads</span>
            </Link>
          </div>


        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-lg-8">
              <h5 className="mb-4 d-flex align-items-center fs-6">
                <i className="fas fa-info-circle text-primary me-2 fs-6"></i>
                Contact Information
              </h5>
              <div className="row g-3">
                {profileFields?.map(({ label, value, icon }, i) => (
                  <div key={i} className="col-md-6 mt-2">
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

          {/* About Section */}
          {vendor.long_description && (
            <div className="mt-4">
              <h5 className="mb-3 d-flex align-items-center fs-6">
                <i className="fas fa-file-alt text-info me-2"></i>
                About
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="bg-light p-4 rounded-3 h-100">
                    <h6 className="text-primary mb-2 fs-6"> Description</h6>
                    <p className="mb-0 lh-lg">{vendor.long_description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Links */}
          <div className="mt-4">
            <h5 className="mb-4 d-flex align-items-center fs-6">
              Social Media & Links
            </h5>
            <div className="d-flex flex-wrap gap-3">
              {socialLinks?.map(({ key, icon, color }) => {
                const link = vendor[key];
                if (!link) return null;
                const fullUrl = link.startsWith("http")
                  ? link
                  : `https://${link}`;
                return (
                  <a
                    key={key}
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

        {/* Profile image popup modal */}
        {showImage && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowImage(false)}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "100vh" }}
            >
              <div
                className="card rounded-pill shadow-lg border-0 overflow-hidden"
                style={{ maxWidth: "600px", width: "90%", background: "#fff" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-body p-0 d-flex justify-content-center align-items-center">
                  <img
                    src={vendor.image || "/no-image.png"}
                    alt="Vendor Large"
                    className="img-fluid"
                    style={{
                      maxHeight: "100vh",
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "50rem",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
