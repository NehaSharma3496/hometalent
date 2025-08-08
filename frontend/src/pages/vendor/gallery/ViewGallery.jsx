import React, { useEffect, useState } from "react";
import {
  GetAdminGallery,
  RemoveGalleryItem,
  UpdateGalleryOrder,
} from "../../../Services/vendor/Vendor";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const ViewGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchGallery();
  }, [userId]);

  const fetchGallery = async () => {
    try {
      const response = await GetAdminGallery(token, userId);
      setGallery(response.data || []);
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      const filteredIds = filteredGallery.map((item) => item.id);
      setSelectAll(updated.length === filteredIds.length);

      return updated;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = filteredGallery.map((item) => item.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDelete = async (itemId) => {
    let idsToDelete = [];

    if (selectedItems.includes(itemId)) {
      idsToDelete = selectedItems;
    } else {
      idsToDelete = [itemId];
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${idsToDelete.length} Image(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await RemoveGalleryItem(token, idsToDelete);
        if (res?.status) {
          Swal.fire("Deleted!", "Image(s) deleted successfully.", "success");
          fetchGallery();
        } else {
          Swal.fire("Error", res?.message || "Failed to delete.", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const filteredItems = gallery.filter((item) =>
      activeTab === "images"
        ? item.file_type === "image"
        : item.file_type === "video"
    );

    const reordered = [...filteredItems];
    const [dragged] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, dragged);

    const updatedFiltered = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    const updatedGallery = gallery.map((item) => {
      const update = updatedFiltered.find((i) => i.id === item.id);
      return update || item;
    });

    setGallery(updatedGallery);
    setDraggedIndex(null);
  };

  const getSortedItems = () =>
    gallery
      .filter((item) =>
        activeTab === "images"
          ? item.file_type === "image"
          : item.file_type === "video"
      )
      .sort((a, b) => a.sort_order - b.sort_order);

  const handleUpdateSortOrder = async () => {
    const sorted = getSortedItems().map((item, index) => ({
      id: item.id,
      sort_order: index + 1,
    }));

    try {
      const res = await UpdateGalleryOrder(token, sorted);
      if (res.status) {
        Swal.fire("Updated", "Gallery order updated", "success");
      } else {
        Swal.fire("Error", "Failed to update order", "error");
      }
    } catch (err) {
      console.error("Sort update failed:", err);
      Swal.fire("Error", "API error occurred", "error");
    }
  };

  const filteredGallery = getSortedItems();

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 mb-4">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0"> My Gallery</h5>
          </div>
        </div>

        <div className="col-md-6 text-end mb-4">
          <Link
            to="/vendor/gallery/upload"
            className="btn btn-primary me-2 shadow-sm"
          >
            <i className="ri-upload-cloud-line me-1"></i> Upload
          </Link>
          <button
            className="btn btn-success me-2 shadow-sm"
            onClick={handleUpdateSortOrder}
          >
            <i className="ri-check-double-line me-1"></i> Update Order
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-3 p-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "images" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("images");
                setSelectedItems([]);
                setSelectAll(false);
              }}
            >
              Images
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("videos");
                setSelectedItems([]);
                setSelectAll(false);
              }}
            >
              Videos
            </button>
          </li>
        </ul>
      </div>

      <div className="card shadow-sm p-3 border-0 bg-light">
        {filteredGallery.length > 0 && (
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                id="selectAll"
                className="form-check-input"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label htmlFor="selectAll" className="form-check-label">
                Select All
              </label>
            </div>

            {selectedItems.length > 0 && (
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(selectedItems[0])}
              >
                <i className="ri-delete-bin-line me-1"></i> Delete(
                {selectedItems.length})
              </button>
            )}
          </div>
        )}

        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">
            No <strong>{activeTab}</strong> found.
          </p>
        ) : (
          <div className="row">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                className="col-xl-4 col-md-4 col-sm-6 mb-4"
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
                    </video>
                  )}

                  <div className="card-body text-center py-3 mt-3">
                    <div className="mb-2 d-flex  justify-content-center gap-15">
                      <span
                        className={`badge ${
                          item.status === "approved"
                            ? "bg-success"
                            : item.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        } fs-6`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>

                      <button
                        className="btn btn-danger btn-sm shadow-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="ri-delete-bin-line me-1"></i>
                        Delete
                      </button>
                    </div>

                    <p className="text-muted small mb-2">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <div className="form-check d-flex justify-content-center mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ transform: "scale(1.3)" }}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </div>
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
