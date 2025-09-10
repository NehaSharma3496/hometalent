import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Resetpassword } from "../Services/auth/Login";
import { useParams, Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    new_password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object({
    new_password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("New password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const payload = {
        token,
        new_password: values.new_password,
      };
      const response = await Resetpassword(token, payload);

      if (response?.data?.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.data?.msg,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });

        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.msg,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
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
              <h4 className="text-center mb-4">Reset Your Password</h4>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="form-group mb-2">
                    <label className="mb-2">New Password</label>
                    <div className="input-group">
                      <Field
                        type={showNewPassword ? "text" : "password"}
                        name="new_password"
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
                      name="new_password"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-2">
                    <label className="mb-2">Confirm New Password</label>
                    <div className="input-group">
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        className="form-control"
                        placeholder="Re-enter new password"
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </span>
                    </div>
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
