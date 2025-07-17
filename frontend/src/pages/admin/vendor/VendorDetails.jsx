import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  const fetchVendor = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8888/admin/user-profile/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      setVendor(res.data?.data);
    } catch (err) {
      console.error("Error fetching vendor:", err);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  if (!vendor) return <div className="text-center py-5">Loading vendor details...</div>;

  return (
    <div className="page-content container-fluid">
  <div className="add-page-heading-div mb-3">
        <Link to="/admin/vendors">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading">Vendor Profile: {vendor.owner_name}</h2>
      </div>

      <div className="card p-4 shadow-sm rounded-4">
        <div className="row">
          <div className="col-md-3 text-center">
            <img
              src={vendor.image || "/no-image.png"}
              alt="Vendor"
              className="img-fluid rounded-3 shadow"
              style={{ width: "100%", maxWidth: "220px", height: "auto" }}
            />
            <h5 className="mt-3">{vendor.owner_name}</h5>
            <span className="badge bg-primary">{vendor.profile_name}</span>
          </div>

          <div className="col-md-9">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-semibold">Email</label>
                <div>{vendor.email}</div>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Phone</label>
                <div>{vendor.phone}</div>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Price Range</label>
                <div>{vendor.price_range}</div>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Experience Since</label>
                <div>{vendor.experience_since}</div>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Pin Code</label>
                <div>{vendor.pin_code}</div>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Category IDs</label>
                <div>{vendor.category_id}</div>
              </div>
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
                {vendor.facebook_link && <a href={vendor.facebook_link} target="_blank" rel="noreferrer">Facebook</a>}
                {vendor.instagram_link && <a href={vendor.instagram_link} target="_blank" rel="noreferrer">Instagram</a>}
                {vendor.twitter_link && <a href={vendor.twitter_link} target="_blank" rel="noreferrer">Twitter</a>}
                {vendor.linkedin_link && <a href={vendor.linkedin_link} target="_blank" rel="noreferrer">LinkedIn</a>}
                {vendor.youtube_link && <a href={vendor.youtube_link} target="_blank" rel="noreferrer">YouTube</a>}
                {vendor.website_link && <a href={vendor.website_link} target="_blank" rel="noreferrer">Website</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
