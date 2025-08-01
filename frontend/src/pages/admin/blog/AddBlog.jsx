import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { AddAdminBlog } from '../../../Services/admin/Admin';
import { useNavigate } from 'react-router-dom';

export default function AddBlogs() {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !shortDescription || !longDescription || !image) {
      Swal.fire('Error', 'All fields including image are required', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('short_description', shortDescription);
    formData.append('long_description', longDescription);
    formData.append('image', image);

    const token = localStorage.getItem('token'); 
    const result = await AddAdminBlog(token, formData);

    if (result?.status) {
      Swal.fire('Success', 'Blog added successfully!', 'success');

    } else {
      Swal.fire('Error', result?.msg || 'Failed to add blog', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Blog</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Short Description</label>
          <textarea className="form-control" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Long Description</label>
          <textarea className="form-control" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Image</label>
          <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary">Add Blog</button>
      </form>
    </div>
  );
}
