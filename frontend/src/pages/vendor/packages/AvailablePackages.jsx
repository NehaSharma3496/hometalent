import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVendorPackages,
  subscribeToPackage,
} from "../../../Services/vendor/Vendor";
import Datatable from "../../../extracomponents/Datatable";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const VendorPackages = () => {
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await getVendorPackages(1, 15, token);
      if (res.status) {
        setPackages(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Failed to load packages", err);
    }
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(packages);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packages");

    XLSX.writeFile(workbook, "vendor-packages.xlsx");
  };

  const handleSubscribe = async (packageId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to subscribe to this package?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, subscribe",
    });

    if (confirm.isConfirmed) {
      const payload = {
        vendor_id: vendorId,
        package_id: packageId,
        payment_reference: `TXN${Date.now()}`,
      };

      try {
        await subscribeToPackage(payload);
        Swal.fire("Success", "Subscribed successfully!", "success");
      } catch (err) {
        Swal.fire("Error", "Subscription failed", "error");
      }
    }
  };

  const columns = [
    {
      name: "S.No.",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Package Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      cell: (row) => <div>{row.description}</div>,
      sortable: false,
    },
    {
      name: "Price (₹)",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Validity (Months)",
      selector: (row) => row.validity_in_months,
      sortable: true,
    },
    {
      name: "Features",
      selector: (row) => row.features,
      sortable: false,
    },
    {
      name: "Subscribe",
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 custom-subscribe-btn"
          onClick={() => handleSubscribe(row.id)}
        >
          <i className="fa-solid fa-crown text-warning"></i>
          <span>Subscribe</span>
        </button>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Available Packages</h2>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div
          className="d-flex align-items-center border rounded px-2 "
          style={{ maxWidth: "250px" }}
        >
          <i className="ri-search-line me-2 mx-5 text-muted" />
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

        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={filteredPackages} pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPackages;
