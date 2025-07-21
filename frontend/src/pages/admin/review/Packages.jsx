import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showPackage, DeletePackage } from "../../../Services/admin/Admin";
import Swal from "sweetalert2";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate(); 

  const fetchPackages = async () => {
    try {
      const res = await showPackage();
      const packageData = res?.data || [];
      setPackages(packageData);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDeletePlan = async (packageId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await DeletePackage(packageId, token);

        if (response?.status) {
          Swal.fire("Deleted!", response.msg || "Package deleted.", "success");
          fetchPackages();
        } else {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error!", "Server error. Please try again.", "error");
      }
    }
  };

  const handleUpdateClick = (id) => {
    navigate(`/admin/UpdatePackages/${id}`);
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
        {packages.length === 0 ? (
          <div className="text-center text-muted fs-5">No packages found</div>
        ) : (
          packages.map((plan, index) => {
            const featureList = plan.features ? plan.features.split(",") : [];
            const isPopular = plan.price >= 999;
            const isActive = plan.status === 1;

            return (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className={`card shadow-sm border-0 h-100 position-relative ${isPopular ? "border border-primary" : ""
                    }`}
                >
                  {isPopular && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-primary">Most Popular</span>
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h4 className="text-primary fw-bold fs-4">{plan.name}</h4>
                    <p className="text-muted small mb-1">{plan.description}</p>

                    <div className="mb-3">
                      <h3 className="text-primary display-6 fw-bold mb-0">
                        ₹{plan.price}
                      </h3>
                      <small className="text-muted">
                        / {plan.validity_in_months} month(s)
                      </small>
                    </div>

                    <ul className="list-unstyled mb-3 flex-grow-1">
                      {featureList.map((feature, i) => (
                        <li key={i} className="d-flex align-items-center mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <span className="small">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mb-2 small text-muted">
                      <strong>Status:</strong>{" "}
                      <span
                        className={isActive ? "text-success" : "text-danger"}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="small text-muted">
                      <strong>Created:</strong>{" "}
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                    <div className="small text-muted mb-3">
                      <strong>Updated:</strong>{" "}
                      {new Date(plan.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="d-flex">
                      <button
                        className={`btn btn-${isActive ? "primary" : "secondary"} w-100 fw-semibold mt-auto me-4`}
                        onClick={() => handleUpdateClick(plan.id)} 
                        disabled={!isActive}
                      >
                        {isActive ? "Update" : "Unavailable"}
                      </button>

                      <button
                        className={`btn btn-${isActive ? "danger" : "secondary"} w-100 fw-semibold mt-auto`}
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={!isActive}
                      >
                        {isActive ? "Delete" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Packages;
