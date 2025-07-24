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

  const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-IN") : n ?? 0);
  const arrowText = (v = 0) => (v >= 0 ? `▲ ${v}%` : `▼ ${Math.abs(v)}%`);
  const arrowColor = (v = 0) => (v >= 0 ? "#16a34a" : "#e11d48");

  // Build cards from API response
  const cards = useMemo(() => {
    if (!counts) return [];
    return [
      {
        title: "Total Leads",
        value: fmt(counts.total_leads),
        icon: "fa fa-user-plus",
        change: arrowText(counts.leads_percentage_increase),
        color: "#3B82F6",
        pct: counts.leads_percentage_increase,
      },
      {
        title: "Total Vendors",
        value: fmt(counts.total_vendors),
        icon: "fa fa-briefcase",
        change: arrowText(counts.vendors_percentage_increase),
        color: "#7B2CBF",
        pct: counts.vendors_percentage_increase,
      },
      {
        title: "Pending Vendors",
        value: fmt(counts.pending_vendors),
        icon: "fa fa-clock",
        change: arrowText(counts.pending_vendors_percentage_increase),
        color: "#FFB703",
        pct: counts.pending_vendors_percentage_increase,
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
              <div className="dashboard-card">
                <div className="card-left">
                  <p className="card-title">{card.title}</p>
                  <h2 className="card-value">{card.value}</h2>
                  <p className="card-change" style={{ color: arrowColor(card.pct) }}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
