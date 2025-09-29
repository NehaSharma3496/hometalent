import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetEmployeePermission,
  GetApprovedVendor,
} from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ApprovedVendors() {
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allApprovedVendors, setAllApprovedVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const fetchApprovedVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetApprovedVendor(token, page, limit);
      if (res?.data && res?.pagination) {
        setApprovedVendors(res?.data);

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

  useEffect(() => {
    fetchApprovedVendors(currentPage, perPage);
    fetchAllApprovedVendors();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetApprovedVendor(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) {
          const approvedOnly = data.filter(
            (vendor) => vendor.approval_status === 1
          );
          allVendors = [...allVendors, ...approvedOnly];
        }

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
        Categories: Array.isArray(row.Category?.name)
          ? row.Category?.name.join(", ")
          : row.Category?.name || "N/A",
        Phone: row.phone || "N/A",
        "Price Range": row.price_range || "N/A",
        Experience: row.experience_since || "N/A",
        Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Vendors");
      XLSX.writeFile(workbook, "Approved_Vendor_List.xlsx");
    } catch (err) {
      console.error("Error exporting vendors:", err);
      Swal.fire("Error", "Failed to export approved vendors", "error");
    }
  };

  const filtered = allApprovedVendors.filter((vendor) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      vendor.owner_name?.toLowerCase().includes(lowerSearch) ||
      vendor.email?.toLowerCase().includes(lowerSearch) ||
      vendor.phone?.toLowerCase().includes(lowerSearch) ||
      vendor.price_range?.toLowerCase().includes(lowerSearch) ||
      vendor.experience_since?.toLowerCase().includes(lowerSearch) ||
      (Array.isArray(vendor.Category?.name)
        ? vendor.Category?.name.join(", ").toLowerCase().includes(lowerSearch)
        : vendor.Category?.name?.toLowerCase().includes(lowerSearch))
    );
  });

  const filteredApprovedVendors = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const fetchAllApprovedVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetApprovedVendor(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) {
          const approvedOnly = data.filter(
            (vendor) => vendor.approval_status === 1
          );
          fullList = [...fullList, ...approvedOnly];
        }

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllApprovedVendors(fullList);
    } catch (err) {
      console.error("Error fetching all approved vendors:", err);
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
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
      sortable: true,
      width: "230px",
    },
    {
    name: "Category",
    selector: (row) => row.Category?.name || "—", // ✅ JSON se category dikhayega
    sortable: true,
    width: "180px",
  },

    { name: "Phone", selector: (row) => row.phone || "—", sortable: true },
    {
      name: "Price Range",
      selector: (row) => row.price_range || "—",
      sortable: true,
    },
    {
      name: "Experience",
      selector: (row) => row.experience_since || "—",
      sortable: true,
    },
  ];

  return (
    <div className="page-content ">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)} // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Approved Vendors</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          {(role !== "3" || permissions.includes("download_excel")) && (
            <button className="btn btn-success me-2" onClick={exportToExcel}>
              <i className="fa-solid fa-file-excel me-1"></i>
              Download Excel
            </button>
          )}
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
              data={filteredApprovedVendors}
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
