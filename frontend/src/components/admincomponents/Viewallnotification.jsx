import React, { useState, useEffect, useMemo } from "react";
import {
  GetAllAdminNotification,
  GetAllVendorNotification,
} from "../../Services/notification.js/Notification";
import { useNavigate } from "react-router-dom";

export default function ViewAllNotification() {
  const role = localStorage.getItem("role"); // 1 = Admin, 2 = Vendor
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
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

  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Card data mapping (like dashboard cards)
  const cards = useMemo(() => {
    if (!notifications?.length) return [];
    return notifications.map((notif) => ({
      title: notif.title,
      value: notif.message,
      icon: notif.is_read ? "fa fa-bell" : "fa fa-bell-o",
      color: notif.is_read ? "#6B7280" : "#3B82F6",
      date: formatDateTime(notif.createdAt),
      is_read: notif.is_read,
    }));
  }, [notifications]);

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
  {/* Header with back button */}
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

  {/* Notifications as line items */}
  <div className="card notification-list">
    {cards.length === 0 ? (
      <p className="text-muted px-3">No notifications found</p>
    ) : (
      cards.map((card, index) => (
        <div
          key={index}
          className="d-flex justify-content-between align-items-center py-2 border-bottom"
        >
          <div>
            <p className=" mb-1 fw-bold">{card.title}</p>
            <small className="">{card.date}</small>
          </div>
          <div className="text-end">
            <span className="">{card.value}</span>
            <i
              className={`${card.icon} ms-2`}
              style={{ color: card.color }}
            ></i>
          </div>
        </div>
      ))
    )}
  </div>
</div>

  );
}
