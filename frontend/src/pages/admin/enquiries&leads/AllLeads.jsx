import React, { useEffect, useState } from "react";
import { GetAllLeads } from "../../../Services/admin/Admin";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";

export default function AllLeads() {
  const [leads, setAllLeads] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAllLeads = async () => {
    try {
      const response = await GetAllLeads(token);
      setAllLeads(response?.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchAllLeads();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "70px",
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor.owner_name,
      sortable: true,
    },
    {
      name: "Vendor Phone",
      selector: (row) => row.vendor.phone,
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: " Client Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Client Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Client Query",
      selector: (row) => row.query,
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
            <h2 className="add-page-heading">All Leads</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={leads} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
