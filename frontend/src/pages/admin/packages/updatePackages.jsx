import React, { useState, useEffect } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UpdatePackage, GetSinglePackage } from "../../../Services/admin/Admin";

export default function UpdatePackages() {
  const token = localStorage.getItem("token");
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [validityType, setValidityType] = useState("months");
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    price: "",
    validity_type: "months",
    validity_in_months: "",
    validity_in_days: "",
    features: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await GetSinglePackage(packageId, token);
        if (response?.status && response?.data) {
          const data = response.data;

          // detect validity type
          const validity_type = data.validity_in_months ? "months" : "days";

          setValidityType(validity_type);

          setInitialValues({
            name: data.name,
            description: data.description,
            price: data.price,
            validity_type,
            validity_in_months: data.validity_in_months || "",
            validity_in_days: data.days || "",
            features: data.features,
          });
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        Swal.fire("Error", "Failed to fetch package details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId, token]);

  // ✅ validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Package Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .integer("Price must be an integer") // ⬅️ केवल integer allow
      .min(0, "Price cannot be negative"),

    validity_type: Yup.string().required("Validity type is required"),
    validity_in_months: Yup.number().when("validity_type", {
      is: "months",
      then: (schema) =>
        schema.required("Validity in months is required").positive(),
    }),
    validity_in_days: Yup.number().when("validity_type", {
      is: "days",
      then: (schema) =>
        schema.required("Validity in days is required").positive(),
    }),
    features: Yup.string().required("Features are required"),
  });

  // ✅ fields
  const fields = [
    {
      name: "name",
      label: "Package Name*",
      type: "text",
      colClass: "col-md-6 mb-3",
    },
    {
      name: "description",
      label: "Description*",
      type: "textarea",
      colClass: "col-md-12 mb-3",
    },
    {
      name: "price",
      label: "Price (₹)*",
      type: "number",
      colClass: "col-md-6 mb-3",
      step: "1",
      onKeyDown: (e) => {
        if (e.key === "." || e.key === "e" || e.key === "E") {
          e.preventDefault(); // ⬅️ decimal aur exponential input disable
        }
      },
    },
    {
      name: "validity_type",
      label: "Validity Type*",
      type: "select",
      colClass: "col-md-6 mb-3",
      options: [
        { label: "Months", value: "months" },
        { label: "Days", value: "days" },
      ],
      onChange: (e) => setValidityType(e.target.value),
    },
    ...(validityType === "months"
      ? [
          {
            name: "validity_in_months",
            label: "Validity (in months)*",
            type: "select",
            colClass: "col-md-6 mb-3",
            options: Array.from({ length: 12 }, (_, i) => ({
              label: `${i + 1} Month${i + 1 > 1 ? "s" : ""}`,
              value: i + 1,
            })),
          },
        ]
      : [
          {
            name: "validity_in_days",
            label: "Validity (in days)*",
            type: "select",
            colClass: "col-md-6 mb-3",
            options: Array.from({ length: 30 }, (_, i) => ({
              label: `${i + 1} Day${i + 1 > 1 ? "s" : ""}`,
              value: i + 1,
            })),
          },
        ]),
    {
      name: "features",
      label: "Features*",
      type: "textarea",
      colClass: "col-md-12 mb-3",
    },
  ];

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        features: values.features,
        validity_in_months:
          values.validity_type === "months" ? values.validity_in_months : null,
        days: values.validity_type === "days" ? values.validity_in_days : null,
      };

      const res = await UpdatePackage(packageId, payload, token);
      if (res?.status) {
        Swal.fire("Success", res?.msg || "Package Updated!", "success").then(
          () => navigate("/admin/Packages")
        );
      } else {
        Swal.fire("Error", res?.msg || "Something went wrong", "error");
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

  return (
    <div className="page-content">
      <div className="add-page-heading-div mb-4">
        <button
              className="btn btn-link p-0"
              onClick={() => navigate(-1)}  // 🔹 पिछली history में वापस जाएगा
            >
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
        <h2 className="add-page-heading">Update Package</h2>
      </div>
      <div className="card">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <ReusableForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            fields={fields}
            SubmitBtn={"Update"}
          />
        )}
      </div>
    </div>
  );
}
