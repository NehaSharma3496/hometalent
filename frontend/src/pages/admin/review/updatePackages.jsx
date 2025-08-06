import React, { useState, useEffect } from "react";
import ReusableForm from "../../../extracomponents/ReusableForm";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
import { UpdatePackage, GetSinglePackage } from "../../../Services/admin/Admin";

export default function UpdatePackages() {
  const token = localStorage.getItem("token");
  const { packageId } = useParams();

  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    price: "",
    validity_in_months: "",
    features: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await GetSinglePackage(packageId, token);
        if (response?.status && response?.data) {
          const data = response.data;
          setInitialValues({
            name: data.name,
            description: data.description,
            price: data.price,
            validity_in_months: data.validity_in_months,
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

  const validationSchema = Yup.object({
    name: Yup.string().required("Package Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required").positive(),
    validity_in_months: Yup.number()
      .required("Validity is required")
      .positive(),
    features: Yup.string().required("Features are required"),
  });

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
    },
  {
      name: "validity_in_months",
      label: "Validity (in months)*",
      type: "select",
      colClass: "col-md-6 mb-3",
      options: [
        { label: "1 Month", value: 1 },
        { label: "2 Months", value: 2 },
        { label: "3 Months", value: 3 },
        { label: "4 Months", value: 4 },
        { label: "5 Months", value: 5 },
        { label: "6 Months", value: 6 },
        { label: "7 Months", value: 7 },
        { label: "8 Months", value: 8 },
        { label: "9 Months", value: 9 },
        { label: "10 Months", value: 10 },
        { label: "11 Months", value: 11 },
        { label: "12 Months", value: 12 },
      ],
    },
    {
      name: "features",
      label: "Features*",
      type: "textarea",
      colClass: "col-md-12 mb-3",
    },
  ];

  const onSubmit = async (values) => {
    try {
      const res = await UpdatePackage(packageId, values, token);
      if (res?.status) {
        Swal.fire("Success", res?.msg || "Package Updated!", "success");
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
        <Link to="/admin/dashboard">
          <i className="fa-sharp fa-regular fa-arrow-left"></i>
        </Link>
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
