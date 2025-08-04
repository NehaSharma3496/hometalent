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
  const initialValues = {
    new_password: "",
  };

  const validationSchema = Yup.object({
    new_password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("New password is required"),
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
          text: response.data.msg,
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
          text: response.data.msg,
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
