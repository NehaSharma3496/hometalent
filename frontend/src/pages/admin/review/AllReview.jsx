import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApproveReview,
  UpdateReviewStatus,
  GetAllReview,
} from "../../../Services/admin/Admin";
import Datatable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { GetEmployeePermission } from "../../../Services/admin/Admin";

export default function AllReviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [allReview, setAllReview] = useState([]);
  const role = localStorage.getItem("role");
  const login_id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [fullText, setFullText] = useState("");

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

  const fetchReview = async (page, limit) => {
    setLoading(true);
    try {
      const res = await GetAllReview(token, page, limit);
      if (res?.data && res?.pagination) {
        setReviews(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching review:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (text) => {
    setFullText(text);
    setShowModal(true);
  };

  useEffect(() => {
    fetchReview(currentPage, perPage);
    fetchAllReview();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleApprove = async (reviewId, action) => {
    try {
      const confirm = await Swal.fire({
        title: action === 1 ? "Approve Review?" : "Reject Review?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: action === 1 ? "Yes, Approve" : "Reject",
      });

      if (!confirm.isConfirmed) return;

      const response = await ApproveReview(reviewId, {
        approve_status: action,
      });

      if (response?.status === true) {
        Swal.fire("Success", "Review status updated", "success");
        fetchReview(currentPage, perPage);
        fetchAllReview();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleStatusToggle = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const token = localStorage.getItem("token");

      const confirm = await Swal.fire({
        title: newStatus === 1 ? "Activate Review?" : "Deactivate Review?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: newStatus === 1 ? "Activate" : "Deactivate",
      });

      if (!confirm.isConfirmed) return;

      const res = await UpdateReviewStatus(
        reviewId,
        newStatus,
        token,
        login_id
      );

      if (res?.status === true) {
        Swal.fire("Success", "Review status updated", "success");
        fetchReview(currentPage, perPage);
        fetchAllReview();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    }
  };

  const fetchAllReview = async () => {
    try {
      const token = localStorage.getItem("token");
      let fullList = [];
      let page = 1;
      const limit = 100;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetAllReview(token, page, limit);
        const { data, pagination } = res || {};
        if (data?.length) fullList = [...fullList, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      setAllReview(fullList);
    } catch (err) {
      console.error("Error fetching all review:", err);
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      let allReview = [];
      let page = 1;
      const limit = 1000000;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await GetAllReview(token, page, limit);
        const { data, pagination } = res || {};

        if (data?.length) allReview = [...allReview, ...data];

        if (pagination) {
          totalPages = Math.ceil(pagination.total_records / limit);
        } else {
          break;
        }

        page++;
      }

      const exportData = allReview?.map((row, index) => {
        return {
          "S.No": index + 1,
          Name: row.name || "N/A",
          Email: row.email || "N/A",
          "Phone Number": row.phone || "N/A",
          Ratings: row.rating || "N/A",
          "Owner Name": row.User?.owner_name || "N/A",
          Review: row.message || "N/A",
          "Approval Status":
            row.approve_status === 1
              ? "Approved"
              : row.approve_status === 0
              ? "Rejected"
              : "Pending",
          "Active Status": row.status === 1 ? "Active" : "Inactive",
          Date: new Date(row.createdAt).toLocaleDateString() || "N/A",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Review");
      XLSX.writeFile(workbook, "All_Review_List.xlsx");
    } catch (err) {
      console.error("Error exporting review:", err);
      Swal.fire("Error", "Failed to export all review", "error");
    }
  };

  const filteredReview = searchText
    ? allReview?.filter((v) => {
        const lowerSearch = searchText.toLowerCase();

        return (
          v.User.owner_name?.toLowerCase().includes(lowerSearch) ||
          v.email?.toLowerCase().includes(lowerSearch) ||
          v.phone?.toLowerCase().includes(lowerSearch) ||
          v.name?.toLowerCase().includes(lowerSearch)
        );
      })
    : allReview;

  let columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row?.name || "N/A",
    },
    {
      name: "Email",
      selector: (row) => row?.email || "N/A",
      width: "250px",
    },
    {
      name: "Phone",
      selector: (row) => row?.phone || "N/A",
      width: "150px",
    },
    {
      name: "Ratings",
      selector: (row) => row?.rating || "N/A",
    },
    {
      name: "Vendor Name",
      selector: (row) => row?.User?.owner_name || "N/A",
    },
    {
      name: "Review",
      sortable: true,
      cell: (row) => {
        const maxLength = 50;
        const shortText =
          row.message.length > maxLength
            ? row.message.substring(0, maxLength) + "..."
            : row.message;

        return row.message.length > maxLength ? (
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
                width: "200px",
              }}
              onClick={() => handleReadMore(row.message)}
            >
              Read More
            </button>
          </>
        ) : (
          row.message
        );
      },
      width: "250px",
    },
  ];

  // ✅ Only add Approval & Active for non-role 3
  if (role !== "3") {
    columns.push(
      {
        name: "Approval Status",
        cell: (row) => {
          if (row.approve_status === 1) {
            return <span className="badge bg-success fs-6">Approved</span>;
          }
          if (row.approve_status === 0) {
            return <span className="badge bg-danger fs-6">Rejected</span>;
          }
          return (
            <div className="dropdown">
              <button
                className="btn btn-sm bg-warning dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Pending
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item text-success"
                    onClick={() => handleApprove(row.id, 1)}
                  >
                    ✅ Approve
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => handleApprove(row.id, 0)}
                  >
                    ❌ Reject
                  </button>
                </li>
              </ul>
            </div>
          );
        },
      },
      {
        name: "Active",
        cell: (row) => (
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={row.status === 1}
              disabled={row.approve_status !== 1}
              onChange={() => handleStatusToggle(row.id, row.status)}
              style={{ width: "3.5rem", height: "1.5rem" }}
            />
          </div>
        ),
      }
    );
  }

  columns.push({
    name: "Date",
    selector: (row) => new Date(row.createdAt).toLocaleDateString(),
  });

  return (
    <div className="page-content table-padding ">
      <div className="row align-items-center mb-3  ">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">All Review</h2>
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
              data={filteredReview}
              pagination
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
      </div>
    </div>
  );
}
