import React, { useEffect, useState } from "react";
import { GetAllFeedBack } from "../../../Services/admin/Admin";
import { Link,useNavigate } from "react-router-dom";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";


export default function AllFeedback() {
  const [feedback, setFeedback] = useState([]);
  const token = localStorage.getItem("token");
  const [searchText, setSearchText] = useState("");
  const [allFeedback, setAllFeedback] = useState([]);
  const navigate = useNavigate();

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


  const fetchAllFeedback = async (page, limit) => {
    setLoading(true);
    try {
      const res = await GetAllFeedBack(token, page, limit);
      if (res?.data && res?.pagination) {
        setFeedback(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      Swal.fire("Error", "Could not load feedback list", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalFeedback = async () => {
    const token = localStorage.getItem("token");
    let allData = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await GetAllFeedBack(token, page, limit);
      if (res?.data && res?.pagination?.total_records) {
        allData = [...allData, ...res.data];
        totalPages = Math.ceil(res.pagination.total_records / limit);
      } else {
        break;
      }
      page++;
    }

    setAllFeedback(allData);
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allContacts = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetAllFeedBack(token);

        if (res?.data && res?.pagination?.total_records) {
          allContacts = [...allContacts, ...res.data];
          totalPages = Math.ceil(res.pagination.total_records / limit);
        } else {
          throw new Error("Invalid response format");
        }

        page++;
      }

      if (!allFeedback.length) {
        Swal.fire("No Data", "There are no feedbacks to export", "info");
        return;
      }

      const filteredData = allFeedback.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
      );

      if (!filteredData.length) {
        Swal.fire("No Matches", "No feedbacks match your search", "info");
        return;
      }

      const formattedData = filteredData.map((item, index) => ({
        "S.No": index + 1,
        Name: item.name || "N/A",
        Email: item.email || "N/A",
        Phone: item.phone || "N/A",
        Message: item.message || "N/A",
        Date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB")
          : "N/A",
      }));

      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");

      XLSX.writeFile(workbook, "All-Feedback.xlsx");

      Swal.fire("Success", "Feedback exported successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export feedback", "error");
    }
  };

  const filteredFeedback = searchText
    ? allFeedback.filter((entry) => {
      const lowerSearch = searchText.toLowerCase();
      return (
        entry.name?.toLowerCase().includes(lowerSearch) ||
        entry.email?.toLowerCase().includes(lowerSearch) ||
        entry.phone?.toLowerCase().includes(lowerSearch)
      );
    })
    : allFeedback;

  useEffect(() => {
    fetchAllFeedback(currentPage, perPage);
    fetchGlobalFeedback();
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
      name: "Name",
      selector: (row) => row?.name || "—",
      sortable: true,
      width: "150px",

    },
    {
      name: "Email",
      selector: (row) => row?.email || "—",
      sortable: true,
      width: "300px",

    },
    {
      name: "Phone",
      selector: (row) => row?.phone || "—",
      sortable: true,
    },
    {
      name: "Message",
      sortable: true,
      cell: (row) => {
        if (!row?.message) return "—";
    
        const maxLength = 50;
        const shortText =
          row.message.length > maxLength
            ? row.message.substring(0, maxLength) + "..."
            : row.message;
    
        return (
          <div>
            {row.message.length > maxLength ? (
              <>
                {shortText}{" "}
                <button
                  className="btn btn-link p-0"
                  style={{
                    fontSize: "12px",
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onClick={() => handleReadMore(row.message)}
                >
                  Read More
                </button>
              </>
            ) : (
              row.message
            )}
          </div>
        );
      },
    },
    
    
    {
      name: "Date",
      selector: (row) => {
        if (!row?.createdAt) return "-";
        const d = new Date(row.createdAt);
        return `${String(d.getDate()).padStart(2, "0")}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}-${d.getFullYear()}`;
      },
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-12 d-flex justify-content-between align-items-center flex-wrap">
          <div className="add-page-heading-div d-flex align-items-center mb-2 mb-md-0">
      <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading ">All Feedback</h2>
          </div>

          <div className="text-end">
            <button className="btn btn-success mt-3" onClick={exportToExcel}>
              <i className="fa-solid fa-file-excel me-1"></i>
              Download Excel
            </button>
          </div>
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
            placeholder="Search by name..."
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
              data={filteredFeedback}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={perPage}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </div>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Full Message</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
              maxHeight: "400px", 
              overflowY: "auto",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap" 
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
      </div>
    </div>
  );
}
