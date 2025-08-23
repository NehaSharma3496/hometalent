import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GetAllLeads } from "../../../Services/admin/Admin";
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";

export default function AllLeads() {
  const [leads, setLeads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const [allLeads, setAllLeads] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchAllLeads = async (page, limit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetAllLeads(token, page, limit);
      if (res?.data && res?.pagination) {
        setLeads(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      Swal.fire("Error", "Could not load vendor list", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllLeads(currentPage, perPage);
    fetchGlobalLeads();
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

      let allLeads = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      // Fetch all paginated leads
      while (page <= totalPages) {
        const res = await GetAllLeads(token, page, limit);

        if (res?.data && res?.pagination?.total_records) {
          allLeads = [...allLeads, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }

        page++;
      }

      if (!allLeads.length) {
        Swal.fire("No Data", "There are no leads to export", "info");
        return;
      }

      const exportData = allLeads.map((lead, index) => ({
        "S.No": index + 1,
        "Vendor Name": lead.vendor?.owner_name || "-",
        "Vendor Phone": lead.vendor?.phone || "-",
        "Client Name": lead.name || "-",
        "Client Phone": lead.phone || "-",
        "Client Email": lead.email || "-",
        "Client Query": lead.query || "-",
        Date: new Date(lead.createdAt).toLocaleDateString(),
      }));

      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      XLSX.writeFile(workbook, "vendor-leads-list.xlsx");

      Swal.fire("Success", "Leads exported successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export leads", "error");
    }
  };

  const fetchGlobalLeads = async () => {
    const token = localStorage.getItem("token");
    let completeList = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await GetAllLeads(token, page, limit);
      if (res?.data && res?.pagination?.total_records) {
        completeList = [...completeList, ...res.data];
        totalPages = Math.ceil(res.pagination.total_records / limit);
      } else {
        break;
      }
      page++;
    }

    setAllLeads(completeList);
  };

  const filteredLeads = searchText
    ? allLeads.filter((lead) => {
      const lowerSearch = searchText.toLowerCase();
      return (
        lead.owner_name?.toLowerCase().includes(lowerSearch) ||
        lead.vendor?.phone?.toLowerCase().includes(lowerSearch) ||
        lead.name?.toLowerCase().includes(lowerSearch) ||
        lead.email?.toLowerCase().includes(lowerSearch) ||
        lead.phone?.toLowerCase().includes(lowerSearch)
      );
    })
    : leads;

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor?.owner_name,
      sortable: true,
    },
    {
      name: "Vendor Phone",
      selector: (row) => row.vendor?.phone,
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: " Client Phone",
      selector: (row) => row?.phone,
      sortable: true,
    },
    {
      name: "Client Email",
      selector: (row) => row?.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Client Query",
      selector: (row) => row?.query,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row?.createdAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-12 d-flex justify-content-between align-items-center flex-wrap">
          <div className="add-page-heading-div d-flex align-items-center">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">All Leads</h2>
          </div>

          <button className="btn btn-success me-2 mt-4" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>


      <div className="card table-padding">
        <div
          className="d-flex align-items-center border rounded px-2 "
          style={{ maxWidth: "250px" }}
        >
          <i className="ri-search-line me-2 mx-5 text-muted" />
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
        <div className="row">
          <div className="col-md-12">
            <Datatable
              columns={columns}
              data={filteredLeads}
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
