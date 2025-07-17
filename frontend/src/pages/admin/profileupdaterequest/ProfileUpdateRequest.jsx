import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import { GetProfileUpdateRequests } from "../../../Services/admin/Admin";

export default function ProfileUpdateRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const page = 1;
      const limit = 100;

      // Now use status as path param
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
        <button
          className="btn action-btn btn-warning me-1"
          onClick={() => (window.location.href = `/admin/vendor/${row.id}`)}
          title="View"
        >
          <i className="fa-regular fa-eye"></i>
        </button>
      ),
    },
  ];

  const viewDetails = (row) => {
    const requestData = row.request_data ? JSON.parse(row.request_data) : {};

    Swal.fire({
      title: row.vendor?.owner_name || "Request Details",
      html: `
        <p><b>Email:</b> ${row.vendor?.email}</p>
        <p><b>Phone:</b> ${row.vendor?.phone}</p>
        <p><b>Status:</b> ${row.status}</p>
        <hr />
        <p><b>Short Desc:</b> ${requestData.short_description || "N/A"}</p>
        <p><b>Price Range:</b> ${requestData.price_range || "N/A"}</p>
        <p><b>Experience Since:</b> ${requestData.experience_since || "N/A"}</p>
      `,
    });
  };

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-3">
        <Link to="//admin/dashboard">
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
