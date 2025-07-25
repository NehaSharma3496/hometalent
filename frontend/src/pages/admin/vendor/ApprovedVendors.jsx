import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendoreList } from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";
import * as XLSX from "xlsx";

export default function ApprovedVendors() {
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(approvedVendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Vendor");

    XLSX.writeFile(workbook, "Approved vendor List.xlsx");
  };

  const filteredApprovedVendors = approvedVendors.filter((vendor) =>
    vendor.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "70px",
    },
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
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>

      <div className="card">
        <div className="col-md-4">
          <div className="d-flex align-items-center border rounded px-2">
            <i className="ri-search-line me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search by vendor name..."
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
        </div>
        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={filteredApprovedVendors} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
