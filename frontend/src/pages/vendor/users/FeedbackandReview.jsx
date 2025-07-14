import React from "react";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";

export default function FeedbackandReview() {
  const columns = [
    {
      name: "SR.NO.",
      selector: (row) => row.sno,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Feedback",
      selector: (row) => row.feedback,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-div">
          <a title="Delete" href="#">
            <i className="fa-solid fa-trash-can"></i>
          </a>
        </div>
      ),
      sortable: false,
    },
  ];

  const data = [
    {
      sno: 1,
      username: "john_doe",
      email: "john.doe@example.com",
      feedback: "Great platform, very helpful!",
      rating: 5,
      date: "2024-06-15",
    },
    {
      sno: 2,
      username: "jane_smith",
      email: "jane.smith@example.com",
      feedback: "Needs more features.",
      rating: 3,
      date: "2024-07-01",
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/vendor/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Feedback & Reviews</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button type="button" className="add-btn-head" disabled>
            + Add Feedback
          </button>
        </div>
      </div>

      <div className="card">
        <div className="row filter-forms">
          <div className="col-lg-3">
            <div className="form-row">
              <input
                className="form-input"
                type="text"
                placeholder="Search by user name or email"
              />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="form-row">
              <select className="form-input">
                <option>Rating</option>
                <option value="all">All</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          <div className="col-lg-3">
            <button
              type="button"
              className="filter-reset-btn"
              title="Export To Excel"
            >
              <i className="fa fa-download" aria-hidden="true"></i> Export Excel
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={data} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
