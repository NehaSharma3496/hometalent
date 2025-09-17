import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  GetVendoreList,
  GetApproveVendor,
  UpdateVendorStatus,
  showPackage,
  AssignPackageToVendor,
} from "../../../Services/admin/Admin";

import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
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
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [pkgOptions, setPkgOptions] = useState([]);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [assignVendorId, setAssignVendorId] = useState(null);
  const [vendorPackageStatus, setVendorPackageStatus] = useState({});
  const [checkpackage, setCheckpackage] = useState(false);
  const [vendorpkgdata, setVendorpkgdata] = useState({});
  // const [vendorPackageStatus, setVendorPackageStatus] = useState({});
  const [vendorPackageHistory, setVendorPackageHistory] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const openAssignPackage = async (vendorId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await showPackage(token, 1, 100);
      const activePkgs = (res?.data || []).filter(
        (p) => Number(p.status) === 1
      );

      setPkgOptions(activePkgs);
      setAssignVendorId(vendorId);
      setSelectedPkgId(null);

      // Fetch package history and mark active/inactive
      const historyRes = await getVendorPackageHistory(token, vendorId);
      let statusObj = {};
      if (historyRes.status && historyRes.data.length > 0) {
        historyRes.data.forEach((pkg) => {
          const now = new Date();
          const start = new Date(pkg.start_date);
          const end = new Date(pkg.end_date);
          const isActive =
            pkg.payment_status === "completed" && now >= start && now <= end;
          statusObj[pkg.package_id] = isActive ? "Active" : "-";
        });
      }
      setVendorPackageStatus(statusObj);

      setPkgModalOpen(true);
    } catch (e) {
      Swal.fire("Error", "Failed to load packages or history", "error");
    }
  };

  const submitAssignPackage = async () => {
    try {
      setPkgModalOpen(false);
      if (!assignVendorId || !selectedPkgId) {
        return Swal.fire(
          "Select Package",
          "Please select a package",
          "warning"
        );
      }
      const token = localStorage.getItem("token");
      const res = await AssignPackageToVendor(
        token,
        assignVendorId,
        selectedPkgId
      );
      if (res?.status) {
        await Swal.fire("Success", res.msg || "Package assigned", "success");
        setPkgModalOpen(false);
        fetchVendors(currentPage, perPage);
      } else {
        Swal.fire("Error", res?.msg || "Unable to assign package", "error");
      }
    } catch (e) {
      Swal.fire(
        "Error",
        e?.msg || e?.message || "Unable to assign package",
        "error"
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const fetchVendorPackageHistory = async (vendorId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await getVendorPackageHistory(token, vendorId);
      setVendorpkgdata(res.data);
      if (res.status && res.data.length > 0) {
        let historyObj = {};
        const now = new Date();

        res.data.forEach((pkg) => {
          const end = new Date(pkg.end_date);

          // Sirf tab add karo jab active ho
          if (pkg.payment_status === "completed" && end >= now) {
            historyObj[pkg.package_id] = "Active";
          }
        });

        setVendorPackageHistory((prev) => ({
          ...prev,
          [vendorId]: historyObj,
        }));
      } else {
        setVendorPackageHistory((prev) => ({
          ...prev,
          [vendorId]: {}, // No history found
        }));
      }
    } catch (err) {
      console.error("Error fetching vendor package history:", err);
      setVendorPackageHistory((prev) => ({
        ...prev,
        [vendorId]: {},
      }));
    }
  };

  useEffect(() => {
    vendors.forEach((vendor) => {
      fetchVendorPackageHistory(vendor.id);
    });
  }, [vendors]);

  // const filteredVendors = searchText
  //   ? allVendors.filter((v) => {
  //       const lowerSearch = searchText.toLowerCase();
  //       return (
  //         v.owner_name?.toLowerCase().includes(lowerSearch) ||
  //         v.email?.toLowerCase().includes(lowerSearch) ||
  //         v.price_range.toLowerCase().includes(lowerSearch) ||
  //         v.experience_since.toLowerCase().includes(lowerSearch) ||
  //         v.City.name?.toLowerCase().includes(lowerSearch) ||
  //         v.phone?.toLowerCase().includes(lowerSearch) ||
  //         (Array.isArray(v.category_names)
  //           ? v.category_names.join(", ").toLowerCase().includes(lowerSearch)
  //           : v.category_names?.toLowerCase().includes(lowerSearch))
  //       );
  //     })
  //   : vendors;

  const filteredVendors = (searchText ? allVendors : vendors).filter((v) => {
    const lowerSearch = searchText.toLowerCase();

    // Text Filter
    const matchesText =
      !searchText ||
      v.owner_name?.toLowerCase().includes(lowerSearch) ||
      v.email?.toLowerCase().includes(lowerSearch) ||
      // v.price_range?.toLowerCase().includes(lowerSearch) ||
      // v.experience_since?.toLowerCase().includes(lowerSearch) ||
      v.phone?.toLowerCase().includes(lowerSearch) ||
      v.City.name?.toLowerCase().includes(lowerSearch) ||
      v.State.name?.toLowerCase().includes(lowerSearch) ||
      (Array.isArray(v.category_names)
        ? v.category_names.join(", ").toLowerCase().includes(lowerSearch)
        : v.category_names?.toLowerCase().includes(lowerSearch));

    // Date Filter
    const createdDate = new Date(v.createdAt);
    const fromDate = startDate ? new Date(startDate) : null;
    const toDate = endDate ? new Date(endDate) : null;

    // Agar endDate set hai to usko din ke end tak le jao
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const matchesDate =
      (!fromDate || createdDate >= fromDate) &&
      (!toDate || createdDate <= toDate);

    return matchesText && matchesDate;
  });

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetVendoreList(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) allVendors = [...allVendors, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      const exportData = allVendors.map((row, index) => ({
        "S.No": index + 1,
        "Owner Name": row.owner_name || "N/A",
        Email: row.email || "N/A",
        "Category Name": Array.isArray(row.category_names)
          ? row.category_names.join(", ")
          : row.category_names || "N/A",
        Phone: row.phone || "N/A",
        // "Price Range": row.price_range || "N/A",
        // "Short Description": row.short_description || "N/A",
        // "Experience Since": row.experience_since || "N/A",
        City: row.City?.name || "N/A",
        State: row.State?.name || "N/A",
        Status: row.status === 1 ? "Active" : "Inactive",
        Approval_Status:
          row.approval_status === 1
            ? "Approved"
            : row.approval_status === 2
            ? "Rejected"
            : "Pending",
        Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
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

  const fetchVendorPkg = async (vendorId) => {
    const token = localStorage.getItem("token");
    const historyRes = await getVendorPackageHistory(token, vendorId);
    return historyRes.data;
  };

  useEffect(() => {
    const loadAllHistories = async () => {
      let histories = {};
      for (let vendor of vendors) {
        const data = await fetchVendorPkg(vendor.id);
        histories[vendor.id] = data;
      }
      setCheckpackage(histories);
    };
    if (vendors?.length > 0) loadAllHistories();
  }, [vendors]);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "50px",
    },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name || "—",
      sortable: true,
      width: "180px",
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
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
    { name: "Phone", selector: (row) => row.phone || "—" },
    // { name: "Price Range", selector: (row) => row.price_range || "—" },

    // {
    //   name: "Experience Since",
    //   selector: (row) => row.experience_since || "—",
    // },
    {
      name: "State",
      selector: (row) => row?.State?.name || "—",
      width: "150px",
    },
    {
      name: "City",
      selector: (row) => row.City?.name || "—",
    },
    {
      name: "Package Status",
      cell: (row) => {
        const pkgStatus = checkpackage[row.id] || {};
        const activePkgIds = [];
        const expiredPkgIds = [];

        Object.keys(pkgStatus).forEach((pkgId) => {
          const status = pkgStatus[pkgId]?.status; // make sure backend gives `status`
          const startDate = new Date(pkgStatus[pkgId]?.start_date);
          const endDate = new Date(pkgStatus[pkgId]?.end_date);
          const now = new Date();

          if (startDate <= now && (!endDate || endDate >= now)) {
            activePkgIds.push(pkgId);
          } else if (endDate && endDate < now) {
            expiredPkgIds.push(pkgId);
          }
        });

        return (
          <div>
            {activePkgIds.length > 0 ? (
              <span className="badge bg-success me-1">Active</span>
            ) : expiredPkgIds.length > 0 ? (
              <span className="badge bg-danger me-1">Expired</span>
            ) : (
              "N/A"
            )}
          </div>
        );
      },
      sortable: false,
      width: "150px",
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

          {row.approval_status !== 0 && (
            <>
              <button
                className="btn btn-sm d-flex align-items-center justify-content-center"
                style={{
                  width: "35px",
                  height: "35px",
                  backgroundColor: "#a3d2f2",
                  borderColor: "#a3d2f2",
                }}
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

              <button
                className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                style={{ width: "35px", height: "35px" }}
                onClick={() => openAssignPackage(row.id)}
                title="Assign Package"
              >
                <i className="fa-solid fa-box"></i>
              </button>
            </>
          )}
        </div>
      ),

      width: "160px",
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
        <div className="col-md-6 text-end mt-2">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>Download Excel
          </button>
          <Link to="/admin/vendor/addvendors" className="btn btn-primary">
            + Add Vendor
          </Link>
        </div>
      </div>

      <div className="card table-padding">
        {/* <div className="card-header">
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
        </div> */}

        <div className="card-header d-flex flex-wrap gap-3">
          {/* Search Bar */}
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

          {/* Date Filter */}
          <div className="d-flex align-items-center gap-2">
  <input
    type={startDate ? "date" : "text"}
    className="form-control form-control-sm shadow-sm border rounded"
    placeholder="From"
    value={startDate}
    onFocus={(e) => (e.target.type = "date")}
    onBlur={(e) => !startDate && (e.target.type = "text")}
    onChange={(e) => setStartDate(e.target.value)}
  />

  <input
    type={endDate ? "date" : "text"}
    className="form-control form-control-sm shadow-sm border rounded"
    placeholder="To"
    value={endDate}
    onFocus={(e) => (e.target.type = "date")}
    onBlur={(e) => !endDate && (e.target.type = "text")}
    onChange={(e) => setEndDate(e.target.value)}
  />

  {(startDate || endDate) && (
    <button
      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded"
      style={{ height: "31px", lineHeight: "1", padding: "0 10px" }}
      onClick={() => {
        setStartDate("");
        setEndDate("");
      }}
    >
      <i className="fas fa-times"></i>
      <span className="d-none d-md-inline">Clear</span>
    </button>
  )}
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

      {pkgModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          onClick={() => setPkgModalOpen(false)} // backdrop click se band hoga
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()} // andar click se band na ho
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Package</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPkgModalOpen(false)}
                />
              </div>
              <div className="modal-body">
                {pkgOptions.length === 0 ? (
                  <p>No active packages found.</p>
                ) : (
                  <div className="list-group">
                    {pkgOptions?.map((p) => (
                      <label
                        key={p.id}
                        className="list-group-item d-flex justify-content-between align-items-center fs-6"
                      >
                        <div>
                          <input
                            type="radio"
                            name="assignPkg"
                            className="form-check-input me-2"
                            checked={selectedPkgId === p.id}
                            onChange={() => setSelectedPkgId(p.id)}
                          />
                          <span className="fw-semibold fs-6">{p.name}</span>
                          <div className="small text-muted fs-6">
                            ₹{p.price} •{" "}
                            {p.validity_in_months
                              ? `${p.validity_in_months} months`
                              : p.days
                              ? `${p.days} days`
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`badge ${
                              vendorPackageHistory[assignVendorId]?.[p.id] ===
                              "Active"
                                ? "bg-success"
                                : vendorPackageHistory[assignVendorId]?.[
                                    p.id
                                  ] === "Inactive"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {vendorPackageHistory[assignVendorId]?.[p.id] || ""}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPkgModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`btn btn-primary ${
                    !selectedPkgId ? "disabled" : ""
                  }`}
                  onClick={submitAssignPackage}
                  disabled={!selectedPkgId}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
