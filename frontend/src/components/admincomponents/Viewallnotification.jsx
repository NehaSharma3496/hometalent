import React, { useState, useEffect } from "react";
import { GetAllAdminNotification,GetAllVendorNotification } from "../../Services/notification.js/Notification";
import { useNavigate } from "react-router-dom";

const ViewAllNotification = () => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        let res;
        if (role === "1") {
          res = await GetAllAdminNotification();
        } else if (role === "2") {
          res = await GetAllVendorNotification(userId);
        }

        if (res?.status && res?.data) {
          // Sort by createdAt descending
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNotifications(sorted);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [role, userId]);

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString(); // You can customize format
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">All Notifications</h3>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted">No notifications found</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={`border rounded p-3 mb-2 shadow-sm ${notif.is_read ? "bg-white" : "bg-light border-start border-4 border-primary"}`}
          >
            <h5 className="mb-1">{notif.title}</h5>
            <p className="mb-1 text-secondary">{notif.message}</p>
            <small className="text-muted">{formatDateTime(notif.createdAt)}</small>
          </div>
        ))
      )}

      <button className="btn btn-outline-primary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default ViewAllNotification;
