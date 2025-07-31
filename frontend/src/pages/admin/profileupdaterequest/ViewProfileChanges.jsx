import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Datatable from "../../../extracomponents/Datatable";
import { ProcessProfileUpdateRequest } from "../../../Services/admin/Admin";
import {
  GetVendorDetails,
  GetCategories,
  GetStates,
  GetCities,
} from "../../../Services/vendor/Vendor";

export default function ViewProfileChanges() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [oldData, setOldData] = useState({});
  const [newData, setNewData] = useState({});
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [oldCities, setOldCities] = useState([]);
  const [newCities, setNewCities] = useState([]);
  const [comparisonRows, setComparisonRows] = useState([]);

  useEffect(() => {
    if (!state?.requestData) return;

    const { vendor_id, request_data } = state.requestData;

    if (vendor_id) {
      GetVendorDetails(token, vendor_id).then((res) => {
        if (res?.status && res.data?.user) {
          setOldData(res.data.user);
        }
      });
    }

    if (request_data) {
      try {
        const parsed = JSON.parse(request_data);
        setNewData(parsed);
      } catch (err) {
        console.error("Invalid JSON in request_data", err);
      }
    }

    GetStates(token).then((res) => res?.status && setStates(res.data || []));
    GetCategories(token).then(
      (res) => res?.status && setCategories(res.data || [])
    );
  }, [state, token]);

  useEffect(() => {
    if (newData?.state_id) {
      GetCities(token, newData.state_id).then((res) => {
        if (res?.status) {
          setNewCities(res.data || []);
        }
      });
    }
  }, [newData?.state_id, token]);

  useEffect(() => {
    if (oldData?.state_id) {
      GetCities(token, oldData.state_id).then((res) => {
        if (res?.status) {
          setOldCities(res.data || []);
        }
      });
    }
  }, [oldData?.state_id, token]);

  useEffect(() => {
    const rows = Object.keys(newData || {})
      .map((key) => {
        const oldValRaw = oldData?.[key];
        const newValRaw = newData?.[key];

        const resolveField = (key, value, type = "new") => {
          if (!value && value !== 0) return "-";

          switch (key) {
            case "state_id":
              return states.find((s) => s.id === +value)?.name || value;

            case "city_id":
            case "city":
              const cityList = type === "old" ? oldCities : newCities;
              return cityList.find((c) => c.id === +value)?.name || value;

            case "category_id":
              const ids = Array.isArray(value)
                ? value
                : value?.toString().split(",") || [];
              return (
                ids
                  .map((id) => categories.find((cat) => +cat.id === +id)?.name)
                  .filter(Boolean)
                  .join(", ") || value
              );

            default:
              return value;
          }
        };

        const oldVal = resolveField(key, oldValRaw, "old");
        const newVal = resolveField(key, newValRaw, "new");
        const hasChanged = `${oldVal}` !== `${newVal}`;

        if (!hasChanged) return null;

        return {
          field:
            key === "state_id" || key === "state"
              ? "State"
              : key === "city_id" || key === "city"
              ? "City"
              : key === "category_id" || key === "category"
              ? "Category"
              : key.replace(/_/g, " "),

          oldVal: oldVal || "-",
          newVal: newVal || "-",
        };
      })
      .filter(Boolean);

    setComparisonRows(rows);
  }, [oldData, newData, states, oldCities, newCities, categories]);

  const handleAction = async (actionType) => {
    const confirm = await Swal.fire({
      title: `${actionType === "approve" ? "Approve" : "Reject"} Request?`,
      icon: actionType === "approve" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText:
        actionType === "approve" ? "Yes, Approve" : "Yes, Reject",
    });

    if (!confirm.isConfirmed) return;

    const result = await ProcessProfileUpdateRequest(
      state.requestData.id,
      actionType,
      "",
      state.adminId,
      token
    );

    if (result?.status) {
      Swal.fire("Success", "Request processed successfully", "success");
    } else {
      Swal.fire("Error", result?.message || "Something went wrong", "error");
    }
  };

  const columns = [
    {
      name: "Field",
      selector: (row) => row.field,
      sortable: true,
    },
    {
      name: "Current Value",
      selector: (row) => row.oldVal,
    },
    {
      name: "Requested Change",
      selector: (row) => row.newVal,
      cell: (row) => <span className="text-warning fw-bold">{row.newVal}</span>,
    },
  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button className="btn btn-link" onClick={() => navigate(-1)}>
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Vendor Profile Update</h2>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <Datatable
          columns={columns}
          data={comparisonRows}
          noDataComponent="No differences found in profile update request."
          highlightOnHover
          striped
        />

        <div className="d-flex gap-3 mt-3">
          <button
            className="btn btn-success"
            onClick={() => handleAction("approve")}
          >
            Approve
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleAction("reject")}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
