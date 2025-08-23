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
    validity_in_months: Yup.number()
      .required("Validity is required")
      .positive(),
    features: Yup.string().required("Features are required"),
  });

  const fields = [
    {
      name: "name",
      label: "Package Name*",
      type: "text",
      colClass: "col-md-6 custom-field",
    },
    {
      name: "description",
      label: "Description*",
      type: "textarea",
      colClass: "col-md-12 custom-field",
    },
    {
      name: "price",
      label: "Price (₹)*",
      type: "number",
      colClass: "col-md-6 custom-field",
    },
    {
      name: "validity_in_months",
      label: "Validity (in months)*",
      type: "select",
      colClass: "col-md-6 custom-field",
      options: [
        { label: "1 Month", value: 1 },
        { label: "2 Months", value: 2 },
        { label: "3 Months", value: 3 },
        { label: "4 Months", value: 4 },
        { label: "5 Months", value: 5 },
        { label: "6 Months", value: 6 },
        { label: "7 Months", value: 7 },
        { label: "8 Months", value: 8 },
        { label: "9 Months", value: 9 },
        { label: "10 Months", value: 10 },
        { label: "11 Months", value: 11 },
        { label: "12 Months", value: 12 },
      ],
    },
    {
      name: "features",
      label: "Features*",
      type: "textarea",
      colClass: "col-md-12 custom-field",
    },
  ];


  const onSubmit = async (values) => {
    try {
      const res = await CreatePackage(values, token);

      if (res?.status) {
        Swal.fire("Success", res?.msg || "Package created!", "success").then(
          () => {
            window.location.reload();
          }
        );
      } else {
        Swal.fire("Error", res?.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.msg || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-2">
        <Link to="/admin/dashboard">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading">Add Package</h2>
      </div>
      <div className="card table-padding font">
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
