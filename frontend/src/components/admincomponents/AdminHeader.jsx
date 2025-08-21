import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MenuItems from "../admincomponents/MenuItems.jsx";
import { GetVendorDetails } from "../../Services/vendor/Vendor.js";
import { useNotifications } from "../../contexts/NotificationContext.js";

export default function AdminHeader() {
  const role = localStorage.getItem("role");
  const MenuData = MenuItems[role] || [];
  const navigate = useNavigate();
  const vendorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [profileImage, setProfileImage] = useState(null);
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  

  // ✅ Context
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const userType = role === "1" ? "admin" : role === "2" ? "vendor" : "client";

  // --- LocalStorage sync ---
useEffect(() => {
  if (notifications && notifications.length > 0) {
    // Get previously stored notifications
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];

    // Merge current notifications with stored, remove duplicates by id
    const merged = [...stored, ...notifications].filter(
      (v, i, a) => a.findIndex(n => n.id === v.id) === i
    );

    // Limit to 20 latest notifications
    const latest20 = merged.slice(-20);

    localStorage.setItem("notifications", JSON.stringify(latest20));
  }
}, [notifications]);



  const handleViewAll = () => {
    markAllAsRead();
    navigate("/vendor/Viewallnotification");
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
    // You can navigate to detail if needed
    // e.g., navigate(`/notification/${notificationId}`);
  };

  const RoleConfig = {
    1: {
      changePassword: "/admin/forgotpassword/changepassword",
      defaultImage: "/assets/images/admin/user-img.png",
    },
    2: {
      profileLink: "/vendor/myprofile",
      changePassword: "/admin/forgotpassword/changepassword",
      defaultImage: "/assets/images/admin/user-img.png",
    },
  };

  const currentRole = RoleConfig[role] || RoleConfig[1];

  useEffect(() => {
    if (window.innerWidth < 1200) {
      setSidebarToggled(true);
    }
  }, []);

  useEffect(() => {
    if (sidebarToggled) {
      document.body.classList.add("sidebar-toggle");
    } else {
      document.body.classList.remove("sidebar-toggle");
    }
  }, [sidebarToggled]);

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };

  const Logout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, logout",
    });

    if (!confirm.isConfirmed) return;

    localStorage.clear();

    await Swal.fire(
      "Logged out",
      "You have been successfully logged out.",
      "success"
    );

    navigate("/");
  };

  useEffect(() => {
    const fetchVendorProfileImage = async () => {
      try {
        const result = await GetVendorDetails(token, vendorId);
        const imageUrl = result?.data?.user?.image;

        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching vendor profile image:", error);
      }
    };

    if (role === "2") {
      fetchVendorProfileImage();
    }
  }, [role, token, vendorId]);

  const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
