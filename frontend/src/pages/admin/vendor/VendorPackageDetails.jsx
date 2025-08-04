import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import DataTable from "react-data-table-component";
import { Link, useLocation } from "react-router-dom";
import { ExtendPackage } from "../../../Services/admin/Admin";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function VendorPackageDetails() {
  const [currentPackages, setCurrentPackages] = useState([]);
  const [expiredPackages, setExpiredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCurrent, setSearchCurrent] = useState("");
  const [searchExpired, setSearchExpired] = useState("");
  const location = useLocation();
  const vendorId = location.state?.vendorId;
  const [extendDays, setExtendDays] = useState("");
  const [latestPackageId, setLatestPackageId] = useState(null);

  const token = localStorage.getItem("token");

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (endDateStr) => {
    const today = new Date();
    const endDate = new Date(endDateStr);
    return endDate < today;
  };

  const fetchPackages = async () => {
    try {
      const res = await getVendorPackageHistory(token, vendorId);
      const packages = res?.data || [];

      const current = [];
      const expired = [];

      packages.forEach((pkg) => {
        if (isExpired(pkg.end_date)) {
          expired.push(pkg);
        } else {
          current.push(pkg);
        }
      });

      setCurrentPackages(current);
      setExpiredPackages(expired);

      const sorted = [...current].sort(
        (a, b) => new Date(b.end_date) - new Date(a.end_date)
      );
      setLatestPackageId(sorted[0]?.id || null);
    } catch (error) {
      console.error("Failed to load packages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && vendorId) fetchPackages();
  }, [token, vendorId]);

  const handleExtendPackage = async (currentEndDateStr) => {
    if (!extendDays) {
      return Swal.fire("Invalid", "Please select a date.", "warning");
    }

    const currentEndDate = new Date(currentEndDateStr);
    const selectedDate = new Date(extendDays);
    const extraDays = Math.ceil(
      (selectedDate - currentEndDate) / (1000 * 60 * 60 * 24)
    );

    if (isNaN(extraDays) || extraDays <= 0) {
      return Swal.fire(
        "Invalid",
        "Select a date after current end date.",
        "warning"
      );
    }

    // 🔔 Confirmation popup before proceeding
    const confirm = await Swal.fire({
      title: "Are you sure?",
      html: `You are about to extend the package by <strong>${extraDays} day(s)</strong> until <strong>${selectedDate.toLocaleDateString(
        "en-IN"
      )}</strong>.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, extend it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await ExtendPackage(token, {
        id: latestPackageId,
        extra_days: extraDays,
      });

      if (response?.status === true || response?.status === "true") {
        Swal.fire("Extended!", "Package extended successfully.", "success");
        setExtendDays("");
        fetchPackages();
      } else {
        Swal.fire("Failed", response?.message || "Extension failed.", "error");
      }
    } catch (err) {
      console.error("Extension failed:", err);
      Swal.fire("Error", "Failed to extend package.", "error");
    }
  };

  const exportToExcel = (data, type) => {
    const exportData = data.map((pkg, index) => ({
      "S.No": index + 1,
      "Package Name": pkg?.Package?.name || "N/A",
      "Start Date": formatDate(pkg.start_date),
      "End Date": formatDate(pkg.end_date),
      Amount: pkg?.Package?.price ? `₹${pkg.Package.price}` : "N/A",
      "Payment Status": pkg.payment_status || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${type} Packages`);
    XLSX.writeFile(workbook, `${type}_Packages.xlsx`);
  };

  const commonColumns = () => [
    {
      name: "S.No",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Package Name",
      selector: (row) => row?.Package.name || "N/A",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => formatDate(row.start_date),
    },
    {
      name: "End Date",
      selector: (row) => formatDate(row.end_date),
    },
    {
      name: "Amount",
      selector: (row) => `₹${row?.Package.price}`,
    },
    {
      name: "Payment Status",
      selector: (row) => row.payment_status,
    },
    {
      name: "Actions",
      minWidth: "240px",
      cell: (row) => {
        if (row.id !== latestPackageId)
          return <span className="text-muted">—</span>;

        return (
          <div className="d-flex flex-column flex-md-row align-items-start gap-2">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "180px" }}
              min={row.end_date?.split("T")[0]}
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
            />
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleExtendPackage(row.end_date)}
            >
              Extend
            </button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "280px",
    },
  ];

  const filterData = (data, query) => {
    if (!query.trim()) return data;
    return data.filter((item) =>
      item?.Package?.name?.toLowerCase().includes(query.toLowerCase())
    );
  };

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
          <h5 className="text-muted">Loading Your Packages...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/dashboard" className="me-2">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0">My Packages</h5>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <div className="text-end mb-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() =>
                exportToExcel(
                  filterData(currentPackages, searchCurrent),
                  "Current"
                )
              }
            >
              <i className="fa fa-file-excel me-1"></i> Download Current
              Packages
            </button>
          </div>
          <div className="text-end mb-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={() =>
                exportToExcel(
                  filterData(expiredPackages, searchExpired),
                  "Expired"
                )
              }
            >
              <i className="fa fa-file-excel me-1"></i> Download Expired
              Packages
            </button>
          </div>
        </div>
      </div>

      {/* Current Packages */}
      <div className="mb-5">
        <h5 className="mb-3 text-success">
          <i className="fas fa-box-open me-2"></i>Current Running Packages
        </h5>

        <div
          className="d-flex align-items-center border rounded px-2 mb-3"
          style={{ maxWidth: "300px" }}
        >
          <i className="ri-search-line me-2 mx-2 text-muted" />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Search by package name..."
            value={searchCurrent}
            onChange={(e) => setSearchCurrent(e.target.value)}
          />
          {searchCurrent && (
            <button
              className="btn btn-sm btn-light border-0"
              onClick={() => setSearchCurrent("")}
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        <DataTable
          columns={commonColumns()}
          data={filterData(currentPackages, searchCurrent)}
          pagination
        />
      </div>

      {/* Expired Packages */}
      <div>
        <h5 className="mb-3 text-danger">
          <i className="fas fa-times-circle me-2"></i>Expired Packages
        </h5>

        <div
          className="d-flex align-items-center border rounded px-2 mb-3"
          style={{ maxWidth: "300px" }}
        >
          <i className="ri-search-line me-2 mx-2 text-muted" />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Search by package name..."
            value={searchExpired}
            onChange={(e) => setSearchExpired(e.target.value)}
          />
          {searchExpired && (
            <button
              className="btn btn-sm btn-light border-0"
              onClick={() => setSearchExpired("")}
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        <DataTable
          columns={commonColumns()}
          data={filterData(expiredPackages, searchExpired)}
          pagination
        />
      </div>
    </div>
  );
}
