import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, Link } from "react-router-dom";
import {
  GetGalleryUpdateRequests,
  ProcessGalleryUpdateRequests,
} from "../../../Services/admin/Admin";

export default function VendorGallery() {
  const { vendorId } = useParams();
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [selectedIds, setSelectedIds] = useState([]);
  const token = localStorage.getItem("token");

  const fetchGallery = async () => {
    try {
      const res = await GetGalleryUpdateRequests({
        token,
        statusFilter: "all",
        page: 1,
        limit: 100,
      });

      if (res.status) {
        const all = res.data.gallery || [];
        const filtered = all.filter((g) => g.user?.id == vendorId);
        setGallery(filtered);
        setSelectedIds([]); // reset selection
      }
    } catch (err) {
      console.error("Fetch vendor gallery error:", err);
    }
  };

  const viewDetails = (item) => {
    Swal.fire({
      title: item.user?.owner_name || "Gallery Request Details",
      html: `
        <p><b>File Name:</b> ${item.file_name}</p>
        <p><b>Type:</b> ${item.file_type}</p>
        <p><b>Size:</b> ${(item.file_size / 1024).toFixed(2)} KB</p>
        <p><b>Status:</b> ${item.status}</p>
        <hr/>
        <p><b>Uploaded By:</b> ${item.user?.owner_name || "N/A"}</p>
        <p><b>Created At:</b> ${new Date(item.createdAt).toLocaleString()}</p>
      `,
      imageUrl: item.file_type.startsWith("image") ? item.file_path : undefined,
      imageWidth: 300,
      imageAlt: "Gallery Image",
    });
  };

  const processRequest = async (action, id) => {
    const res = await ProcessGalleryUpdateRequests(
      id,
      action,
      `${action}d by admin`,
      1,
      token
    );
    return res;
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      return Swal.fire("No Selection", "Please select items first.", "info");
    }

    Swal.fire({
      title: `Are you sure you want to ${action} selected items?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let successCount = 0;

        for (const id of selectedIds) {
          const res = await processRequest(action, id);
          if (res?.status) successCount++;
        }

        Swal.fire(
          "Done",
          `${successCount} item(s) ${action}d successfully.`,
          "success"
        );
        fetchGallery();
      }
    });
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchGallery();
  }, [vendorId]);

  const images = gallery.filter((item) => item.file_type.startsWith("image"));
  const videos = gallery.filter((item) => item.file_type.startsWith("video"));

  const renderGalleryCard = (item) => (
    <div className="col-md-4 mb-4" key={item.id}>
      <div className="card h-100 shadow-sm position-relative">
        {item.file_type.startsWith("image") ? (
          <img
            src={item.file_path}
            className="card-img-top"
            alt={item.file_name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        ) : (
          <video
            controls
            src={item.file_path}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between align-items-center">
            {item.file_name}
            {item.status === "pending" && (
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleCheckbox(item.id)}
              />
            )}
          </h5>
          <p className="card-text mb-1">
            <strong>Status:</strong> {item.status}
          </p>
          <p className="card-text">
            <strong>Date:</strong>{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-sm btn-info"
              onClick={() => viewDetails(item)}
            >
              View
            </button>
            {item.status === "pending" && (
              <>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleBulkAction("approve", [item.id])}
                >
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleBulkAction("reject", [item.id])}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="add-page-heading">Vendor Gallery (ID: {vendorId})</h2>
        <Link to="/admin/vendor/allvendors" className="btn btn-secondary btn-sm">
          <i className="fa fa-arrow-left"></i> Back to Vendors
        </Link>
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

      {/* Bulk Action Buttons */}
      {selectedIds.length > 0 && (
        <div className="mb-3 d-flex gap-2">
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleBulkAction("approve")}
          >
            Approve Selected
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleBulkAction("reject")}
          >
            Reject Selected
          </button>
        </div>
      )}

      {/* Gallery content */}
      <div className="row">
        {activeTab === "images" && images.length === 0 && (
          <div className="col-12 text-center">No images found.</div>
        )}
        {activeTab === "videos" && videos.length === 0 && (
          <div className="col-12 text-center">No videos found.</div>
        )}

        {activeTab === "images" &&
          images.map((item) => renderGalleryCard(item))}

        {activeTab === "videos" &&
          videos.map((item) => renderGalleryCard(item))}
      </div>
    </div>
  );
}
