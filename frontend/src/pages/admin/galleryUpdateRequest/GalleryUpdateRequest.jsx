import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  GetGalleryUpdateRequests,
  ProcessGalleryUpdateRequests,
} from "../../../Services/admin/Admin";

export default function GalleryUpdateRequest() {
  const [gallery, setGallery] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const token = localStorage.getItem("token");

  const fetchGallery = async () => {
    try {
      const res = await GetGalleryUpdateRequests({
        token,
        statusFilter,
        page: 1,
        limit: 100,
      });

      if (res.status) {
        setGallery(res.data.gallery || []);
      }
    } catch (err) {
      console.error("Fetch gallery error:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
    setSelectedIds([]);
  }, [statusFilter]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const processRequests = async (action, ids = selectedIds) => {
    if (!ids || (Array.isArray(ids) && ids.length === 0)) return;

    const galleryIds = Array.isArray(ids) ? ids : [ids];
    let successCount = 0;

    for (const id of galleryIds) {
      const res = await ProcessGalleryUpdateRequests(
        id, // single gallery_id
        action,
        `${action}d by admin`,
        1, // admin_id (can be dynamic later)
        token
      );

      if (res?.status) successCount++;
    }

    if (successCount > 0) {
      Swal.fire(
        "Success",
        `${successCount} request(s) ${action}d successfully`,
        "success"
      );
      fetchGallery();
    } else {
      Swal.fire("Error", `Failed to ${action} request(s)`, "error");
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
      imageUrl: item.file_path,
      imageWidth: 300,
      imageAlt: "Gallery Image",
    });
  };

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-3 d-flex align-items-center justify-content-between">
        <h2 className="add-page-heading">Gallery Update Requests</h2>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {statusFilter === "pending" && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => processRequests("approve")}
                disabled={selectedIds.length === 0}
              >
                Approve Selected
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => processRequests("reject")}
                disabled={selectedIds.length === 0}
              >
                Reject Selected
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row">
        {gallery.length === 0 ? (
          <div className="col-12 text-center">No records found.</div>
        ) : (
          gallery.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm position-relative">
                {statusFilter === "pending" && (
                  <div className="position-absolute top-0 end-0 m-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </div>
                )}
                <img
                  src={item.file_path}
                  className="card-img-top"
                  alt={item.file_name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.file_name}</h5>
                  <p className="card-text mb-1">
                    <strong>Vendor:</strong> {item.user?.owner_name || "N/A"}
                  </p>
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
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => processRequests("approve", item.id)}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
