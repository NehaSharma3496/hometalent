import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  GetVendoreList,
  GetApproveVendor,
  UpdateVendorStatus,
} from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";

export default function Allvendors() {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const response = await GetVendoreList();
      setVendors(response.data);
    } catch (error) {
      console.log("error");
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      const confirm = await Swal.fire({
        title: "Approve Vendor?",
        text: "Are you sure you want to approve this vendor?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
      });

      if (!confirm.isConfirmed) return;

      const token = localStorage.getItem("token");
      const response = await GetApproveVendor(vendorId, token);

      if (response.status === true || response.status === "true") {
        await Swal.fire("Approved!", "Vendor approved successfully.", "success");
        fetchVendors();
      } else {
        await Swal.fire("Failed!", "Failed to approve vendor.", "error");
      }
    } catch (error) {
      console.error("Error approving vendor:", error);
      await Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleStatusChange = async (vendorId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await UpdateVendorStatus(vendorId, newStatus, token);

      if (res?.status === true || res?.status === "true") {
        await Swal.fire("Success", "Vendor status updated.", "success");
        fetchVendors();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      await Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const columns = [
    {
      name: "Sr.No.",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Category Names",
      selector: (row) =>
        Array.isArray(row.category_names)
          ? row.category_names.join(", ")
          : row.category_names,
      sortable: true,
    },
    {
      name: "Phone ",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Price Range",
      selector: (row) => row.price_range,
      sortable: true,
    },
    {
      name: "Short Description",
      selector: (row) => row.short_description,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image,
      cell: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.profile_name}
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      name: "Experience Since",
      selector: (row) => row.experience_since,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="form-select form-select-sm"
          style={{
            padding: "4px 8px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #ced4da",
            width: "130px",
            backgroundColor:
              row.status === 1
                ? "#d4edda"
                : row.status === 2
                ? "#f8d7da"
                : "#fff3cd",
          }}
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, parseInt(e.target.value))}
        >
          <option value={0}>Pending</option>
          <option value={1}>Approved</option>
          <option value={2}>Blocked</option>
        </select>
      ),
      sortable: false,
      width: "160px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-div">
          <a title="Edit" href="#">
            <i className="fa-regular fa-pen-line"></i>
          </a>
          <a title="Delete" href="#">
            <i className="fa-solid fa-trash-can"></i>
          </a>

          <button
            className="btn action-btn btn-warning me-1"
            onClick={() => (window.location.href = `/admin/vendor/${row.id}`)}
            title="View"
          >
            <i className="fa-regular fa-eye"></i>
          </button>

          <button
            className="btn action-btn btn-info me-1"
            onClick={() => navigate(`/admin/galleryUpdates/vendorgallery/${row.id}`)}
            title="View Gallery"
          >
            <i className="fa-solid fa-images"></i> Gallery
          </button>

          <button
            className="btn action-btn btn-primary"
            onClick={() => handleApproveVendor(row.id)}
          >
            Approve
          </button>
        </div>
      ),
      width: "340px",
      sortable: false,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">All Vendor</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/addclient" className="add-btn-head">
            + Add User
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="row filter-forms">
          <div className="col-lg-2">
            <div className="form-row">
              <input
                className="form-input"
                type="text"
                placeholder="Search Something Here"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={vendors} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
