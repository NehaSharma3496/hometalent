import React, { useEffect, useState } from "react";
import {
  GetAdminGallery,
  RemoveGalleryItem,
} from "../../../Services/vendor/Vendor";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchgallery = async () => {
    try {
      const response = await GetAdminGallery(token, userId);
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
      try {
        const res = await RemoveGalleryItem(token, item.id);
        if (res.status) {
          Swal.fire("Deleted!", "Item has been deleted.", "success");
          fetchgallery();
        } else {
          Swal.fire("Error", "Failed to delete item.", "error");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        Swal.fire("Error", "An error occurred while deleting.", "error");
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchgallery();
    }
  }, [userId]);

  const filteredGallery = gallery.filter((item) =>
    activeTab === "images"
      ? item.file_type === "image"
      : item.file_type === "video"
  );

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 mb-4">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0">Gallery</h5>
          </div>
        </div>

        <div className="col-md-6 text-end mb-4">
          <Link to="/admin/uploadgallery" className="btn btn-primary shadow-sm">
            <i className="ri-upload-cloud-line me-1"></i>
            Upload
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm border-0 mb-3 p-3">
        <ul className="nav nav-tabs">
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
      </div>

      {/* Gallery Grid */}
      <div className="card shadow-sm p-3 border-0 bg-light">
        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">
            No <strong>{activeTab}</strong> found.
          </p>
        ) : (
          <div className="row">
            {filteredGallery.map((item, index) => (
              <div className="col-xl-4 col-md-4 col-sm-6 mb-4" key={item.id}>
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  {item.file_type === "image" ? (
                    <img
                      src={item.file_path}
                      alt="Gallery"
                      className="card-img-top rounded-top-4"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      controls
                      className="card-img-top rounded-top-4"
                      style={{ height: "250px", objectFit: "cover" }}
                    >
                      <source src={item.file_path} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <div className="card-body text-center py-3 mt-3">
                    <button
                      className="btn btn-danger shadow-sm"
                      onClick={() => handleDelete(item)}
                    >
                      <i className="ri-delete-bin-line me-1"></i>
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

export default AdminGallery;
