import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendorDetails } from "../../Services/vendor/Vendor";

export default function MyProfile() {
  const [vendor, setVendor] = useState(null);
  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");

  const fetchVendor = async () => {
    try {
      const res = await GetVendorDetails(token, vendorId);
      console.log("Vendor API Response:", res);
      if (res?.data) {
        setVendor(res.data);
      } else {
        console.error("Invalid response structure", res);
      }
    } catch (err) {
      console.error("Error fetching vendor:", err);
    }
  };

  useEffect(() => {
    if (token && vendorId) {
      fetchVendor();
    } else {
      console.warn("Missing token or vendor ID");
    }
  }, [token, vendorId]);

  if (!vendor) {
    return <div className="text-center py-5">Loading Your Profile...</div>;
  }

  return (
    <div className="page-content container-fluid">
      <div className="add-page-heading-div mb-3 d-flex align-items-center gap-2">
        <Link to="/dashboard">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading mb-0">
          Vendor Profile: {vendor.owner_name}
        </h2>
      </div>

      <div className="card p-4 shadow-sm rounded-4">
        <div className="row">
          <div className="col-md-3 text-center">
            <img
              src={vendor.image || "/no-image.png"}
              alt="Vendor"
              className="img-fluid rounded-3 shadow"
              style={{ maxWidth: "220px" }}
            />
            <h5 className="mt-3">{vendor.owner_name}</h5>
            <span className="badge bg-primary">{vendor.profile_name}</span>
          </div>

          <div className="col-md-9">
            <div className="row g-3">
              {[
                ["Email", vendor.email],
                ["Phone", vendor.phone],
                ["Price Range", vendor.price_range],
                ["Experience Since", vendor.experience_since],
                ["Pin Code", vendor.pin_code],
                ["Category IDs", vendor.category_id],
              ].map(([label, value], i) => (
                <div key={i} className="col-md-6">
                  <label className="fw-semibold">{label}</label>
                  <div>{value || "N/A"}</div>
                </div>
              ))}

              <div className="col-12">
                <label className="fw-semibold">Short Description</label>
                <div>{vendor.short_description || "N/A"}</div>
              </div>
              <div className="col-12">
                <label className="fw-semibold">Long Description</label>
                <div>{vendor.long_description || "N/A"}</div>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <h5 className="mb-3">🔗 Social Links</h5>
              <div className="d-flex flex-wrap gap-3">
                {vendor.facebook_link && (
                  <a href={vendor.facebook_link} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                )}
                {vendor.instagram_link && (
                  <a href={vendor.instagram_link} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                )}
                {vendor.twitter_link && (
                  <a href={vendor.twitter_link} target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                )}
                {vendor.linkedin_link && (
                  <a href={vendor.linkedin_link} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}
                {vendor.youtube_link && (
                  <a href={vendor.youtube_link} target="_blank" rel="noreferrer">
                    YouTube
                  </a>
                )}
                {vendor.website_link && (
                  <a href={vendor.website_link} target="_blank" rel="noreferrer">
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* ✅ Update Button */}
            <div className="text-end mt-4">
              <Link to="/vendor/updateprofile" className="btn btn-warning">
                <i className="fa fa-edit me-2"></i>Request Profile Update
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
