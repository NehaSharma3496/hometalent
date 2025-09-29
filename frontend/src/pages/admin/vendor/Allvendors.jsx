import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  GetVendoreList,
  GetApproveVendor,
  UpdateVendorStatus,
  showPackage,
  AssignPackageToVendor,
  GetEmployeePermission,
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
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [pkgOptions, setPkgOptions] = useState([]);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [assignVendorId, setAssignVendorId] = useState(null);
  const [vendorPackageStatus, setVendorPackageStatus] = useState({});
  const [vendorPackageHistory, setVendorPackageHistory] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false); // 🔹 Track if history is loaded

  const login_id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (role !== "3") return;

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const res = await GetEmployeePermission(token, userId);
        if (res?.status && Array.isArray(res.data)) {
          setPermissions(res.data.map((p) => p.slug));
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    if (allVendors?.length > 0) {
      // Extract cities
      const cities = [];
      const citySet = new Set();

      allVendors.forEach((vendor) => {
        if (vendor.City?.name && !citySet.has(vendor.City.name)) {
          citySet.add(vendor.City.name);
          cities.push({
            id: vendor.City.id,
            name: vendor.City.name,
          });
        }
      });

      const sortedCities = cities.sort((a, b) => a.name.localeCompare(b.name));
      setAvailableCities(sortedCities);

      // Extract categories
      const categories = [];
      const categorySet = new Set();

      allVendors.forEach((vendor) => {
        if (vendor.category_names) {
          const vendorCategories = Array.isArray(vendor.category_names)
            ? vendor.category_names
            : [vendor.category_names];

          vendorCategories.forEach((category) => {
            if (category && !categorySet.has(category)) {
              categorySet.add(category);
              categories.push(category);
            }
          });
        }
      });

      const sortedCategories = categories.sort((a, b) => a.localeCompare(b));
      setAvailableCategories(sortedCategories);
    }
  }, [allVendors]);

  // 🔹 Utility function to get package status for a vendor
  const getVendorPackageStatus = (vendorId) => {
    const packages = vendorPackageHistory[vendorId];
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      return "N/A";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasActive = false;
    let hasExpired = false;

    packages.forEach((pkg) => {
      if (pkg.payment_status === "completed") {
        const startDate = new Date(pkg.start_date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(pkg.end_date);
        endDate.setHours(0, 0, 0, 0);

        if (today >= startDate && today <= endDate) {
          hasActive = true;
        } else if (today > endDate) {
          hasExpired = true;
        }
      }
    });

    if (hasActive) return "Active";
    if (hasExpired) return "Expired";
    return "N/A";
  };

  const fetchAllVendors = async () => {
    setLoading(true);
    setHistoryLoaded(false); // Reset history loaded state
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
      setVendors(fullList); // 🔹 Set vendors to fullList initially
    } catch (err) {
      console.error("Error fetching all vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVendors();
  }, []);

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

      // Fetch package history and mark active/inactive for modal
      const historyRes = await getVendorPackageHistory(token, vendorId);
      let statusObj = {};
      if (historyRes.status && historyRes.data.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        historyRes.data.forEach((pkg) => {
          if (pkg.payment_status === "completed") {
            const startDate = new Date(pkg.start_date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(pkg.end_date);
            endDate.setHours(0, 0, 0, 0);

            const isActive = today >= startDate && today <= endDate;
            statusObj[pkg.package_id] = isActive ? "Active" : "-";
          }
        });
      }
      setVendorPackageStatus(statusObj);

      setPkgModalOpen(true);
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "Failed to load packages or history",
        icon: "error",
        zIndex: 9999,
      });
    }
  };

  const submitAssignPackage = async () => {
    try {
      if (!assignVendorId || !selectedPkgId) {
        return Swal.fire({
          title: "Select Package",
          text: "Please select a package",
          icon: "warning",
          zIndex: 9999,
        });
      }

      const token = localStorage.getItem("token");
      const res = await AssignPackageToVendor(
        token,
        assignVendorId,
        selectedPkgId,
        login_id
      );

      if (res?.status) {
        await Swal.fire({
          title: "Success",
          text: res.msg || "Package assigned",
          icon: "success",
          zIndex: 9999,
        });

        setPkgModalOpen(false);
        fetchAllVendors(); // 🔹 Refresh all vendors
        // 🔹 Refresh package history after assignment
        await fetchVendorPackageHistory(assignVendorId);
      } else {
        Swal.fire({
          title: "Error",
          text: res?.msg || "Unable to assign package",
          icon: "error",
          zIndex: 9999,
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e?.msg || e?.message || "Unable to assign package",
        icon: "error",
        zIndex: 9999,
      });
    }
  };

  const fetchVendorPackageHistory = async (vendorId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await getVendorPackageHistory(token, vendorId);

      if (res.status && res.data && Array.isArray(res.data)) {
        setVendorPackageHistory((prev) => ({
          ...prev,
          [vendorId]: res.data,
        }));
      } else {
        setVendorPackageHistory((prev) => ({
          ...prev,
          [vendorId]: [],
        }));
      }
    } catch (err) {
      console.error("Error fetching vendor package history:", err);
      setVendorPackageHistory((prev) => ({
        ...prev,
        [vendorId]: [],
      }));
    }
  };

  // 🔹 Fetch package history for all vendors
  useEffect(() => {
    const loadAllHistories = async () => {
      if (!allVendors?.length) return;
      
      setHistoryLoaded(false);
      const historyPromises = allVendors.map(vendor => 
        fetchVendorPackageHistory(vendor.id)
      );
      
      await Promise.all(historyPromises);
      setHistoryLoaded(true);
    };

    loadAllHistories();
  }, [allVendors]);

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setPackageFilter("");
    setCityFilter("");
    setCategoryFilter("");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchText ||
    startDate ||
    endDate ||
    packageFilter ||
    cityFilter ||
    categoryFilter;

  // 🔹 MAIN FILTERING LOGIC
  const filteredVendors = allVendors.filter((v) => {
    const lowerSearch = searchText.toLowerCase();

    // 🔹 Text Filter
    const matchesText =
      !searchText ||
      v.owner_name?.toLowerCase().includes(lowerSearch) ||
      v.email?.toLowerCase().includes(lowerSearch) ||
      v.phone?.toLowerCase().includes(lowerSearch) ||
      v.City?.name?.toLowerCase().includes(lowerSearch) ||
      v.State?.name?.toLowerCase().includes(lowerSearch) ||
      (Array.isArray(v.category_names)
        ? v.category_names.join(", ").toLowerCase().includes(lowerSearch)
        : v.category_names?.toLowerCase().includes(lowerSearch));

    // 🔹 Date Filter
    const createdDate = new Date(v.createdAt);
    const fromDate = startDate ? new Date(startDate) : null;
    const toDate = endDate ? new Date(endDate) : null;
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }
    const matchesDate =
      (!fromDate || createdDate >= fromDate) &&
      (!toDate || createdDate <= toDate);

    // 🔹 Package Status Filter - Only apply if history is loaded
    let matchesPackage = true;
    if (packageFilter && historyLoaded) {
      const vendorPkgStatus = getVendorPackageStatus(v.id);
      matchesPackage = vendorPkgStatus === packageFilter;
    }

    // 🔹 City Filter
    let matchesCity = true;
    if (cityFilter) {
      matchesCity = v.City?.name === cityFilter;
    }

    // 🔹 Category Filter
    let matchesCategory = true;
    if (categoryFilter) {
      const vendorCategories = Array.isArray(v.category_names)
        ? v.category_names
        : [v.category_names];
      matchesCategory = vendorCategories.includes(categoryFilter);
    }

    return (
      matchesText &&
      matchesDate &&
      matchesPackage &&
      matchesCity &&
      matchesCategory
    );
  });

  // 🔹 Paginate filtered vendors
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const exportToExcel = async () => {
    try {
      const exportData = filteredVendors?.map((row, index) => {
        const packageStatus = getVendorPackageStatus(row.id);

        return {
          "S.No": index + 1,
          "Owner Name": row.owner_name || "N/A",
          Email: row.email || "N/A",
          "Category Name": Array.isArray(row.category_names)
            ? row.category_names.join(", ")
            : row.category_names || "N/A",
          Phone: row.phone || "N/A",
          City: row.City?.name || "N/A",
          State: row.State?.name || "N/A",
          Status: row.status === 1 ? "Active" : "Inactive",
          Approval_Status:
            row.approval_status === 1
              ? "Approved"
              : row.approval_status === 2
              ? "Rejected"
              : "Pending",
          "Package Status": packageStatus,
          Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Vendors");
      XLSX.writeFile(workbook, "Filtered_Vendor_List.xlsx");

      Swal.fire(
        "Success",
        `${exportData.length} vendors exported successfully!`,
        "success"
      );
    } catch (err) {
      console.error("Error exporting vendors:", err);
      Swal.fire("Error", "Failed to export vendors", "error");
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
      const login_id = localStorage.getItem("userId");
      const response = await GetApproveVendor(
        vendorId,
        status,
        token,
        login_id
      );
      if (response.status === true || response.status === "true") {
        await Swal.fire("Success", response.message, "success");
        fetchAllVendors();
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
      const login_id = localStorage.getItem("userId");
      const res = await UpdateVendorStatus(
        vendorId,
        newStatus,
        token,
        login_id
      );
      if (res?.status === true || res?.status === "true") {
        await Swal.fire("Success", "Vendor status updated.", "success");
        fetchAllVendors();
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
    {
      name: "State",
      selector: (row) => row?.State?.name || "—",
      width: "150px",
    },
    { name: "City", selector: (row) => row.City?.name || "—" },
    {
      name: "Package Status",
      cell: (row) => {
        const packageStatus = getVendorPackageStatus(row.id);
        return (
          <div>
            {packageStatus === "Active" ? (
              <span className="badge bg-success">Active</span>
            ) : packageStatus === "Expired" ? (
              <span className="badge bg-danger">Expired</span>
            ) : (
              <span className="badge bg-secondary">N/A</span>
            )}
          </div>
        );
      },
      sortable: false,
      width: "150px",
    },

    ...(role !== "3" || permissions.includes("active_deactive")
      ? [
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
                    cursor:
                      row.approval_status !== 1 ? "not-allowed" : "pointer",
                    marginTop: "2px",
                  }}
                />
              </div>
            ),
            width: "150px",
          },
        ]
      : []),

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
              {role !== "3" && (
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
              )}

              {(role !== "3" || permissions.includes("add_edit_vendor")) && (
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
              )}

              {(role !== "3" ||
                permissions.includes("allot_package_extension")) && (
                <button
                  className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                  style={{ width: "35px", height: "35px" }}
                  onClick={() => openAssignPackage(row.id)}
                  title="Assign Package"
                >
                  <i className="fa-solid fa-box"></i>
                </button>
              )}
            </>
          )}
        </div>
      ),
      width: "180px",
    },

    ...(role !== "3" || permissions.includes("approve_reject")
      ? [
          {
            name: "Approval Status",
            cell: (row) => {
              const status = row.approval_status;
              const getStatusLabel = () =>
                status === 1
                  ? "Approved"
                  : status === 2
                  ? "Rejected"
                  : "Pending";
              const getButtonClass = () =>
                status === 1
                  ? "bg-success"
                  : status === 2
                  ? "bg-danger"
                  : "bg-warning dropdown-toggle fs-6";

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
        ]
      : []),

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
            <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">All Vendor</h2>
          </div>
        </div>
        <div className="col-md-6 text-end mt-2">
          {(role !== "3" || permissions.includes("download_excel")) && (
            <button className="btn btn-success me-2" onClick={exportToExcel}>
              <i className="fa-solid fa-file-excel me-1"></i>Download Excel
            </button>
          )}

          {role !== "3" || permissions.includes("add_edit_vendor") ? (
            <Link to="/admin/vendor/addvendors" className="btn btn-primary">
              + Add Vendor
            </Link>
          ) : null}
        </div>
      </div>

      <div className="card table-padding">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div
              className="d-flex align-items-center border rounded px-2"
              style={{ width: "190px" }}
            >
              <i className="ri-search-line me-2 text-muted" />
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search..."
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

            <input
              type={startDate ? "date" : "text"}
              className="form-control form-control-sm shadow-sm border rounded"
              placeholder="From Date"
              value={startDate}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => !startDate && (e.target.type = "text")}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              style={{ width: "140px" }}
            />

            <input
              type={endDate ? "date" : "text"}
              className="form-control form-control-sm shadow-sm border rounded"
              placeholder="To Date"
              value={endDate}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => !endDate && (e.target.type = "text")}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              style={{ width: "140px" }}
            />

            <select
              className="form-select form-select-sm shadow-sm border rounded"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{ width: "140px" }}
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm shadow-sm border rounded"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm shadow-sm border rounded"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              style={{ width: "130px" }}
            >
              <option value="">All Packages</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="N/A">N/A</option>
            </select>

            {hasActiveFilters && (
              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center rounded"
                onClick={clearAllFilters}
                title="Clear All Filters"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        <div className="row">
          <div className="card-body">
            <Datatable
              columns={columns}
              data={paginatedVendors}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={filteredVendors.length}
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
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5) ",
            zIndex: 0,
          }}
          onClick={() => setPkgModalOpen(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
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
                          {vendorPackageStatus[p.id] === "Active" && (
                            <span className="badge bg-success">
                              {vendorPackageStatus[p.id]}
                            </span>
                          )}
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