import React, { useState, useEffect } from "react";
import { Bell, DollarSign, Star, Calendar, User, Package, CheckCircle, Circle, Trash2 } from "lucide-react";

const Viewallnotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const dummyData = [
            {
                id: 1,
                title: "New booking request",
                message: "John Doe requested Canvas Painting service",
                timestamp: "2025-07-22T16:28:00Z",
                type: "booking",
                isRead: false,
            },
            {
                id: 2,
                title: "Payment received",
                message: "Payment of ₹2500 received for Mehandi Art",
                timestamp: "2025-07-22T15:30:00Z",
                type: "payment",
                isRead: true,
            },
            {
                id: 3,
                title: "New review",
                message: "You received a 5-star review for Fabric Painting",
                time: "3 hours ago",
                type: "review",
                isRead: true,
            },
            {
                id: 4,
                title: "Service reminder",
                message: "You have a Catering booking tomorrow at 3 PM",
                time: "1 day ago",
                type: "reminder",
                isRead: true,
            },
            {
                id: 5,
                title: "Profile update",
                message: "Your profile has been successfully updated",
                time: "2 days ago",
                type: "profile",
                isRead: true,
            },
            {
                id: 6,
                title: "Profile update",
                message: "Your profile has been successfully updated",
                time: "3 days ago",
                type: "profile",
                isRead: false,
            },
            {
                id: 7,
                title: "Payment received",
                message: "Payment of ₹5500 received for Mehandi Art",
                time: "4 days ago",
                type: "payment",
                isRead: false,
            },
        ];
        setNotifications(dummyData);
    }, []);

    // const getIcon = (type) => {
    //     const iconProps = { size: 20, className: "me-2" };
    //     switch (type) {
    //         case "booking":
    //             return <Calendar {...iconProps} className="text-primary" />;
    //         case "payment":
    //             return <DollarSign {...iconProps} className="text-success" />;
    //         case "review":
    //             return <Star {...iconProps} className="text-warning" />;
    //         case "reminder":
    //             return <Bell {...iconProps} className="text-danger" />;
    //         case "profile":
    //             return <User {...iconProps} className="text-info" />;
    //         case "package":
    //             return <Package {...iconProps} className="text-secondary" />;
    //         default:
    //             return <Bell {...iconProps} className="text-muted" />;
    //     }
    // };

    const getBadgeClass = (type) => {
        switch (type) {
            case "booking":
                return "badge bg-primary-subtle text-primary";
            case "payment":
                return "badge bg-success-subtle text-success";
            case "review":
                return "badge bg-warning-subtle text-warning";
            case "reminder":
                return "badge bg-danger-subtle text-danger";
            case "profile":
                return "badge bg-info-subtle text-info";
            case "package":
                return "badge bg-secondary-subtle text-secondary";
            default:
                return "badge bg-light text-muted";
        }
    };

    const toggleRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const filtered = notifications.filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.isRead;
        if (filter === "read") return n.isRead;
        return n.type === filter;
    });

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMin = Math.floor((now - date) / (1000 * 60));
        // if (diffMin < 60) return `${diffMin} minutes ago`;
        // if (diffMin < 1440) return `${Math.floor(diffMin / 60)} hours ago`;
        // return `${Math.floor(diffMin / 1440)} days ago`;
    };

    const tabs = [
        { key: "all", label: "All" },
        { key: "unread", label: "Unread" },
        { key: "booking", label: "Bookings" },
        { key: "payment", label: "Payments" },
    ];

    return (
        <div className="card container  py-2 p-4">
            <div className="  mb-2 p-1">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle rounded-pill p-2 ">
                            <Bell size={22} className="text-primary" />
                        </div>
                        <div class=" p-2">
                            <h5 className="card-title d-flex justify-content-between align-items-center mb-0 text-primary fs-3">
                                Notifications
                                <span
                                    className="badge bg-primary rounded-pill ms-1 fw-normal"
                                    style={{ fontSize: "0.6rem" }} 
                                >
                                    {unreadCount} unread
                                </span>
                            </h5>


                        </div>
                    </div>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Mark all as read
                    </button>
                </div>
                <div className="card-body">
                    <div className="btn-group" role="group">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setFilter(tab.key)}
                                className={`btn btn-sm ${filter === tab.key ? "btn-primary" : "btn-outline-secondary"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="alert alert-info text-center">
                    <Bell size={32} className="mb-2" />
                    You're all caught up!
                </div>
            ) : (
                filtered.map((n) => (

                    <div
                        key={n.id}
                        className={`p-2 mb-1 d-flex justify-content-between align-items-start rounded border shadow-lg ${n.isRead ? "bg-white" : "bg-light border-start border-4 border-primary"
                            }`}
                        style={{ transition: "0.3s ease" }}
                    >
                        <div>
                            <div className="d-flex align-items-center gap-3 mb-2">
                                {!n.isRead && (
                                    <span className="badge bg-primary">New</span>
                                )}
                                <h6 className={`mb-0 ${n.isRead ? "text-primary" : "fw-bold text-primary"}`}>
                                    {n.title}
                                </h6>
                            </div>
                            <p className={`mb-1 ${n.isRead ? "text-muted" : "text-light"}`}>
                                {n.message}
                            </p>
                            <small className="text-primary">{formatTime(n.timestamp)}</small>
                        </div>

                        <div className="text-end">
                            <button
                                onClick={() => toggleRead(n.id)}
                                className="btn btn-sm btn-outline-primary me-2"
                            >
                                {n.isRead ? "Mark Unread" : "Mark Read"}
                            </button>
                            <button
                                onClick={() => deleteNotification(n.id)}
                                className="btn btn-sm btn-outline-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Viewallnotification;
