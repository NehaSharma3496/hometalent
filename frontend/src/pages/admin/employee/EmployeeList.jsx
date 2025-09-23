import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetEmployeeList,UpdateVendorStatus } from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function EmployeeList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [employee, setEmployee] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [allemployee, setAllEmployee] = useState([]);

  const fetchEmployee = async (page, limit) => {
    setLoading(true);
    try {
      const res = await GetEmployeeList(token, page, limit);
      if (res?.data && res?.pagination) {
        setEmployee(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee(currentPage, perPage);
    fetchAllEmployee();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const fetchAllEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetEmployeeList(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) fullList = [...fullList, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllEmployee(fullList);
    } catch (err) {
      console.error("Error fetching all employee:", err);
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
          fetchEmployee(currentPage, perPage);
          fetchAllEmployee();
        } else {
          throw new Error(res?.message || "Failed to update status");
        }
      } catch (err) {
        console.error(err);
        await Swal.fire("Error", "Failed to update status.", "error");
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
        const res = await GetEmployeeList(token, page, limit);
        const { data, pagination } = res || {};

        if (data?.length) allVendors = [...allVendors, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      const exportData = allVendors?.map((row, index) => {
        return {
          "S.No": index + 1,
          Name: row.profile_name || "N/A",
          Email: row.email || "N/A",
          "Phone Number": row.phone || "N/A",
          Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee");
      XLSX.writeFile(workbook, "Employee_List.xlsx");
    } catch (err) {
      console.error("Error exporting employee:", err);
      Swal.fire("Error", "Failed to export all employee", "error");
    }
  };

  const filteredEmployee = searchText
    ? allemployee?.filter((v) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          v.owner_name?.toLowerCase().includes(lowerSearch) ||
          v.email?.toLowerCase().includes(lowerSearch) ||
          v.phone?.toLowerCase().includes(lowerSearch)
        );
      })
    : employee;

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Owner Name",
      selector: (row) => row?.profile_name || "—",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email || "—",
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row?.phone || "—",
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
        onChange={(e) => {
          handleStatusChange(row.id, e.target.checked ? 1 : 2);
        }}
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
    <div className="page-content table-padding ">
      <div className="row align-items-center mb-3  ">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">All Employee</h2>
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
              data={filteredEmployee}
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
