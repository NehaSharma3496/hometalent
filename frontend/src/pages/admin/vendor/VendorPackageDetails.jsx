import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import { GetExtendPackageHistory, ExtendPackage } from "../../../Services/admin/Admin";
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

        // track latest package id
        const active = enriched.filter((p) => p.status === "Active");
        const sorted = [...active].sort(
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
        const more = await getVendorPackageHistory(token, vendorId, page, limit);
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

  // 📌 Fetch extension history
  const fetchExtensionMap = async () => {
    try {
      const res = await GetExtendPackageHistory(token, { vendor_id: vendorId });
      if (res?.status) {
        const map = {};
        res.data.forEach((item) => {
          const pkgName = item.packagelog?.name;
          const days = item.details;
          if (pkgName) {
            map[pkgName] = (map[pkgName] || 0) + parseInt(days);
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
    const extraDays = Math.ceil((selectedDate - currentEndDate) / (1000 * 60 * 60 * 24));

    if (isNaN(extraDays) || extraDays <= 0) {
      return Swal.fire("Invalid", "Select a date after current end date.", "warning");
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      html: `Extend <b>${row?.Package?.name}</b> by <strong>${extraDays} day(s)</strong> until <strong>${selectedDate.toLocaleDateString(
        "en-IN"
      )}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, extend it",
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
        fetchPaginatedPackages(currentPage, perPage);
        fetchAllPackagesForSearch();
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
    const dataToExport = (searchText ? allPackagesForSearch : allPackagesForSearch).map(
      (pkg, index) => ({
        "S.No": index + 1,
        "Package Name": pkg?.Package?.name || "N/A",
        Price: pkg?.Package?.price || "",
        "Start Date": formatDate(pkg.start_date),
        "End Date": formatDate(pkg.end_date),
        Status: pkg.status,
        "Payment Status": pkg.payment_status || "N/A",
        "Payment Date": pkg?.createdAt ? formatDate(pkg.createdAt) : "N/A",
        "Extended Days": extensionMap[pkg?.Package?.name] || "—",
      })
    );

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
    { name: "Start Date", selector: (row) => formatDate(row.start_date) },
    { name: "End Date", selector: (row) => formatDate(row.end_date) },
    { name: "Amount", selector: (row) => `₹${row?.Package?.price || "0"}` },
    { name: "Payment Status", selector: (row) => row?.payment_status || "N/A" },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`badge bg-${row.status === "Active" ? "success" : "danger"}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Extended Days",
      selector: (row) => extensionMap[row?.Package?.name] || "—",
    },
    {
      name: "Actions",
      minWidth: "250px",
      cell: (row) =>
        row.id === latestPackageId ? (
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "160px" }}
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
        ),
    },
  ];

  const filteredData = searchText
    ? allPackagesForSearch.filter((pkg) =>
        pkg?.Package?.name?.toLowerCase().includes(searchText.toLowerCase())
      )
    : paginatedPackages;

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
          <button className="btn btn-primary btn-sm" onClick={exportToExcel}>
            <i className="fa fa-file-excel me-1"></i> Download Packages
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
    </div>
  );
}
