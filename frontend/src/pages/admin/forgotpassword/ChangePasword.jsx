import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ChangePasswords } from "../../../Services/auth/Login";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id || user?.user_id;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
      confirmNewPassword: "",
  };

 const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});


  const handleSubmit = async (values, { resetForm }) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const payload = {
          user_id: user_id,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        };

        const response = await ChangePasswords(token, payload);
        console.log("Backend Response:", response);

        if (response?.data?.status) {
          Swal.fire({
            icon: "success",
            title: "Password Updated Successfully!",
            text: response?.data?.message || "Your password has been changed.",
            confirmButtonText: "OK",
            confirmButtonText: "OK",
          }).then(() => {
            resetForm();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response?.data?.message || "Something went wrong",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.data?.message || "Server error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="login-area section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10">
            <div className="login-card">
              <div className="logo mb-40 text-center">
                <img
                  src="/assets/images/logo/logo.png"
                  alt="logo"
                  className="changeLogo w-25"
                />
              </div>
              <h4 className="text-center mb-4">Change Password</h4>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="form-group mb-3">
                    <label>Old Password</label>
                    <Field
                      type="password"
                      name="oldPassword"
                      className="form-control"
                      placeholder="Enter old password"
                    />
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>New Password</label>
                    <div className="input-group">
                      <Field
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        className="form-control"
                        placeholder="Enter new password"
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        <i
                          className={`bi ${
                            showNewPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </span>
                    </div>
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                   <div className="form-group mb-2">
  <label className="mb-2">Confirm New Password</label>
  <div className="input-group">
   <Field
  type={showConfirmPassword ? "text" : "password"}
  name="confirmNewPassword"
  className="form-control"
  placeholder="Re-enter new password"
/>
    <span
      className="input-group-text"
      style={{ cursor: "pointer" }}
      onClick={() => setShowConfirmPassword((prev) => !prev)}
    >
      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
    </span>
  </div>
  <ErrorMessage
  name="confirmNewPassword"
  component="div"
  className="text-danger"
/>
</div>


                  <button type="submit" className="btn btn-primary w-100">
                    Change Password
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
