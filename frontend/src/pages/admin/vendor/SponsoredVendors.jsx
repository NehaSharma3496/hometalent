import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetCategories } from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";

export default function SponsoredVendors() {
  const [category, setCategory] = React.useState([]);

  const fetchCategory = async () => {
    try {
      const response = await GetCategories();
      setCategory(response.data);
      console.log("Category list", response.data);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
      sortable: true,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Category</h2>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col-md-12">
            <Datatable columns={columns} data={category} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
