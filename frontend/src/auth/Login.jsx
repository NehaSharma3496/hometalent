import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { LoginApi } from "../Services/auth/Login";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Config from "../Utils/config";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validationSchema = Yup.object({
    identifier: Yup.string().required("Email or phone is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const payload = {
      identifier: values.identifier,
      password: values.password,
    };

    try {
      const response = await LoginApi(payload);

      if (response?.status === true) {
        const user = response?.user;
        const roleId = user?.role_id;

        localStorage.setItem("token", response?.token);
        localStorage.setItem("role", roleId?.toString());
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user?.id);

        try {
          await fetch(`${Config.base_url}admin/notify-expired-plans`);
        } catch (error) {
          console.error("Error notifying expired plans:", error);
        }

        Swal.fire({
          title: "Login Success",
          text: "You have been logged in",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        setTimeout(() => {
          if (roleId === 1) {
            navigate("/admin/dashboard");
          } else if (roleId === 2) {
            navigate("/vendor/dashboard");
          } else if (roleId === 3) {
            navigate("/admin/dashboard");
          } else {
            navigate("/login");
          }
        }, 1500);
      } else {
        Swal.fire({
          title: "Error",
          text: response?.msg || "Invalid credentials",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg || error?.message || "Something went wrong",
        icon: "error",
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
                <Link to="/">
                  <img
                    src="../assets/images//logo/logo.png"
                    width="100"
                    alt="logo"
                    className="changeLogo"
                  />
                </Link>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  {/* Identifier Field */}
                  <div className="form-group mb-3">
                    <label>Email/Phone</label>
                    <Field
                      name="identifier"
                      type="text"
                      className="form-control"
                      placeholder="Enter your email or phone"
                    />
                    <ErrorMessage
                      name="identifier"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Password Field with Toggle */}
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <div className="input-group">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your password"
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </Form>
              </Formik>

              <div className="create-account mt-3">
                <Link to="/forgotpassword" className="text-primary">
                  Forgot Password
                </Link>
              </div>

              <div className="login-footer d-flex">
                <div className="create-account text-center mt-3">
                  <p>
                    Don’t have an account?{" "}
                    <Link to="/registration" className="text-primary">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
