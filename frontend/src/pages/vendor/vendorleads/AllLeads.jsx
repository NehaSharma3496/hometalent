import React, { useEffect, useState } from "react";
import { GetAllVendorLeads } from "../../../Services/vendor/Vendor";
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";

export default function AllLeads() {
  const [leads, setLeads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [allLeads, setAllLeads] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [fullText, setFullText] = useState("");

  const handleReadMore = (text) => {
    setFullText(text);
    setShowModal(true);
  };

  const fetchAllLeads = async (page, limit) => {
    setLoading(true);
    try {
      const res = await GetAllVendorLeads(token, userId, page, limit);
      if (res?.data && res?.pagination) {
        setLeads(res.data);
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

  const fetchGlobalLeads = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    let fullList = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await GetAllVendorLeads(token, userId, page, limit);
      if (res?.data && res?.pagination?.total_records) {
        fullList = [...fullList, ...res.data];
        totalPages = Math.ceil(res.pagination.total_records / limit);
      } else {
        break;
      }
      page++;
    }

    setAllLeads(fullList);
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      let allLeads = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetAllVendorLeads(token, userId, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) allLeads = [...allLeads, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break; // Exit if pagination not available
        }

        page++;
      }

      const exportData = allLeads.map((lead, index) => ({
        "S.No": index + 1,
        "Client Name": lead.name || "N/A",
        "Client Phone": lead.phone || "N/A",
        "Client Email": lead.email || "N/A",
        "Client Query": lead.query || "N/A",
        Date: lead.createdAt
          ? new Date(lead.createdAt).toLocaleDateString()
          : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Leads");

      XLSX.writeFile(workbook, "vendor-leads.xlsx");
    } catch (err) {
      console.error("Error exporting leads:", err);
      Swal.fire("Error", "Failed to export all vendor leads", "error");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllLeads(currentPage, perPage);
      fetchGlobalLeads();
    }
  }, [userId, currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const filteredLeads = searchText
    ? allLeads.filter((lead) => {
        const lowerSearch = searchText.toLowerCase();
        return (
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
      name: "Client Name"||"-",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: " Client Phone"||"-",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Client Email" ||"-",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Client Query",
      sortable: true,
      cell: (row) => {
        if (!row?.query) return "—";

        const maxLength = 50; // number of letters to show
        const shortText =
          row.query.length > maxLength
            ? row.query.substring(0, maxLength) + "..."
            : row.query;

        return (
          <div>
            {row.query.length > maxLength ? (
              <>
                {shortText}{" "}
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#e9f5ff",
                    color: "#007bff",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: "500",
                    border: "1px solid #cce5ff",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReadMore(row.query)}
                >
                  Read More
                </button>
              </>
            ) : (
              row.query
            )}
          </div>
        );
      },
    },

    {
      name: "Date" ||"-",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      {/* 🔹 Top Header Row */}
      <div className="row align-items-center mb-3">
        {/* Left side: Back + Heading */}
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">All Leads</h2>
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="col-md-6 text-end mt-2">
          <button className="btn btn-success me-2" onClick={exportToExcel}>
            <i className="fa-solid fa-file-excel me-1"></i>
            Download Excel
          </button>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="card table-padding">
        <div className="card-header">
          <div className="col-md-4">
            <div className="d-flex align-items-center border rounded px-2">
              <i className="ri-search-line me-2 text-muted" />
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
          </div>
        </div>

        <div className="row">
          <div className="card-body">
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

      {/* 🔹 Full Query Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Full Query</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {fullText}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
