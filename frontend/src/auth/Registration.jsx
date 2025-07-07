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

const Registration = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const token = localStorage.getItem("token"); // or wherever you're storing it

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
    category: [],
    experience: "",
    longDesc: "",
    images: [],
    videos: [],
    socialLinks: "",
    terms: false,
  };

  const validationSchema = Yup.object({
    ownerName: Yup.string().required("Owner Name is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pin: Yup.string().required("Pin Code is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    category: Yup.array().min(1, "Select at least one category"),
    terms: Yup.boolean().oneOf([true], "You must accept terms"),
  });

  // 👇 Only define fields after categoryData is available
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
      label: "State",
      type: "select",
      options: statesData,
      onChange: (e) => setSelectedStateId(e.target.value),

      colClass: "col-md-4 mb-3",
    },
    {
      name: "city",
      label: "City",
      type: "select",
      options: cityData,
      colClass: "col-md-4 mb-3",
    },
    { name: "pin", label: "Pin Code", type: "text", colClass: "col-md-4 mb-3" },
    {
      name: "phone",
      label: "Phone (Hidden in profile)",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    { name: "email", label: "Email", type: "email", colClass: "col-md-4 mb-3" },
    {
      name: "priceRange",
      label: "Estimated Price Range",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "category",
      label: "Category Select* (max 2)",
      type: "multiSelect",
      colClass: "col-md-4 mb-3",
      options: categoryData,
    },
    {
      name: "shortDesc",
      label: "One Line Description",
      type: "text",
      colClass: "col-md-12 mb-3",
    },
    {
      name: "longDesc",
      label: "Large Description",
      type: "textarea",
      colClass: "col-12 mb-3",
    },
    {
      name: "images",
      label: "Images (Max 30)",
      type: "file",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "videos",
      label: "Videos (Max 3)",
      type: "file",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "socialLinks",
      label: "Social Media Links",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "experience",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "terms",
      label: "I accept Terms & Privacy Policy",
      type: "checkbox",
      colClass: "col-md-12 mb-3",
    },
  ];

  const onSubmit = async (values) => {
    const payload = {
      owner_name: values.ownerName,
      profile_name: values.profileName,
      state_id: values.state,
      city_id: values.city,
      pin_code: values.pin,
      phone: values.phone,
      email: values.email,
      price_range: values.priceRange,
      short_description: values.shortDesc,
      category_id: values.category.join(","),
      experience_since: values.experience,
      long_description: values.longDesc,
      social_media_link: values.socialLinks,
      image: null,
      video: null,
      role_id: 2,
      password: values.password,
      show_password: values.password,
    };

    try {
      const res = await VendorRegister(payload);

      console.log("API SUCCESS RESPONSE:", res?.data);

      if (res?.data?.status) {
        Swal.fire("Success", res?.data?.msg || "User registered!", "success");
      } else {
        Swal.fire("Error", res?.data?.msg || "Something went wrong", "error");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.msg || err.message || "Something went wrong",
        "error"
      );
    }
  };
 const fetchCategories = async () => {
      try {
        const res = await GetCategories();
        const catformatted = res.data.map((cat) => ({
          value: cat.id.toString(),
          label: cat.name,
        }));
        setCategoryData(catformatted);
      } catch (error) {
        console.log("error", error);
      }
    };

   

    const fetchStates = async () => {
      try {
        const res = await GetStates();
        // console.log("State", res.data);
        const stateformatted = res.data.map((cat) => ({
          value: cat.id.toString(),
          label: cat.name,
        }));
        setStatesData(stateformatted);
      } catch (error) {
        console.log("error", error);
      }
    };

      const fetchCities = async () => {
      if (!selectedStateId) return; // Skip if no state selected

      try {
        const res = await GetCities(token, selectedStateId);
        console.log("City", res.data);
        const formatted = res.data.map((city) => ({
          value: city.id.toString(),
          label: city.name,
        }));
        setCityData(formatted);
      } catch (error) {
        console.log("Error fetching cities:", error);
      }
    };


  useEffect(() => {
  
fetchCategories();
    fetchStates();
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
