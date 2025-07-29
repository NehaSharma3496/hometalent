import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import {
  GetProfileUpdateRequests,
  ProcessProfileUpdateRequest,
} from "../../../Services/admin/Admin";
import * as XLSX from "xlsx";

export default function ProfileUpdateRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const page = 1;
      const limit = 10;

      const status = statusFilter;
      const res = await GetProfileUpdateRequests(token, status, page, limit);

      let data = [];

      if (res?.requests && Array.isArray(res.requests)) {
        data = res.requests;
      } else if (res?.data?.requests && Array.isArray(res.data.requests)) {
        data = res.data.requests;
      } else {
        console.warn("⚠️ Unexpected data format, forcing empty array");
      }

      setRequests(data);
    } catch (err) {
      console.error("❌ Failed to fetch requests:", err);
      setRequests([]);
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
    fetchRequests();
  }, [statusFilter]);

  const handleAction = async (row, action) => {
    const confirm = await Swal.fire({
      title: `${action === "approve" ? "Approve" : "Reject"} Request?`,
      text: `Are you sure you want to ${action} this profile update request?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("userId");

        const res = await ProcessProfileUpdateRequest(
          row.id,
          action,
          `${action}d by admin`,
          adminId,
          token
        );

        if (res?.status) {
          Swal.fire("Success", res.msg || "Request processed", "success");
          fetchRequests();
        } else {
          Swal.fire("Error", res?.msg || "Failed to process", "error");
        }
      } catch (err) {
        Swal.fire("Error", "API error occurred", "error");
        console.error("API Error:", err);
      }
    }
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
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
      name: "Actions",
      cell: (row) =>
        row.status === "pending" ? (
          <div className="d-flex gap-1">
            <button
              className="btn btn-success btn-sm d-flex align-items-center px-3"
              onClick={() => handleAction(row, "approve")}
              title="Approve"
              style={{ fontWeight: "500" }}
            >
              <i className="fa fa-check me-1"></i>
              Approve
            </button>
            <button
              className="btn btn-danger btn-sm d-flex align-items-center px-3"
              onClick={() => handleAction(row, "reject")}
              title="Reject"
              style={{ fontWeight: "500" }}
            >
              <i className="fa fa-times me-1"></i>
              Reject
            </button>
          </div>
        ) : (
          <span className="text-muted">No actions</span>
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
          pagination
          highlightOnHover
          striped
          noDataComponent="No profile update requests found."
        />
      </div>
    </div>
  );
}
