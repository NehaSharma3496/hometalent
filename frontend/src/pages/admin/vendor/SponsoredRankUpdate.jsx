import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  GetSponsoredVendorsByCategory,
  UpdateSponsoredRanks,
} from "../../../Services/admin/Admin";
import Swal from "sweetalert2";

export default function SponsoredRankUpdate() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const categoryId = location.state?.categoryId;
  const categoryName = location.state?.categoryName;

  const [loading, setLoading] = useState(true);
  const [vendorList, setVendorList] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (categoryId) fetchVendors();
  }, [categoryId]);

  const fetchVendors = async () => {
    try {
      const res = await GetSponsoredVendorsByCategory(categoryId, token);
      const sponsored =
        res?.sponsored?.map((v) => ({
          ...v.vendor,
          sponsor_rank: v.sponsor_rank,
        })) || [];

      const remaining = res?.remaining_active || [];

      const allVendors = [
        ...sponsored,
        ...remaining.filter((v) => !sponsored.some((s) => s.id === v.id)),
      ];

      setVendorList(allVendors);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRankChange = (vendorId, newRank) => {
    const rankToAssign = parseInt(newRank);

    setVendorList((prevList) => {
      const updatedList = [...prevList];

      const existingRankVendor = updatedList.find(
        (v) => v.sponsor_rank === rankToAssign && v.id !== vendorId
      );

      if (existingRankVendor) {
        existingRankVendor.sponsor_rank = undefined;
      }

      const targetVendor = updatedList.find((v) => v.id === vendorId);
      if (targetVendor) {
        targetVendor.sponsor_rank = rankToAssign;
      }

      return updatedList;
    });
  };

  const handleSubmit = async () => {
    const updated = vendorList
      .filter((v) => v.sponsor_rank !== undefined)
      .map((v) => ({
        vendor_id: v.id,
        sponsor_rank: v.sponsor_rank,
        category_id: categoryId,
      }));

    const rankSet = new Set();
    for (let entry of updated) {
      if (rankSet.has(entry.sponsor_rank)) {
        return Swal.fire(
          "Duplicate Ranks",
          "Two vendors cannot have the same rank!",
          "warning"
        );
      }
      rankSet.add(entry.sponsor_rank);
    }

    try {
      const result = await UpdateSponsoredRanks(updated, token);
      if (result.status) {
        Swal.fire("Success", "Sponsor ranks updated successfully.", "success");
        fetchVendors();
      } else {
        Swal.fire("Failed", result?.message || "Update failed.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "An error occurred while updating ranks.", "error");
    }
  };

  // 🔎 Filter vendor list based on search
  const filteredVendors = searchText
    ? vendorList.filter((vendor) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          vendor.owner_name?.toLowerCase().includes(lowerSearch) ||
          vendor.email?.toLowerCase().includes(lowerSearch) ||
          vendor.phone?.toLowerCase().includes(lowerSearch)
        );
      })
    : vendorList;

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 col-8">
          <div className="add-page-heading-div d-flex align-items-center">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">
              Sponsored Vendors - {categoryName}
            </h2>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success" onClick={handleSubmit}>
            Update Ranks
          </button>
        </div>
      </div>

      {/* 🔎 Search Bar */}
      <div className="col-md-4 mb-3">
        <div className="d-flex align-items-center border rounded px-2">
          <i className="ri-search-line me-2 text-muted" />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Search by vendor name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              className="btn btn-sm btn-light border-0"
              onClick={() => setSearchText("")}
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Vendor Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Current Rank</th>
                <th>Assign New Rank</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No vendors found
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor, index) => (
                  <tr key={vendor.id}>
                    <td>{index + 1}</td>
                    <td>{vendor.owner_name || "N/A"}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.phone}</td>
                    <td>{vendor.sponsor_rank ?? "Not Sponsored"}</td>
                    <td style={{ width: "180px" }}>
                      <input
                        type="number"
                        className="form-control"
                        min={1}
                        value={vendor.sponsor_rank ?? ""}
                        onChange={(e) =>
                          handleRankChange(vendor.id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
