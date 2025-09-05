import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, Link } from "react-router-dom";
import {
  GetGalleryUpdateRequests,
  ProcessGalleryUpdateRequests,
  AddToAdminGallery,
  RemoveGalleryItem,
} from "../../../Services/admin/Admin";

export default function VendorGallery() {
  const { vendorId } = useParams();
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images"); // images | videos | galleryAdded
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const token = localStorage.getItem("token");
  const adminId = 1;

  /** Fetch Vendor Gallery */
  const fetchGallery = async () => {
    try {
      const res = await GetGalleryUpdateRequests({
        token,
        statusFilter: "all",
        page: 1,
        limit: 200,
      });

      if (res.status) {
        const all = res.data.gallery || [];
        const filtered = all.filter((g) => g.user?.id == vendorId);
        setGallery(filtered);
      }
    } catch (err) {
      console.error("Fetch vendor gallery error:", err);
    }
  };

  /** Approve / Reject Single Item */
  const handleSingleAction = async (action, id) => {
    let idsToProcess = [];

    if (selectedItems.includes(id)) {
      idsToProcess = gallery
        .filter(
          (item) => selectedItems.includes(item.id) && item.status === "pending"
        )
        .map((item) => item.id);
    } else {
      const item = gallery.find((g) => g.id === id);
      if (!item || item.status !== "pending") return;
      idsToProcess = [id];
    }

    if (idsToProcess.length === 0) {
      Swal.fire("Info", `No image(s) to ${action}.`, "info");
      return;
    }

    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} ${idsToProcess.length} image(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    const res = await ProcessGalleryUpdateRequests(
      idsToProcess,
      action,
      `${action}d by admin`,
      adminId,
      token
    );

    if (res?.status) {
      Swal.fire("Success", `Image(s) ${action}d successfully.`, "success");
      setSelectedItems([]);
      fetchGallery();
    } else {
      Swal.fire("Failed", res?.message || "Action failed", "error");
    }
  };

  /** Bulk Approve / Reject */
  const handleBulkAction = async (action) => {
    const selectedValidItems = gallery.filter(
      (item) => selectedItems.includes(item.id) && item.status === "pending"
    );

    if (selectedValidItems.length === 0) {
      Swal.fire("Info", `No valid items to ${action}.`, "info");
      return;
    }

    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} selected image(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    const res = await ProcessGalleryUpdateRequests(
      selectedValidItems.map((i) => i.id),
      action,
      `${action}d by admin`,
      adminId,
      token
    );

    if (res?.status) {
      Swal.fire("Success", `Image(s) ${action}d successfully.`, "success");
      setSelectedItems([]);
      fetchGallery();
    } else {
      Swal.fire("Failed", res?.message || "Action failed", "error");
    }
  };

  /** Add to Admin Gallery */
  const handleAddToAdminGallery = async (item) => {
    const confirm = await Swal.fire({
      title: "Add to Admin Gallery?",
      text: "This will copy the file into Admin Gallery.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add",
    });

    if (!confirm.isConfirmed) return;

    const res = await AddToAdminGallery(token, {
      id: item.id,
      admin_id: adminId,
      file_path: item.file_path,
      file_type: item.file_type,
      file_name: item.file_name,
      file_size: item.file_size,
      source_vendor_id: item.user?.id || vendorId,
    });

    if (res?.status) {
      Swal.fire("Success", "Added to Admin Gallery", "success");
      fetchGallery();
    } else {
      Swal.fire("Error", res?.msg || "Failed to add", "error");
    }
  };

  /** Remove from Admin Gallery */
  const handleRemoveFromAdminGallery = async (item) => {
    const confirm = await Swal.fire({
      title: "Remove from Admin Gallery?",
      text: "This will move it back to Vendor Gallery.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await RemoveGalleryItem(token, [item.id]);

      if (res?.status) {
        Swal.fire("Removed", "Item removed from Admin Gallery.", "success");
        fetchGallery();
      } else {
        Swal.fire("Error", res?.msg || "Failed to remove", "error");
      }
    } catch (err) {
      console.error("Remove error:", err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  /** Select / Unselect All Pending */
  const handleSelectAll = () => {
    const pendingItems = filteredGallery
      .filter((item) => item.status === "pending")
      .map((item) => item.id);

    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingItems);
    }

    setSelectAll(!selectAll);
  };

  /** Toggle single select */
  const toggleSelect = (id) => {
    setSelectedItems((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      const pendingIds = filteredGallery
        .filter((item) => item.status === "pending")
        .map((item) => item.id);

      if (updated.length !== pendingIds.length) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }

      return updated;
    });
  };

  /** On Load */
  useEffect(() => {
    fetchGallery();
  }, [vendorId]);

  /** Filter Gallery by Tab */
  const filteredGallery = gallery
    .filter((item) => {
      if (activeTab === "images") {
        return item.file_type.startsWith("image");
      } else if (activeTab === "videos") {
        return item.file_type.startsWith("video");
      } else if (activeTab === "galleryAdded") {
        return item.admin_remarks && item.admin_remarks.includes("source_vendor_id");
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="page-content">
      {/* Header */}
      <div className="row align-items-center mb-3">
        <div className="col-md-6 mb-4">
          <div className="add-page-heading-div">
            <Link to="/admin/vendor/allvendors" className="me-2">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading mb-0">Vendor Gallery</h5>
          </div>
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
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "galleryAdded" ? "active" : ""}`}
              onClick={() => setActiveTab("galleryAdded")}
            >
              Gallery Added
            </button>
          </li>
        </ul>
      </div>

      {/* Select All (only images/videos) */}
      {activeTab !== "galleryAdded" &&
        filteredGallery.some((item) => item.status === "pending") && (
          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="selectAll"
              className="form-check-input"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <label htmlFor="selectAll" className="form-check-label">
              Select All Pending
            </label>
          </div>
        )}

      {/* Bulk Buttons */}
      {activeTab !== "galleryAdded" && selectedItems.length > 0 && (
        <div className="mb-3 d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => handleBulkAction("approve")}
          >
            Approve
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleBulkAction("reject")}
          >
            Reject
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="card shadow-sm p-3 border-0 bg-light">
        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">
            No {activeTab === "galleryAdded" ? "added" : activeTab} found.
          </p>
        ) : (
          <div className="row">
            {filteredGallery.map((item) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                key={item.id}
              >
                <div className="card border-0 shadow-sm h-100 position-relative gallery-card">
                  {/* File */}
                  {item.file_type.startsWith("image") ? (
                    <img
                      src={item.file_path}
                      alt="Gallery"
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      controls
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    >
                      <source src={item.file_path} type="video/mp4" />
                    </video>
                  )}

                  {/* Card Body */}
                  <div className="card-body text-center p-3">
                    <h6
                      className={`mb-1 fw-bold 
                        ${
                          item.status === "approved"
                            ? "text-success"
                            : item.status === "rejected"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </h6>

                    <p className="text-muted small mb-2">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {/* Pending Actions */}
                    {activeTab !== "galleryAdded" &&
                      item.status === "pending" &&
                      !selectAll && (
                        <>
                          <div className="form-check d-flex justify-content-center mb-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelect(item.id)}
                            />
                          </div>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleSingleAction("approve", item.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleSingleAction("reject", item.id)}
                            >
                              Reject
                            </button>
                          </div>
                        </>
                      )}

                    {/* Add to Admin Gallery */}
                    {activeTab !== "galleryAdded" && item.status === "approved" && (
                      <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => handleAddToAdminGallery(item)}
                      >
                        Add to Admin Gallery
                      </button>
                    )}

                    {/* Remove from Admin Gallery */}
                    {activeTab === "galleryAdded" && (
                      <button
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => handleRemoveFromAdminGallery(item)}
                      >
                        Remove from Admin Gallery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
