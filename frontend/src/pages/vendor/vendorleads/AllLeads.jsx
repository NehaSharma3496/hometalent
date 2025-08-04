import React, { useEffect, useState } from "react";
import { GetAllVendorLeads } from "../../../Services/vendor/Vendor";
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function AllLeads() {
  const [leads, setAllLeads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchAllLeads = async (page, limit) => {
    setLoading(true);
    try {
      const res = await GetAllVendorLeads(token, userId, page, limit);
      if (res?.data && res?.pagination) {
        setAllLeads(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      Swal.fire("Error", "Could not load vendor lead list", "error");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = filteredLeads.map((lead, index) => ({
      "S.No": index + 1,
      "Client Name": lead.name,
      "Client Phone": lead.phone,
      "Client Email": lead.email,
      "Client Query": lead.query,
      Date: new Date(lead.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(workbook, "vendor-leads.xlsx");
  };

  useEffect(() => {
    if (userId) {
      fetchAllLeads(currentPage, perPage);
    }
  }, [userId, currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
   {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Client Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: " Client Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Client Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Client Query",
      selector: (row) => row.query,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
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
            <h2 className="add-page-heading">All Leads</h2>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>
      <div className="card p-4">
        {/* 🔍 Styled Search Bar */}
        <div
          className="d-flex align-items-center border rounded px-2 "
          style={{ maxWidth: "250px" }}
        >
          <i className="ri-search-line me-2 mx-5 text-muted" />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Search by client name..."
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
