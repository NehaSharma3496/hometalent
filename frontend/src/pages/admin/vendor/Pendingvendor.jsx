import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GetPendingVendoreList,
  GetCategories,
  GetApproveVendor,
} from "../../../Services/admin/Admin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import * as XLSX from "xlsx";

export default function PendingVendor() {
  const [pendingvendors, setPendingVendors] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const navigate = useNavigate();

  const handleApproveVendor = async (vendorId) => {
    try {
      const confirm = await Swal.fire({
        title: "Approve Vendor?",
        text: "Are you sure you want to approve this vendor?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
      });

      if (!confirm.isConfirmed) return;

      const token = localStorage.getItem("token");
      const response = await GetApproveVendor(vendorId, token);

      if (response.status === true || response.status === "true") {
        await Swal.fire(
          "Approved!",
          "Vendor approved successfully.",
          "success"
        );
        fetchPendingVendors();
      } else {
        await Swal.fire("Failed!", "Failed to approve vendor.", "error");
      }
    } catch (error) {
      console.error("Error approving vendor:", error);
      await Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const fetchPendingVendors = async () => {
    try {
      const response = await GetPendingVendoreList();
      setPendingVendors(response.data);
      console.log("Vendor list", response.data);
    } catch (error) {
      console.log("error");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pendingvendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Vendor");

    XLSX.writeFile(workbook, "Pending vendor List.xlsx");
  };

  const filteredPendingVendors = pendingvendors.filter((vendor) =>
    vendor.owner_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchPendingVendors();
    fetchCategories();
  }, []);

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
      selector: (row, index) => index + 1,
      sortable: false,
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

    {
      name: "Action",
      cell: (row) => (
        <div className="action-div">
          <button
            className="btn btn-sm btn-success d-flex align-items-center gap-1"
            onClick={() => handleApproveVendor(row.id)}
            title="Approve"
          >
            Approve
          </button>
        </div>
      ),
      sortable: false,
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
              pagination
            />
          </div>
        </div>
      </div>
    </div>
  );
}
