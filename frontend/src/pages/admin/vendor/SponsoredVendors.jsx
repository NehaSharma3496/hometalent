import React, { useEffect, useState } from "react";
import { GetCategories } from "../../../Services/admin/Admin";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await GetCategories(token);
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const categoryColumns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    { name: "Category Name", selector: (row) => row.name, sortable: true },

    {
      name: "Sponsored Vendor",
      cell: (row) => (
        <button
          className="btn action-btn btn-primary"
          onClick={() =>
            navigate("/admin/vendor/sponsoredrankupdate", {
              state: { categoryId: row.id, categoryName: row.name },
            })
          }
        >
          Get
        </button>
      ),
    },
    ``,
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 col-8">
          <div className="add-page-heading-div d-flex align-items-center">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Categories</h2>
          </div>
        </div>
      </div>

      <div className="card table-padding">
        <div className="row">
          <div className="col-md-12">
            <DataTable columns={categoryColumns} data={categories} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
