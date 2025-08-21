import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GetDashBoardCount } from "../../../Services/vendor/Vendor";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const vendor_id = localStorage.getItem("userId");

  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await GetDashBoardCount({ vendor_id }, token);
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
  }, [vendor_id, token]);

  const fmt = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : n ?? 0;

  const arrowText = (v = 0) =>
    v >= 0 ? `▲ ${v.toFixed(2)}%` : `▼ ${Math.abs(v).toFixed(2)}%`;

  const arrowColor = (v = 0) => (v >= 0 ? "#16a34a" : "#e11d48");

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
        link: "/vendor/leads/all",
        showChange: true,
      },
      {
        title: "Running Package",
        value: fmt(counts.running_package),
        icon: "fa fa-cube",
        color: "#8B5CF6",
        link: "/vendor/mypackages",
        showChange: false,
      },
    ];
  }, [counts]);

  if (loading) return <div className="page-content">Loading...</div>;
  if (err) return <div className="page-content text-danger">Error: {err}</div>;

  return (
    <div className="page-content">
      <h1 className="page-heading">Dashboard</h1>
      <div className="card mb-3">
        <div className="row">
          {cards.map((card, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <Link to={card.link} style={{ textDecoration: "none" }}>
                <div
                  className="dashboard-card d-flex justify-content-between align-items-center p-3 shadow-sm rounded"
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    height: "100%",
                    minHeight: "120px",
                  }}
                >
                  <div className="card-left">
                    <p className="card-title text-muted m-0">{card.title}</p>
                    <h2 className="card-value fw-bold">{card.value}</h2>
                    {card.showChange && (
                      <p
                        className="card-change m-0"
                        style={{
                          color: arrowColor(card.pct),
                          fontSize: "14px",
                        }}
                      >
                        {arrowText(card.pct)}
                      </p>
                    )}
                  </div>
                  <div
                    className="card-icon d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                      fontSize: "20px",
                    }}
                  >
                    <i className={card.icon} />
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
