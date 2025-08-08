import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GetPendingVendoreList,
  GetCategories,
  GetApproveVendor,
} from "../../../Services/admin/Admin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";

export default function PendingVendor() {
  const [pendingvendors, setPendingVendors] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const navigate = useNavigate();
  const [allPendingVendors, setAllPendingVendors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

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
        await Swal.fire(
          "Success",
          response.message ||
            (isApprove ? "Vendor approved." : "Vendor rejected."),
          "success"
        );
        fetchPendingVendors();
      } else {
        await Swal.fire(
          "Failed",
          response.message || "Something went wrong!",
          "error"
        );
      }
    } catch (error) {
      console.error("Error approving/rejecting vendor:", error);
      await Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const fetchPendingVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetPendingVendoreList(token, page, limit);
      if (res?.data && res?.pagination) {
        setPendingVendors(res.data);
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

  const fetchAllPendingVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetPendingVendoreList(token, page, limit);
        if (res?.data && res?.pagination) {
          fullList = [...fullList, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }
        page++;
      }

      setAllPendingVendors(fullList);
    } catch (err) {
      console.error("Error fetching all pending vendors:", err);
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      // Fetch all paginated data
      while (page <= totalPages) {
        const res = await GetPendingVendoreList(token, page, limit);
        if (res?.data && res?.pagination) {
          allVendors = [...allVendors, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }
        page++;
      }

      // Map to export format
      const exportData = allVendors.map((row, index) => {
        const categoryNames = row.category_id
          ? row.category_id
              .split(",")
              .map((id) => categoryMap[id.trim()] || `ID-${id.trim()}`)
              .join(", ")
          : "—";

        const statusText =
          row.approval_status === 1
            ? "Approved"
            : row.approval_status === 2
            ? "Rejected"
            : "Pending";

        return {
          "S.No": index + 1,
          "Owner Name": row.owner_name || "",
          Email: row.email || "",
          "Category Names": categoryNames,
          "Profile Name": row.profile_name || "",
          "Phone Number": row.phone || "",
          "Price Range": row.price_range || "",
          "Short Description": row.short_description || "",
          Image: row.image ? "Available" : "N/A",
          "Pin Code": row.pin_code || "",
          "Experience Since": row.experience_since || "",
          Status: statusText,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Vendors");
      XLSX.writeFile(workbook, "Pending_Vendor_List.xlsx");
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export pending vendors", "error");
    }
  };

  const filteredPendingVendors = searchText
  ? allPendingVendors.filter((vendor) => {
      const lowerSearch = searchText.toLowerCase();

      const categoryNames = vendor.category_id
        ? vendor.category_id
            .split(",")
            .map((id) => categoryMap[id.trim()]?.toLowerCase() || "")
            .join(", ")
        : "";

      return (
        vendor.owner_name?.toLowerCase().includes(lowerSearch) ||
        vendor.email?.toLowerCase().includes(lowerSearch) ||
        vendor.phone?.toLowerCase().includes(lowerSearch) ||
        vendor.price_range?.toLowerCase().includes(lowerSearch) ||
        vendor.pin_code?.toLowerCase().includes(lowerSearch) ||
        vendor.experience_since?.toLowerCase().includes(lowerSearch) ||
        categoryNames.includes(lowerSearch)
      );
    })
  : pendingvendors;


  useEffect(() => {
    fetchPendingVendors(currentPage, perPage);
    fetchAllPendingVendors();
    fetchCategories();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const fetchCategories = async () => {
    try {
      const res = await GetCategories();
      const categories = res.data;

      const categoryObject = {};
      categories.forEach((cat) => {
        categoryObject[cat.id] = cat.name;
      });

      setCategoryList(categories);
      setCategoryMap(categoryObject);
    } catch (error) {
      console.log("Error fetching categories", error);
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
      width: "100px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "180px",
    },
    {
      name: "Category Names",
      selector: (row) => {
        if (!row.category_id) return "—";
        const ids = row.category_id.split(",").map((id) => id.trim());
        const names = ids.map((id) => categoryMap[id] || `ID-${id}`);
        return names.join(", ");
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Price Range",
      selector: (row) => row.price_range,
      sortable: true,
    },
    {
      name: "Pin Code",
      selector: (row) => row.pin_code,
      sortable: true,
    },
    {
      name: "Experience Since",
      selector: (row) => row.experience_since,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const status = row.approval_status;

        // Set button label and color
        const getStatusLabel = () => {
          if (status === 1) return "Approved";
          if (status === 2) return "Rejected";
          return "Pending";
        };

        const getButtonClass = () => {
          if (status === 1) return "btn-success";
          if (status === 2) return "btn-danger";
          return "btn-warning dropdown-toggle"; // dropdown only for pending
        };

        return (
          <div className="dropdown">
            {status === 0 ? (
              <>
                <button
                  className={`btn btn-sm ${getButtonClass()}`}
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
      width: "180px",
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
            <h2 className="add-page-heading">Pending Vendors</h2>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
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
            <Datatable
              columns={columns}
              data={filteredPendingVendors}
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
