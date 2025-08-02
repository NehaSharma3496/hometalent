import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendoreList } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";

export default function ApprovedVendors() {
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchApprovedVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetVendoreList(token, page, limit);
      if (res?.data && res?.pagination) {
        const approved = res.data?.filter(
          (vendor) => vendor.approval_status === 1
        );
        setApprovedVendors(approved || []);

        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedVendors(currentPage, perPage);
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const exportData = filteredApprovedVendors.map((row, index) => ({
      "S.No": (currentPage - 1) * perPage + index + 1,
      "Owner Name": row.owner_name || "",
      Email: row.email || "",
      Categories: Array.isArray(row.category_names)
        ? row.category_names.join(", ")
        : row.category_names || "",
      Phone: row.phone || "",
      "Price Range": row.price_range || "",
      Experience: row.experience_since || "",
      Image: row.image ? "Available" : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Vendors");
    XLSX.writeFile(workbook, "Approved_Vendor_List.xlsx");
  };

  const filteredApprovedVendors = approvedVendors.filter((vendor) =>
    vendor.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
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
            <Datatable
              columns={columns}
              data={filteredApprovedVendors}
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
    </div>
  );
}
