import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GetBlockedVendore,
  GetCategories,
  UpdateVendorStatus,
} from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function BlockedVendors() {
  const [blockedvendors, setBlockedVendors] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [allBlockedVendors, setAllBlockedVendors] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchBlockedVendors = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetBlockedVendore(token, page, limit);
      if (res?.data && res?.pagination) {
        const approvedVendors = res.data.filter((v) => v.approval_status === 1);
        setBlockedVendors(approvedVendors);
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
      const res = await UpdateVendorStatus(vendorId, newStatus, token);
      if (res?.status === true || res?.status === "true") {
        await Swal.fire("Success", "Vendor status updated.", "success");
        fetchBlockedVendors(currentPage, perPage);
      } else {
        throw new Error(res?.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      await Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const fetchAllBlockedVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetBlockedVendore(token, page, limit);
        const { data, pagination } = res || {};

        if (data?.length) {
          const approvedVendors = data.filter((v) => v.approval_status === 1);
          fullList = [...fullList, ...approvedVendors];
        }

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllBlockedVendors(fullList);
    } catch (err) {
      console.error("Error fetching all blocked vendors:", err);
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allVendors = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetBlockedVendore(token, page, limit);
        const { data, pagination } = res || {};

        if (data?.length) {
          allVendors = [...allVendors, ...data];
        }

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
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Blocked Vendors");
      XLSX.writeFile(workbook, "Blocked_Vendor_List.xlsx");
    } catch (err) {
      console.error("Error exporting blocked vendors:", err);
      Swal.fire("Error", "Failed to export blocked vendors", "error");
    }
  };

  const filteredBlockedVendors = searchText
  ? allBlockedVendors.filter((vendor) => {
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
  : blockedvendors;


  useEffect(() => {
    fetchBlockedVendors(currentPage, perPage);
    fetchAllBlockedVendors();
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
      width: "130px",
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
      width: "120px",
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
      name: "Active Status",
      cell: (row) => (
        <div className="form-check form-switch m-0 d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`toggle-${row.id}`}
            checked={row.status === 1}
            onChange={(e) =>
              handleStatusChange(row.id, e.target.checked ? 1 : 2)
            }
            style={{
              width: "3.5rem",
              height: "1.5rem",
              cursor: "pointer",
              marginTop: "2px",
            }}
          />
        </div>
      ),
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
            <h2 className="add-page-heading">Inactive Vendors</h2>
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
              data={filteredBlockedVendors}
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
