import React, { useState } from "react";
import { Link } from "react-router-dom";

const Packages = () => {
  const pricingPlans = [
    {
      name: "Basic",
      price: 299,
      period: "month",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 5 projects",
        "Basic templates",
        "Email support",
        "Mobile app access",
        "Basic analytics",
      ],
      notIncluded: [
        "Priority support",
        "Advanced features",
        "Custom integrations",
      ],
      buttonText: "Get Started",
        buttonVariant: "primary",
  
    },
    {
      name: "Pro",
      price: 599,
      period: "month",
      description: "Best for growing businesses",
      features: [
        "Unlimited projects",
        "Premium templates",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Team collaboration",
        "API access",
      ],
      popular: true,
      buttonText: "Start Free Trial",
        buttonVariant: "outline-primary",
    },
    {
      name: "Enterprise",
      price: 1299,
      period: "month",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom development",
        "White-label solution",
        "Advanced security",
        "SLA guarantee",
        "Training sessions",
        "24/7 phone support",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "dark",
    },
  ];

  const handleSelectPlan = (planName) => {
    console.log(`Selected plan: ${planName}`);
  };


  return (
    <div className="page-content">
      <div className="row align-items-center mb-4">
        <div className="col-md-12">
          <div className="add-page-heading-div d-flex align-items-center">
            <Link to="/admin/dashboard" className="me-3">
              <i className="fa-sharp fa-regular fa-arrow-left fs-5 text-primary"></i>
            </Link>
            <h2 className="add-page-heading mb-0">Choose Your Plan</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {pricingPlans.map((plan, index) => (
          <div key={index} className="col-lg-4 col-md-6">
            <div
              className={`card shadow-sm border-0 h-100 position-relative ${
                plan.popular ? "border border-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-primary">Most Popular</span>
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h4 className="text-primary fw-bold fs-4">{plan.name}</h4>
                <p className="text-muted small">{plan.description}</p>

                <div className="mb-3">
                  <h3 className="text-primary display-6 fw-bold mb-0">
                    ₹{plan.price}
                  </h3>
                  <small className="text-muted">/{plan.period}</small>
                </div>

                <ul className="list-unstyled mb-4 flex-grow-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="d-flex align-items-center mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <span className="small">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded &&
                    plan.notIncluded.map((feature, i) => (
                      <li
                        key={i}
                        className="d-flex align-items-center mb-2 text-muted"
                      >
                        <i className="fas fa-times text-danger me-2"></i>
                        <span className="small">{feature}</span>
                      </li>
                    ))}
                </ul>

                <button
                  className={`btn btn-${plan.buttonVariant} w-100 fw-semibold mt-auto`}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;
