import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  GetVendoreList,
  GetApproveVendor,
  UpdateVendorStatus,
} from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";

export default function Allvendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetVendoreList(token, page, limit);
      if (res?.data && res?.pagination) {
        setVendors(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      Swal.fire("Error", "Could not load vendor list", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetVendoreList(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) fullList = [...fullList, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllVendors(fullList);
    } catch (err) {
      console.error("Error fetching all vendors:", err);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, perPage);
    fetchAllVendors();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const filteredVendors = searchText
    ? allVendors.filter((v) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          v.owner_name?.toLowerCase().includes(lowerSearch) ||
          v.email?.toLowerCase().includes(lowerSearch) ||
          v.phone?.toLowerCase().includes(lowerSearch) ||
          (Array.isArray(v.category_names)
            ? v.category_names.join(", ").toLowerCase().includes(lowerSearch)
            : v.category_names?.toLowerCase().includes(lowerSearch))
        );
      })
    : vendors;

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetVendoreList(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) allVendors = [...allVendors, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break; // fallback if pagination info missing
        }

        page++;
      }

      const exportData = allVendors.map((row, index) => ({
        "S.No": index + 1,
        "Owner Name": row.owner_name || "",
        Email: row.email || "",
        "Category Name": Array.isArray(row.category_names)
          ? row.category_names.join(", ")
          : row.category_names || "",
        Phone: row.phone || "",
        "Price Range": row.price_range || "",
        "Short Description": row.short_description || "",
        "Experience Since": row.experience_since || "",
        Image: row.image ? "Available" : "N/A",
        Status:
          row.approval_status === 1
            ? "Approved"
            : row.approval_status === 2
            ? "Rejected"
            : "Pending",
        "Enable Status": row.status === 1 ? "Enabled" : "Disabled",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Vendors");
      XLSX.writeFile(workbook, "All_Vendor_List.xlsx");
    } catch (err) {
      console.error("Error exporting vendors:", err);
      Swal.fire("Error", "Failed to export all vendors", "error");
    }
  };

  const handleApproveVendor = async (vendorId, status) => {
    try {
      const isApprove = status === 1;
      const confirm = await Swal.fire({
        title: isApprove ? "Approve Vendor?" : "Reject Vendor?",
        text: isApprove
          ? "Are you sure you want to approve this vendor?"
          : "Are you sure you want to reject this vendor?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: isApprove ? "#3085d6" : "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: isApprove ? "Yes, approve!" : "Yes, reject!",
      });

      if (!confirm.isConfirmed) return;

      const token = localStorage.getItem("token");
      const response = await GetApproveVendor(vendorId, status, token);

      if (response.status === true || response.status === "true") {
        await Swal.fire("Success", response.message, "success");
        fetchVendors(currentPage, perPage);
      } else {
        throw new Error(response.message || "Failed to update approval");
      }
    } catch (err) {
      console.error(err);
      await Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleStatusChange = async (vendorId, newStatus) => {
    const isEnabling = newStatus === 1;

    const confirm = await Swal.fire({
      title: isEnabling ? "Enable Vendor?" : "Disable Vendor?",
      text: isEnabling
        ? "Are you sure you want to enable this vendor?"
        : "Are you sure you want to disable this vendor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isEnabling ? "Yes, enable" : "Yes, disable",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await UpdateVendorStatus(vendorId, newStatus, token);
      if (res?.status === true || res?.status === "true") {
        await Swal.fire("Success", "Vendor status updated.", "success");
        fetchVendors(currentPage, perPage);
      } else {
        throw new Error(res?.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      await Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "50px",
    },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name,
      sortable: true,
      width: "180px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "250px",
    },
    {
      name: "Category Names",
      selector: (row) =>
        Array.isArray(row.category_names)
          ? row.category_names.join(", ")
          : row.category_names,
      sortable: true,
      width: "170px",
    },
    { name: "Phone", selector: (row) => row.phone },
    { name: "Price Range", selector: (row) => row.price_range },

    {
      name: "Experience Since",
      selector: (row) => row.experience_since,
    },
    {
      name: "Active Status",
      cell: (row) => (
        <div className="form-check form-switch m-0 d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`toggle-${row.id}`}
            checked={row.status === 1}
            onChange={(e) => {
              if (row.approval_status === 1) {
                handleStatusChange(row.id, e.target.checked ? 1 : 2);
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "Action not allowed",
                  text: "Vendor must be approved first to change status.",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "OK",
                });
              }
            }}
            style={{
              width: "3.5rem",
              height: "1.5rem",
              cursor: row.approval_status !== 1 ? "not-allowed" : "pointer",
              marginTop: "2px",
            }}
          />
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() =>
              navigate(`/admin/vendordetails`, { state: { vendorId: row.id } })
            }
            title="View"
          >
            <i className="fa-regular fa-eye"></i>
          </button>

          {/* Only show Gallery and Update buttons if not rejected */}
          {row.approval_status !== 2 && (
            <>
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
            </>
          )}
        </div>
      ),

      width: "125px",
    },
    {
      name: "Approval Status",
      cell: (row) => {
        const status = row.approval_status;

        const getStatusLabel = () => {
          if (status === 1) return "Approved";
          if (status === 2) return "Rejected";
          return "Pending";
        };

        const getButtonClass = () => {
          if (status === 1) return "bg-success";
          if (status === 2) return "bg-danger";
          return "bg-warning dropdown-toggle fs-6";
        };

        return (
          <div className="dropdown">
            {status === 0 ? (
              <>
                <button
                  className={`badge ${getButtonClass()}`}
                  type="button"
                  id={`statusDropdown-${row.id}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {getStatusLabel()}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby={`statusDropdown-${row.id}`}
                >
                  <li>
                    <button
                      className="dropdown-item text-success"
                      onClick={() => handleApproveVendor(row.id, 1)}
                    >
                      ✅ Approve
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleApproveVendor(row.id, 2)}
                    >
                      ❌ Reject
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <button
                className={`btn btn-sm ${getButtonClass()}`}
                type="button"
                disabled
                style={{ cursor: "default" }}
                title={getStatusLabel()}
              >
                {getStatusLabel()}
              </button>
            )}
          </div>
        );
      },
      sortable: false,
      width: "120px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
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
            <i className="fa-solid fa-file-excel me-1"></i>Download Excel
          </button>
          <Link to="/admin/vendor/addvendors" className="btn btn-primary">
            + Add Vendor
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="col-md-4">
            <div className="d-flex align-items-center border rounded px-2">
              <i className="ri-search-line me-2 text-muted" />
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by Owner Name..."
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
        <div className="row ">
          <div className="card-body">
            <Datatable
              columns={columns}
              data={filteredVendors}
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
}
