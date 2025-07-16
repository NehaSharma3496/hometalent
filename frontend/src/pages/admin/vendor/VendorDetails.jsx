import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function VendorDetails() {
  const { id } = useParams(); // from URL
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
      console.error("Failed to load vendor:", err);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  if (!vendor) return <div>Loading...</div>;

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-3">
        <Link to="/admin/vendors">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading">Vendor Profile: {vendor.owner_name}</h2>
      </div>

      <div className="card p-3">
        <p><b>Profile Name:</b> {vendor.profile_name}</p>
        <p><b>Email:</b> {vendor.email}</p>
        <p><b>Phone:</b> {vendor.phone}</p>
        <p><b>Price Range:</b> {vendor.price_range}</p>
        <p><b>Experience Since:</b> {vendor.experience_since}</p>
        <p><b>Short Description:</b> {vendor.short_description}</p>

        {vendor.image && (
          <div>
            <b>Image:</b><br />
            <img
              src={vendor.image}
              alt="Vendor"
              style={{ width: "150px", borderRadius: "8px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
