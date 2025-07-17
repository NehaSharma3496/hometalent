import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetPendingVendoreList } from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";

export default function PendingVendor() {
  const [pendingvendors, setPendingVendors] = React.useState([]);

  const fetchBlockedVendors = async () => {
    try {
      const response = await GetPendingVendoreList();
      setPendingVendors(response.data);
      console.log("Vendor list", response.data);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    fetchBlockedVendors();
  }, []);

  const columns = [
    {
      name: "Sr.No.",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Category Names",
      selector: (row) =>
        Array.isArray(row.category_names)
          ? row.category_names.join(", ")
          : row.category_names,
      sortable: true,
    },

    {
      name: "Profile Name",
      selector: (row) => row.profile_name,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Price Range",
      selector: (row) => row.price_range,
      sortable: true,
    },
    {
      name: "Short Description",
      selector: (row) => row.short_description,
      sortable: true,
    },

    {
      name: "Social Media Link",
      selector: (row) => row.social_media_link,
      sortable: true,
    },
    {
      name: "Pin Code",
      selector: (row) => row.tradingstatus,
      sortable: true,
    },
    {
      name: "Experience Since",
      selector: (row) => row.experience_since,
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Pending Vendors</h2>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={pendingvendors} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
