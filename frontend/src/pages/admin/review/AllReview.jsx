import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import {
  ApproveReview,
  UpdateReviewStatus,
  GetAllReview,
} from "../../../Services/admin/Admin";

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await GetAllReview(token, 1, 100);
      setReviews(res?.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
        fetchReviews();
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

      const res = await UpdateReviewStatus(reviewId, newStatus, token);

      if (res?.status === true) {
        Swal.fire("Success", "Review status updated", "success");
        fetchReviews();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    }
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Reviewer",
      selector: (row) => row.name || "N/A",
    },
    {
      name: "Review",
      selector: (row) => row.message || "N/A",
    },
    {
      name: "Approval",
      cell: (row) => {
        if (row.approve_status === 1) {
          return <span className="badge bg-success">Approved</span>;
        }

        if (row.approve_status === 0) {
          return <span className="badge bg-danger">Rejected</span>;
        }

        // approve_status === 2 (pending)
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
                  onClick={() => handleApprove(row.id, 1)} // ✅ Approve
                >
                  ✅ Approve
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => handleApprove(row.id, 0)} // ✅ Reject
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
            disabled={row.approve_status !== 1} // ✅ only allow if approved
            onChange={() => handleStatusToggle(row.id, row.status)}
            style={{ width: "3.5rem", height: "1.5rem" }}
          />
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
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
          />
        </div>
      </div>
    </div>
  );
}
