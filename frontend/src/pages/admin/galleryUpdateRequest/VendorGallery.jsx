// src/pages/admin/gallery/VendorGalleryPage.jsx

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
        const filtered = all.filter((g) => g.user?.id == vendorId); // loose == to match string/number
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
      imageUrl: item.file_path,
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

    if (res?.status) {
      Swal.fire("Success", `Image ${action}d successfully`, "success");
      fetchGallery();
    } else {
      Swal.fire("Error", `Failed to ${action} image`, "error");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [vendorId]);

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="add-page-heading">Vendor Gallery (ID: {vendorId})</h2>
        <Link to="/admin/all-vendors" className="btn btn-secondary btn-sm">
          <i className="fa fa-arrow-left"></i> Back to Vendors
        </Link>
      </div>

      <div className="row">
        {gallery.length === 0 ? (
          <div className="col-12 text-center">No gallery images found.</div>
        ) : (
          gallery.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm position-relative">
                <img
                  src={item.file_path}
                  className="card-img-top"
                  alt={item.file_name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.file_name}</h5>
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
                          onClick={() => processRequest("approve", item.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => processRequest("reject", item.id)}
                        >
                          Reject
                        </button>
                      </>
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
