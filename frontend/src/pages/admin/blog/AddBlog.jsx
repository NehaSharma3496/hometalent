import React, { useState, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AddAdminBlog } from "../../../Services/admin/Admin";
import "react-quill/dist/quill.snow.css";

const ReactQuill = lazy(() => import("react-quill"));

export default function AddBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      longDescription === "<p><br></p>" ||
      !image
    ) {
      Swal.fire("All fields are required!", "", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to add this blog.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_description", shortDescription);
    formData.append("long_description", longDescription);
    formData.append("image", image);

    try {
      const response = await AddAdminBlog(token, formData);
      if (response && response.status === true) {
        Swal.fire(
          "Success",
          response.msg || "Blog added successfully!",
          "success"
        );
        navigate("/admin/blog/allblogs");
      } else {
        Swal.fire("Failed", response?.msg || "Something went wrong", "error");
      }
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.msg || "Server error", "error");
    }
  };

  return (
    <div className="page-content">
      {/* Header Section with Back Button and Title */}
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Add Blog</h2>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={shortDescription}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/);
                    if (words.length <= 30) {
                      setShortDescription(e.target.value);
                    } else {
                      Swal.fire(
                        "Limit Exceeded",
                        "Short Description cannot exceed 30 words.",
                        "warning"
                      );
                    }
                  }}
                  required
                ></textarea>
                <small className="text-muted">
                  Word Count:{" "}
                  {shortDescription.trim() === ""
                    ? 0
                    : shortDescription.trim().split(/\s+/).length}{" "}
                  / 30
                </small>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Long Description</label>
                <Suspense fallback={<div>Loading editor...</div>}>
                  <ReactQuill
                    theme="snow"
                    value={longDescription}
                    onChange={setLongDescription}
                    className="custom-quill-editor"
                  />
                </Suspense>
              </div>

              <div className="col-md-12 mb-4">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
              </div>

              <div className="col-md-12 text-end">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-plus me-1"></i> Add Blog
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
