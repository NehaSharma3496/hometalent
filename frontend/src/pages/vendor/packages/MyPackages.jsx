import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import Datatable from "react-data-table-component";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function MyPackages() {
  const [currentPackages, setCurrentPackages] = useState([]);
  const [expiredPackages, setExpiredPackages] = useState([]);
  const [searchCurrent, setSearchCurrent] = useState("");
  const [searchExpired, setSearchExpired] = useState("");
  const [allCurrentPackages, setAllCurrentPackages] = useState([]);
  const [allExpiredPackages, setAllExpiredPackages] = useState([]);

  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

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

  const exportAllPackages = async () => {
    try {
      let allPackages = [];
      const limit = 100;
      let page = 1;

      const firstRes = await getVendorPackageHistory(
        token,
        vendorId,
        page,
        limit
      );
      if (!firstRes?.data?.length) return;

      allPackages = [...firstRes.data];
      const totalPages = Math.ceil(firstRes.pagination.total_records / limit);

      for (page = 2; page <= totalPages; page++) {
        const res = await getVendorPackageHistory(token, vendorId, page, limit);
        if (res?.data?.length) {
          allPackages = [...allPackages, ...res.data];
        }
      }

      const now = new Date();
      const currentPackages = allPackages.filter(
        (pkg) => new Date(pkg.end_date) >= now
      );
      const expiredPackages = allPackages.filter(
        (pkg) => new Date(pkg.end_date) < now
      );

      const formatDate = (dateStr) =>
        dateStr ? new Date(dateStr).toLocaleDateString() : "";

      const currentData = currentPackages.map((pkg, index) => ({
        "S.No": index + 1,
        "Package Name": pkg?.Package?.name || "",
        Price: pkg?.Package?.price || "",
        "Start Date": formatDate(pkg.start_date),
        "End Date": formatDate(pkg.end_date),
        Status: pkg?.payment_status || "",
        "Payment Date": pkg?.createdAt
          ? new Date(pkg.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
      }));

      const expiredData = expiredPackages.map((pkg, index) => ({
        "S.No": index + 1,
        "Package Name": pkg?.Package?.name || "",
        Price: pkg?.Package?.price || "",
        Duration: pkg?.Package?.duration || "",
        "Start Date": formatDate(pkg.start_date),
        "End Date": formatDate(pkg.end_date),
        Status: "Expired",
      }));

      const workbook = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet(currentData);
      const ws2 = XLSX.utils.json_to_sheet(expiredData);

      XLSX.utils.book_append_sheet(workbook, ws1, "Current Packages");
      XLSX.utils.book_append_sheet(workbook, ws2, "Expired Packages");

      XLSX.writeFile(workbook, "all-vendor-packages.xlsx");
    } catch (error) {
      console.error("Export All Packages Error:", error);
      Swal.fire("Error", "Failed to export packages", "error");
    }
  };

  const fetchPackages = async (page, limit) => {
    setLoading(true);
    try {
      const res = await getVendorPackageHistory(token, vendorId, page, limit);

      if (res?.data && res?.pagination) {
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
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to load packages", error);
      Swal.fire("Error", "Could not load package subscription list", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPackages = async () => {
    try {
      let allPackages = [];
      const limit = 100;
      let page = 1;

      const res = await getVendorPackageHistory(token, vendorId, page, limit);
      if (!res?.data?.length) return;

      allPackages = [...res.data];
      const totalPages = Math.ceil(res.pagination.total_records / limit);

      for (page = 2; page <= totalPages; page++) {
        const res = await getVendorPackageHistory(token, vendorId, page, limit);
        if (res?.data?.length) {
          allPackages = [...allPackages, ...res.data];
        }
      }

      const now = new Date();
      const current = allPackages.filter(
        (pkg) => new Date(pkg.end_date) >= now
      );
      const expired = allPackages.filter((pkg) => new Date(pkg.end_date) < now);

      setAllCurrentPackages(current);
      setAllExpiredPackages(expired);
    } catch (err) {
      console.error("Failed to fetch all packages for search", err);
    }
  };

  useEffect(() => {
    if (token && vendorId) fetchPackages(currentPage, perPage);
    fetchAllPackages();
  }, [token, vendorId, currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const commonColumns = (page) => [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
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
      name: "Payment Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const filterData = (list, searchText, allList) => {
    if (!searchText.trim()) return list;
    return allList.filter((item) =>
      item?.Package?.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

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
        <div className="text-end mb-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={exportAllPackages}
          >
            <i className="fa-solid fa-file-excel me-1"></i> Download All
            Packages
          </button>
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

        <Datatable
          columns={commonColumns()}
          data={filterData(currentPackages, searchCurrent, allCurrentPackages)}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
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

        <Datatable
          columns={commonColumns()}
          data={filterData(expiredPackages, searchExpired)}
          progressPending={loading}
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
