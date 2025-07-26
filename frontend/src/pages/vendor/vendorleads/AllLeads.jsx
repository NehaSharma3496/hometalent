import React, { useEffect, useState } from "react";
import { GetAllVendorLeads } from "../../../Services/vendor/Vendor";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import * as XLSX from "xlsx";

export default function AllLeads() {
  const [leads, setAllLeads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchAllLeads = async () => {
    try {
      const response = await GetAllVendorLeads(token, userId);
      setAllLeads(response?.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(workbook, "vendor-leads.xlsx");
  };

  useEffect(() => {
    if (userId) {
      fetchAllLeads();
    }
  }, [userId]);

  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "70px",
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
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
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

        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>
      <div className="card p-4">
        {/* 🔍 Styled Search Bar */}
        <div
          className="d-flex align-items-center border rounded px-2 "
          style={{ maxWidth: "250px" }}
        >
          <i className="ri-search-line me-2 mx-5 text-muted" />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Search by client name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              className="btn btn-sm btn-light border-0"
              onClick={() => setSearchText("")}
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={filteredLeads} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
