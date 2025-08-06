import React, { useEffect, useState } from "react";
import { GetExtendPackageHistory } from "../../../Services/admin/Admin";
import { useLocation, Link } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function ExtendPackageHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const location = useLocation();
  const vendor_id = location?.state?.vendor_id;

  useEffect(() => {
    const fetchData = async () => {
      if (!vendor_id) return;

      try {
        const res = await GetExtendPackageHistory(token, { vendor_id });
        if (res?.status) {
          setHistory(res.data);
        } else {
          console.error("Failed to fetch package history");
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendor_id, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Package Name",
      selector: (row) => row.packagelog?.name || "N/A",
      sortable: true,
    },
    {
      name: "Updated On",
      selector: (row) => formatDate(row.createdAt),
    },
    {
      name: "Extended Days",
      selector: (row) => `${row.details} Day(s)`,
    },
  ];

  const filteredData = history.filter((item) =>
    item.packagelog?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Extend History...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/vendor-packages" className="me-2">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0">Extend Package History</h5>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <div
            className="d-flex align-items-center border rounded px-2 ms-auto"
            style={{ maxWidth: "300px" }}
          >
            <i className="ri-search-line me-2 mx-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search by package name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="btn btn-sm btn-light border-0"
                onClick={() => setSearch("")}
              >
                <i className="ri-close-line" />
              </button>
            )}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        noDataComponent={
          <div className="text-muted py-3">No history found</div>
        }
      />
    </div>
  );
}
