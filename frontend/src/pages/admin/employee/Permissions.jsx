import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  GetAllPermission,
  GetEmployeePermission,
  AssignPermission,
} from "../../../Services/admin/Admin";

export default function Permissions() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.vendor_id;
  const token = localStorage.getItem("token");

  const [permissions, setPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all + employee permissions
  useEffect(() => {
    async function fetchData() {
      try {
        const all = await GetAllPermission(token);
        const emp = await GetEmployeePermission(token, id);

        setPermissions(all?.data || []);

        // ✅ pick only IDs from employee permissions data
        const empIds = emp?.data?.map((p) => Number(p.id)) || [];
        setUserPermissions(empIds);

        console.log("Employee permissions from API:", emp?.data);
        console.log("Normalized IDs:", empIds);
      } catch (err) {
        Swal.fire("Error", err?.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, token]);

  // toggle checkbox
  const handleToggle = (pid) => {
    const permId = Number(pid);
    if (userPermissions.includes(permId)) {
      setUserPermissions(userPermissions.filter((p) => p !== permId));
    } else {
      setUserPermissions([...userPermissions, permId]);
    }
  };

  // submit updated permissions
const handleSubmit = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update the permissions?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, update it",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return; // अगर cancel दबाया तो exit

  try {
    const payload = {
      user_id: id,
      permission_ids: userPermissions, // array of selected IDs
    };
    await AssignPermission(payload);

    Swal.fire("Success", "Permissions updated successfully", "success");
  } catch (err) {
    Swal.fire("Error", err?.message || "Failed to update", "error");
  }
};


  return (
    <div className="page-content">
      {/* Header Section */}
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </button>
            <h2 className="add-page-heading">Manage Permissions</h2>
          </div>
        </div>
        <div className="col-md-6 text-end mt-2">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            <i className="fa-solid fa-save me-1"></i>Save Changes
          </button>
        </div>
      </div>

      {/* Card Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="row">
              {permissions?.map((perm) => (
                <div key={perm.id} className="col-md-4 mb-3">
                  <div
                    className={`d-flex align-items-center justify-content-between border rounded px-3 py-2 shadow-sm ${
                      userPermissions.includes(Number(perm.id))
                        ? "bg-success bg-opacity-10 border-success"
                        : "bg-light"
                    }`}
                  >
                    <label
                      className="fw-semibold mb-0"
                      htmlFor={`perm-${perm.id}`}
                    >
                      {perm.name}
                    </label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`perm-${perm.id}`}
                        checked={userPermissions.includes(Number(perm.id))}
                        onChange={() => handleToggle(perm.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
