import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Datatable from "react-data-table-component";
import { GetProfileUpdateRequests } from "../../../Services/admin/Admin";
import * as XLSX from "xlsx";

export default function ProfileUpdateRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

 const fetchRequests = async (page, limit) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await GetProfileUpdateRequests(token, statusFilter, page, limit);
    console.log("API Response:", res);

    // ✅ FIXED condition
    if (res?.data?.requests && typeof res.data.total === "number") {
      setRequests(res.data.requests);
      console.log("Fetched Requests:", res.data.requests);

      // ✅ Use total from inside data
      setTotalRows(res.data.total);
    } else {
      throw new Error("Invalid response format");
    }
  } catch (err) {
    console.error("Error fetching vendors:", err);
    Swal.fire("Error", "Could not load vendor list", "error");
  } finally {
    setLoading(false);
  }
};


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(requests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Request");

    XLSX.writeFile(workbook, "vendor-update-profile-request.xlsx");
  };

  const filteredRequests = requests.filter((request) =>
    request.vendor?.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchRequests(currentPage, perPage);
  }, [statusFilter, currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor?.owner_name || "N/A",
      sortable: true,
      width: "145px",
    },
    {
      name: "Email",
      selector: (row) => row.vendor?.email || "N/A",
    },
    {
      name: "Phone",
      selector: (row) => row.vendor?.phone || "N/A",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "View",
      cell: (row) => (
        <div className="d-flex align-items-center gap-9">
          <button
            className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() =>
              navigate(`/admin/profileupdaterequest/viewprofilechanges`, {
                state: {
                  requestData: row,
                  adminId: localStorage.getItem("userId"),
                },
              })
            }
            title="View"
          >
            <i className="fa-regular fa-eye"></i>
          </button>
        </div>
      ),
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
            <h2 className="add-page-heading">Profile Update Requests</h2>
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
        <div className="row mb-3 justify-content-between align-items-center">
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

          <div className="col-md-3 text-end">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <Datatable
          columns={columns}
          data={filteredRequests}
          highlightOnHover
          striped
          noDataComponent="No profile update requests found."
          // progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
        />
      </div>
    </div>
  );
}
