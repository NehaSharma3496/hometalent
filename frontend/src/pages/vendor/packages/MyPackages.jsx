import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import { GetExtendPackageHistory } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function MyPackages() {
  const [paginatedPackages, setPaginatedPackages] = useState([]);
  const [allPackagesForSearch, setAllPackagesForSearch] = useState([]);
  const [extensionMap, setExtensionMap] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isExpired = (endDateStr) => new Date(endDateStr) < new Date();

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
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("Fetch paginated error", err);
      Swal.fire("Error", "Failed to load packages", "error");
    } finally {
      setLoading(false);
    }
  };

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

 const fetchExtensionMap = async () => {
  try {
    const res = await GetExtendPackageHistory(token, { vendor_id: vendorId });
    if (res?.status) {
      const map = {};
      res.data.forEach((item) => {
        if (item.request_id) {   // ✅ package subscription id
          map[item.request_id] = (map[item.request_id] || 0) + parseInt(item.details || 0);
        }
      });
      setExtensionMap(map);
    }
  } catch (err) {
    console.error("Extension fetch error:", err);
  }
};


  const handlePageChange = (page) => setCurrentPage(page);

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const filteredData = searchText
    ? allPackagesForSearch
        .filter((pkg) => {
          const lowerSearch = searchText.toLowerCase();
          return (
            pkg.Package?.name?.toLowerCase().includes(lowerSearch) ||
            pkg.amount?.toString().toLowerCase().includes(lowerSearch)
          );
        })
        .filter((pkg) => pkg.payment_status === "completed")
    : paginatedPackages.filter((pkg) => pkg.payment_status === "completed");

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
      selector: (row) => formatDate(row.start_date),
    },
    {
      name: "End Date",
      selector: (row) => formatDate(row.end_date),
    },
    {
      name: "Amount",
      selector: (row) => `₹${row?.Package?.price || "0"}`,
    },
    {
      name: "Payment Status",
      selector: (row) => row?.payment_status || "N/A",
    },
    {
      name: "Payment Date",
      selector: (row) => (row?.createdAt ? formatDate(row.createdAt) : "N/A"),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span>
          {row.payment_status === "completed" ? "Active" : "Inactive"}
        </span>
      ),
    },
   {
  name: "Extended Days",
  selector: (row) => extensionMap[row.id] || "—",  
},

  ];

  const exportToExcel = async () => {
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
      const exportData = all.map((pkg, index) => ({
        "S.No": index + 1,
        "Package Name": pkg?.Package?.name || "",
        Price: pkg?.Package?.price || "",
        "Start Date": formatDate(pkg.start_date),
        "End Date": formatDate(pkg.end_date),
        Status: new Date(pkg.end_date) >= today ? "Active" : "Expired",
        "Payment Status": pkg?.payment_status || "",
        "Payment Date": pkg?.createdAt ? formatDate(pkg.createdAt) : "",
       "Extended Days": extensionMap[pkg?.id] || "—",  

      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Vendor Packages");
      XLSX.writeFile(wb, "vendor-packages.xlsx");
    } catch (err) {
      console.error("Export Failed", err);
      Swal.fire("Error", "Could not export package data", "error");
    }
  };

  useEffect(() => {
    if (token && vendorId) {
      fetchPaginatedPackages(currentPage, perPage);
      fetchAllPackagesForSearch();
      fetchExtensionMap();
    }
  }, [token, vendorId, currentPage, perPage]);

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4 p-2 mt-3 flex-nowrap">
        {/* Back button + Heading */}
        <div className="d-flex align-items-center">
          <Link to="/vendor/dashboard" className="me-2">
            <i className="fa fa-arrow-left"></i>
          </Link>
          <h5 className="add-page-heading mb-0">My Packages</h5>
        </div>

        {/* Download Button */}
        <button className="btn btn-primary btn-sm" onClick={exportToExcel}>
          <i className="fa-solid fa-file-excel me-1"></i> Download
        </button>
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
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </div>
  );
}
