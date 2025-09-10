import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetVendoreList } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function ApprovedVendors() {
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allApprovedVendors, setAllApprovedVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchApprovedVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetVendoreList(token, page, limit);
      if (res?.data && res?.pagination) {
        const approved = res.data?.filter(
          (vendor) => vendor.approval_status === 1
        );
        setApprovedVendors(approved || []);

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
        const res = await GetVendoreList(token, page, limit);
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
        Categories: Array.isArray(row.category_names)
          ? row.category_names.join(", ")
          : row.category_names || "N/A",
        Phone: row.phone || "N/A",
        "Price Range": row.price_range || "N/A",
        Experience: row.experience_since || "N/A",
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
      vendor.phone?.toLowerCase().includes(lowerSearch)||
      vendor.price_range?.toLowerCase().includes(lowerSearch) ||
      vendor.experience_since?.toLowerCase().includes(lowerSearch) ||
       (Array.isArray(vendor.category_names)
            ? vendor.category_names.join(", ").toLowerCase().includes(lowerSearch)
            : vendor.category_names?.toLowerCase().includes(lowerSearch))
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
        const res = await GetVendoreList(token, page, limit);
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
      name: "Categories",
      selector: (row) => row.category_names.join(", ") || "—",
      sortable: false,
    },
    { name: "Phone", selector: (row) => row.phone || "—", sortable: true },
    { name: "Price Range", selector: (row) => row.price_range || "—", sortable: true },
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
            <Link to="/admin/dashboard">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Approved Vendors</h2>
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
