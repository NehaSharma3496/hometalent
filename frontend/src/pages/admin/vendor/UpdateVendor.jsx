import React, { useEffect, useState } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useLocation, Link } from "react-router-dom";
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
  const token = localStorage.getItem("token");
  const location = useLocation();
  const vendorId = location.state?.vendorId;

  const fields = [
    {
      name: "owner_name",
      label: "Owner Name",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "profile_name",
      label: "Profile Name",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    { name: "phone", label: "Phone", type: "text", colClass: "col-md-4 mb-3" },
    { name: "email", label: "Email", type: "email", colClass: "col-md-4 mb-3" },
    {
      name: "state_id",
      label: "State",
      type: "select",
      options: statesData,
      onChange: (e) => setSelectedStateId(e.target.value),
      colClass: "col-md-4 mb-3",
    },
    {
      name: "city_id",
      label: "City",
      type: "select",
      options: cityData,
      colClass: "col-md-4 mb-3",
    },
    {
      name: "pin_code",
      label: "Pin Code",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "price_range",
      label: "Price Range",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "category_id",
      label: "Categories",
      type: "multiSelect",
      options: categoryData,
      colClass: "col-md-4 mb-3",
    },
    {
      name: "experience_since",
      label: "Experience Since",
      type: "text",
      colClass: "col-md-4 mb-3",
    },
    {
      name: "short_description",
      label: "Short Description",
      type: "text",
      colClass: "col-12 mb-3",
    },
    {
      name: "long_description",
      label: "Long Description",
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
    { name: "image", label: "Image", type: "file", colClass: "col-md-6 mb-3" },
  ];

  const onSubmit = async (values) => {
  // Prepare comparable objects (excluding file input)
  const cleanInitial = { ...initialValues };
  const cleanCurrent = { ...values };

  // Convert image field and category_id to normalized form for comparison
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
        formData.append(key, values[key].join(","));
      } else if (key === "image" && values[key] && values[key].length > 0) {
        formData.append("image", values[key][0]);
      } else {
        formData.append(key, values[key]);
      }
    }

    const res = await SubmitProfileUpdateRequest(formData);
    if (res?.data?.status) {
      Swal.fire("Success", res.data.msg || "Profile update submitted!", "success");
    } else {
      Swal.fire("Error", res?.data?.msg || "Something went wrong", "error");
    }
  } catch (err) {
    console.error("API ERROR:", err);
    Swal.fire(
      "Error",
      err?.response?.data?.msg || err.message || "Failed to submit",
      "error"
    );
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
          category_id:
            vendor.category_id?.split(",").map((id) => id.toString()) || [],
          experience_since: vendor.experience_since || "",
          long_description: vendor.long_description || "",
          facebook_link: vendor.facebook_link || "",
          instagram_link: vendor.instagram_link || "",
          twitter_link: vendor.twitter_link || "",
          linkedin_link: vendor.linkedin_link || "",
          youtube_link: vendor.youtube_link || "",
          website_link: vendor.website_link || "",
        
        });
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
        setCityData(
          res.data.map((x) => ({ value: x.id.toString(), label: x.name }))
        );
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
        <Link to="/admin/dashboard">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
