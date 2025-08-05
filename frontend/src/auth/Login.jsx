import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { LoginApi } from "../Services/auth/Login";
import ReusableForm from "../extracomponents/ReusableForm";

const Login = () => {
  const navigate = useNavigate();
  const initialValues = {
    identifier: "",
    password: "",
  };

  //  Validation schema
  const validationSchema = Yup.object({
    identifier: Yup.string().required("Email or phone is required"),
    password: Yup.string().required("Password is required"),
  });

  //  Field definitions
  const fields = [
    {
      name: "identifier",
      label: "Email/phone",
      type: "text",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  const handleSubmit = async (values) => {
    const payload = {
      identifier: values.identifier,
      password: values.password,
    };

    try {
      const response = await LoginApi(payload);

      console.log("Login API response:", response);

      if (response.status === true) {
        const user = response.user;
        const roleId = user.role_id;

        localStorage.setItem("token", response.token);
        localStorage.setItem("role", roleId.toString());
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user.id);

        if (user?.id) {
          localStorage.setItem("userId", user.id.toString());
        } else {
          console.log("User ID not found in response:", user);
        }

        Swal.fire({
          title: "Login Success",
          text: "You have been logged in",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            if (roleId === 1) {
              navigate("/admin/dashboard");
            } else if (roleId === 2) {
              navigate("/vendor/dashboard");
            } else {
              navigate("/login");
            }
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.msg || "Invalid credentials",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Login error:", error.response?.data || error);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg || error.message || "Something went wrong",
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
                <img
                  src="../assets/images/logo/logo.png"
                  alt="logo"
                  className="changeLogo w-25"
                />
              </div>

              <ReusableForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                fields={fields}
              />
              <div className="create-account mt-3">
                {" "}
                <a href="/forgotpassword" className="text-primary ">
                  Forgot Password
                </a>
              </div>

              <div className="login-footer d-flex">
                <div className="create-account text-center mt-3">
                  <p>
                    Don’t have an account?{" "}
                    <a href="/registration" className="text-primary">
                      Register
                    </a>
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
