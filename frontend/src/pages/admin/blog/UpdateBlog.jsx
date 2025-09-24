import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  UpdateAdminBlog,
  GetSingleAdminBlog,
} from "../../../Services/admin/Admin";
import "react-quill/dist/quill.snow.css";
const login_id = localStorage.getItem("userId");


const ReactQuill = lazy(() => import("react-quill"));

export default function UpdateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [image, setImage] = useState(null);
  const { blogId } = useParams();
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      longDescription === "<p><br></p>"
    ) {
      Swal.fire("All fields are required!", "", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to update this blog.",
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
    formData.append("login_id", login_id);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await UpdateAdminBlog(token, blogId, formData);
      if (response.status) {
        Swal.fire(
          "Success",
          response.msg || "Blog update successfully!",
          "success"
        );
        navigate("/admin/blog/allblogs");
      } else {
        Swal.fire("Failed", response.msg || "Something went wrong", "error");
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.msg || "Server error", "error");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBlogData = async () => {
      try {
        const response = await GetSingleAdminBlog(token, blogId);
        if (response.status) {
          setTitle(response.data.title || "");
          setShortDescription(response.data.short_description || "");
          setLongDescription(response.data.long_description || "");
          setExistingImageUrl(response.data.image);
        } else {
          Swal.fire("Error", response.msg || "Unable to fetch blog", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error?.response?.data?.msg || "Server error",
          "error"
        );
      }
    };

    fetchBlogData();
  }, [blogId]);

  return (
    <div className="page-content">
      {/* Header Section with Back Button and Title */}
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
           <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Update Blog</h2>
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
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                ></textarea>
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
                />
                {existingImageUrl && (
                  <div className="mb-3">
                    <img
                      src={existingImageUrl}
                      alt="Current Blog"
                      style={{ maxHeight: "150px", borderRadius: "5px" }}
                    />
                  </div>
                )}
              </div>

              <div className="col-md-12 text-end">
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-edit me-1" /> Update Blog
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
