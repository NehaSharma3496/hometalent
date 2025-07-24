import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { GalleryUpload } from "../../../Services/vendor/Vendor";

const UploadGallery = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const handleImageChange = (e) => setImages([...e.target.files]);
  const handleVideoChange = (e) => setVideos([...e.target.files]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!userId) return;

  if (images.length === 0 && videos.length === 0) {
    Swal.fire("No Files", "Please select at least one image or video", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", userId);

  images.forEach((img) => formData.append("images[]", img));
  videos.forEach((vid) => formData.append("videos[]", vid));

  try {
    const res = await GalleryUpload(formData);

    if (res?.data?.status) {
      Swal.fire("Success", res.data.msg, "success");
      setImages([]);
      setVideos([]);
    } else {
      Swal.fire("Error", res?.data?.msg || "Upload failed", "error");
    }
  } catch (error) {
    Swal.fire("Error", error?.msg || "Something went wrong!", "error");
  }
};


  return (
    <div className="page-content ">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 mb-4">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h5 className="add-page-heading">Upload Gallery</h5>
          </div>
        </div>

        <div className="card shadow-sm p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Select Images</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Select Videos</label>
                <input
                  type="file"
                  className="form-control"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                />
              </div>
            </div>

            {(images.length > 0 || videos.length > 0) && (
              <>
                <label className="form-label fw-semibold mb-2">Preview</label>
                <div className="row g-3 mb-3">
                  {images.map((img, i) => (
                    <div className="col-6 col-md-3" key={i}>
                      <div className="border rounded overflow-hidden shadow-sm">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${i}`}
                          className="img-fluid w-100"
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  ))}
                  {videos.map((vid, i) => (
                    <div className="col-6 col-md-3" key={i}>
                      <div className="border rounded overflow-hidden shadow-sm">
                        <video className="w-100" height="160" controls>
                          <source src={URL.createObjectURL(vid)} />
                        </video>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="text-end">
              <button type="submit" className="btn btn-primary me-2">
                <i className="ri-upload-cloud-line me-1"></i>
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadGallery;
