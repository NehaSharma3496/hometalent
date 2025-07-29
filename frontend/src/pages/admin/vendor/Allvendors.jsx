import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  GetVendoreList,
  GetApproveVendor,
  UpdateVendorStatus,
} from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";
import * as XLSX from "xlsx";

export default function Allvendors() {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const fetchVendors = async () => {
    try {
      const response = await GetVendoreList();
      console.log("Vendors list", response);
      setVendors(response.data);
    } catch (error) {
      console.log("error");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Vendor");

    XLSX.writeFile(workbook, "All vendor List.xlsx");
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

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
        await Swal.fire(
          "Approved!",
          "Vendor approved successfully.",
          "success"
        );
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
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "70px",
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
      name: "Update Vendor Status",
      cell: (row) => (
        <div className="form-check form-switch m-0 d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`toggle-${row.id}`}
            checked={row.status === 1}
            disabled={row.status === 0}
            onChange={(e) =>
              handleStatusChange(row.id, e.target.checked ? 1 : 2)
            }
            style={{
              width: "3.5rem",
              height: "1.5rem",
              cursor: row.status === 0 ? "not-allowed" : "pointer",
              marginTop: "2px",
            }}
          />
        </div>
      ),
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex align-items-center gap-9">
          <button
            className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() =>
              navigate(`/admin/vendordetails`, {
                state: { vendorId: row.id },
              })
            }
            title="View"
          >
            <i className="fa-regular fa-eye"></i>
          </button>

          <button
            className="btn btn-info btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() =>
              navigate(`/admin/galleryUpdates/vendorgallery/${row.id}`)
            }
            title="View Gallery"
          >
            <i className="fa-solid fa-images"></i>
          </button>

          <button
            className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() =>
              navigate("/admin/vendor/updatevendor", {
                state: { vendorId: row.id },
              })
            }
            title="Update"
          >
            <i className="fa fa-edit"></i>
          </button>
        </div>
      ),
      sortable: false,
      width: "150px",
    },

   {
  name: "Status",
  cell: (row) => (
    <div className="action-div">
      {row.status === 0 ? (
        <button
          className="btn btn-sm btn-success text-nowrap"
          onClick={() => handleApproveVendor(row.id)}
          title="Approve"
        >
          Pending
        </button>
      ) : row.status === 1 ? (
        <span className="badge bg-success fs-6">Approved</span>
      ) : null}
    </div>
  ),
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
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
          <Link to="/admin/vendor/addvendors" className="btn btn-primary">
            + Add User
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="col-md-4">
          <div className="d-flex align-items-center border rounded px-2">
            <i className="ri-search-line me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search by vendor name..."
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

        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={filteredVendors} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
