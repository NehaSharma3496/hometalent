import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { GetSponsoredVendorsByCategory } from "../../../Services/admin/Admin";
import Datatable from "../../../extracomponents/Datatable";

export default function SponsoredRankUpdate() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const categoryId = location.state?.categoryId;

  const [loading, setLoading] = useState(true);
  const [sponsoredVendor, setSponsoredVendor] = useState([]);

  useEffect(() => {
    if (categoryId) {
        console.log("category Id",categoryId);
      fetchSponsoredVendors();
    }
  }, [categoryId]);

  const fetchSponsoredVendors = async () => {
    try {
      const res = await GetSponsoredVendorsByCategory(categoryId,token);
      console.log("Sponsor Vendor", res);
      setSponsoredVendor(res?.remaning_active?.data );

    } catch (error) {
      console.error("Error fetching sponsored vendors", error);
    } finally {
      setLoading(false);
    }
  };

const vendorColumns = [
  {
    name: "S.No",
    selector: (row, index) => index + 1,
    width: "80px",
  },
  {
    name: "Vendor Name",
    selector: (row) => row.vendor?.profile_name || "N/A",
  },
  {
    name: "Sponsor Rank",
    selector: (row) => row.sponsor_rank ?? "Not Ranked",
  },
  {
    name: "Category",
    selector: (row) => row.category?.name || "N/A",
  },
];


  return (
    <div className="page-content">
      <div className="row align-items-center mb-3">
        <div className="col-md-6 col-8">
          <div className="add-page-heading-div d-flex align-items-center">
            <Link to="/admin/dashboard" className="me-2">
              <i className="fa-sharp fa-regular fa-arrow-left"></i>
            </Link>
            <h2 className="add-page-heading">Sponsored Vendors</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div className="col-md-12">
            <Datatable
              columns={vendorColumns}
              data={sponsoredVendor}
              pagination
              progressPending={loading}
              noDataComponent="No sponsored vendors found."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
