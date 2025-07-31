import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetActiveVendors, GetCategories } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";

export default function ActiveVendor() {
  const [activevendors, setActiveVendors] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

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
    fetchCategories();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(activevendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Active Vendor");

    XLSX.writeFile(workbook, "Active vendor List.xlsx");
  };

  const filteredActiveVendors = activevendors.filter((activevendors) =>
    activevendors.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

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
      selector: (row) => row.owner_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
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
      name: "Profile Name",
      selector: (row) => row.profile_name,
      sortable: true,
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
      name: "Short Description",
      selector: (row) => row.short_description,
      sortable: true,
    },

    {
      name: "Social Media",
      cell: (row) =>
        row.social_media_link ? (
          <a
            href={row.social_media_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-instagram" />
          </a>
        ) : (
          <span className="text-muted">Not Provided</span>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
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
