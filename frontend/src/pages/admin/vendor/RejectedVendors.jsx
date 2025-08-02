import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GetRejectedVendor,
  GetCategories,
} from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";
import * as XLSX from "xlsx";

export default function RejectedVendors() {
  const [rejectedvendors, setRejectedVendors] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchRejectedVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetRejectedVendor(token,page, limit);
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

const exportToExcel = () => {
  const exportData = filteredRejectedVendors.map((row, index) => {
    const categoryNames = row.category_id
      ? row.category_id
          .split(",")
          .map((id) => categoryMap[id.trim()] || `ID-${id.trim()}`)
          .join(", ")
      : "—";

    return {
      "S.No": (currentPage - 1) * perPage + index + 1,
      "Owner Name": row.owner_name || "",
      "Email": row.email || "",
      "Category Names": categoryNames,
      "Profile Name": row.profile_name || "",
      "Phone Number": row.phone || "",
      "Price Range": row.price_range || "",
      "Short Description": row.short_description || "",
      "Image": row.image ? "Available" : "N/A",
      "Pin Code": row.pin_code || "",
      "Experience Since": row.experience_since || "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rejected Vendors");
  XLSX.writeFile(workbook, "Rejected_Vendor_List.xlsx");
};


  const filteredRejectedVendors = rejectedvendors.filter((vendor) =>
    vendor.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchRejectedVendors(currentPage, perPage);
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
      name: "Image",
      cell: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.profile_name}
            style={{ width: "70px", height: "70px", objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
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
