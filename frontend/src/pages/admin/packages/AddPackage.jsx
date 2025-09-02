import React, { useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { CreatePackage } from "../../../Services/admin/Admin";

export default function AddPackage() {
  const token = localStorage.getItem("token");
  const [validityType, setValidityType] = useState("months"); // default

  const initialValues = {
    name: "",
    description: "",
    price: "",
    validity_type: "months", // new field
    validity_in_months: "",
    validity_in_days: "",
    features: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Package Name is required"),
    description: Yup.string().required("Description is required"),
   price: Yup.number()
  .required("Price is required")
  .min(0, "Price cannot be negative"),

    validity_type: Yup.string().required("Validity type is required"),
    validity_in_months: Yup.number().when("validity_type", {
      is: "months",
      then: (schema) =>
        schema.required("Validity in months is required").positive(),
    }),
    validity_in_days: Yup.number().when("validity_type", {
      is: "days",
      then: (schema) =>
        schema.required("Validity in days is required").positive(),
    }),
    features: Yup.string().required("Features are required"),
  });

  // dynamic fields
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
      name: "validity_type",
      label: "Validity Type*",
      type: "select",
      colClass: "col-md-6 custom-field",
      options: [
        { label: "Months", value: "months" },
        { label: "Days", value: "days" },
      ],
      onChange: (e) => setValidityType(e.target.value), // track change
    },
    ...(validityType === "months"
      ? [
          {
            name: "validity_in_months",
            label: "Validity (in months)*",
            type: "select",
            colClass: "col-md-6 custom-field",
            options: Array.from({ length: 12 }, (_, i) => ({
              label: `${i + 1} Month${i + 1 > 1 ? "s" : ""}`,
              value: i + 1,
            })),
          },
        ]
      : [
          {
            name: "validity_in_days",
            label: "Validity (in days)*",
            type: "select",
            colClass: "col-md-6 custom-field",
            options: Array.from({ length: 30 }, (_, i) => ({
              label: `${i + 1} Day${i + 1 > 1 ? "s" : ""}`,
              value: i + 1,
            })),
          },
        ]),
    {
      name: "features",
      label: "Features*",
      type: "textarea",
      colClass: "col-md-12 custom-field",
    },
  ];

  const onSubmit = async (values) => {
    try {
      // backend ke liye ek hi validity bhejna
      const payload = {
        ...values,
        validity:
          values.validity_type === "months"
            ? values.validity_in_months
            : values.days,
      };

      const res = await CreatePackage(payload, token);

      if (res?.status==true) {
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
