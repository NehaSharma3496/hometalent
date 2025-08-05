import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ChangePassword } from "../../../Services/auth/Login";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const storedPassword = user?.show_password;

  const initialValues = {
    old_password: "",
    new_password: "",
  };

  const validationSchema = Yup.object({
    old_password: Yup.string().required("Old password is required"),
    new_password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("New password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log("Stored Password:", storedPassword);
    console.log("Entered Old Password:", values.old_password);
    console.log("User", user);
    console.log("Token", token);

    if (values.old_password !== storedPassword) {
      Swal.fire({
        icon: "error",
        title: "Incorrect Old Password",
        text: "The old password you entered does not match.",
      });
      return;
    }

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
          token,
          new_password: values.new_password,
        };
        const response = await Resetpassword(token, payload);

        if (response?.data?.status) {
          Swal.fire({
            icon: "success",
            title: "Password Changed",
            text: response.data.msg,
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            resetForm();
            navigate("/dashboard");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response?.data?.msg || "Something went wrong",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.message || "Server error",
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
                  src="../../../../public/assets/images/logo/logo.png"
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
                      name="old_password"
                      className="form-control"
                      placeholder="Enter old password"
                    />
                    <ErrorMessage
                      name="old_password"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>New Password</label>
                    <Field
                      type="password"
                      name="new_password"
                      className="form-control"
                      placeholder="Enter new password"
                    />
                    <ErrorMessage
                      name="new_password"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Change Password
                  </button>
                </Form>
              </Formik>
              <div className="text-center mt-3">
                <a href="/login">← Back to Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
