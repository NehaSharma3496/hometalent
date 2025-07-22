import React, { useEffect, useState } from "react";
import {
  GetCategories,
  GetSponsoredVendorsByCategory,
  UpdateSponsoredRanks,
} from "../../../Services/admin/Admin";
import { Link } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import Swal from "sweetalert2";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [sponsoredVendors, setSponsoredVendors] = useState([]);
  const [updatedRanks, setUpdatedRanks] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [liveRanks, setLiveRanks] = useState({});

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await GetCategories(token);
      setCategories(res?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

const handleSponsoredVendor = async (categoryId) => {
  try {
    const category = categories.find((c) => c.id === categoryId);
    setSelectedCategoryName(category?.name);

    const res = await GetSponsoredVendorsByCategory(categoryId, token);
    setSponsoredVendors(res?.data);

    // ✅ Re-initialize liveRanks
    const initialLiveRanks = {};
    res?.data.forEach((v) => {
      initialLiveRanks[`${v.vendor_id}_${v.category_id}`] = v.sponsor_rank;
    });
    setLiveRanks(initialLiveRanks);
    setUpdatedRanks({});
  } catch (error) {
    console.log("Error fetching SponsoredVendor", error);
  }
};



  // ✅ CHANGE: handle input change for sponsor rank
 const handleRankChange = (vendorId, categoryId, newValue) => {
  const newRank = parseInt(newValue);
  const key = `${vendorId}_${categoryId}`;

  // 🔁 First, find the current vendor's old rank
  const currentVendor = sponsoredVendors.find(
    (v) => v.vendor_id === vendorId && v.category_id === categoryId
  );
  const oldRank =
    updatedRanks[key]?.sponsor_rank ||
    liveRanks[key] ||
    currentVendor?.sponsor_rank;

  // ✅ Update liveRanks for input fields
  setLiveRanks((prevLive) => {
    const updatedLive = { ...prevLive };

    // Find and swap with vendor who had the newRank
    for (const k in prevLive) {
      if (prevLive[k] === newRank && k !== key) {
        updatedLive[k] = oldRank; // swap their input value
      }
    }

    updatedLive[key] = newRank;
    return updatedLive;
  });

  // ✅ Store updates for API submission later
  setUpdatedRanks((prev) => {
    const updated = { ...prev };

    sponsoredVendors.forEach((v) => {
      const vKey = `${v.vendor_id}_${v.category_id}`;
      const existingRank = updated[vKey]?.sponsor_rank || liveRanks[vKey] || v.sponsor_rank;

      if (
        v.category_id === categoryId &&
        existingRank === newRank &&
        v.vendor_id !== vendorId
      ) {
        updated[vKey] = {
          vendor_id: v.vendor_id,
          category_id: v.category_id,
          sponsor_rank: oldRank,
        };
      }
    });

    updated[key] = {
      vendor_id: vendorId,
      category_id: categoryId,
      sponsor_rank: newRank,
    };

    return updated;
  });
};



  // ✅ CHANGE: handle API call for updating sponsor ranks
  const handleUpdateAllRanks = async () => {
    const vendors = Object.values(updatedRanks);
    if (vendors.length === 0) {
      Swal.fire("No Changes", "Please modify some ranks first.", "info");
      return;
    }

    try {
      const res = await UpdateSponsoredRanks(vendors, token);
      if (
        res?.success ||
        res?.message?.includes("updated") ||
        res?.status === true
      ) {
        Swal.fire("Success", "Sponsor ranks updated successfully.", "success");
        setUpdatedRanks({});
      } else {
        Swal.fire(
          "Error",
          res?.message || "Failed to update sponsor ranks",
          "error"
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      Swal.fire("Error", "An error occurred while updating.", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryColumns = [
    {
      name: "Category Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Sponsored Vendor",
      cell: (row) => (
        <div className="action-div">
          <button
            className="btn action-btn btn-primary"
            onClick={() => handleSponsoredVendor(row.id)}
          >
            Get
          </button>
        </div>
      ),
      width: "180px",
      sortable: false,
    },
  ];

  const vendorColumns = [
    {
      name: "Vendor ID",
      selector: (row) => row.vendor_id,
      sortable: true,
    },
    {
      name: "Owner Name",
      selector: (row) => row.vendor?.owner_name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.vendor?.phone,
    },
    {
      name: "Email",
      selector: (row) => row.vendor?.email,
    },
    {
      name: "Category Name",
      selector: (row) => row.category.name,
    },
    {
      name: "Sponser Rank",
      selector: (row) => row.sponsor_rank,
    },
 {
  name: "Update Rank",
  cell: (row) => {
    const key = `${row.vendor_id}_${row.category_id}`;
    const value = liveRanks[key] !== undefined ? liveRanks[key] : row.sponsor_rank;

    return (
      <input
        type="number"
        className="form-control"
        value={value}
        onChange={(e) =>
          handleRankChange(row.vendor_id, row.category_id, e.target.value)
        }
      />
    );
  },
}


  ];

  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="add-page-heading-div">
            <Link to="/admin/dashboard">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Categories</h2>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col-md-12">
            <Datatable columns={categoryColumns} data={categories} pagination />
          </div>

          {sponsoredVendors.length > 0 && (
            <div className="page-content">
              <div className="row align-items-center mb-3">
                <div className="col-md-6">
                  <div className="add-page-heading-div">
                    <h2 className="add-page-heading">
                      Sponsored Vendors{" "}
                      {selectedCategoryName && `- ${selectedCategoryName}`}
                    </h2>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <button
                    className="add-btn-head"
                    onClick={handleUpdateAllRanks}
                  >
                    Update All Ranks
                  </button>
                </div>
              </div>

              <Datatable
                columns={vendorColumns}
                data={sponsoredVendors}
                pagination
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
