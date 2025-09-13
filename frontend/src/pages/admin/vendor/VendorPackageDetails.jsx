import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import {
  GetExtendPackageHistory,
  ExtendPackage,
} from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import { Link, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function VendorPackageDetails() {
  const [paginatedPackages, setPaginatedPackages] = useState([]);
  const [allPackagesForSearch, setAllPackagesForSearch] = useState([]);
  const [extensionMap, setExtensionMap] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [extendDays, setExtendDays] = useState("");
  const [latestPackageId, setLatestPackageId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [extensionHistory, setExtensionHistory] = useState([]);

  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(5);

  const token = localStorage.getItem("token");
  const location = useLocation();
  const vendorId = location.state?.vendorId;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isExpired = (endDateStr) => new Date(endDateStr) < new Date();

  // 📌 Fetch paginated packages
  const fetchPaginatedPackages = async (page, limit) => {
    setLoading(true);
    try {
      const res = await getVendorPackageHistory(token, vendorId, page, limit);
      if (res?.data && res?.pagination) {
        const enriched = res.data.map((pkg) => ({
          ...pkg,
          status: isExpired(pkg.end_date) ? "Expired" : "Active",
        }));
        setPaginatedPackages(enriched);
        setTotalRows(res.pagination.total_records);

        // ✅ Get latest package by end_date regardless of status
        const sorted = [...enriched].sort(
          (a, b) => new Date(b.end_date) - new Date(a.end_date)
        );
        setLatestPackageId(sorted[0]?.id || null);
      }
    } catch (err) {
      console.error("Fetch error", err);
      Swal.fire("Error", "Failed to load packages", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchExtensionHistory = async () => {
    try {
      const res = await GetExtendPackageHistory(token, { vendor_id: vendorId });
      if (res?.status && res?.data) {
        setExtensionHistory(res.data);
        setShowHistory(true); // Modal open hoga
      }
    } catch (err) {
      console.error("Failed to fetch extension history", err);
    }
  };

  // 📌 Fetch all data for search + export
  const fetchAllPackagesForSearch = async () => {
    try {
      let all = [];
      const limit = 100;
      let page = 1;

      const res = await getVendorPackageHistory(token, vendorId, page, limit);
      if (!res?.data?.length) return;

      all = [...res.data];
      const totalPages = Math.ceil(res.pagination.total_records / limit);

      for (page = 2; page <= totalPages; page++) {
        const more = await getVendorPackageHistory(
          token,
          vendorId,
          page,
          limit
        );
        if (more?.data?.length) {
          all = [...all, ...more.data];
        }
      }

      const today = new Date();
      const mapped = all.map((pkg) => ({
        ...pkg,
        status: new Date(pkg.end_date) >= today ? "Active" : "Expired",
      }));

      setAllPackagesForSearch(mapped);
    } catch (err) {
      console.error("Fetch all packages failed", err);
    }
  };

  // 📌 Fetch extension history aur map banate waqt
  const fetchExtensionMap = async () => {
    try {
      const res = await GetExtendPackageHistory(token, { vendor_id: vendorId });
      if (res?.status) {
        const map = {};
        res.data.forEach((item) => {
          if (item.request_id) {
            map[item.request_id] =
              (map[item.request_id] || 0) + parseInt(item.details || 0);
          }
        });
        setExtensionMap(map);
      }
    } catch (err) {
      console.error("Extension fetch error:", err);
    }
  };

  // 📌 Extend package
  const handleExtendPackage = async (row) => {
    if (!extendDays) {
      return Swal.fire("Invalid", "Please select a date.", "warning");
    }

    const currentEndDate = new Date(row.end_date);
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

    const confirm = await Swal.fire({
      title: "Are you sure?",
      html: `Extend <b>${
        row?.Package?.name
      }</b> by <strong>${extraDays} day(s)</strong> until <strong>${selectedDate.toLocaleDateString(
        "en-IN"
      )}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, extend it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await ExtendPackage(token, {
        id: row.id,
        extra_days: extraDays,
      });

      if (response?.status === true || response?.status === "true") {
        Swal.fire("Extended!", "Package extended successfully.", "success");
        setExtendDays("");
        fetchPaginatedPackages(currentPage, perPage);
        fetchAllPackagesForSearch();
        fetchExtensionMap();
      } else {
        Swal.fire("Failed", response?.message || "Extension failed.", "error");
      }
    } catch (err) {
      console.error("Extension failed:", err);
      Swal.fire("Error", "Failed to extend package.", "error");
    }
  };

  // 📌 Excel export (all data, with search applied)
  const exportToExcel = () => {
   const dataToExport = (
    searchText ? allPackagesForSearch : allPackagesForSearch
  )
    // sirf completed payment wale hi record lenge
    .filter(pkg => pkg?.payment_status === "completed")
    .map((pkg, index) => ({
      "S.No": index + 1,
      "Package Name": pkg?.Package?.name || "N/A",
      "Start Date": formatDate(pkg.start_date) || "N/A",
      "End Date": formatDate(pkg.end_date) || "N/A",
      Price: pkg?.Package?.price || "N/A",
      "Payment Status": pkg.payment_status || "N/A",
      Status: pkg.status || "N/A",
      "Payment Date": pkg?.createdAt ? formatDate(pkg.createdAt) : "N/A",
      "Extended Days": extensionMap[pkg?.Package?.name] || "—",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendor Packages");
    XLSX.writeFile(wb, "vendor-packages.xlsx");
  };

  // 📌 Columns
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Package Name",
      selector: (row) => row?.Package?.name || "N/A",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) =>
        row.payment_status === "pending" ? "-" : formatDate(row.start_date),
    },
    {
      name: "End Date",
      selector: (row) =>
        row.payment_status === "pending" ? "-" : formatDate(row.end_date),
    },

    { name: "Amount", selector: (row) => `₹${row?.Package?.price || "0"}` },
    { name: "Payment Status", selector: (row) => row?.payment_status || "N/A" },
 {
  name: "Status",
  cell: (row) => {
    if (row.payment_status !== "completed") return null; // pending/inactive skip

    return new Date(row.end_date) < new Date() ? (
      <span style={{ color: "red" }}>Expired</span>
    ) : (
      <span style={{ color: "green" }}>Active</span>
    );
  },
},


 {
      name: "Payment Date",
      selector: (row) => (row?.createdAt ? formatDate(row.createdAt) : "-"),
    },
    {
      name: "Extended Days",
      selector: (row) => extensionMap[row.id] || "—", // row.id = subscriptionId
    },

    {
      name: "Actions",
      minWidth: "250px",
      cell: (row) => {
        const latestCompleted = [...paginatedPackages]
          .filter((pkg) => pkg.payment_status === "completed")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        const isLatestCompleted = latestCompleted?.id === row.id;

        // 🚫 Agar package ka price 0 hai to extend option disable kar do
        if (row?.Package?.validity_in_months
 ==null) {
          return (
            <span className="text-muted">Free Package (Not Extendable)</span>
          );
        }

        return isLatestCompleted ? (
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "140px" }}
              min={row.end_date?.split("T")[0]}
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
            />
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleExtendPackage(row)}
            >
              Extend
            </button>
          </div>
        ) : (
          <span className="text-muted">—</span>
        );
      },
    },
  ];

  const historyColumns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Package Name",
      selector: (row) => row.packagelog?.name || "N/A",
      sortable: true,
    },
    {
      name: "Extended Days",
      selector: (row) => row.details || "—",
    },
    {
      name: "Extended Date",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
  ];

 const filteredData = searchText
  ? allPackagesForSearch
      .filter((pkg) =>
        pkg?.Package?.name?.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((pkg) => pkg.payment_status === "completed")
  : paginatedPackages.filter((pkg) => pkg.payment_status === "completed");

  useEffect(() => {
    if (token && vendorId) {
      fetchPaginatedPackages(currentPage, perPage);
      fetchAllPackagesForSearch();
      fetchExtensionMap();
    }
  }, [token, vendorId, currentPage, perPage]);

  return (
    <div className="page-content">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0">Vendor Packages</h5>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success me-2"
            onClick={exportToExcel}
          >
            <i className="fa fa-file-excel me-1"></i> Download Packages
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={fetchExtensionHistory}
          >
            <i className="fa fa-file-excel me-1"></i> History
          </button>
        </div>
      </div>

      <div
        className="d-flex align-items-center border rounded px-2 mb-3"
        style={{ maxWidth: "300px" }}
      >
        <i className="ri-search-line me-2 mx-2 text-muted" />
        <input
          type="text"
          className="form-control border-0 shadow-none"
          placeholder="Search by package name..."
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

      <Datatable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        paginationServer={!searchText}
        paginationTotalRows={searchText ? filteredData.length : totalRows}
        paginationPerPage={perPage}
        onChangeRowsPerPage={(newPerPage) => {
          setPerPage(newPerPage);
          setCurrentPage(1);
        }}
        onChangePage={(page) => setCurrentPage(page)}
      />
      {showHistory && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Extension History</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHistory(false)}
                ></button>
              </div>
              <div className="modal-body">
                {extensionHistory.length > 0 ? (
                  <Datatable
                    columns={historyColumns}
                    data={extensionHistory.slice(
                      (historyPage - 1) * historyPerPage,
                      historyPage * historyPerPage
                    )}
                    pagination
                    paginationServer
                    paginationTotalRows={extensionHistory.length}
                    paginationPerPage={historyPerPage}
                    onChangeRowsPerPage={(newPerPage) => {
                      setHistoryPerPage(newPerPage);
                      setHistoryPage(1);
                    }}
                    onChangePage={(page) => setHistoryPage(page)}
                  />
                ) : (
                  <p>No extension history found.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowHistory(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
