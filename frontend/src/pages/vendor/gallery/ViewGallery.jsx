import React, { useEffect, useState } from "react";
import { GetGallery } from "../../../Services/vendor/Vendor";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const ViewGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchgallery = async () => {
    try {
      const response = await GetGallery(token, userId);
      setGallery(response.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const handleDelete = async (item) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      console.log("Deleting:", item);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchgallery();
    }
  }, [userId]);

  const filteredGallery = gallery.filter((item) =>
    activeTab === "images" ? item.file_type === "image" : item.file_type === "video"
  );

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 col-8">
          <div className="add-page-heading-div d-flex align-items-center">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading mb-0">Gallery</h2>
          </div>
        </div>
        <div className="col-md-6 col-4 text-end">
          <Link to="/vendor/gallery/upload" className="btn btn-primary btn-sm">
            + Upload
          </Link>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "images" ? "active" : ""}`}
            onClick={() => setActiveTab("images")}
          >
            Images
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
        </li>
      </ul>

      <div className="card p-3">
        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">
            No {activeTab} found.
          </p>
        ) : (
          <div className="row">
            {filteredGallery.map((item, index) => (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                <div className="card h-100 border shadow-sm">
                  {item.file_type === "image" ? (
                    <img
                      src={item.file_path}
                      alt="Gallery"
                      className="card-img-top img-fluid"
                      style={{ height: "240px", objectFit: "cover", width: "100%" }}
                    />
                  ) : (
                    <video
                      controls
                      className="card-img-top"
                      style={{ height: "240px", objectFit: "cover", width: "100%" }}
                    >
                      <source src={item.file_path} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <div className="card-body text-center py-2">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGallery;
