import React, { useEffect, useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link,useNavigate } from "react-router-dom";
import {
  VendorRegister,
  GetCategories,
  GetStates,
  GetCities,
} from "../../../Services/vendor/Vendor";
import { VerifyOtp } from "../../../Services/webService/Web";

export default function AddVendor() {
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

const validationSchema = Yup.object({
  ownerName: Yup.string()
    .matches(
      /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      "Only alphabets  are allowed "
    )
    .required("Owner Name is required"),

  profileName: Yup.string()
    .matches(
      /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      "Only alphabets are allowed "
    ),
    

  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pin: Yup.string()
    .matches(/^\d{6}$/, "Pin code must be exactly 6 digits")
    .required("Pin Code is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone No is required"),
  isPhoneVerified: Yup.boolean().oneOf([true], "Phone number must be verified"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  category: Yup.string().required("Category is required"),
  otherCategory: Yup.string().when("category", {
    is: (val) => {
      const selected = categoryData?.find((cat) => cat.value === val);
      return selected?.label?.toLowerCase() === "other";
    },
    then: (schema) => schema.required("Please enter category name"),
    otherwise: (schema) => schema.notRequired(),
  }),
  terms: Yup.boolean().oneOf([true], "You must accept terms"),
  longDesc: Yup.string().required("Description is required"),
});



  const handlePhoneInput = (e, setFieldValue, setFieldTouched, touched) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "").slice(0, 10);

    setFieldValue("phone", numericValue);

    if (!touched.phone) {
      setFieldTouched("phone", true);
    }

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
        Swal.fire("Success", "Verification code sent via Cegano Technology.Enter the OTP to continue.", "success");
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

  // pehle sirf () tha
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

      // yaha se Formik me value set karenge
      setFieldValue("isPhoneVerified", true);

      Swal.fire("Success", "Phone number verified successfully!", "success");
    } else {
      Swal.fire("Error", "Invalid OTP. Please try again.", "error");
    }
  };

  const handleKeyPress = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const CustomPhoneComponent = ({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  }) => (
    <>
      <label className="form-label">Phone No*</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className={`form-control ${
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
      {touched.phone && errors.phone && (
        <div className="text-danger small mt-1">{errors.phone}</div>
      )}
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
      colClass: "col-md-4",
    },
    {
      name: "profileName",
      label: "Profile Name",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "state",
      label: "State*",
      type: "select",
      options: statesData,
      colClass: "col-md-4",
      onChange: (e) => setSelectedStateId(e.target.value),
    },
    {
      name: "city",
      label: "City*",
      type: "select",
      options: cityData,
      colClass: "col-md-4",
    },
    {
      name: "pin",
      label: "Pin Code*",
      type: "text",
      colClass: "col-md-4",
      maxLength: 6,
      numeric: true,
    },
    {
      name: "phone",
      label: "Phone No*",
      type: "custom",
      colClass: "col-md-4",
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
      options: categoryData,
      colClass: "col-md-4",
    },
    {
      name: "otherCategory",
      label: "Category Name*",
      type: "text",
      colClass: "col-md-4",
      showWhen: (values) => {
        const selected = categoryData?.find(
          (cat) => cat.value === values.category
        );
        return selected?.label?.toLowerCase() === "other";
      },
      placeholder: "Enter category name",
    },
   
    // {
    //   name: "shortDesc",
    //   label: "Short Description",
    //   type: "text",
    //   colClass: "col-md-12",
    // },
    {
      name: "longDesc",
      label: "Description*",
      type: "textarea",
      colClass: "col-md-12",
    },
       {
      name: "priceRange",
      label: "Price Range",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "experience",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "facebook_link",
      label: "Facebook Link",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "instagram_link",
      label: "Instagram Link",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "twitter_link",
      label: "Twitter Link",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "linkedin_link",
      label: "LinkedIn Link",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "youtube_link",
      label: "YouTube Link",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "website_link",
      label: "Website Link",
      type: "text",
      colClass: "col-md-4",
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      colClass: "col-md-6",
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
      colClass: "col-md-12",
    },
  ];

  const onSubmit = async (values) => {
    if (!phoneVerificationState.isVerified) {
      Swal.fire(
        "Error",
        "Please verify your phone number before submitting",
        "error"
      );
      return;
    }

    try {
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

      const selectedCat = categoryData.find(
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
        const maxSize = 5 * 1024 * 1024;
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
       " Registration successful! Login details have been sent to your mail/phone via Cegano Technology.",
          "success"
        ).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire("Error", res.data.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.msg || "Something went wrong",
        "error"
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await GetCategories();
      const formatted = res.data.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
      }));
      setCategoryData(formatted);
    } catch (error) {
      console.log("Category fetch error:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await GetStates();
      const formatted = res.data.map((state) => ({
        value: state.id.toString(),
        label: state.name,
      }));
      setStatesData(formatted);
    } catch (error) {
      console.log("State fetch error:", error);
    }
  };

  const fetchCities = async () => {
    if (!selectedStateId) return;
    try {
      const res = await GetCities(token, selectedStateId);
      const formatted = res.data.map((city) => ({
        value: city.id.toString(),
        label: city.name,
      }));
      setCityData(formatted);
    } catch (error) {
      console.log("City fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [selectedStateId]);

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-4">
        <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
        <h2 className="add-page-heading">Add Vendor</h2>
      </div>
      <div className="card card1">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
        />
      </div>
    </div>
  );
}
