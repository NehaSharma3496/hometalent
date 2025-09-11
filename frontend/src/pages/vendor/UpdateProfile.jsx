import React, { useEffect, useState } from "react";
import ReusableForm from "../../extracomponents/ReusableForm";
import Swal from "sweetalert2";
import {
  GetCategories,
  GetCities,
  GetStates,
  SubmitProfileUpdateRequest,
  GetVendorDetails,
} from "../../Services/vendor/Vendor";
import { Link } from "react-router-dom";
import * as Yup from "yup";

export default function UpdateProfile() {
  const [categoryData, setCategoryData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [initialValues, setInitialValues] = useState(null);
  const [cityTouched, setCityTouched] = useState(false);

  const token = localStorage.getItem("token");
  const vendorId = localStorage.getItem("userId");

  const validationSchema = Yup.object().shape({
    state_id: Yup.string().required("State is required"),
  });

  const fields = [
    {
      name: "owner_name",
      label: "Owner Name",
      type: "text",
      colClass: "col-md-4 ",
    },
    {
      name: "profile_name",
      label: "Profile Name",
      type: "text",
      colClass: "col-md-4 ",
    },
    { name: "phone", label: "Phone", type: "text", colClass: "col-md-4 " },
    { name: "email", label: "Email", type: "email", colClass: "col-md-4 " },
    {
      name: "state_id",
      label: "State",
      type: "select",
      options: statesData,
      onChange: (e) => {
        setSelectedStateId(e.target.value);
        setCityTouched(false);
      },
      colClass: "col-md-4 ",
    },
    {
      name: "city_id",
      label: "City",
      type: "select",
      options: cityData,
      onChange: () => setCityTouched(true),
      colClass: "col-md-4 ",
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
      colClass: "col-md-4 ",
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categoryData,
      colClass: "col-md-4 ",
    },
    {
      name: "other_category",
      label: "Category Name*",
      type: "text",
      colClass: "col-md-6 mb-3",
      showWhen: (values) => {
        const selected = categoryData?.find(
          (cat) => cat.value === values.category_id
        );
        return selected?.label?.toLowerCase() === "other";
      },
      placeholder: "Enter category name",
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
      colClass: "col-12 ",
    },
    {
      name: "long_description",
      label: "Long Description",
      type: "textarea",
      colClass: "col-12 ",
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
      name: "image",
      label: "Image",
      type: "file",
      colClass: "col-md-6 mb-3",
      accept: "image/*",
    },
  ];

  const onSubmit = async (values) => {
    if (values.state_id !== initialValues.state_id && !cityTouched) {
      Swal.fire(
        "Validation Error",
        "Please select a city for the new state",
        "warning"
      );
      return;
    }

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
        } else {
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
        // FIXED: Remove the manual placeholder - let ReusableForm handle it
        const mapped = res.data.map((x) => ({
          value: x.id.toString(),
          label: x.name,
        }));
        setCityData(mapped); // Don't add placeholder here
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
    <div className="page-content ">
      <div className="add-page-heading-div">
        <Link to="/vendor/dashboard">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
        <h2 className="add-page-heading ">Request Profile Update</h2>
      </div>

      <div className="card table-padding">
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
