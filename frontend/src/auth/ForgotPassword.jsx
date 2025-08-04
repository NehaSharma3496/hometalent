import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Forgotpassword } from "../Services/auth/Login";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const initialValues = {
    email: "",
    url: `${window.location.protocol}//${window.location.host}/reset-password`,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await Forgotpassword(values);

      if (response?.data?.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.data?.msg || "Password reset link sent.",
        });
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.msg || "Something went wrong",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.message || "Server error",
      });
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
                  src="../assets/images/logo/logo.png"
                  alt="logo"
                  className="changeLogo w-25"
                />
              </div>
              <h4 className="text-center mb-4">Forgot Password</h4>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <Field type="hidden" name="url" />

                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Send Reset Link
                  </button>
                </Form>
              </Formik>
              <div className="text-center mt-3">
                <Link to="/login">← Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
