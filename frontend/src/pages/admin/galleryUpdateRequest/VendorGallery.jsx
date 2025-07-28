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

  const handleSingleAction = async (action, id) => {
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${action} this item?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (confirm.isConfirmed) {
      const res = await processRequest(action, id);
      if (res?.status) {
        Swal.fire("Success", `Item ${action}d successfully.`, "success");
        fetchGallery();
      } else {
        Swal.fire("Failed", "Something went wrong.", "error");
      }
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
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => viewDetails(item)}
                      >
                        View
                      </button>

                      {item.status === "pending" && (
                        <>
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
                        </>
                      )}

                      {item.status === "approved" && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleSingleAction("reject", item.id)}
                        >
                          Reject
                        </button>
                      )}

                      {item.status === "rejected" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSingleAction("approve", item.id)}
                        >
                          Approve Again
                        </button>
                      )}
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
}
