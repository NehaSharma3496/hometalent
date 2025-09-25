import React, { useEffect, useState } from "react";
import {
  GetAllAdminBlog,
  DeleteAdminBlog,
  UpdateBlogStatus,
} from "../../../Services/admin/Admin";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function AllBlog() {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await GetAllAdminBlog(token);
      if (res?.status && Array.isArray(res.data)) {
        setBlogs(res.data);
        setFilteredBlogs(res.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const result = blogs.filter((item) =>
      item.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBlogs(result);
  }, [searchText, blogs]);

  const exportToExcel = () => {
    const exportData = filteredBlogs.map((blog, index) => ({
      "S.No": index + 1,
      Title: blog.title||"N/A",
      "Short Description": blog.short_description||"N/A",
      Status: blog.status === 1 ? "Active" : "Inactive",
      Date: new Date(blog.createdAt).toLocaleDateString()||"N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Blogs");
    XLSX.writeFile(workbook, "Blog_List.xlsx");
  };

  const handleDelete = async (blogId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This blog will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await DeleteAdminBlog(token, blogId);
        if (res?.status) {
          Swal.fire("Deleted!", "The blog has been deleted.", "success");
          fetchBlogs(); // Refresh blog list
        } else {
          Swal.fire("Error!", "Failed to delete the blog.", "error");
        }
      }
    });
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "90px",
    },
    {
      name: "Title",
      selector: (row) => row.title || "-",
      width: "100px",
    },
    {
      name: "Short Description",
      selector: (row) => row.short_description || "-",
      width: "250px",
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString() || "-",
      width: "180px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/admin/updatepackage/${row.id}`)}
          >
            <i className="fa fa-edit me-1" />
            Update
          </button>
          {/* <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash me-1" />
            Delete
          </button> */}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "250px",
    },
    {
      name: "Active Status",
      cell: (row) => (
        <div className="form-check form-switch m-0 d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`toggle-blog-${row.id}`}
            checked={row.status === 1}
            onChange={async (e) => {
              const newStatus = e.target.checked ? 1 : 0;

              const confirm = await Swal.fire({
                title: newStatus ? "Enable Blog?" : "Disable Blog?",
                text: `Are you sure you want to ${
                  newStatus ? "enable" : "disable"
                } this blog?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: newStatus ? "Yes, enable" : "Yes, disable",
                cancelButtonText: "Cancel",
              });

              if (!confirm.isConfirmed) return;

              try {
                const res = await UpdateBlogStatus(row.id, newStatus, token);
                if (res?.status) {
                  Swal.fire("Success", "Blog status updated.", "success");
                  fetchBlogs();
                } else {
                  throw new Error(
                    res?.message || "Failed to update blog status."
                  );
                }
              } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to update blog status.", "error");
              }
            }}
            style={{
              width: "3.5rem",
              height: "1.5rem",
              marginTop: "2px",
            }}
          />
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-12 d-flex justify-content-between align-items-center">
          <div className="add-page-heading-div d-flex align-items-center">
             <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading ">All Blogs</h2>
          </div>

          <div className="text-end">
            <button className="btn btn-success mt-4" onClick={exportToExcel}>
              <i className="fa-solid fa-file-excel me-1"></i>Download Excel
            </button>
          </div>
        </div>
      </div>

      <div className="card table-padding">
        <div className="card-header">
          <div className="col-md-4">
            <div className="d-flex align-items-center border rounded px-2">
              <i className="ri-search-line me-2 text-muted" />
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by blog title..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  className="btn btn-sm btn-light border-0"
                  onClick={() => setSearchText("")}
                >
                  <i className="ri-close-line" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="card-body">
            <DataTable
              columns={columns}
              data={filteredBlogs.slice(
                (currentPage - 1) * perPage,
                currentPage * perPage
              )}
              pagination
              paginationServer
              paginationTotalRows={filteredBlogs.length}
              paginationPerPage={perPage}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerPageChange}
              striped
              responsive
              highlightOnHover
            />
          </div>
        </div>
      </div>
    </div>
  );
}
