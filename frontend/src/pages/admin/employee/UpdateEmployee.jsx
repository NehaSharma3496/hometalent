import React, { useEffect, useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  GetVendorDetails,
} from "../../../Services/vendor/Vendor";
import { UpdateEmpoyee } from "../../../Services/admin/Admin";

export default function UpdateEmployee() {
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const vendorId = location.state?.vendorId;
  const vendor_id=location.state?.vendorId;
const token=localStorage.getItem("token");

  const validationSchema = Yup.object().shape({
    profile_name: Yup.string()
      .required("Name is required")
      .min(2, "Profile Name must be at least 2 characters")
      .max(50, "Profile Name must not exceed 50 characters")
      .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, "Only alphabets are allowed"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian mobile number"
      ),
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email address"),
          password: Yup.string().required("Password is required"),
      
  });

  const fields = [
    {
      name: "profile_name",
      label: "Profile Name",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "phone",
      label: "Phone*",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
      placeholder: "Enter 10-digit mobile number",
    },
    {
      name: "email",
      label: "Email*",
      type: "email",
      colClass: "col-md-4 mb-3",
      required: true,
    },
       {
      name: "password",
      label: "Password*",
      type: "password",
      colClass: "col-md-4",
    },
  ];

 const onSubmit = async (values) => {
  try {
    const formData = new FormData();
    formData.append("vendor_id", vendorId);
    formData.append("profile_name", values.profile_name);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    formData.append("password",values.password);

    const res = await UpdateEmpoyee(formData,vendor_id);

    if (res?.status) {
      Swal.fire("Success", res.msg || "Profile update submitted!", "success");
      navigate(-1); // optional: go back after success
    } else {
      Swal.fire("Error", res?.msg || "Something went wrong", "error");
    }
  } catch (err) {
    console.error("Full error object:", err);
    let errorMessage = "Failed to submit";
    if (err?.response?.data?.msg) {
      errorMessage = err.response.data.msg;
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }
    Swal.fire("Error", errorMessage, "error");
  }
};


  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [vendorRes] = await Promise.all([
          GetVendorDetails(token, vendorId),
        ]);

        const vendor = vendorRes?.data?.user;

        setInitialValues({
          profile_name: vendor.profile_name || "",
          phone: vendor.phone || "",
          email: vendor.email || "",
          password:vendor.show_password||"",
        });
      } catch (err) {
        console.log("Init fetch error", err);
      }
    };
    fetchInitial();
  }, []);

  if (!initialValues)
    return <div className="text-center py-5">Loading Profile Data...</div>;

  return (
    <div className="page-content container-fluid">
      <div className="add-page-heading-div mb-3 d-flex align-items-center gap-2">
        <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </button>
        <h2 className="add-page-heading mb-0">Update Employee Profile</h2>
      </div>
      <div className="card">
        <div className="row align-items-center mb-3">
          <div className="col-md-6"></div>
        </div>

        <div className="row px-4 pb-4">
          <div className="col-md-12">
            <ReusableForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              fields={fields}
              validationSchema={validationSchema}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
