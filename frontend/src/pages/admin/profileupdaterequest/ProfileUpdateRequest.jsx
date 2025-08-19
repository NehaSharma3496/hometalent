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
  const [allRequests, setAllRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchRequests = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetProfileUpdateRequests(
        token,
        statusFilter,
        page,
        limit
      );
      if (res?.data?.requests && typeof res.data.total === "number") {
        setRequests(res.data.requests);
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

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allRequests = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetProfileUpdateRequests(
          token,
          statusFilter,
          page,
          limit
        );

        if (res?.data?.requests && typeof res.data.total === "number") {
          allRequests = [...allRequests, ...res.data.requests];
          totalPages = Math.ceil(res.data.total / limit);
        } else {
          throw new Error("Invalid response format");
        }

        page++;
      }

      if (!allRequests.length) {
        return Swal.fire(
          "No Data",
          "No profile update requests found to export",
          "info"
        );
      }

      const exportData = allRequests.map((row, index) => ({
        "S.No": index + 1,
        "Vendor Name": row.vendor?.owner_name || "N/A",
        Email: row.vendor?.email || "N/A",
        Phone: row.vendor?.phone || "N/A",
        Status:
          row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Profile Update Requests"
      );

      XLSX.writeFile(workbook, "Profile_Update_Requests.xlsx");

      Swal.fire(
        "Success",
        "Profile update requests downloaded successfully",
        "success"
      );
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export profile update requests", "error");
    }
  };

  const fetchAllRequests = async () => {
    const token = localStorage.getItem("token");
    const filter = statusFilter === "all" ? "" : statusFilter;

    let full = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await GetProfileUpdateRequests(token, filter, page, limit);
      full = [...full, ...res.data.requests];
      totalPages = Math.ceil(res.data.total / limit);
      page++;
    }

    setAllRequests(full);
  };

  const filteredRequests = searchText
    ? allRequests.filter((r) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          r.vendor?.owner_name?.toLowerCase().includes(lowerSearch) ||
          r.vendor?.email?.toLowerCase().includes(lowerSearch) ||
          r.vendor?.phone?.toLowerCase().includes(lowerSearch)
        );
      })
    : requests;

  useEffect(() => {
    fetchRequests(currentPage, perPage);
    fetchAllRequests();
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
      width: "250px",
    },
    {
      name: "Phone",
      selector: (row) => row.vendor?.phone || "N/A",
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        let badgeClass = "";
        if (row.status === "pending") {
          badgeClass = "bg-warning text-dark";
        } else if (row.status === "approved") {
          badgeClass = "bg-success";
        } else if (row.status === "rejected") {
          badgeClass = "bg-danger";
        } else {
          badgeClass = "bg-secondary";
        }

        return (
          <span className={`badge fs-6 ${badgeClass}`}>
            {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
          </span>
        );
      },
      sortable: true,
      width: "120px",
    },

    {
      name: "View",

      cell: (row) => {
        return (
          <button
            className="btn btn-warning btn-sm"
            title="View"
            onClick={() =>
              navigate(`/admin/profileupdaterequest/viewprofilechanges`, {
                state: {
                  requestId: row.id,
                  requestData: row,
                  adminId: localStorage.getItem("userId"),
                  readonly: row.status !== "pending",
                },
              })
            }
          >
            <i className="fa-regular fa-eye"></i>
          </button>
        );
      },
      width: "100px",
    },

    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      width: "100px",
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
