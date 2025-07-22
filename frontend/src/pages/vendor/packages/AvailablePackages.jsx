import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVendorPackages, subscribeToPackage } from '../../../Services/vendor/Vendor';
import Datatable from '../../../extracomponents/Datatable';
import Swal from 'sweetalert2';

const VendorPackages = () => {
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await getVendorPackages(1, 15,token);
      if (res.status) {
        setPackages(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load packages', err);
    }
  };

  const handleSubscribe = async (packageId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to subscribe to this package?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, subscribe',
    });

    if (confirm.isConfirmed) {
      const payload = {
        vendor_id: vendorId,
        package_id: packageId,
        payment_reference: `TXN${Date.now()}`
      };

      try {
        const res = await subscribeToPackage(payload);
        Swal.fire("Success", "Subscribed successfully!", "success");
      } catch (err) {
        Swal.fire("Error", "Subscription failed", "error");
      }
    }
  };

  const showFullDescription = (description) => {
    Swal.fire({
      title: 'Package Description',
      text: description,
      confirmButtonText: 'Close',
    });
  };

  const truncateText = (text, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const columns = [
    {
      name: "S.No.",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px"
    },
    {
      name: "Package Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      cell: (row) => (
        <div>
          {truncateText(row.description)}
          {row.description.length > 30 && (
            <button
              className="btn btn-link p-0 ms-2"
              style={{ fontSize: '0.85rem', }}
              onClick={() => showFullDescription(row.description)}
            >
              🔽
            </button>
          )}
        </div>
      ),
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
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-sm btn-primary rounded-4 px-4"
          onClick={() => handleSubscribe(row.id)}
        >
          Subscribe
        </button>
      ),
      sortable: false,
    }
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">All Vendor Packages</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/addpackage" className="add-btn-head">+ Add Package</Link>
        </div>
      </div>

      <div className="card p-4">
        <div className="row filter-forms mb-4">
          <div className="col-md-4">
            <input className="form-input" type="text" placeholder="Search by Package Name" />
          </div>
          <div className="col-md-2">
            <button type="button" className="filter-reset-btn">
              <i className="fa fa-download" aria-hidden="true"></i> Export Excel
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Datatable
              columns={columns}
              data={packages}
              pagination
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default VendorPackages;
