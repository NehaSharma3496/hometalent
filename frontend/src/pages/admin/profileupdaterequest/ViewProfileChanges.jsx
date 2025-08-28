import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Datatable from "../../../extracomponents/Datatable";
import {
  ProcessProfileUpdateRequest,
  GetProfileUpdateRequestsBlogs,
} from "../../../Services/admin/Admin";
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

  const readonly = state?.readonly || false;
  const requestData = state?.requestData || {};
  const vendor_id = requestData?.vendor_id;
  const request_data = requestData?.request_data;
  const status = requestData?.status;
  const request_id = state?.requestId;

  useEffect(() => {
    if (!vendor_id) return;

    if (status === "approved" && request_id) {
      GetProfileUpdateRequestsBlogs(token, { request_id }).then((res) => {
        if (res?.status && res?.data?.details) {
          setOldData(res.data.details.user_before || {});
          setNewData(res.data.details.user_after || {});
        }
      });
    } else {
      GetVendorDetails(token, vendor_id).then((res) => {
        if (res?.status && res.data?.user) {
          setOldData(res.data.user);
        }
      });

      if (request_data) {
        try {
          const parsed = JSON.parse(request_data);
          setNewData(parsed);
        } catch (err) {
          console.error("Invalid JSON in request_data", err);
        }
      }
    }

    GetStates(token).then((res) => res?.status && setStates(res.data || []));
    GetCategories(token).then(
      (res) => res?.status && setCategories(res.data || [])
    );
  }, [vendor_id, token, request_data, status, request_id]);

  useEffect(() => {
    if (newData?.state_id) {
      GetCities(token, newData.state_id).then((res) => {
        if (res?.status) setNewCities(res.data || []);
      });
    }
  }, [newData?.state_id, token]);

  useEffect(() => {
    if (oldData?.state_id) {
      GetCities(token, oldData.state_id).then((res) => {
        if (res?.status) setOldCities(res.data || []);
      });
    }
  }, [oldData?.state_id, token]);

  const getNameById = (list, id) => {
    if (!id) return "-";
    const item = list.find(
      (i) =>
        i.id === Number(id) ||
        i.category_id === Number(id) ||
        i.id?.toString() === id?.toString() ||
        i.category_id?.toString() === id?.toString()
    );

    return item
      ? item.name || item.category_name // states/cities → name, categories → category_name
      : id;
  };

  useEffect(() => {
    if (!oldData || !newData || categories.length === 0) return;

    let allKeys = [];
    if (status === "approved") {
      allKeys = [
        ...new Set([
          ...Object.keys(oldData || {}),
          ...Object.keys(newData || {}),
        ]),
      ];
    } else {
      allKeys = Object.keys(newData || {});
    }

    const rows = allKeys
      .filter(
        (key) =>
          ![
            "id",
            "approval_status",
            "createdAt",
            "updatedAt",
            "deleted_at",
            "sort_order",
            "admin_id",
          ].includes(key)
      )
      .map((key) => {
        let oldValRaw = oldData?.[key];
        let newValRaw = newData?.[key];

        if (key === "state_id") {
          oldValRaw = getNameById(states, oldValRaw);
          newValRaw = getNameById(states, newValRaw);
        }
        if (key === "city_id") {
          oldValRaw = getNameById(oldCities, oldValRaw);
          newValRaw = getNameById(newCities, newValRaw);
        }
        if (key === "category_id") {
          oldValRaw = getNameById(categories, oldValRaw);
          newValRaw = getNameById(categories, newValRaw);
        }

        const resolveField = (value) => {
          if (!value && value !== 0) return "-";
          if (typeof value === "object") {
            if (Array.isArray(value)) {
              return value
                .map((v) => (v?.file_name ? v.file_name : JSON.stringify(v)))
                .join(", ");
            }
            return (
              value?.file_name || value?.file_path || JSON.stringify(value)
            );
          }
          return value.toString().trim();
        };

        const oldVal = resolveField(oldValRaw);
        const newVal = resolveField(newValRaw);

        if (oldVal === newVal) return null;

        return {
          field: key.replace(/_/g, " "),
          oldVal,
          newVal,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.field.localeCompare(b.field));

    setComparisonRows(rows);
  }, [oldData, newData, status, states, oldCities, newCities, categories]);

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
      requestData.id,
      actionType,
      "",
      state.adminId,
      token
    );

    if (result?.status) {
      Swal.fire("Success", "Request processed successfully", "success");
      navigate("/admin/profileupdaterequest");
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
            <h2 className="add-page-heading mb-0">Vendor Profile Update</h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          {status && (
            <span
              className={`badge fs-6 ${
                status === "approved"
                  ? "bg-success"
                  : status === "rejected"
                  ? "bg-danger"
                  : "bg-warning text-dark"
              }`}
            >
              Status: {status.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="card p-3">
        <Datatable
          columns={columns}
          data={comparisonRows}
          noDataComponent={
            <div className="text-muted py-3">
              {readonly
                ? "No changes found or data unavailable for this request."
                : "No differences found in profile update request."}
            </div>
          }
          highlightOnHover
          striped
        />

        {!readonly && (
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
        )}
      </div>
    </div>
  );
}
