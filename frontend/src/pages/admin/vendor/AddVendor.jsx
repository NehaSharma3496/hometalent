import React, { useEffect, useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  VendorRegister,
  GetCategories,
  GetStates,
  GetCities,
} from "../../../Services/vendor/Vendor";

export default function AddVendor() {
  const [categoryData, setCategoryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
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
    images: [],

    terms: false,
    // password: "",
  };

  const validationSchema = Yup.object({
    ownerName: Yup.string().required("Owner Name is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pin: Yup.string()
      .matches(/^\d{6}$/, "Pin code must be exactly 6 digits")
      .required("Pin Code is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    category: Yup.string().required("Category is required"),
    terms: Yup.boolean().oneOf([true], "You must accept terms"),
    // experience: Yup.string().required("Experience Is required"),
    // priceRange: Yup.string().required("Price Range is required"),
    longDesc: Yup.string().required("Large Description is required"),
  });

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
      colClass: "col-md-4 ",
    },
    {
      name: "state",
      label: "State*",
      type: "select",
      options: statesData,
      colClass: "col-md-4 ",
      onChange: (e) => setSelectedStateId(e.target.value),
    },
    {
      name: "city",
      label: "City*",
      type: "select",
      options: cityData,
      colClass: "col-md-4 ",
    },
    {
      name: "pin",
      label: "Pin Code*",
      type: "text",
      colClass: "col-md-4 ",
    },
    {
      name: "phone",
      label: "Phone No*",
      type: "text",
      colClass: "col-md-4 ",
    },
    {
      name: "email",
      label: "Email*",
      type: "email",
      colClass: "col-md-4 ",
    },
    {
      name: "priceRange",
      label: "Price Range",
      type: "text",
      colClass: "col-md-4 ",
    },
    {
      name: "category",
      label: "Category*",
      type: "select",
      options: [...categoryData, { value: "other", label: "Other" }],
      colClass: "col-md-4 ",
    },
    {
      name: "otherCategory",
      label: "Other Category Name",
      type: "text",
      colClass: "col-md-4 ",
      showWhen: (values) => values.category === "other",
      placeholder: "Enter category name",
    },
    {
      name: "experience",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "shortDesc",
      label: "Short Description",
      type: "text",
      colClass: "col-md-12 ",
    },
    {
      name: "longDesc",
      label: "Full Description*",
      type: "textarea",
      colClass: "col-md-12 ",
    },
    {
      name: "facebook_link",
      label: "Facebook Link",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "instagram_link",
      label: "Instagram Link",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "twitter_link",
      label: "Twitter Link",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "linkedin_link",
      label: "LinkedIn Link",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "youtube_link",
      label: "YouTube Link",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "website_link",
      label: "Website Link",
      type: "text",
      colClass: "col-md-6 ",
    },
    {
      name: "images",
      label: "Image",
      type: "file",
      colClass: "col-md-6 ",
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
      colClass: "col-md-12 ",
    },
  ];

  const onSubmit = async (values) => {
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

      if (values.category === "other") {
        formData.append("other_category_name", values.otherCategory || "");
      } else {
        formData.append("category_id", values.category);
      }

      for (let i = 0; i < values.images.length; i++) {
        formData.append("image", values.images[i]);
      }

      const res = await VendorRegister(formData);
      if (res?.data?.status) {
        Swal.fire("Success", res?.data?.msg || "Vendor added!", "success").then(
          () => {
            window.location.reload();
          }
        );
      } else {
        Swal.fire("Error", res?.data?.msg || "Something went wrong", "error");
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
    fetchCities();
  }, [selectedStateId]);

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-4">
        <Link to="/admin/dashboard">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
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
