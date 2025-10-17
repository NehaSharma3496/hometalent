import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Datatable from "react-data-table-component";
import { GetGalleryRequest, GetEmployeePermission } from "../../../Services/admin/Admin";

export default function AllGalleryRequest() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [permissions, setPermissions] = useState([]);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // 🔹 Fetch Employee Permissions (same as your Allvendors logic)
  useEffect(() => {
    const fetchPermissions = async () => {
      if (role !== "3") return;
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

  // 🔹 Fetch Pending Gallery Vendors
  const fetchGalleryRequests = async () => {
    setLoading(true);
    try {
      let allData = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetGalleryRequest(token, page, limit);
        if (res?.status && Array.isArray(res.data)) {
          allData = [...allData, ...res.data];
        }

        if (res?.pagination) {
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          break;
        }
        page++;
      }

      setVendors(allData);
    } catch (error) {
      console.error("Error fetching gallery requests:", error);
      Swal.fire("Error", "Failed to fetch gallery requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryRequests();
  }, []);

  // 🔹 Search Filter
  const filteredVendors = vendors.filter((v) => {
    const lower = searchText.toLowerCase();
    return (
      v.owner_name?.toLowerCase().includes(lower) ||
      v.City?.name?.toLowerCase().includes(lower) ||
      v.State?.name?.toLowerCase().includes(lower) ||
      v.phone?.toLowerCase().includes(lower) ||
      (Array.isArray(v.category_names)
        ? v.category_names.join(", ").toLowerCase().includes(lower)
        : v.category_names?.toLowerCase().includes(lower))
    );
  });

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // 🔹 Columns for DataTable
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
      width: "180px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone || "—",
      width: "140px",
    },
    {
      name: "State",
      selector: (row) => row.State?.name || "—",
      width: "150px",
    },
    {
      name: "City",
      selector: (row) => row.City?.name || "—",
      width: "150px",
    },
    {
      name: "Category",
      selector: (row) =>
        Array.isArray(row.Category.name)
          ? row.Category.name.join(", ")
          : row.Category.name || "—",
      width: "200px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() =>
              navigate(`/admin/galleryUpdates/vendorgallery/${row.id}`)
            }
            title="View Gallery"
          >
            <i className="fa-regular fa-eye"></i>
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Pending Gallery Requests</h2>
          </div>
        </div>
      </div>

      <div className="card table-padding">
        <div className="card-header">
          <div className="d-flex align-items-center border rounded px-2" style={{ width: "250px" }}>
            <i className="ri-search-line me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search..."
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

        <div className="card-body">
          <Datatable
            columns={columns}
            data={paginatedVendors}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={filteredVendors.length}
            paginationPerPage={perPage}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
