import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import {
  GetRejectedVendor,
  GetCategories,
  GetApproveVendor,
} from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function RejectedVendors() {
  const [rejectedvendors, setRejectedVendors] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [allRejectedVendors, setAllRejectedVendors] = useState([]);
  const navigate = useNavigate();


  const login_id = localStorage.getItem("userId");

  const fetchRejectedVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetRejectedVendor(token, page, limit);
      if (res?.data && res?.pagination) {
        setRejectedVendors(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
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

  const fetchAllRejectedVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetRejectedVendor(token, page, limit);
        if (res?.data && res?.pagination) {
          fullList = [...fullList, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          break;
        }
        page++;
      }

      setAllRejectedVendors(fullList);
    } catch (err) {
      console.error("Error fetching all rejected vendors:", err);
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      // Fetch all paginated rejected vendors
      while (page <= totalPages) {
        const res = await GetRejectedVendor(token, page, limit);
        if (res?.data && res?.pagination) {
          allVendors = [...allVendors, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }
        page++;
      }

      if (!allVendors.length) {
        return Swal.fire(
          "No Data",
          "No rejected vendors found to export",
          "info"
        );
      }

      const exportData = allVendors.map((row, index) => {
        const categoryNames = row.category_id
          ? row.category_id
              .split(",")
              .map((id) => categoryMap[id.trim()] || `ID-${id.trim()}`)
              .join(", ")
          : "—";

        return {
          "S.No": index + 1,
          "Owner Name": row.owner_name || "N/A",
          Email: row.email || "N/A",
          "Category Names": categoryNames,
          "Phone Number": row.phone || "N/A",
          "Price Range": row.price_range || "N/A",
          "Pin Code": row.pin_code || "N/A",
          "Experience Since": row.experience_since || "N/A",
          Approval_Status:
            row.approval_status === 1
              ? "Approved"
              : row.approval_status === 2
              ? "Rejected"
              : "Pending",
                Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rejected Vendors");
      XLSX.writeFile(workbook, "Rejected_Vendor_List.xlsx");

      Swal.fire(
        "Success",
        "Rejected vendor list downloaded successfully",
        "success"
      );
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export rejected vendors", "error");
    }
  };

 const handleApproveVendor = async (vendorId, status) => {
  try {
    const confirm = await Swal.fire({
      title: "Approve Vendor?",
      text: "Are you sure you want to approve this vendor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, approve!",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    const login_id = localStorage.getItem("userId"); // 🔹 yaha login_id le rahe hain

    // API call with login_id
    const response = await GetApproveVendor(vendorId, status, token, login_id);

    if (response.status === true || response.status === "true") {
      await Swal.fire("Success", response.message, "success");
      fetchRejectedVendors(currentPage, perPage);
      fetchAllRejectedVendors();
    } else {
      throw new Error(response.message || "Failed to update approval");
    }
  } catch (err) {
    console.error(err);
    await Swal.fire("Error!", "Something went wrong.", "error");
  }
};


  const filteredRejectedVendors = searchText
    ? allRejectedVendors.filter((vendor) => {
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
    : rejectedvendors;

  useEffect(() => {
    fetchRejectedVendors(currentPage, perPage);
    fetchAllRejectedVendors();
    fetchCategories();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
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
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
      sortable: true,
      width: "200px",
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
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone || "—",
      sortable: true,
    },
    {
      name: "Price Range",
      selector: (row) => row.price_range || "—",
      sortable: true,
    },
    {
      name: "Pin Code",
      selector: (row) => row.pin_code || "—",
      sortable: true,
    },
    {
      name: "Experience Since",
      selector: (row) => row.experience_since || "—",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <div className="dropdown">
            <>
              <button
                className={`badge bg-danger dropdown-toggle fs-6`}
                type="button"
                id={`actionDropdown-${row.id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Rejected
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby={`actionDropdown-${row.id}`}
              >
                <li>
                  <button
                    className="dropdown-item text-success"
                    onClick={() => handleApproveVendor(row.id, 1)}
                  >
                    ✅ Approve
                  </button>
                </li>
              </ul>
            </>
          </div>
        );
      },
      width: "120px",
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Rejected Vendors</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>
      <div className="card table-padding">
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
              data={filteredRejectedVendors}
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
