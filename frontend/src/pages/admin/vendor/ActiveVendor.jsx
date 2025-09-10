import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetActiveVendors, GetCategories } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function ActiveVendor() {
  const [activevendors, setActiveVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [allActiveVendors, setAllActiveVendors] = useState([]);

  const fetchActiveVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetActiveVendors(token, page, limit);
      if (res?.data && res?.pagination) {
        setActiveVendors(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching active vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVendors(currentPage, perPage);
    fetchAllActiveVendors();
    fetchCategories();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const fetchAllActiveVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetActiveVendors(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) fullList = [...fullList, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllActiveVendors(fullList);
    } catch (err) {
      console.error("Error fetching all active vendors:", err);
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetActiveVendors(token, page, limit);
        const { data, pagination } = res || {};

        if (data?.length) allVendors = [...allVendors, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
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
          "Experience Since": row.experience_since || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Active Vendors");
      XLSX.writeFile(workbook, "Active_Vendor_List.xlsx");
    } catch (err) {
      console.error("Error exporting vendors:", err);
      Swal.fire("Error", "Failed to export all active vendors", "error");
    }
  };

  const filteredActiveVendors = searchText
    ? allActiveVendors.filter((v) => {
        const lowerSearch = searchText.toLowerCase();
        const categoryNames = v.category_id
          ? v.category_id
              .split(",")
              .map((id) => categoryMap[id.trim()]?.toLowerCase() || "")
              .join(", ")
          : "";

        return (
          v.owner_name?.toLowerCase().includes(lowerSearch) ||
          v.email?.toLowerCase().includes(lowerSearch) ||
          v.phone?.toLowerCase().includes(lowerSearch) ||
          v.price_range?.toLowerCase().includes(lowerSearch) ||
          v.experience_since?.toLowerCase().includes(lowerSearch) ||
          categoryNames.includes(lowerSearch)
        );
      })
    : activevendors;

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
      width: "70px",
    },
    {
      name: "Owner Name",
      selector: (row) => row.owner_name || "—",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
      sortable: true,
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
      name: "Experience Since",
      selector: (row) => row.experience_since || "—",
      sortable: true,
    },
  ];

  return (
    <div className="page-content table-padding ">
      <div className="row align-items-center mb-3  ">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Active Vendors</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>
      <div className="card table-padding-inside">
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
              data={filteredActiveVendors}
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
