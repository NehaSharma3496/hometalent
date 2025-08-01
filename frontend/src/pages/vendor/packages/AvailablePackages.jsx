import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVendorPackages,
  subscribeToPackage,
  getVendorPackageHistory,
} from "../../../Services/vendor/Vendor";
import Datatable from "../../../extracomponents/Datatable";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { loadScript } from "../../../Utils/razorpayLoader";

const VendorPackages = () => {
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;
  const [searchText, setSearchText] = useState("");
  const [subscribedPackageIds, setSubscribedPackageIds] = useState([]);

  useEffect(() => {
    fetchPackages();
    fetchSubscribedPackages();
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

  const fetchSubscribedPackages = async () => {
    try {
      const res = await getVendorPackageHistory(token, vendorId);
      if (res.status) {
        const subscribedIds = res.data.map((pkg) => pkg.package_id);
        setSubscribedPackageIds(subscribedIds);
      }
    } catch (err) {
      console.error("Failed to load subscribed packages", err);
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

  const AddSubscribeplan = async (pkg) => {
  try {
    const amount = pkg.price; 
    const getkey = "rzp_test_22mEHcDzJbcUmz"; 

    if (!window.Razorpay) {
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to subscribe to this package?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, subscribe",
    });

    if (!confirm.isConfirmed) return;

    const finalAmount = Math.round(amount * 100);

    const options = {
      key: getkey,
      amount: finalAmount,
      name: "Hometalent4u",
      currency: "INR",
      description: pkg.name || "Subscription Plan",
      handler: async function (response) {
        const data = {
          vendor_id: vendorId,
          package_id: pkg.id,
          
          // price: amount,
          payment_reference: response.razorpay_payment_id, 
        };

        const result = await subscribeToPackage(data, token);
        if (result?.status) {
          Swal.fire("Subscribed!", "Your package is now active.", "success");
          fetchSubscribedPackages(); 
        }
      },
      prefill: {
        email: user?.email,
        contact: user?.phone,
        name: user?.name,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Subscription error:", error);
    Swal.fire("Error", "Something went wrong during subscription.", "error");
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
      cell: (row) => {
        const isSubscribed = subscribedPackageIds.includes(row.id);

        return (
          <button
            className={`btn btn-primary p-1 d-flex align-items-center gap-1 ${
              isSubscribed ? "btn-outline-secondary" : "btn-primary"
            }`}
            onClick={() => AddSubscribeplan(row)}
          >
            <i className="fa-solid fa-crown text-warning"></i>
            <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
          </button>
        );
      },
      sortable: false,
      width: "140px",
    },
    {
      name: "Status",
      cell: (row) => {
        const isSubscribed = subscribedPackageIds.includes(row.id);
        return (
          <button
            className={`badge ${
              isSubscribed ? "bg-success" : "bg-secondary"
            } fs-6`}
            disabled
          >
            {isSubscribed ? "Active" : "Not Subscribed"}
          </button>
        );
      },
      sortable: false,
      width: "155px",
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
