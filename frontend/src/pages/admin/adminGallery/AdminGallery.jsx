import React, { useEffect, useState } from "react";
import {
  GetAdminGallery,
  RemoveGalleryItem,
} from "../../../Services/vendor/Vendor";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { image_baseurl } from "../../../Utils/config";

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const role = localStorage.getItem("role");

 const fetchGallery = async () => {
  try {
    // 🔹 role 3 हो तो userId = 1 fix कर दो
    const finalUserId = role === "3" ? 1 : userId;

    const response = await GetAdminGallery(token, finalUserId);
    setGallery(response.data || []);
  } catch (error) {
    console.error("Error fetching gallery:", error);
  }
};


  useEffect(() => {
    if (userId) fetchGallery();
  }, [userId]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const ids = filteredGallery.map((item) => item.id);
      setSelectedItems(ids);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      if (updated.length !== filteredGallery.length) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }

      return updated;
    });
  };

  const handleSingleDelete = async (id) => {
    const isBulk = selectedItems.includes(id);
    const idsToDelete = isBulk ? selectedItems : [id];

    const confirm = await Swal.fire({
      title: `Are you sure you want to delete ${
        isBulk ? idsToDelete.length : 1
      } image(s)?`,
      text: "This will permanently delete the selected image(s)(s).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await RemoveGalleryItem(token, idsToDelete);
      if (res.status) {
        Swal.fire("Deleted!", "image(s) have been deleted.", "success");
        setSelectedItems([]);
        fetchGallery();
      } else {
        Swal.fire(
          "Error",
          res.message || "Failed to delete image(s).",
          "error"
        );
      }
    } catch (err) {
      Swal.fire("Error", "An error occurred while deleting.", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      Swal.fire("Info", "No image(s) selected for deletion.", "info");
      return;
    }

    const confirm = await Swal.fire({
      title: `Are you sure you want to delete ${selectedItems.length} image(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await RemoveGalleryItem(token, selectedItems);
      if (res.status) {
        Swal.fire("Deleted!", "Selected image(s) deleted.", "success");
        setSelectedItems([]);
        fetchGallery();
      } else {
        Swal.fire("Error", res.message || "Delete failed.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "An error occurred during deletion.", "error");
    }
  };

  const filteredGallery = gallery?.filter((item) =>
    activeTab === "images"
      ? item.file_type === "image"
      : item.file_type === "video"
  );

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-2">
        {/* Left side */}
        <div className="add-page-heading-div d-flex align-items-center">
          <button
            className="btn btn-link p-0"
            onClick={() => navigate(-1)} // 🔹 पिछली history में वापस जाएगा
          >
            <i className="fa-sharp fa-regular fa-arrow-left"></i>
          </button>
          <h5 className="add-page-heading mb-0">Gallery</h5>
        </div>

        <Link
          to="/admin/uploadgallery"
          className="btn btn-primary shadow-sm Addimage"
        >
          <i className="ri-upload-cloud-line me-1"></i>
          Add Image / Video
        </Link>
      </div>

      <div className="card shadow-sm border-0 mb-2 p-3">
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

      {filteredGallery.length > 0 && (
        <div className="mb-1 d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input
              type="checkbox"
              id="selectAll"
              className="form-check-input mt-2"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <label htmlFor="selectAll" className="form-check-label">
              Select All
            </label>
          </div>

          {selectedItems.length > 0 && (
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete ({selectedItems.length})
            </button>
          )}
        </div>
      )}

      <div className="card shadow-sm p-3 border-0 bg-light">
        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">
            No <strong>{activeTab}</strong> found.
          </p>
        ) : (
          <div className="row">
            {filteredGallery.map((item) => (
              <div className="col-xl-4 col-md-4 col-sm-6 mb-4" key={item.id}>
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  {item.file_type === "image" ? (
                    <img
                      src={`${image_baseurl}${item.file_path}`}
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
                      <source
                        src={`${image_baseurl}${item.file_path}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className="card-body text-center py-2 mt-3">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2 mb-1"
                        style={{ width: "1.2rem", height: "1.4rem" }}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />

                      <button
                        className="btn btn-danger btn-sm d-flex align-items-center"
                        style={{ height: "1.5rem", padding: "0 10px" }} // match height of checkbox
                        onClick={() => handleSingleDelete(item.id)}
                      >
                        <i className="ri-delete-bin-line me-1"></i>
                        Delete
                      </button>
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

export default AdminGallery;
