import React from 'react'
import {Link} from 'react-router-dom'

export default function Dashboard() {
	const cards = [
  {
    title: "Total Users",
    value: "12,540",
    icon: "fa fa-users",
    change: "▲ 5.2% this month",
    color: "#C9184A",
  },
  {
    title: "Total Vendors",
    value: "3,210",
    icon: "fa fa-briefcase",
    change: "▲ 3.8% this month",
    color: "#7B2CBF",
  },
  {
    title: "Pending Listings",
    value: "148",
    icon: "fa fa-clock",
    change: "▼ 1.5% this week",
    color: "#FFB703",
  },
  {
    title: "Total Revenue",
    value: "₹5.8L",
    icon: "fa fa-indian-rupee-sign", // for Font Awesome 6
    change: "▲ 12.4% this month",
    color: "#38A169",
  },
  {
    title: "Reviews Pending",
    value: "42",
    icon: "fa fa-comment-dots",
    change: "▼ 2% today",
    color: "#3B82F6",
  },
];

  return (
  
        <div className="page-content">
			<h1 className="page-heading">Dashboard</h1>
			<div className='card'>
			<div className="row">

  <div className="row">
  {cards.map((card, index) => (
	<div className='col-md-4'>
    <div className="dashboard-card" key={index}>
      <div className="card-left">
        <p className="card-title">{card.title}</p>
        <h2 className="card-value">{card.value}</h2>
        <p
          className="card-change"
          style={{
            color: card.change.includes("▲") ? "#16a34a" : "#e11d48",
          }}
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
	</div>
  ))}
</div>


				
			</div>
</div>
		</div>
		

  )
}
