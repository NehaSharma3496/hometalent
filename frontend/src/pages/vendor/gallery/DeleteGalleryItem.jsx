import React, { useEffect, useState } from "react";
import { GetGallery, RemoveGalleryItem } from "../../../Services/vendor/Vendor";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DeleteGalleryItem = () => {
  const [gallery, setGallery] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchGallery = async () => {
    try {
      const res = await GetGallery(token, userId);
      setGallery(res?.data || []);
    } catch (error) {
      console.error("Error fetching gallery", error);
    }
  };

  const handleDelete = async (id) => {

    console.log("ok");
    
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This file will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await RemoveGalleryItem(token, id);
        if (res?.status) {
          Swal.fire("Deleted!", res?.msg || "Item deleted.", "success");
          fetchGallery();
        } else {
          Swal.fire("Failed", res?.msg || "Could not delete item", "error");
        }
      } catch (err) {
        Swal.fire("Error", err?.msg || "Server error", "error");
      }
    }
  };

  useEffect(() => {
    if (userId) fetchGallery();
  }, [userId]);

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-light shadow-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h4 className="fw-bold m-0">Delete Gallery Items</h4>
        <div></div> 
      </div>

    
      <div className="row">
        {gallery.length > 0 ? (
          gallery.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm h-100">
                {item.file_type === "image" ? (
                  <img
                    src={item.file_path}
                    className="card-img-top"
                    alt={item.file_name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                ) : (
                  <video className="card-img-top" height="250" controls>
                    <source src={item.file_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="card-footer text-center bg-white border-top-0">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted mt-4">No approved gallery items found.</div>
        )}
      </div>
    </div>
  );
};

export default DeleteGalleryItem;
