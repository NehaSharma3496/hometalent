import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Datatable from "react-data-table-component";
import {
  ApproveReview,
  UpdateReviewStatus,
  GetAllReview,
} from "../../../Services/admin/Admin";
import { Modal, Button } from "react-bootstrap";

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullText, setFullText] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // ✅ current page
  const [perPage, setPerPage] = useState(10); // ✅ rows per page
  const [totalRows, setTotalRows] = useState(0); // ✅ total rows

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const login_id = localStorage.getItem("userId");

  const handleReadMore = (text) => {
    setFullText(text);
    setShowModal(true);
  };

  const fetchReviews = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetAllReview(token, page, limit);

      if (res?.data && res?.pagination) {
        setReviews(res.data);
        setTotalRows(res.pagination.total_records);
      } else {
        setReviews([]);
        setTotalRows(0);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage, perPage);
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
        fetchReviews(currentPage, perPage);
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
        fetchReviews(currentPage, perPage);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    }
  };

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
    },
  ];

  if (role !== "3") {
    columns.push(
      {
        name: "Approval",
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
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">All Reviews</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <Datatable
            columns={columns}
            data={reviews}
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
  );
}
