import React, { useEffect, useState } from "react";
import {
  GetGallery,
  RemoveGalleryItem,
  UpdateGalleryOrder,
} from "../../../Services/vendor/Vendor";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const ViewGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [draggedIndex, setDraggedIndex] = useState(null);
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

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const filteredItems = gallery.filter((item) =>
      activeTab === "images"
        ? item.file_type === "image"
        : item.file_type === "video"
    );

    const newFiltered = [...filteredItems];
    const draggedItem = newFiltered[draggedIndex];
    newFiltered.splice(draggedIndex, 1);
    newFiltered.splice(dropIndex, 0, draggedItem);

    const updatedFiltered = newFiltered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    const updatedGallery = gallery.map((item) => {
      const updatedItem = updatedFiltered.find((u) => u.id === item.id);
      return updatedItem || item;
    });

    setGallery(updatedGallery);
    setDraggedIndex(null);
  };

  useEffect(() => {
    if (userId) {
      fetchgallery();
    }
  }, [userId]);

  const filteredGallery = gallery
    .filter((item) =>
      activeTab === "images"
        ? item.file_type === "image"
        : item.file_type === "video"
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const getUpdatedOrder = () => {
    const updated = gallery
      .filter((item) =>
        activeTab === "images"
          ? item.file_type === "image"
          : item.file_type === "video"
      )
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item, index) => ({
        id: item.id,
        sort_order: index + 1,
      }));

    return updated;
  };

  const handleUpdateSortOrder = async () => {
    const orderedData = getUpdatedOrder(); // This gives updated array
    console.log("Send this to API:", orderedData);

    try {
      // Suppose you have an API function like UpdateGalleryOrder(token, data)
      const response = await UpdateGalleryOrder(token, orderedData);
      if (response.status) {
        Swal.fire("Updated", "Gallery order updated successfully", "success");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  return (
    <div className="page-content">
      {/* Header Row */}
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
          <Link to="/vendor/gallery/upload" className="add-btn-head me-2">
            + Upload
          </Link>
          <button
            className="btn btn-sm btn-danger rounded"
            onClick={handleUpdateSortOrder}
          >
            + Update
          </button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Gallery Section */}
      <div className="card p-3 border-0 bg-light">
        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">No {activeTab} found.</p>
        ) : (
          <div className="row">
            {filteredGallery.map((item, index) => (
              <div
                className="col-xl-4 col-lg-4 col-md-6 mb-4"
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  cursor: "grab",
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <div className="card shadow rounded-4 h-100 border-0">
                  {item.file_type === "image" ? (
                    <img
                      src={item.file_path}
                      alt="Gallery"
                      className="card-img-top rounded-top-4"
                      style={{ height: "240px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      controls
                      className="card-img-top rounded-top-4"
                      style={{ height: "240px", objectFit: "cover" }}
                    >
                      <source src={item.file_path} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <div className="card-body text-center  py-3">
                    {/* <p className="mb-2 text-muted small">
                    ID: <strong>{item.id}</strong> | Sort:{" "}
                    <strong>{item.sort_order}</strong>
                  </p> */}
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
