import React, { useEffect, useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  SubmitProfileUpdateRequest,
  GetCities,
  GetStates,
  GetCategories,
  GetVendorDetails,
} from "../../../Services/vendor/Vendor";

export default function UpdateVendor() {
  const [categoryData, setCategoryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [initialValues, setInitialValues] = useState(null);
  const [cityTouched, setCityTouched] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const location = useLocation();
  const vendorId = location.state?.vendorId;

  // Enhanced validation schema with all fields
  const validationSchema = Yup.object().shape({
    owner_name: Yup.string()
      .required("Owner Name is required")
      .min(2, "Owner Name must be at least 2 characters")
      .max(50, "Owner Name must not exceed 50 characters")
      .matches(
        /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        "Only alphabets are allowed"
      ),

    profile_name: Yup.string()

      .min(2, "Profile Name must be at least 2 characters")
      .max(50, "Profile Name must not exceed 50 characters")
      .matches(
        /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        "Only alphabets are allowed"
      ),

    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),

    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email address"),

    state_id: Yup.string()
      .required("State is required"),

    city_id: Yup.string()
      .required("City is required"),

    pin_code: Yup.string()
      .required("Pin Code is required")
      .matches(/^\d{6}$/, "Pin Code must be exactly 6 digits"),

    // price_range: Yup.string()
    //   .required("Price Range is required")
    //   .min(3, "Please provide a meaningful price range"),

    category_id: Yup.string()
      .required("Category is required"),

    // Conditional validation for other_category
    other_category: Yup.string().when('category_id', {
      is: (categoryId) => {
        // Check if the selected category is "Other"
        const selectedCategory = categoryData?.find(cat => cat.value === categoryId);
        return selectedCategory?.label?.toLowerCase() === 'other';
      },
      then: (schema) => schema
        .required("Category Name is required ")
        .min(2, "Category Name must be at least 2 characters")
        .max(50, "Category Name must not exceed 50 characters"),
      otherwise: (schema) => schema.notRequired()
    }),

    // experience_since: Yup.string()
    //   .required("Experience Since is required")
    //   .matches(/^\d{4}$/, "Please enter a valid 4-digit year")
    //   .test('valid-year', 'Experience year cannot be in the future', function(value) {
    //     if (!value) return true;
    //     const currentYear = new Date().getFullYear();
    //     const experienceYear = parseInt(value);
    //     return experienceYear <= currentYear && experienceYear >= 1950;
    //   }),

    // long_description: Yup.string()
    //   .required("Long Description is required")
    //   .min(50, "Long Description must be at least 50 characters")
    //   .max(1000, "Long Description must not exceed 1000 characters"),

    // // Optional social media links with URL validation
    // facebook_link: Yup.string()
    //   .nullable()
    //   .test('facebook-url', 'Please enter a valid Facebook URL', function(value) {
    //     if (!value || value.trim() === '') return true; // Allow empty
    //     return Yup.string().url().isValidSync(value) && /facebook\.com/.test(value);
    //   }),

    // instagram_link: Yup.string()
    //   .nullable()
    //   .test('instagram-url', 'Please enter a valid Instagram URL', function(value) {
    //     if (!value || value.trim() === '') return true; // Allow empty
    //     return Yup.string().url().isValidSync(value) && /instagram\.com/.test(value);
    //   }),

    // twitter_link: Yup.string()
    //   .nullable()
    //   .test('twitter-url', 'Please enter a valid Twitter/X URL', function(value) {
    //     if (!value || value.trim() === '') return true; // Allow empty
    //     return Yup.string().url().isValidSync(value) && /(twitter\.com|x\.com)/.test(value);
    //   }),

    // linkedin_link: Yup.string()
    //   .nullable()
    //   .test('linkedin-url', 'Please enter a valid LinkedIn URL', function(value) {
    //     if (!value || value.trim() === '') return true; // Allow empty
    //     return Yup.string().url().isValidSync(value) && /linkedin\.com/.test(value);
    //   }),

    // youtube_link: Yup.string()
    //   .nullable()
    //   .test('youtube-url', 'Please enter a valid YouTube URL', function(value) {
    //     if (!value || value.trim() === '') return true; // Allow empty
    //     return Yup.string().url().isValidSync(value) && /youtube\.com/.test(value);
    //   }),

    // website_link: Yup.string()
    //   .nullable()
    //   .test('website-url', 'Please enter a valid URL', function(value) {
    //     if (!value || value.trim() === '') return true; // Allow empty
    //     return Yup.string().url().isValidSync(value);
    //   }),

    // Image validation (optional)
    // image: Yup.mixed()
    //   .nullable()
    //   .test('file-size', 'File size must be less than 5MB', function(value) {
    //     if (!value || !value[0]) return true;
    //     return value[0].size <= 5 * 1024 * 1024; // 5MB limit
    //   })
    //   .test('file-type', 'Only image files are allowed', function(value) {
    //     if (!value || !value[0]) return true;
    //     return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value[0].type);
    //   })
  });

  const fields = [
    {
      name: "owner_name",
      label: "Owner Name*",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "profile_name",
      label: "Profile Name",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "phone",
      label: "Phone*",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
      placeholder: "Enter 10-digit mobile number"
    },
    {
      name: "email",
      label: "Email*",
      type: "email",
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "state_id",
      label: "State*",
      type: "select",
      options: statesData,
      // when state changes: update selectedStateId (to fetch cities) AND reset cityTouched
      onChange: (e) => {
        setSelectedStateId(e.target.value);
        setCityTouched(false); // user didn't touch city for the new state yet
      },
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "city_id",
      label: "City*",
      type: "select",
      options: cityData,
      // when user actively changes city -> mark as touched
      onChange: () => setCityTouched(true),
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "pin_code",
      label: "Pin Code*",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
      placeholder: "Enter 6-digit pin code"
    },
    {
      name: "category_id",
      label: "Category*",
      type: "select",
      options: categoryData,
      colClass: "col-md-4 mb-3",
      required: true,
    },
    {
      name: "other_category",
      label: "Category Name*",
      type: "text",
      colClass: "col-md-4",
      showWhen: (values) => {
        const selected = categoryData?.find(
          (cat) => cat.value === values.category_id
        );
        return selected?.label?.toLowerCase() === "other";
      },
      placeholder: "",
      required: true, // This will be conditionally required via Yup validation
    },

    {
      name: "long_description",
      label: "Description*",
      type: "textarea",
      colClass: "col-12 mb-3",
      required: true,
      placeholder: "Describe your services in detail (minimum 50 characters)"
    },
    {
      name: "price_range",
      label: "Price Range",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
      placeholder: ""
    },
    {
      name: "experience_since",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-4 mb-3",
      required: true,
      placeholder: ""
    },
    {
      name: "facebook_link",
      label: "Facebook Link",
      type: "text",
      colClass: "col-md-4",
      // placeholder: "https://facebook.com/yourpage"
    },
    {
      name: "instagram_link",
      label: "Instagram Link",
      type: "text",
      colClass: "col-md-4",
      // placeholder: "https://instagram.com/youraccount"
    },
    {
      name: "twitter_link",
      label: "Twitter Link",
      type: "text",
      colClass: "col-md-4",
      // placeholder: "https://twitter.com/youraccount"
    },
    {
      name: "linkedin_link",
      label: "LinkedIn Link",
      type: "text",
      colClass: "col-md-4",
      // placeholder: "https://linkedin.com/in/yourprofile"
    },
    {
      name: "youtube_link",
      label: "YouTube Link",
      type: "text",
      colClass: "col-md-4",
      // placeholder: "https://youtube.com/yourchannel"
    },
    {
      name: "website_link",
      label: "Website Link",
      type: "text",
      colClass: "col-md-4",
      // placeholder: "https://yourwebsite.com"
    },
    {
      name: "image",
      label: (
        <>
        Profile Image{" "}<i
            className="ri-eye-fill"
            style={{
              marginLeft: "8px",
              marginRight: "8px",
              cursor: "pointer",
              color: "#2278b6",
              fontSize: "18px",
            }}
            onClick={() =>
              Swal.fire({
                title: "Image Upload Guidelines",
                html: `
                    <div style="text-align:left; font-size:15px;">
                      ✅ Upload only clear & good quality image<br/><br/>
                      ✅ Preferred size: <b>736 × 400 px</b><br/><br/>
                      ✅ Supported formats: <b>.jpg, .jpeg, .png</b><br/><br/>
                      ✅ File size: <b>Max 5 MB</b><br/><br/>
                      ✅ Make sure your profile image is clearly visible<br/><br/>
                      🚫 Blur, low-quality, pixelated, or stretched images may not look clear on your profile. For best results, upload a sharp and proper-sized image.<br/><br/>
                      ⚠️ Irrelevant or offensive images are not allowed
                    </div>
                  `,
                // icon: "info",
                confirmButtonText: "Got it!",
                width: 400,
                customClass: {
                  popup: "custom-swal-popup"
                },
                didOpen: () => {

                  document.documentElement.style.overflow = "hidden";
                  document.body.style.overflow = "hidden";
                },
                willClose: () => {

                  document.documentElement.style.overflow = "";
                  document.body.style.overflow = "";
                }
              })
            }
          ></i>
          <span style={{ fontWeight: "normal", color: "#fd0000ff" }}>
            (Image size should be 736x400 for better experience)
          </span>

        </>
      ),
      type: "file",
      colClass: "col-md-7 mb-3",
      accept: "image/*",
      multiple: false,
    },
  ];

  const onSubmit = async (values) => {
    // Check if category is "Other" and other_category is provided
    const selectedCat = categoryData?.find((cat) => cat.value === values.category_id);
    if (selectedCat?.label?.toLowerCase() === "other" && !values.other_category?.trim()) {
      Swal.fire(
        "Validation Error",
        "Please provide a category name when 'Other' is selected",
        "warning"
      );
      return;
    }

    // If state changed from initial and user hasn't manually touched city -> block
    if (values.state_id !== initialValues.state_id && !cityTouched) {
      Swal.fire(
        "Validation Error",
        "Please select a city for the new state",
        "warning"
      );
      return;
    }

    // Remove image fields for comparison
    const cleanInitial = { ...initialValues };
    const cleanCurrent = { ...values };

    delete cleanInitial.image;
    delete cleanCurrent.image;

    const isSame = Object.keys(cleanInitial).every((key) => {
      const initVal = cleanInitial[key];
      const currVal = cleanCurrent[key];

      if (Array.isArray(initVal)) {
        return (
          Array.isArray(currVal) &&
          initVal.length === currVal.length &&
          initVal.every((v, i) => v === currVal[i])
        );
      }

      return initVal === currVal;
    });

    if (isSame && (!values.image || values.image.length === 0)) {
      Swal.fire("No Changes", "No changes were made to the profile.", "info");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("vendor_id", vendorId);

      for (const key in values) {
        if (key === "category_id") {
          const selectedCat = categoryData?.find(
            (cat) => cat.value === values.category_id
          );

          if (selectedCat?.label?.toLowerCase() === "other") {
            formData.append("category_id", selectedCat.value);
            formData.append("category_name", values.other_category || "");
          } else {
            formData.append("category_id", values.category_id);
          }
        } else if (key === "image" && values[key]?.length > 0) {
          formData.append("image", values[key][0]);
        } else if (key !== "other_category") { // Don't append other_category separately
          formData.append(key, values[key]);
        }
      }

      const res = await SubmitProfileUpdateRequest(formData);

      if (res?.status) {
        Swal.fire("Success", res.msg || "Profile update submitted!", "success");
      } else {
        Swal.fire("Error", res?.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("Full error object:", err);

      let errorMessage = "Failed to submit";

      if (err?.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [cat, st, vendorRes] = await Promise.all([
          GetCategories(),
          GetStates(),
          GetVendorDetails(token, vendorId),
        ]);

        const vendor = vendorRes.data.user;

        setCategoryData(
          cat.data.map((x) => ({ value: x.id.toString(), label: x.name }))
        );
        setStatesData(
          st.data.map((x) => ({ value: x.id.toString(), label: x.name }))
        );
        setSelectedStateId(vendor.state_id?.toString());

        setInitialValues({
          owner_name: vendor.owner_name || "",
          profile_name: vendor.profile_name || "",
          phone: vendor.phone || "",
          email: vendor.email || "",
          state_id: vendor.state_id?.toString() || "",
          city_id: vendor.city_id?.toString() || "",
          pin_code: vendor.pin_code || "",
          price_range: vendor.price_range || "",
          short_description: vendor.short_description || "",
          category_id: vendor.category_id?.toString() || "",
          other_category: vendor.category_name || "",
          experience_since: vendor.experience_since || "",
          long_description: vendor.long_description || "",
          facebook_link: vendor.facebook_link || "",
          instagram_link: vendor.instagram_link || "",
          twitter_link: vendor.twitter_link || "",
          linkedin_link: vendor.linkedin_link || "",
          youtube_link: vendor.youtube_link || "",
          website_link: vendor.website_link || "",
        });

        // initial city touched should be true if initial city exists (so user isn't forced to reselect unless state changes)
        setCityTouched(!!vendor.city_id);
      } catch (err) {
        console.log("Init fetch error", err);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    if (!selectedStateId) return;
    const fetchCities = async () => {
      try {
        const res = await GetCities(token, selectedStateId);
        const mapped = res.data.map((x) => ({
          value: x.id.toString(),
          label: x.name,
        }));
        setCityData(mapped);
        // don't mark cityTouched true here — user must pick manually
        setCityTouched(false);
      } catch (err) {
        console.log("City fetch error", err);
      }
    };
    fetchCities();
  }, [selectedStateId]);

  if (!initialValues)
    return <div className="text-center py-5">Loading Profile Data...</div>;

  return (
    <div className="page-content container-fluid">
      <div className="add-page-heading-div mb-3 d-flex align-items-center gap-2">
        <button
          className="btn btn-link p-0"
          onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
        >
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </button>
        <h2 className="add-page-heading mb-0">Request Profile Update</h2>
      </div>
      <div className="card">
        <div className="row align-items-center mb-3">
          <div className="col-md-6"></div>
        </div>

        <div className="row px-4 pb-4">
          <div className="col-md-12">
            <ReusableForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              fields={fields}
              validationSchema={validationSchema}
            />
          </div>
        </div>
      </div>
    </div>
  );
}