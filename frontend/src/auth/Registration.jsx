import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/websitecomponents/Breadcrumbs";
import ReusableForm from "../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  VendorRegister,
  GetCategories,
  GetStates,
  GetCities,
} from "../Services/vendor/Vendor";
import { VerifyOtp } from "../Services/webService/Web";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [phoneVerificationState, setPhoneVerificationState] = useState({
    isVerified: false,
    showVerifyButton: false,
    showOtpInput: false,
    otp: "",
    sentOtp: "",
    phoneNumber: "",
    loading: false,
  });

  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtpClick = (phone) => {
    handleSendOtp(phone);
    setIsOtpSent(true);
  };

  const token = localStorage.getItem("token");

  const initialValues = {
    ownerName: "",
    profileName: "",
    state: "",
    city: "",
    pin: "",
    phone: "",
    isPhoneVerified: false,
    email: "",
    priceRange: "",
    shortDesc: "",
    category: "",
    otherCategory: "",
    experience: "",
    longDesc: "",
    facebook_link: "",
    instagram_link: "",
    twitter_link: "",
    linkedin_link: "",
    youtube_link: "",
    website_link: "",
    image: null,
    terms: false,
  };

  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Enhanced validation schema with phone verification
  const validationSchema = Yup.object({
    ownerName: Yup.string()
      .matches(
        /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        "Only alphabets are allowed"
      )
      .required("Owner Name is required"),

    profileName: Yup.string()
      .matches(
        /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        "Only alphabets are allowed"
      )
      .required("Profile Name is required"),

    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pin: Yup.string()
      .matches(/^\d{6}$/, "Pin code must be exactly 6 digits")
      .required("Pin Code is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required"),
    isPhoneVerified: Yup.boolean().oneOf(
      [true],
      "Phone number must be verified"
    ),
    email: Yup.string().email("Invalid email").required("Email is required"),
    category: Yup.string().required("Category is required"),
    otherCategory: Yup.string().when("category", {
      is: (val) => {
        return (
          categoryData
            ?.find((cat) => cat.value === val)
            ?.label?.toLowerCase() === "other"
        );
      },
      then: (schema) => schema.required("Please enter category name"),
      otherwise: (schema) => schema.notRequired(),
    }),
    terms: Yup.boolean().oneOf([true], "You must accept terms"),
    longDesc: Yup.string().required("Description is required"),
  });

  // Phone verification handlers
  const handlePhoneInput = (e, setFieldValue, setFieldTouched, touched) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "").slice(0, 10);

    // Update Formik field value
    setFieldValue("phone", numericValue);

    // Mark field as touched
    if (!touched.phone) {
      setFieldTouched("phone", true);
    }

    // Update phone verification state
    setPhoneVerificationState((prev) => ({
      ...prev,
      isVerified: numericValue !== prev.phoneNumber ? false : prev.isVerified,
      showVerifyButton: numericValue.length === 10,
      showOtpInput:
        numericValue !== prev.phoneNumber ? false : prev.showOtpInput,
      otp: numericValue !== prev.phoneNumber ? "" : prev.otp,
      sentOtp: numericValue !== prev.phoneNumber ? "" : prev.sentOtp,
      phoneNumber: numericValue,
    }));
  };

  const handleOtpInput = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "").slice(0, 4);

    setPhoneVerificationState((prev) => ({
      ...prev,
      otp: numericValue,
    }));
  };

  const handleSendOtp = async (phoneValue) => {
    if (!phoneValue || phoneValue.length !== 10) {
      Swal.fire("Error", "Please enter a valid 10-digit phone number", "error");
      return;
    }

    try {
      setPhoneVerificationState((prev) => ({ ...prev, loading: true }));

      const res = await VerifyOtp({ phone: phoneValue });

      if (res?.status) {
        setPhoneVerificationState((prev) => ({
          ...prev,
          showOtpInput: true,
          sentOtp: res?.otp || "",
          loading: false,
          isVerified: false,
        }));
        setOtpTimer(60); // start 1 minute countdown
        Swal.fire(
          "Success",
          "Verification code sent via Cegano Technology.Enter the OTP to continue.",
          "success"
        );
      } else {
        setPhoneVerificationState((prev) => ({ ...prev, loading: false }));
        Swal.fire("Error", res?.msg || "Failed to send OTP", "error");
      }
    } catch (err) {
      console.error(err);
      setPhoneVerificationState((prev) => ({ ...prev, loading: false }));
      Swal.fire("Error", "Failed to send OTP. Please try again.", "error");
    }
  };

  // const handleSendOtp = async (phoneValue) => {
  //   if (!phoneValue || phoneValue.length !== 10) {
  //     Swal.fire("Error", "Please enter a valid 10-digit phone number", "error");
  //     return;
  //   }

  //   try {
  //     // Show loading state
  //     setPhoneVerificationState((prev) => ({
  //       ...prev,
  //       loading: true,
  //     }));

  //     const res = await VerifyOtp({ phone: phoneValue });

  //     if (res?.status) {
  //       setPhoneVerificationState((prev) => ({
  //         ...prev,
  //         showOtpInput: true,
  //         sentOtp: res?.otp || "",
  //         loading: false,
  //       }));
  //       Swal.fire("Success", "OTP sent successfully to your phone!", "success");
  //     } else {
  //       setPhoneVerificationState((prev) => ({
  //         ...prev,
  //         loading: false,
  //       }));
  //       Swal.fire("Error", res?.msg || "Failed to send OTP", "error");
  //     }
  //   } catch (err) {
  //     console.error("OTP send error:", err);
  //     setPhoneVerificationState((prev) => ({
  //       ...prev,
  //       loading: false,
  //     }));
  //     Swal.fire("Error", "Failed to send OTP. Please try again.", "error");
  //   }
  // };

  // accept setFieldValue as argument
  const handleVerifyOtp = (setFieldValue) => {
    const otpValue = phoneVerificationState.otp;

    if (!otpValue || otpValue.length !== 4) {
      Swal.fire("Error", "Please enter a valid 4-digit OTP", "error");
      return;
    }

    if (otpValue === phoneVerificationState.sentOtp.toString()) {
      setPhoneVerificationState((prev) => ({
        ...prev,
        isVerified: true,
        showOtpInput: false,
      }));

      // now works ✅
      setFieldValue("isPhoneVerified", true);

      Swal.fire("Success", "Phone number verified successfully!", "success");
    } else {
      Swal.fire("Error", "Invalid OTP. Please try again.", "error");
    }
  };

  const handleKeyPress = (e) => {
    // Only allow numbers
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  // Custom phone component as a function
  const CustomPhoneComponent = ({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  }) => (
    <>
      <label className="contact-label mb-2 fs-6 fw-semibold">Phone No*</label>

      <div className="input-group mb-2">
        <input
          type="text"
          className={`form-control contact-input ${
            touched.phone && errors.phone ? "is-invalid" : ""
          }`}
          value={values.phone || ""}
          onChange={(e) =>
            handlePhoneInput(e, setFieldValue, setFieldTouched, touched)
          }
          placeholder="Enter 10-digit phone number"
          maxLength="10"
          autoComplete="tel"
        />

        {/* {phoneVerificationState.showVerifyButton &&
          !phoneVerificationState.isVerified && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleSendOtp(values.phone)}
              disabled={
                phoneVerificationState.showOtpInput ||
                phoneVerificationState.loading
              }
              style={{ whiteSpace: "nowrap" }}
            >
              {phoneVerificationState.loading
                ? "Sending..."
                : phoneVerificationState.showOtpInput
                ? "OTP Sent"
                : "Send OTP"}
            </button>
          )} */}

        {phoneVerificationState.showVerifyButton &&
          !phoneVerificationState.isVerified && (
            <>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handleSendOtpClick(values.phone)}
                disabled={otpTimer > 0 || phoneVerificationState.loading}
                style={{ whiteSpace: "nowrap" }}
              >
                {phoneVerificationState.loading
                  ? "Sending..."
                  : !isOtpSent
                  ? "Send OTP"
                  : otpTimer > 0
                  ? `Resend OTP in ${otpTimer}s`
                  : "Resend OTP"}
              </button>
            </>
          )}
      </div>

      {phoneVerificationState.showOtpInput && (
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control contact-input"
            value={phoneVerificationState.otp || ""}
            onChange={handleOtpInput}
            onKeyPress={handleKeyPress}
            placeholder="Enter 4-digit OTP"
            maxLength="4"
            autoComplete="one-time-code"
          />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleVerifyOtp(setFieldValue)}
            disabled={phoneVerificationState.otp.length !== 4}
          >
            Verify OTP
          </button>
        </div>
      )}

      {phoneVerificationState.isVerified && (
        <div className="alert alert-success p-2 mt-2" role="alert">
          <small>✓ Phone number verified successfully!</small>
        </div>
      )}

      {/* Show validation errors */}
      {touched.phone && errors.phone && (
        <div className="text-danger small mt-1">{errors.phone}</div>
      )}

      {/* Show warning if phone number is complete but not verified */}
      {!phoneVerificationState.isVerified &&
        values.phone &&
        values.phone.length === 10 &&
        !errors.phone && (
          <div className="text-warning mt-1">
            <small>⚠️ Please verify your phone number before submitting</small>
          </div>
        )}
    </>
  );

  const fields = [
    {
      name: "ownerName",
      label: "Owner Name*",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "profileName",
      label: "Profile Name",
      type: "text",
      colClass: "col-md-4 mb-3",
    },

    {
      name: "state",
      label: "State*",
      type: "select",
      options: statesData,
      onChange: (e) => setSelectedStateId(e.target.value),
      colClass: "col-md-4 mb-3",
    },

    {
      name: "city",
      label: "City*",
      type: "select",
      options: cityData,
      colClass: "col-md-4 mb-3",
    },
    {
      name: "pin",
      label: "Pin Code*",
      type: "text",
      colClass: "col-md-4 mb-3",
      maxLength: 6,
      numeric: true,
    },
    {
      name: "phone",
      label: "Phone No*",
      type: "custom",
      colClass: "col-md-4 mb-3",
      customComponent: CustomPhoneComponent,
    },
    {
      name: "email",
      label: "Email*",
      type: "email",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "category",
      label: "Category*",
      type: "select",
      colClass: "col-md-6 mb-3",
      options: categoryData,
    },
    {
      name: "otherCategory",
      label: "Category Name*",
      type: "text",
      colClass: "col-md-6 mb-3",
      showWhen: (values) => {
        const selected = categoryData?.find(
          (cat) => cat.value === values.category
        );
        return selected?.label?.toLowerCase() === "other";
      },
      placeholder: "Enter category name",
    },
    {
      name: "longDesc",
      label: "Description*",
      type: "textarea",
      colClass: "col-12 mb-3",
    },

    {
      name: "priceRange",
      label: "Estimated Price Range",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "experience",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "facebook_link",
      label: "Facebook Link",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "instagram_link",
      label: "Instagram Link",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "twitter_link",
      label: "Twitter Link",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "linkedin_link",
      label: "LinkedIn Link",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "youtube_link",
      label: "YouTube Link",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "website_link",
      label: "Website Link",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      colClass: "col-md-6 mb-3",
      accept: "image/*",
      multiple: false,
    },
    {
      name: "terms",
      label: (
        <>
          I accept{" "}
          <Link to="/termscondition" target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </Link>
          *
        </>
      ),
      type: "checkbox",
      colClass: "col-md-12 mb-3",
    },
  ];

  // Enhanced fields array with custom phone field
  // const fields = [
  //   {
  //     name: "ownerName",
  //     label: "Profile Name*",
  //     type: "text",
  //     colClass: "col-md-4 mb-3",
  //   },

  //   {
  //     name: "profileName",
  //     label: "Owner Name",
  //     type: "text",
  //     colClass: "col-md-4 mb-3",
  //   },

  //   {
  //     name: "state",
  //     label: "State*",
  //     type: "select",
  //     options: statesData,
  //     onChange: (e) => setSelectedStateId(e.target.value),
  //     colClass: "col-md-4 mb-3",
  //   },
  //   {
  //     name: "city",
  //     label: "City*",
  //     type: "select",
  //     options: cityData,
  //     colClass: "col-md-4 mb-3",
  //   },
  //   {
  //     name: "pin",
  //     label: "Pin Code*",
  //     type: "text",
  //     colClass: "col-md-4 mb-3",
  //     maxLength: 6,
  //     numeric: true,
  //   },
  //   {
  //     name: "phone",
  //     label: "Phone No*",
  //     type: "custom",
  //     colClass: "col-md-4 mb-3",
  //     customComponent: CustomPhoneComponent,
  //   },
  //   {
  //     name: "email",
  //     label: "Email*",
  //     type: "email",
  //     colClass: "col-md-4 mb-3",
  //   },
  //   {
  //     name: "priceRange",
  //     label: "Estimated Price Range",
  //     type: "text",
  //     colClass: "col-md-4 mb-3",
  //   },
  //   {
  //     name: "category",
  //     label: "Category*",
  //     type: "select",
  //     colClass: "col-md-6 mb-3",
  //     options: categoryData,
  //   },
  //   {
  //     name: "otherCategory",
  //     label: "Category Name*",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //     showWhen: (values) => {
  //       const selected = categoryData?.find(
  //         (cat) => cat.value === values.category
  //       );
  //       return selected?.label?.toLowerCase() === "other";
  //     },
  //     placeholder: "Enter category name",
  //   },
  //   {
  //     name: "experience",
  //     label: "Experience Since",
  //     type: "text",
  //     colClass: "col-md-4 mb-3",
  //   },
  //   // {
  //   //   name: "shortDesc",
  //   //   label: "Short Description",
  //   //   type: "text",
  //   //   colClass: "col-12 mb-3",
  //   // },
  //   {
  //     name: "longDesc",
  //     label: "Large Description*",
  //     type: "textarea",
  //     colClass: "col-12 mb-3",
  //   },
  //   {
  //     name: "facebook_link",
  //     label: "Facebook Link",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //   },
  //   {
  //     name: "instagram_link",
  //     label: "Instagram Link",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //   },
  //   {
  //     name: "twitter_link",
  //     label: "Twitter Link",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //   },
  //   {
  //     name: "linkedin_link",
  //     label: "LinkedIn Link",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //   },
  //   {
  //     name: "youtube_link",
  //     label: "YouTube Link",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //   },
  //   {
  //     name: "website_link",
  //     label: "Website Link",
  //     type: "text",
  //     colClass: "col-md-6 mb-3",
  //   },
  //   {
  //     name: "image",
  //     label: "Image",
  //     type: "file",
  //     colClass: "col-md-6 mb-3",
  //     accept: "image/*",
  //     multiple: false,
  //   },
  //   {
  //     name: "terms",
  //     label: (
  //       <>
  //         I accept{" "}
  //         <Link to="/termscondition" target="_blank" rel="noopener noreferrer">
  //           Terms & Conditions
  //         </Link>
  //         *
  //       </>
  //     ),
  //     type: "checkbox",
  //     colClass: "col-md-12 mb-3",
  //   },
  // ];

  const onSubmit = async (values) => {
    // Check if phone is verified before submission
    if (!phoneVerificationState.isVerified) {
      Swal.fire(
        "Error",
        "Please verify your phone number before submitting",
        "error"
      );
      return;
    }

    try {
      console.log("Form submitted with values:", values);
      console.log(
        "Phone verification status:",
        phoneVerificationState.isVerified
      );

      const formData = new FormData();
      formData.append("owner_name", values.ownerName);
      formData.append("profile_name", values.profileName);
      formData.append("state_id", values.state);
      formData.append("city_id", values.city);
      formData.append("pin_code", values.pin);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("price_range", values.priceRange);
      formData.append("short_description", values.shortDesc);
      formData.append("experience_since", values.experience);
      formData.append("long_description", values.longDesc);
      formData.append("role_id", 2);

      formData.append("facebook_link", values.facebook_link || "");
      formData.append("instagram_link", values.instagram_link || "");
      formData.append("twitter_link", values.twitter_link || "");
      formData.append("linkedin_link", values.linkedin_link || "");
      formData.append("youtube_link", values.youtube_link || "");
      formData.append("website_link", values.website_link || "");

      const selectedCat = categoryData?.find(
        (cat) => cat.value === values.category
      );

      if (selectedCat?.label?.toLowerCase() === "other") {
        formData.append("category_id", selectedCat.value);
        formData.append("category_name", values.otherCategory || "");
      } else {
        formData.append("category_id", values.category);
      }

      if (values.image) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
          "image/gif",
        ];

        if (!allowedTypes.includes(values.image.type)) {
          Swal.fire(
            "Error",
            "Only image files (JPEG, PNG, JPG, WEBP, GIF) are allowed",
            "error"
          );
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (values.image.size > maxSize) {
          Swal.fire("Error", "File size must be less than 5MB", "error");
          return;
        }

        formData.append("image", values.image);
      }

      const res = await VendorRegister(formData);

      if (res?.data?.status) {
        Swal.fire(
          "Success",
          "Registration successful! Login details have been sent to your mail/phone via Cegano Technology.",
          "success"
        ).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire(
          "Error",
          res?.data?.msg || res?.msg || "Something went wrong",
          "error"
        );
      }
    } catch (err) {
      console.error("API ERROR:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.msg || err?.msg || "Something went wrong",
        "error"
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await GetCategories();
      const catformatted = res?.data?.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
      }));
      setCategoryData(catformatted);
    } catch (error) {
      console.log("Category fetch error:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await GetStates();
      const stateformatted = res?.data?.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
      }));
      setStatesData(stateformatted);
    } catch (error) {
      console.log("States fetch error:", error);
    }
  };

  const fetchCities = async () => {
    if (!selectedStateId) return;
    try {
      const res = await GetCities(token, selectedStateId);
      const formatted = res?.data?.map((city) => ({
        value: city.id.toString(),
        label: city.name,
      }));
      setCityData(formatted);
    } catch (error) {
      console.log("Cities fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [selectedStateId]);

  const breadcrumbLinks = [
    { label: "Home", to: "/home" },
    { label: "Vendor Registration", to: "#" },
  ];

  return (
    <div>
      <Breadcrumbs title="Vendor Registration" links={breadcrumbLinks} />
      <section className="login-area section-padding ">
        <div className="container mt-4">
          <div className=" col-lg-12 mx-auto">
            <div className="login-card">
              <ReusableForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                fields={fields}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Registration;
