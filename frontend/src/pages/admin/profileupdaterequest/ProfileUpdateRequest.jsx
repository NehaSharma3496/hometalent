import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import {
  GetProfileUpdateRequests,
  ProcessProfileUpdateRequest,
} from "../../../Services/admin/Admin";

export default function ProfileUpdateRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const page = 1;
      const limit = 100;

      const res = await GetProfileUpdateRequests(
        token,
        statusFilter,
        page,
        limit
      );

      const data = res?.data?.requests || [];
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

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
        const adminId = localStorage.getItem("userId"); // ensure this exists

        const res = await ProcessProfileUpdateRequest(
          row.id,
          action,
          `${action}d by admin`,
          adminId,
          token
        );

        if (res?.status) {
          Swal.fire("Success", res.msg || "Request processed", "success");
          fetchRequests(); // refresh list
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
      name: "Vendor Name",
      selector: (row) => row.vendor?.owner_name || "N/A",
      sortable: true,
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
      cell: (row) => (
        <div className="d-flex">
          <button
            className="btn action-btn btn-warning me-2"
            onClick={() => (window.location.href = `/admin/vendor/${row.id}`)}
            title="View"
          >
            <i className="fa-regular fa-eye"></i>
          </button>
          {row.status === "pending" && (
            <>
              <button
                className="btn btn-success btn-sm me-1"
                onClick={() => handleAction(row, "approve")}
                title="Approve"
              >
                <i className="fa fa-check"></i>
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleAction(row, "reject")}
                title="Reject"
              >
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-3">
        <Link to="/admin/dashboard">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading">Profile Update Requests</h2>
      </div>
      <div className="card">
        <div className="row mb-3">
          <div className="col-md-3">
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
          data={requests}
          pagination
          highlightOnHover
          striped
          noDataComponent="No profile update requests found."
        />
      </div>
    </div>
  );
}
