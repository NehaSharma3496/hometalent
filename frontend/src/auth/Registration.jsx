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
import { Link } from "react-router-dom";

const Registration = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [phoneVerificationState, setPhoneVerificationState] = useState({
    isVerified: false,
    showVerifyButton: false,
    showOtpInput: false,
    otp: "",
    sentOtp: "", // Store the OTP received from API response
    phoneNumber: "",
  });

  const token = localStorage.getItem("token");

  const initialValues = {
    ownerName: "",
    profileName: "",
    state: "",
    city: "",
    pin: "",
    phone: "",
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

  // Enhanced validation schema with phone verification
  const validationSchema = Yup.object({
    ownerName: Yup.string().required("Owner Name is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pin: Yup.string()
      .matches(/^\d{6}$/, "Pin code must be exactly 6 digits")
      .required("Pin Code is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required")
      .test("phone-verified", "Phone number must be verified", () => {
        return phoneVerificationState.isVerified;
      }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    category: Yup.string().required("Category is required"),
    terms: Yup.boolean().oneOf([true], "You must accept terms"),
    longDesc: Yup.string().required("Large Description is required"),
    otherCategory: Yup.string().when("category", {
      is: (val) => {
        const selected = categoryData?.find((cat) => cat.value === val);
        return selected?.label?.toLowerCase() === "other";
      },
      then: (schema) => schema.required("Other Category Name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Handle phone number change
  const handlePhoneChange = (e, setFieldValue) => {
    const phoneValue = e.target.value;
    setFieldValue("phone", phoneValue);

    // Reset verification state when phone number changes
    setPhoneVerificationState((prev) => ({
      ...prev,
      isVerified: false,
      showVerifyButton: phoneValue.length === 10,
      showOtpInput: false,
      otp: "",
      sentOtp: "",
      phoneNumber: phoneValue,
    }));
  };

  // Send OTP function
  const handleSendOtp = async () => {
    try {
      if (phoneVerificationState.phoneNumber.length !== 10) {
        Swal.fire(
          "Error",
          "Please enter a valid 10-digit phone number",
          "error"
        );
        return;
      }

      const otpResponse = await VerifyOtp({
        phone: phoneVerificationState.phoneNumber,
      });

      console.log("OTP Response:", otpResponse);

      if (otpResponse?.status) {
        // Store the OTP from response for verification
        setPhoneVerificationState((prev) => ({
          ...prev,
          showOtpInput: true,
          sentOtp: otpResponse?.otp || otpResponse?.data?.otp || "", // Store the received OTP
        }));

        Swal.fire(
          "Success",
          "OTP sent successfully! Please check your phone.",
          "success"
        );
      } else {
        Swal.fire("Error", otpResponse?.msg || "Failed to send OTP", "error");
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      Swal.fire("Error", "Failed to send OTP. Please try again.", "error");
    }
  };

  // Verify OTP function
  const handleVerifyOtp = () => {
    if (phoneVerificationState.otp.length !== 4) {
      Swal.fire("Error", "Please enter a valid 4-digit OTP", "error");
      return;
    }

    // Compare entered OTP with the OTP received from API
    if (
      phoneVerificationState.otp === phoneVerificationState.sentOtp.toString()
    ) {
      setPhoneVerificationState((prev) => ({
        ...prev,
        isVerified: true,
        showOtpInput: false,
      }));
      Swal.fire("Success", "Phone number verified successfully!", "success");
    } else {
      Swal.fire("Error", "Invalid OTP. Please try again.", "error");
    }
  };

  // Handle OTP input change (only allow 4 digits)
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 4) {
      setPhoneVerificationState((prev) => ({
        ...prev,
        otp: value,
      }));
    }
  };

  // Phone verification component
  const PhoneVerificationComponent = ({ values, setFieldValue }) => (
    <>
      <label className="contact-label mb- fs-6 fw-semibold">Phone No*</label>
      <div className="input-group">
        <input
          type="tel"
          className="form-control contact-input"
          value={values.phone || ""}
          onChange={(e) => handlePhoneChange(e, setFieldValue)}
          onInput={(e) => {
            // Remove any non-digit characters as user types
            const cleaned = e.target.value.replace(/\D/g, "");
            if (cleaned.length <= 10) {
              e.target.value = cleaned;
            } else {
              e.target.value = cleaned.slice(0, 10);
            }
          }}
          maxLength={10}
          placeholder="Enter 10-digit phone number"
          autoComplete="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
        />
      </div>

      {/* Verify Phone Button */}
      {phoneVerificationState.showVerifyButton &&
        !phoneVerificationState.isVerified && (
          <button
            type="button"
            className="btn btn-primary btn-sm mt-2"
            onClick={handleSendOtp}
            disabled={phoneVerificationState.showOtpInput}
          >
            {phoneVerificationState.showOtpInput ? "OTP Sent" : "Verify Phone"}
          </button>
        )}

      {/* OTP Input Field */}
      {phoneVerificationState.showOtpInput && (
        <div className="mt-2">
          <div className="input-group">
            <input
              type="tel"
              className="form-control contact-input"
              value={phoneVerificationState.otp}
              onChange={handleOtpChange}
              onInput={(e) => {
                // Only allow numbers and limit to 4 digits
                const cleaned = e.target.value.replace(/\D/g, "");
                if (cleaned.length <= 4) {
                  e.target.value = cleaned;
                } else {
                  e.target.value = cleaned.slice(0, 4);
                }
              }}
              maxLength={4}
              placeholder="Enter 4-digit OTP"
              style={{ letterSpacing: "0.5em", textAlign: "center" }}
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]{4}"
            />
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={handleVerifyOtp}
              disabled={phoneVerificationState.otp.length !== 4}
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {/* Verification Status */}
      {phoneVerificationState.isVerified && (
        <div className="text-success mt-1 small">
          <i className="fas fa-check-circle"></i> Phone number verified
        </div>
      )}
    </>
  );

  // Enhanced fields array with custom phone field
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
    },
    // Custom phone field with verification
    {
      name: "phone",
      label: "Phone No*",
      type: "custom",
      colClass: "col-md-4 mb-3",
      customComponent: PhoneVerificationComponent,
    },
    {
      name: "email",
      label: "Email*",
      type: "email",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "priceRange",
      label: "Estimated Price Range",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "category",
      label: "Category Select*",
      type: "select",
      colClass: "col-md-6 mb-3",
      options: categoryData,
    },
    {
      name: "otherCategory",
      label: "Other Category Name",
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
      name: "experience",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "shortDesc",
      label: "Short Description",
      type: "text",
      colClass: "col-12 mb-3",
    },
    {
      name: "longDesc",
      label: "Large Description*",
      type: "textarea",
      colClass: "col-12 mb-3",
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
          <Link to="/termscondition" target="_self" rel="noopener noreferrer">
            Terms & Conditions
          </Link>
          *
        </>
      ),
      type: "checkbox",
      colClass: "col-md-12 mb-3",
    },
  ];

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
          "User registered! We will reach you soon on mail",
          "success"
        ).then(() => {
          window.location.reload();
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
