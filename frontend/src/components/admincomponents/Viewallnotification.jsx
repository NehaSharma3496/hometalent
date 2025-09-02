import React, { useState, useEffect } from "react";
import {
  GetAllAdminNotification,
  GetAllVendorNotification,
} from "../../Services/notification.js/Notification";
import { useNavigate } from "react-router-dom";
import Datatable from "react-data-table-component";

export default function ViewAllNotification() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);


useEffect(() => {
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let res;
      if (role === "1") {
        res = await GetAllAdminNotification(currentPage, perPage);
      } else if (role === "2") {
        res = await GetAllVendorNotification(userId, currentPage, perPage);
      }

      if (res?.status && res?.data) {
        setNotifications(res.data);
        setTotal(res.meta?.total || 0);  // total records
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, [role, userId, currentPage, perPage]);


  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // columns for datatable
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      width: "250px",

    },
    {
      name: "Message",
      selector: (row) => row.message,
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => formatDateTime(row.createdAt),
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-2 mt-3 flex-nowrap">
        <div className="d-flex align-items-center">
          <button
            onClick={() =>
              navigate(role === "1" ? "/admin/dashboard" : "/vendor/dashboard")
            }
            className="btn btn-link p-0 me-2"
          >
            <i className="fa fa-arrow-left"></i>
          </button>
          <h5 className="page-heading mb-0">All Notifications</h5>
        </div>
      </div>

      {/* Datatable */}
      <div className="card table-padding">
        <div className="card-body">
       <Datatable
  columns={columns}
  data={notifications}
  progressPending={loading}
  pagination
  paginationServer={true}   // ✅ ab server side pagination hoga
  paginationPerPage={perPage}
  paginationTotalRows={total}  // backend se meta.total use karo
  onChangeRowsPerPage={(newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  }}
  onChangePage={(page) => setCurrentPage(page)}
/>

        </div>
      </div>
    </div>
  );
}
