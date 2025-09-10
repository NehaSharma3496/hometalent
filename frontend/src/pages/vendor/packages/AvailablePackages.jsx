import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getVendorPackages,
  subscribeToPackage,
  getVendorPackageHistory,
} from "../../../Services/vendor/Vendor";
import Datatable from "react-data-table-component";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

import { paymentService } from "../../../Services/vendor/paymentService";
// import { subscribeToPackage } from "../../../Services/vendor/Vendor";

const VendorPackages = () => {
  const [packages, setPackages] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;
  const [searchText, setSearchText] = useState("");
  const [subscribedPackageIds, setSubscribedPackageIds] = useState([]);
  const [allPackages, setAllPackages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages(currentPage, perPage);
    fetchAllPackages();
    fetchSubscribedPackages();
  }, [currentPage, perPage]);

  const fetchPackages = async (page, limit) => {
    setLoading(true);
    try {
      const res = await getVendorPackages(token, page, limit);
      if (res?.data && res?.pagination) {
        setPackages(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      Swal.fire("Error", "Could not load vendor package list", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPackages = async () => {
    try {
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await getVendorPackages(token, page, limit);
        if (res?.data && res?.pagination?.total_records) {
          fullList = [...fullList, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          break;
        }
        page++;
      }
      setAllPackages(fullList);
    } catch (error) {
      console.error("Error fetching full package list:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const fetchSubscribedPackages = async () => {
    try {
      const res = await getVendorPackageHistory(token, vendorId);
      if (res.status) {
        setSubscribedPackageIds(res.data);
      }
    } catch (err) {
      console.error("Failed to load subscribed packages", err);
    }
  };

  const filteredPackages = searchText
    ? allPackages.filter((pkg) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          pkg.name?.toLowerCase().includes(lowerSearch) ||
          pkg.price?.toString().toLowerCase().includes(lowerSearch) ||
          pkg.validity_in_months?.toString().toLowerCase().includes(lowerSearch)
        );
      })
    : packages;

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allPackages = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await getVendorPackages(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) allPackages = [...allPackages, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }
      const subRes = await getVendorPackageHistory(token, vendorId);
      const subscribedIds = subRes?.data?.map((pkg) => pkg.package_id) || [];

      const exportData = allPackages.map((pkg, index) => ({
        "S.No.": index + 1,
        "Package Name": pkg.name||"N/A",
        "Price (₹)": pkg.price||"0",
        Validity: pkg.validity_in_months
          ? `${pkg.validity_in_months} Month${
              pkg.validity_in_months > 1 ? "s" : ""
            }`
          : pkg.days
          ? `${pkg.days} Day${pkg.days > 1 ? "s" : ""}`
          : "N/A",
        Description: pkg.description||"N/A",
        Features: pkg.features||"N/A",
        Status: subscribedIds.includes(pkg.id) ? "Active" : "Not Subscribed"||"N/A",
          Date: new Date(pkg.createdAt).toLocaleDateString() || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Packages");

      XLSX.writeFile(workbook, "vendor-packages.xlsx");
    } catch (error) {
      console.error("Failed to export packages:", error);
      Swal.fire("Error", "Failed to export all packages", "error");
    }
  };

  const AddSubscribeplan = async (pkg) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: `Subscribe to ${pkg.name} for ₹${pkg.price}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
      });

      if (!confirm.isConfirmed) return;
      console.log("pkg.price", Number(pkg.price));

      // If price is 0, attempt free self-subscription (backend validates "fresh vendor" rule)
      if (Number(pkg.price) === 0) {
        const token = localStorage.getItem("token");
        const res = await subscribeToPackage(
          { vendor_id: vendorId, package_id: pkg.id },
          token
        );
        console.log("res", res);
        if (res?.status) {
          await Swal.fire(
            "Success",
            res?.msg || "Subscribed to free package",
            "success"
          );
          fetchSubscribedPackages();
          return;
        } else {
          await Swal.fire("Error", res?.msg || "Something went wrong", "error");
          return;
        }
        // if backend declines (not fresh), fallthrough to payment flow
      }

      const response = await paymentService.createPaymentOrder(
        vendorId,
        pkg.id
      );
      if (response.status && response.data?.payment_url) {
        Swal.fire("Success", response.msg || "Success", "success");
        navigate("/vendor/payment", {
          state: { orderData: response.data, package: pkg },
        });
      } else {
        Swal.fire("Error", response.msg || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      Swal.fire(
        "Error",
        error?.response?.data?.msg || error?.message || "Something went wrong.",
        "error"
      );
    }
  };

  const handleView = (pkg) => {
    Swal.fire({
      title: pkg.name,
      html: `
      <p><b>Description:</b> ${pkg.description}</p>
      <p><b>Price:</b> ₹${pkg.price}</p>
      <p><b>Validity:</b> ${pkg.validity_in_months} month(s)</p>
      <p><b>Features:</b><br/>${pkg.features.replace(/\r?\n/g, "<br/>")}</p>
    `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Package Name" || "-",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Price (₹)" || "-",
      selector: (row) => row.price,
      sortable: true,
      width: "100px",
    },
    {
      name: "Validity",
      selector: (row) => {
        if (row.validity_in_months) {
          return `${row.validity_in_months} Month${
            row.validity_in_months > 1 ? "s" : ""
          }`;
        } else if (row.days) {
          return `${row.days} Day${row.days > 1 ? "s" : ""}`;
        }
        return "N/A";
      },

      sortable: true,
    },

    {
      name: "View",
      cell: (row) => (
        <button
          className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
          style={{ width: "35px", height: "35px" }}
          onClick={() => handleView(row)}
          title="View"
        >
          <i className="fa-regular fa-eye"></i>
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
    {
      name: "Subscribe",
      cell: (row) => {
        return (
          <button
            className="btn p-1 d-flex align-items-center gap-1 btn-primary"
            onClick={() => AddSubscribeplan(row)}
          >
            <i className="fa-solid fa-crown text-warning"></i>
            <span>Subscribe</span>
          </button>
        );
      },
      sortable: false,
      width: "150px",
    },

    {
      name: "Status",
      cell: (row) => {
        const isSubscribed = subscribedPackageIds.some(
          (item) =>
            item?.package_id === row.id && item?.payment_status === "completed"
        );
        return (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "40px", width: "100%" }}
          >
            <span className={`fs-6 ${isSubscribed ? "badge bg-success" : "-"}`}>
              {isSubscribed ? "Active" : "-"}
            </span>
          </div>
        );
      },
      sortable: false,
      width: "155px",
    },
  ];

  return (
    <div className="page-content">
      {/* 🔹 Top Header Row */}
      <div className="row align-items-center mb-3">
        {/* Left side: Back + Heading */}
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Packages</h2>
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="col-md-6 text-end mt-2">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="card table-padding">
        <div className="card-header">
          <div className="col-md-4">
            <div className="d-flex align-items-center border rounded px-2">
              <i className="ri-search-line me-2 text-muted" />
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
          </div>
        </div>

        <div className="row">
          <div className="card-body">
            <Datatable
              columns={columns}
              data={filteredPackages}
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
      </div>
    </div>
  );
};

export default VendorPackages;
