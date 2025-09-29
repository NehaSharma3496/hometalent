import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GetVendorsByPackageStatus,
  showPackage,
  AssignPackageToVendor,
  GetEmployeePermission,
} from "../../../Services/admin/Admin";
import { getVendorPackageHistory } from "../../../Services/vendor/Vendor";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function ExpiredVendors() {
  const [vendors, setVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [pkgOptions, setPkgOptions] = useState([]);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [assignVendorId, setAssignVendorId] = useState(null);
  const [vendorPackageHistory, setVendorPackageHistory] = useState({});

  const token = localStorage.getItem("token");
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

  // Fetch vendors
  const fetchVendors = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await GetVendorsByPackageStatus(
        token,
        "expired",
        page,
        limit
      );
      const { data, count } = res || {};
      setVendors(data || []);
      setTotalRows(count || 0);

      // Fetch package histories for these vendors
      for (let vendor of data || []) {
        const historyRes = await getVendorPackageHistory(token, vendor.id);
        const historyObj = {};
        (historyRes.data || []).forEach((pkg) => {
          const now = new Date();
          const start = new Date(pkg.start_date);
          const end = new Date(pkg.end_date);
          historyObj[pkg.package_id] =
            pkg.payment_status === "completed" && now >= start && now <= end
              ? "Active"
              : "-";
        });
        setVendorPackageHistory((prev) => ({
          ...prev,
          [vendor.id]: historyObj,
        }));
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, perPage);
  }, [currentPage, perPage]);

  useEffect(() => {
    if (pkgModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [pkgModalOpen]);

  // Pagination
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const exportData = vendors.map((row, index) => ({
        "S.No": index + 1,
        "Owner Name": row.owner_name || "N/A",
        Email: row.email || "N/A",
        Category: row.Category.name || "N/A",
        State: row.State.name || "N/A",
        City: row.City.name || "N/A",
        Phone: row.phone || "N/A",
        Date: row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Expired Vendors");
      XLSX.writeFile(workbook, "Expired_Vendor_List.xlsx");
    } catch (err) {
      console.error("Error exporting vendors:", err);
      Swal.fire("Error", "Failed to export vendors", "error");
    }
  };

  // Open Assign Package Modal
  const openAssignPackage = async (vendorId) => {
    try {
      const res = await showPackage(token, 1, 100);
      const activePkgs = (res?.data || []).filter(
        (p) => Number(p.status) === 1
      );
      setPkgOptions(activePkgs);
      setAssignVendorId(vendorId);
      setSelectedPkgId(null);
      setPkgModalOpen(true);
    } catch (err) {
      Swal.fire("Error", "Failed to load packages", "error");
    }
  };

  // Submit Package Assignment
  const submitAssignPackage = async () => {
    if (!assignVendorId || !selectedPkgId)
      return Swal.fire("Select Package", "Please select a package", "warning");

    try {
      const res = await AssignPackageToVendor(
        token,
        assignVendorId,
        selectedPkgId,
        login_id
      );
      if (res?.status) {
        await Swal.fire("Success", res.msg || "Package assigned", "success");
        setPkgModalOpen(false); // Close modal after success
        fetchVendors(currentPage, perPage); // Refresh vendor list
      } else {
        Swal.fire("Error", res?.msg || "Unable to assign package", "error");
      }
    } catch (err) {
      Swal.fire("Error", err?.message || "Unable to assign package", "error");
    }
  };

  // Search & filter
  const filteredVendors = vendors.filter((vendor) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      vendor.owner_name?.toLowerCase().includes(lowerSearch) ||
      vendor.email?.toLowerCase().includes(lowerSearch) ||
      vendor.phone?.toLowerCase().includes(lowerSearch) ||
      vendor.Category.name?.toLowerCase().includes(lowerSearch) ||
      vendor.State.name?.toLowerCase().includes(lowerSearch) ||
      vendor.City.name?.toLowerCase().includes(lowerSearch)
    );
  });

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, width: "60px" },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name || "—",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
      sortable: true,
      width: "230px",
    },
    {
      name: "Category Name",
      selector: (row) => row.Category?.name || "-",
      width: "230px",
    },
    { name: "Phone", selector: (row) => row.phone || "—", sortable: true },
    {
      name: "State",
      selector: (row) => row.State?.name || "—",
      sortable: true,
    },
    { name: "City", selector: (row) => row.City?.name || "—", sortable: true },

    // ✅ Conditional Assign Package column
    ...(role !== "3" || permissions.includes("allot_package_extension")
      ? [
          {
            name: "Assign Package",
            cell: (row) => (
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAssignPackage(row.id)}
                title="Assign Package"
              >
                <i className="fa-solid fa-box"></i>
              </button>
            ),
            width: "120px",
          },
        ]
      : []),
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)} // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Expired Vendors</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>Download Excel
          </button>
        </div>
      </div>

      <div className="card table-padding">
        <div className="col-md-4 mb-3">
          <div className="d-flex align-items-center border rounded px-2">
            <i className="ri-search-line me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search by vendor..."
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

        <div className="col-md-12">
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

      {pkgModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1040 }}
          onClick={() => setPkgModalOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-md"
            style={{ zIndex: 1050 }}
            onClick={(e) => e.stopPropagation()}
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
                {pkgOptions?.length === 0 ? (
                  <p>No active packages found.</p>
                ) : (
                  <div className="list-group">
                    {pkgOptions?.map((p) => (
                      <label
                        key={p.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <input
                            type="radio"
                            name="assignPkg"
                            className="form-check-input me-2"
                            checked={selectedPkgId === p.id}
                            onChange={() => setSelectedPkgId(p.id)}
                          />
                          <span className="fw-semibold">{p.name}</span>
                          <div className="small text-muted">
                            ₹{p.price} •{" "}
                            {p.validity_in_months && p.validity_in_months > 0
                              ? `${p.validity_in_months} months`
                              : p.days && p.days > 0
                              ? `${p.days} days`
                              : "N/A"}
                          </div>
                        </div>

                        {/* <div>
                          <span
                            className={`badge ${
                              vendorPackageHistory[assignVendorId]?.[p.id] ===
                              "Active"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {vendorPackageHistory[assignVendorId]?.[p.id] || ""}
                          </span>
                        </div> */}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPkgModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!selectedPkgId}
                  onClick={submitAssignPackage}
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
