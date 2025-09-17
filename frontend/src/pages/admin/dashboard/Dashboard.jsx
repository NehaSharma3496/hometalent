import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GetDashboardCounts } from "../../../Services/admin/Admin";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await GetDashboardCounts(token);
        if (res?.status) {
          setCounts(res.data);
        } else {
          setErr(res?.message || "Failed to load counts");
        }
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const fmt = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : n ?? 0;
  const arrowText = (v = 0) =>
    v >= 0 ? `▲ ${v.toFixed(2)}%` : `▼ ${Math.abs(v).toFixed(2)}%`;

  const arrowColor = (v = 0) => (v >= 0 ? "#16a34a" : "#e11d48");

  const cards = useMemo(() => {
    if (!counts) return [];
    return [
      {
        title: "Total Vendors",
        value: fmt(counts.total_vendors),
        icon: "fa fa-user-tie",
        change: arrowText(counts.vendors_percentage_increase),
        color: "#7B2CBF",
        pct: counts.vendors_percentage_increase,
        link: "/admin/vendor/allvendors",
      },
      {
        title: "Active Vendors",
        value: fmt(counts.active_vendors),
        icon: "fa fa-toggle-on",
        change: arrowText(counts.active_vendors_percentage_increase),
        color: "#0EA5E9",
        pct: counts.active_vendors_percentage_increase,
        link: "/admin/vendor/activevendors",
      },
      {
        title: "Inactive Vendors",
        value: fmt(counts.inactive_vendors),
        icon: "fa fa-toggle-off",
        change: arrowText(counts.inactive_vendors_percentage_increase),
        color: "#6B7280",
        pct: counts.inactive_vendors_percentage_increase,
        link: "/admin/vendor/blockedvendors",
      },
      {
        title: "Approved Vendors",
        value: fmt(counts.approve_vendors),
        icon: "fa fa-check-circle",
        change: arrowText(counts.approve_vendors_percentage_increase),
        color: "#10B981",
        pct: counts.approve_vendors_percentage_increase,
        link: "/admin/vendor/approvevendors",
      },
      {
        title: "Pending Vendors",
        value: fmt(counts.pending_vendors),
        icon: "fa fa-clock",
        change: arrowText(counts.pending_vendors_percentage_increase),
        color: "#FFB703",
        pct: counts.pending_vendors_percentage_increase,
        link: "/admin/vendor/pendingvendors",
      },
      {
        title: "Total Leads",
        value: fmt(counts.total_leads),
        icon: "fa fa-user-plus",
        change: arrowText(counts.leads_percentage_increase),
        color: "#3B82F6",
        pct: counts.leads_percentage_increase,
        link: "/admin/enquiries/allleads",
      },

 {
      title: "Subscribed Vendors",
      value: fmt(counts.subscribed_with_active),
      icon: "fa fa-user-check",
      // change: arrowText(counts.active_vendors_percentage_increase),
      color: "#0EA5E9",
      // pct: counts.active_vendors_percentage_increase,
      link: "/admin/subscribedvendors",
    },
    {
      title: "Expired Vendors",
      value: fmt(counts.subscribed_only_expired),
      icon: "fa fa-user-clock",
      // change: arrowText(counts.inactive_vendors_percentage_increase),
      color: "#6B7280",
      // pct: counts.inactive_vendors_percentage_increase,
      link: "/admin/vendor/blockedvendors",
    },
    {
      title: "Unsubscribed Vendors",
      value: fmt(counts.unsubscribed_vendors),
      icon: "fa fa-user-slash",
      // change: arrowText(counts.unsubscribed_vendors_percentage_increase),
      color: "#EF4444",
      // pct: counts.unsubscribed_vendors_percentage_increase,
      link: "/admin/vendor/unsubscribedvendors",
    },

    ];
  }, [counts]);

  if (loading) return <div className="page-content">Loading...</div>;
  if (err) return <div className="page-content text-danger">Error: {err}</div>;

  return (
    <div className="page-content">
      <h1 className="page-heading">Dashboard</h1>

      <div className="card  mb-3">
        <div className="row">
          {cards.map((card, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <Link to={card.link} style={{ textDecoration: "none" }}>
                <div className="dashboard-card">
                  <div className="card-left">
                    <p className="card-title">{card.title}</p>
                    <h2 className="card-value">{card.value}</h2>
                    <p
                      className="card-change"
                      style={{ color: arrowColor(card.pct) }}
                    >
                      {card.change}
                    </p>
                  </div>
                  <div
                    className="card-icon"
                    style={{
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                    }}
                  >
                    <i className={card.icon} aria-hidden="true"></i>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
