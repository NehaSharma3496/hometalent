import React, { useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { CreatePackage } from "../../../Services/admin/Admin"; 

export default function AddPackage() {
  const token = localStorage.getItem("token");

  const initialValues = {
    name: "",
    description: "",
    price: "",
    validity_in_months: "",
    features: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Package Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required").positive(),
    validity_in_months: Yup.number().required("Validity is required").positive(),
    features: Yup.string().required("Features are required"),
  });

  const fields = [
    {
      name: "name",
      label: "Package Name*",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "description",
      label: "Description*",
      type: "textarea",
      colClass: "col-md-12 mb-3",
    },
    {
      name: "price",
      label: "Price (₹)*",
      type: "number",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "validity_in_months",
      label: "Validity (in months)*",
      type: "number",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "features",
      label: "Features*",
      type: "textarea",
      colClass: "col-md-12 mb-3",
    },
  ];

  const onSubmit = async (values) => {
    try {
      const res = await CreatePackage(values, token);

      if (res?.status) {
        Swal.fire("Success", res?.msg || "Package created!", "success");
      } else {
        Swal.fire("Error", res?.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      Swal.fire("Error", err?.response?.data?.msg || "Something went wrong", "error");
    }
  };

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-4">
        <Link to="/admin/package">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading">Add Package</h2>
      </div>
      <div className="card">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
        />
      </div>
    </div>
  );
}
