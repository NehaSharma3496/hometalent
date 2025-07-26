import React, { useEffect, useState } from "react";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

export default function MyPackages() {
  const [currentPackages, setCurrentPackages] = useState([]);
  const [expiredPackages, setExpiredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCurrent, setSearchCurrent] = useState("");
  const [searchExpired, setSearchExpired] = useState("");


  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");

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
    } catch (error) {
      console.error("Failed to load packages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && vendorId) fetchPackages();
  }, [token, vendorId]);

  const commonColumns = (page) => [
    {
      name: "S.No",
      cell: (row, index) =>  index + 1,
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
  ];

  const filterData = (data, query) => {
    if (!query.trim()) return data;
    return data.filter((item) =>
      item?.Package?.name?.toLowerCase().includes(query.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
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
      columns={commonColumns () }
      data={filterData(expiredPackages, searchExpired)}
      pagination
        />
  </div>
</div>

  );
}
