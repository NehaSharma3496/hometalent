import React, { useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { EmployeeRegister } from "../../../Services/admin/Admin";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    profileName: "",
    phone: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    profileName: Yup.string()
      .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, "Only alphabets are allowed ")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const fields = [
    {
      name: "profileName",
      label: "Name*",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "phone",
      label: "Phone No*",
      type: "number",
      colClass: "col-md-4",
    },
    {
      name: "email",
      label: "Email*",
      type: "email",
      colClass: "col-md-4",
    },
    {
      name: "password",
      label: "Password*",
      type: "password",
      colClass: "col-md-4",
    },
  ];

  const onSubmit = async (values) => {
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        profile_name: values.profileName,
        phone: values.phone,
        email: values.email,
        password: values.password,
        role_id: 3,
      };

      console.log("Payload:", payload);

      const res = await EmployeeRegister(payload);
      if (res?.data?.status) {
        Swal.fire(
          "Success",
          res?.data?.msg || "Employee Added Successfully.",
          "success"
        ).then(() => {
          navigate("/admin/employeelist");
        });
      } else {
        Swal.fire("Error", res?.data?.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.msg || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-4">
        <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </button>
        <h2 className="add-page-heading">Add Employee</h2>
      </div>
      <div className="card ">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitButtonProps={{ disabled: loading }}
        />
      </div>
    </div>
  );
}
