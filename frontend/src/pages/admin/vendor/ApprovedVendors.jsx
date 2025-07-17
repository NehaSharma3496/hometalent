import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendoreList } from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";

export default function ApprovedVendors() {
  const [approvedVendors, setApprovedVendors] = useState([]);

  const fetchApprovedVendors = async () => {
    try {
      const response = await GetVendoreList();
      const approved = response.data?.filter((vendor) => vendor.status === 1);
      setApprovedVendors(approved || []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  useEffect(() => {
    fetchApprovedVendors();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Owner Name", selector: (row) => row.owner_name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Categories",
      selector: (row) => row.category_names.join(", "),
      sortable: false,
    },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    { name: "Price Range", selector: (row) => row.price_range, sortable: true },
    {
      name: "Experience",
      selector: (row) => row.experience_since,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image,
      cell: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.profile_name}
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Approved Vendors</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div className="col-md-12">
            <Datatable
              columns={columns}
              data={approvedVendors}
              pagination
            
            />
          </div>
        </div>
      </div>
    </div>
  );
}