const displayedNotifications = notifications.length > 0 ? notifications : storedNotifications;


  return (
    <>
      <header className="header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-9">
              <div className="left-header">
                <div className="logo-div me-5">
                  <Link to="#">
                    <img
                      src="/assets/images/logo/logo.png"
                      style={{ width: "100px" }}
                    />
                  </Link>
                </div>
                <span
                  className="toggle-sidebar-btn  px-5 ms-5"
                  onClick={handleToggle}
                >
                  <i className="fa-solid fa-angle-left"></i>
                </span>
              </div>
            </div>
            <div className="col-3">
              <div className="right-header">
                <div className="position-relative">
                  <div>
                    <button
                      className="btn p-0 setting-link position-relative"
                      onClick={() => setIsOpen(!isOpen)}
                      style={{ background: "none", border: "none" }}
                    >
                      <i className="fa-solid fa-bell text-primary fs-5"></i>
                      {unreadCount > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <>
                      <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 1040 }}
                        onClick={() => setIsOpen(false)}
                      ></div>

                      <div
                        className="position-absolute bg-white shadow-lg rounded-3 border"
                        style={{
                          top: "100%",
                          right: "0",
                          width: "380px",
                          maxHeight: "500px",
                          zIndex: 1050,
                          marginTop: "10px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white shadow-sm rounded-top">
                          <h6 className="mb-0 fw-semibold fs-5 text-primary d-flex align-items-center">
                            <i className="bi bi-bell-fill me-2 text-warning"></i>{" "}
                            Notifications
                          </h6>
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            onClick={() => setIsOpen(false)}
                          >
                            <i className="bi bi-x-lg me-1"></i> Close
                          </button>
                        </div>

                        <div
                          className="overflow-auto bg-light"
                          style={{ maxHeight: "400px" }}
                        >
                          {displayedNotifications .length === 0 ? (
                            <p className="text-center text-muted p-3">
                              No notifications
                            </p>
                          ) : (
                            displayedNotifications .map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-3 border-bottom rounded-2 mb-2 mx-2 shadow-sm notification-item hover-effect ${
                                  notification.isRead
                                    ? "bg-white"
                                    : "bg-primary-subtle border-start border-3 border-primary"
                                }`}
                                style={{
                                  cursor: "pointer",
                                  transition: "0.3s",
                                }}
                                onClick={() =>
                                  handleNotificationClick(notification.id)
                                }
                              >
                                <h6
                                  className={`mb-1 fw-bold d-flex align-items-center ${
                                    notification.isRead
                                      ? "text-secondary"
                                      : "text-primary"
                                  }`}
                                >
                                  <i className="bi bi-info-circle-fill me-2"></i>
                                  {notification?.data?.message}
                                </h6>
                                <div>
                                  <small className="text-muted fst-italic">
                                    {new Date(
                                      notification.timestamp
                                    ).toLocaleString()}
                                  </small>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="p-3 bg-white text-left rounded-bottom shadow-sm border-top">
                          <button
                            className="btn btn-gradient btn-sm px-4 py-2 rounded-pill fw-semibold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #4e54c8, #8f94fb)",
                              transition: "all 0.3s ease-in-out",
                              boxShadow: "0 4px 10px rgba(78, 84, 200, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "scale(1)";
                            }}
                            onClick={handleViewAll}
                          >
                            View All Notifications
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <div className="dropdown profile-dropdown-div">
                    <Link
                      className="dropdown-toggle"
                      to="/"
                      role="button"
                      id="profile-dropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={
                          role === "2" && profileImage
                            ? profileImage
                            : currentRole.defaultImage
                        }
                        className="user-img"
                        alt="Profile"
                      />
                      <i className="fa-solid fa-angle-down"></i>
                    </Link>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="profile-dropdown"
                    >
                      {role == "2" && (
                        <li>
                          <Link
                            className="dropdown-item"
                            to={currentRole.profileLink}
                          >
                            <i className="fa-light fa-user"></i> My Profile
                          </Link>
                        </li>
                      )}

                      <li>
                        <Link
                          className="dropdown-item"
                          to={currentRole.changePassword}
                        >
                          <i className="fa-light fa-user"></i> Change Password
                        </Link>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={Logout}>
                          <i className="fa-regular fa-arrow-right-from-bracket"></i>
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside id="sidebar">
        <ul className="sidebar-nav">
          {MenuData.map((item, idx) => (
            <li
              key={idx}
              className={`nav-item ${item.children ? "menu-dropdown" : ""}`}
            >
              {item.children ? (
                <>
                  <Link
                    to="#"
                    className="dropdown-menu-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <div>
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </div>
                    <i className="fa-regular fa-angle-down"></i>
                  </Link>
                  <ul className="sub-menu dropdown-menu">
                    {item.children.map((child, cIdx) => (
                      <li key={cIdx}>
                        <Link to={child.link}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link to={item.link}>
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        <img src="/assets/images/admin/logo/footer-img.png" className="w-100" />
      </aside>
    </>
  );
}
