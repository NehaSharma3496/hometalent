import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { showPackage, DeletePackage } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import { UpdatePackageStatus } from "../../../Services/admin/Admin";
import * as XLSX from "xlsx";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [allPackages, setAllPackages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchPackages = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await showPackage(token, page, limit);
      if (res?.data && res?.pagination) {
        setPackages(res.data);
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

  const fetchAllPackages = async () => {
    const token = localStorage.getItem("token");
    let fullList = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await showPackage(token, page, limit);
      if (res?.data && res?.pagination?.total_records) {
        fullList = [...fullList, ...res.data];
        totalPages = Math.ceil(res.pagination.total_records / limit);
      } else {
        break;
      }
      page++;
    }

    setAllPackages(fullList);
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allPackages = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      // Fetch all paginated packages
      while (page <= totalPages) {
        const res = await showPackage(token, page, limit);

        if (res?.data && res?.pagination?.total_records) {
          allPackages = [...allPackages, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }

        page++;
      }

      if (!allPackages.length) {
        return Swal.fire("No Data", "No packages found to export", "info");
      }

      const exportData = allPackages.map((pkg, index) => ({
        "S.No": index + 1,
        Name: pkg.name || "N/A",
        Description: pkg.description || "N/A",
        "Price (₹)": `₹${pkg.price}`,
        "Validity (Months)": pkg.validity_in_months,
        Features: pkg.features,
        Status: pkg.status === 1 ? "Active" : "Inactive",
        "Created At": new Date(pkg.createdAt).toLocaleDateString(),
        "Updated At": new Date(pkg.updatedAt).toLocaleDateString(),
      }));

      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Packages");

      XLSX.writeFile(workbook, "All_Packages.xlsx");

      Swal.fire("Success", "Packages downloaded successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export packages", "error");
    }
  };

  useEffect(() => {
    fetchPackages(currentPage, perPage);
    fetchAllPackages();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (pkg) => {
    const token = localStorage.getItem("adminToken");
    const newStatus = pkg.status === 1 ? 0 : 1;

    try {
      const res = await UpdatePackageStatus(token, {
        package_id: pkg.id,
        status: newStatus,
      });

      if (res?.status) {
        Swal.fire("Success", res?.msg || "Status updated", "success");
        fetchPackages();
      } else {
        Swal.fire("Error", res?.msg || "Failed to update status", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  const handleDelete = async (packageId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await DeletePackage(packageId, token);
        if (response?.status) {
          Swal.fire("Deleted!", response.msg || "Package deleted.", "success");
          fetchPackages();
        } else {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Server error. Try again.", "error");
      }
    }
  };

  const filteredPackages = searchText
    ? allPackages.filter((p) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          p.name?.toLowerCase().includes(lowerSearch) ||
          p.price?.toString().toLowerCase().includes(lowerSearch) ||
          p.validity_in_months?.toString().toLowerCase().includes(lowerSearch)
        );
      })
    : packages;

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: false,
    },
    {
      name: "Price (₹)",
      selector: (row) => `₹${row.price}`,
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
      wrap: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="form-check form-switch d-flex justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            id={`statusSwitch-${row.id}`}
            checked={row.status === 1}
            onChange={() => handleStatusToggle(row)}
            style={{
              cursor: "pointer",
              width: "3rem",
              height: "1.5rem",
            }}
          />
        </div>
      ),
      center: true,
    },

    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      name: "Updated At",
      selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            disabled={row.status !== 1}
            onClick={() => navigate(`/admin/UpdatePackages/${row.id}`)}
          >
            <i className="fa fa-edit me-1" />
            Update
          </button>
          {/* <button
            className="btn btn-sm btn-danger"
            disabled={row.status !== 1}
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash me-1" />
            Delete
          </button> */}
        </div>
      ),
      width: "140px",
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-2">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">All Packages</h2>
          </div>
        </div>

        <div className="col-md-6 text-end mt-2">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-2"></i>
            Download Excel
          </button>

          <Link to="/admin/addpackage" className="btn btn-primary me-2">
            + Add Package
          </Link>
        </div>
      </div>

      <div className="card table-padding">
        <div className="col-md-4 p-1">
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

        <div className="col-md-12">
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
  );
}
