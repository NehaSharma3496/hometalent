import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetReport } from "../../../Services/webService/Web";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { GetEmployeePermission } from "../../../Services/admin/Admin";

export default function AllReport() {
  const navigate = useNavigate();

  const [report, setReport] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [allReport, setAllReport] = useState([]);
  const token = localStorage.getItem("token");
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

  const fetchReport = async (page, limit) => {
    setLoading(true);
    try {
      const res = await GetReport(token, page, limit);
      if (res?.data && res?.pagination) {
        setReport(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(currentPage, perPage);
    fetchAllReport();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const fetchAllReport = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetReport(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) fullList = [...fullList, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllReport(fullList);
    } catch (err) {
      console.error("Error fetching all report:", err);
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allReport = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetReport(token, page, limit);
        const { data, pagination } = res || {};

        if (data?.length) allReport = [...allReport, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      const exportData = allReport?.map((row, index) => {
        return {
          "S.No": index + 1,
          Name: row.name || "N/A",
          "Phone Number": row.phone || "N/A",
          Reason: row.reason || "N/A",
          "Owner Name": row.User?.owner_name || "N/A",
          Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Report");
      XLSX.writeFile(workbook, "All_Report_List.xlsx");
    } catch (err) {
      console.error("Error exporting report:", err);
      Swal.fire("Error", "Failed to export all report", "error");
    }
  };

  const filteredReport = searchText
    ? allReport?.filter((v) => {
        const lowerSearch = searchText.toLowerCase();

        return (
          v.User.owner_name?.toLowerCase().includes(lowerSearch) ||
          v.email?.toLowerCase().includes(lowerSearch) ||
          v.phone?.toLowerCase().includes(lowerSearch) ||
          v.name?.toLowerCase().includes(lowerSearch)
        );
      })
    : allReport;

  const columns = [
    {
      name: "S.No",
    selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row?.name || "N/A",
      width: "150px",
    },
    {
      name: "Phone",
      selector: (row) => row?.phone || "N/A",
      width: "150px",
    },
    {
      name: "Reason",
      selector: (row) => row?.reason || "N/A",
      width: "300px",
    },
    {
      name: "Vendor Name",
      selector: (row) => row?.User?.owner_name || "N/A",
      width: "200px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
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
            <h2 className="add-page-heading">All Report</h2>
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
      <div className="card table-padding-inside">
        <div className="col-md-4">
          <div className="d-flex align-items-center border rounded px-2">
            <i className="ri-search-line me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search ..."
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
              data={filteredReport}
              pagination
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
