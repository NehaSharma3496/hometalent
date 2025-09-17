import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendorsByPackageStatus } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function SubscribedVendors() {
  const [vendors, setVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch vendors
  const fetchVendors = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await GetVendorsByPackageStatus(token, "active", page, limit);
      const { data, count } = res || {};
      setVendors(data || []);
      setTotalRows(count || 0);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, perPage);
  }, [currentPage, perPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // Search & filter
  const filteredVendors = vendors.filter((vendor) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      vendor.owner_name?.toLowerCase().includes(lowerSearch) ||
      vendor.email?.toLowerCase().includes(lowerSearch) ||
      vendor.phone?.toLowerCase().includes(lowerSearch) ||
      vendor.price_range?.toLowerCase().includes(lowerSearch) ||
      vendor.experience_since?.toLowerCase().includes(lowerSearch) ||
      vendor.Category.name?.toLowerCase().includes(lowerSearch) ||
      vendor.State.name?.toLowerCase().includes(lowerSearch) ||
      vendor.City.name?.toLowerCase().includes(lowerSearch)
    );
  });

  // Export to Excel
  const exportToExcel = () => {
    try {
      const exportData = vendors.map((row, index) => ({
        "S.No": index + 1,
        "Owner Name": row.owner_name || "N/A",
        Email: row.email || "N/A",
        Category: row.category_name || "N/A",
        Phone: row.phone || "N/A",
        // "Price Range": row.price_range || "N/A",
        // Experience: row.experience_since || "N/A",
        Date: row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribed Vendors");
      XLSX.writeFile(workbook, "Subscribed_Vendor_List.xlsx");
    } catch (err) {
      console.error("Error exporting vendors:", err);
      Swal.fire("Error", "Failed to export vendors", "error");
    }
  };

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, width: "60px" },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name || "—",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
      sortable: true,
      width: "230px",
    },
    { name: "Category Name", selector: (row) => row.Category.name || "-" },
    { name: "Phone", selector: (row) => row.phone || "—", sortable: true },
    { name: "State", selector: (row) => row.State.name || "—", sortable: true },
    { name: "City", selector: (row) => row.City.name || "—", sortable: true },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Subscribed Vendors</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>

      <div className="card table-padding">
        <div className="col-md-4 mb-3">
          <div className="d-flex align-items-center border rounded px-2">
            <i className="ri-search-line me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search by vendor..."
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

        <div className="col-md-12">
          <Datatable
            columns={columns}
            data={filteredVendors}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
