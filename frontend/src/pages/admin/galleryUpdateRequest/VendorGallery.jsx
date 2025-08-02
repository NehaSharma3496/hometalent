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
  const [selectedItems, setSelectedItems] = useState([]);
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
      }
    } catch (err) {
      console.error("Fetch vendor gallery error:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
      Swal.fire("Info", `No valid items to ${action}.`, "info");
      return;
    }

    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} ${idsToProcess.length} item(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    const res = await ProcessGalleryUpdateRequests(
      idsToProcess,
      action,
      `${action}d by admin`,
      1,
      token
    );

    if (res?.status) {
      Swal.fire("Success", `Item(s) ${action}d successfully.`, "success");
      setSelectedItems([]);
      fetchGallery();
    } else {
      Swal.fire("Failed", res?.message || "Action failed", "error");
    }
  };

  const handleBulkAction = async (action) => {
    const selectedValidItems = gallery.filter(
      (item) => selectedItems.includes(item.id) && item.status === "pending"
    );

    if (selectedValidItems.length === 0) {
      Swal.fire("Info", `No valid items to ${action}.`, "info");
      return;
    }

    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} selected items?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    const res = await ProcessGalleryUpdateRequests(
      selectedValidItems.map((i) => i.id),
      action,
      `${action}d by admin`,
      1,
      token
    );

    if (res?.status) {
      Swal.fire("Success", `Items ${action}d successfully.`, "success");
      setSelectedItems([]);
      fetchGallery();
    } else {
      Swal.fire("Failed", res?.message || "Action failed", "error");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [vendorId]);

  const filteredGallery = gallery
    .filter((item) =>
      activeTab === "images"
        ? item.file_type.startsWith("image")
        : item.file_type.startsWith("video")
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="page-content">
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

      {selectedItems.length > 0 && (
        <div className="mb-3 d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => handleBulkAction("approve")}
          >
            Approve Selected
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleBulkAction("reject")}
          >
            Reject Selected
          </button>
        </div>
      )}

      <div className="card shadow-sm p-3 border-0 bg-light">
        {filteredGallery.length === 0 ? (
          <p className="text-muted text-center my-4">No {activeTab} found.</p>
        ) : (
          <div className="row">
            {filteredGallery.map((item) => (
              <div className="col-xl-4 col-md-4 col-sm-6 mb-4" key={item.id}>
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  {item.file_type.startsWith("image") ? (
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
                    <p className="text-muted small mb-2">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {item.status === "pending" && (
                      <>
                        <div className="form-check d-flex justify-content-center mb-2">
                          <input
                            type="checkbox"
                            style={{ transform: "scale(1.3)" }}
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                          />
                        </div>

                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              handleSingleAction("approve", item.id)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleSingleAction("reject", item.id)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    )}

                    {item.status === "approved" && (
                      <span className="badge bg-success fs-5">Approved</span>
                    )}

                    {item.status === "rejected" && (
                      <span className="badge bg-danger fs-5">Rejected</span>
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
