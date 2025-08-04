import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import Datatable from "react-data-table-component";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function MyPackages() {
  const [currentPackages, setCurrentPackages] = useState([]);
  const [expiredPackages, setExpiredPackages] = useState([]);
  const [searchCurrent, setSearchCurrent] = useState("");
  const [searchExpired, setSearchExpired] = useState("");

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

  const exportCurrentToExcel = () => {
    const exportData = filterData(currentPackages, searchCurrent).map(
      (item, index) => ({
        "S.No": index + 1,
        "Package Name": item?.Package?.name || "N/A",
        "Start Date": formatDate(item.start_date),
        "End Date": formatDate(item.end_date),
        Amount: `₹${item?.Package?.price}`,
        "Payment Status": item.payment_status,
        "Payment Date": new Date(item.createdAt).toLocaleDateString(),
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Current Packages");

    XLSX.writeFile(workbook, "current-packages.xlsx");
  };

  const exportExpiredToExcel = () => {
    const exportData = filterData(expiredPackages, searchExpired).map(
      (item, index) => ({
        "S.No": index + 1,
        "Package Name": item?.Package?.name || "N/A",
        "Start Date": formatDate(item.start_date),
        "End Date": formatDate(item.end_date),
        Amount: `₹${item?.Package?.price}`,
        "Payment Status": item.payment_status,
        "Payment Date": new Date(item.createdAt).toLocaleDateString(),
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expired Packages");

    XLSX.writeFile(workbook, "expired-packages.xlsx");
  };

  const fetchPackages = async (page, limit) => {
     setLoading(true);
    try {
      const res = await getVendorPackageHistory(token, vendorId,page, limit);
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
    } catch (error) {
      console.error("Failed to load packages", error);
    }
  };

  useEffect(() => {
    if (token && vendorId) fetchPackages();
  }, [token, vendorId]);

  const commonColumns = (page) => [
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
      name: "Payment Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const filterData = (data, query) => {
    if (!query.trim()) return data;
    return data.filter((item) =>
      item?.Package?.name?.toLowerCase().includes(query.toLowerCase())
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
        <div className="col-md-6 text-end">
          <div className="text-end mb-2">
            <button
              className="btn btn-success btn-sm"
              onClick={exportCurrentToExcel}
            >
              <i className="fa-solid fa-file-excel me-1"></i> Download Current
              Packages
            </button>
          </div>
          <div className="text-end mb-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={exportExpiredToExcel}
            >
              <i className="fa-solid fa-file-excel me-1"></i> Download Expired
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

        <Datatable
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

        <Datatable
          columns={commonColumns()}
          data={filterData(expiredPackages, searchExpired)}
          pagination
        />
      </div>
    </div>
  );
}
