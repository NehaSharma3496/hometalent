import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";

import { useParams, Navigate } from "react-router-dom";
import {
  GetStateCity,
  GetVendorsByCategory,
} from "../../../Services/webService/Web";

// Import base_url as named export
import { base_url } from "../../../Utils/config";

const Category = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [vendor, setVendor] = useState([]);
  const [city, setCity] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Get category from location state (from Header navigation)
  const categoryFromState = location?.state?.category;

  // Get parameters from URL search params (from Home page navigation)
  const categoryIdFromUrl = searchParams.get("categoryId");
  const cityIdFromUrl = searchParams.get("cityId");

  // Determine effective IDs for API call
  const effectiveCategoryId = categoryFromState?._id || categoryIdFromUrl;
  const effectiveCityId = cityIdFromUrl;

  // For breadcrumbs and display, use category from state if available
  const displayCategory = categoryFromState || {
    _id: categoryIdFromUrl,
    name: "Selected Category",
  };

  console.log("Category Component State:", {
    categoryFromState,
    categoryIdFromUrl,
    cityIdFromUrl,
    effectiveCategoryId,
    effectiveCityId,
  });

  // Custom function for category-only API call (without city_id parameter)
  const getCategoryOnlyVendors = async (categoryId) => {
    try {
      console.log("Making category-only API call for categoryId:", categoryId);

      // Direct axios call without city_id parameter using base_url
      const response = await axios.get(
        `${base_url}front/vendors-by-category/${categoryId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Category-only API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Category-only API error:", error);
      return { status: false, data: [] };
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      console.log("Fetching vendors with params:", {
        categoryId: effectiveCategoryId,
        cityId: effectiveCityId,
      });

      let response;

      if (effectiveCategoryId && effectiveCityId) {
        // Both category and city selected - use original API function
        console.log("API Call: Both category and city");
        response = await GetVendorsByCategory(
          token,
          effectiveCategoryId,
          effectiveCityId
        );
      } else if (effectiveCategoryId) {
        // Only category selected - use custom function without city_id
        console.log("API Call: Only category - using custom function");
        response = await getCategoryOnlyVendors(effectiveCategoryId);
      } else if (effectiveCityId) {
        // Only city selected - use original API function with empty category
        console.log("API Call: Only city - using empty string for category");
        response = await GetVendorsByCategory(token, "", effectiveCityId);
      } else {
        console.log("No filters provided");
        setVendor([]);
        setLoading(false);
        return;
      }

      console.log("API Response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        setVendor(response.data);
        console.log(`Successfully loaded ${response.data.length} vendors`);
      } else {
        console.log("No vendor data in response or invalid format");
        setVendor([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendor([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await GetStateCity();
      console.log("Cities fetched:", response?.data?.length || 0);
      setCity(response.data || []);
    } catch (error) {
      console.log("Error in fetching cities", error);
      setCity([]);
    }
  };

  // Filter vendors based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVendors(vendor);
    } else {
      const filtered = vendor.filter((v) => {
        const ownerMatch = v.owner_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        const cityMatch = city
          .find((c) => c.type === "city" && c.id === v.city_id)
          ?.name?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        return ownerMatch || cityMatch;
      });

      setFilteredVendors(filtered);
    }
  }, [searchQuery, vendor, city]);

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch vendors when parameters change
  useEffect(() => {
    if (effectiveCategoryId || effectiveCityId) {
      fetchVendors();
    } else {
      setVendor([]);
    }
  }, [effectiveCategoryId, effectiveCityId, token]);

  // Get city name for display
  const selectedCityName = effectiveCityId
    ? city.find((c) => c.type === "city" && c.id === parseInt(effectiveCityId))
        ?.name
    : null;

  // Dynamic page title
  const getPageTitle = () => {
    if (effectiveCategoryId && effectiveCityId) {
      return `${displayCategory.name} in ${
        selectedCityName || "Selected City"
      }`;
    } else if (effectiveCategoryId) {
      return displayCategory.name;
    } else if (effectiveCityId) {
      return `Vendors in ${selectedCityName || "Selected City"}`;
    }
    return "Vendors";
  };

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: getPageTitle(), to: "#" },
  ];

  return (
    <div>
      <Breadcrumbs title={getPageTitle()} links={breadcrumbLinks} />
      <section className="tour-list-section top-bottom-padding2">
        <div className="container">
          <div className="row g-4">
            <div className="col-xl-12">
              <div className="showing-result">
                <h4 className="title">
                  {loading
                    ? "Loading..."
                    : `Showing ${filteredVendors.length} of ${vendor.length} Results`}
                  {effectiveCategoryId && ` for ${displayCategory.name}`}
                  {effectiveCityId &&
                    ` in ${selectedCityName || "Selected City"}`}
                </h4>

                <div className="d-flex gap-10 align-items-center">
                  <div
                    className="expand-icon hamburger block d-xl-none"
                    id="hamburger"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 7H10M10 7C10 8.65685 11.3431 10 13 10H14C15.6569 10 17 8.65685 17 7C17 5.34315 15.6569 4 14 4H13C11.3431 4 10 5.34315 10 7ZM16 17H21M20 7H21M3 17H6M6 17C6 18.6569 7.34315 20 9 20H10C11.6569 20 13 18.6569 13 17C13 15.3431 11.6569 14 10 14H9C7.34315 14 6 15.3431 6 17Z"
                        stroke="#071516"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div
                    className="d-flex align-items-center border rounded px-2 py-1"
                    style={{ maxWidth: "400px", margin: "auto" }}
                  >
                    <i className="ri-search-line me-2 text-muted" />
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      placeholder="Search vendors by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        className="btn btn-sm btn-light border-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <i className="ri-close-line" />
                      </button>
                    )}
                  </div>

                  <div className="sorting-dropdown">
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const value = e.target.value;
                        let sorted = [...vendor];

                        const getMinPrice = (range) => {
                          if (!range) return 0;
                          const parts = range
                            .split("-")
                            .map((p) => parseInt(p));
                          return isNaN(parts[0]) ? 0 : parts[0];
                        };

                        const getMaxPrice = (range) => {
                          if (!range) return 0;
                          const parts = range
                            .split("-")
                            .map((p) => parseInt(p));
                          return isNaN(parts[1]) ? 0 : parts[1];
                        };

                        if (value === "low") {
                          sorted.sort(
                            (a, b) =>
                              getMinPrice(a.price_range) -
                              getMinPrice(b.price_range)
                          );
                        } else if (value === "high") {
                          sorted.sort(
                            (a, b) =>
                              getMaxPrice(b.price_range) -
                              getMaxPrice(a.price_range)
                          );
                        } else if (value === "new") {
                          sorted.sort(
                            (a, b) =>
                              new Date(b.created_at || 0) -
                              new Date(a.created_at || 0)
                          );
                        } else if (value === "popular") {
                          sorted = [...vendor];
                        }

                        setVendor(sorted);
                      }}
                    >
                      <option value="popular">Sort by Popular</option>
                      <option value="low">Price low to high</option>
                      <option value="high">Price high to low</option>
                      <option value="new">Sort by Newest</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="all-tour-list">
                <div className="row g-4">
                  <div className="row">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading vendors...</p>
                      </div>
                    ) : filteredVendors.length > 0 ? (
                      filteredVendors.map((item, index) => (
                        <div className="col-xl-4 col-lg-4 col-sm-6" key={index}>
                          <div className="hotel-card">
                            <div className="hotel-img imgEffect4">
                              <Link
                                to="/categorydetail"
                                state={{
                                  vendor: item,
                                  category: displayCategory,
                                  cities: city,
                                }}
                              >
                                <img
                                  src={item.image || "/default-vendor.jpg"}
                                  alt={item.owner_name}
                                />
                              </Link>
                              <div className="rating-badge-car">
                                <div className="rating">
                                  <i className="ri-star-s-fill" />
                                  <p className="pera">
                                    {item.rating || "4.8"} ({item.reviews || 15}{" "}
                                    Reviews)
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="hotel-content">
                              <h4 className="area-name">
                                <Link
                                  to="/categorydetail"
                                  state={{
                                    vendor: item,
                                    category: displayCategory,
                                    cities: city,
                                  }}
                                >
                                  {item.owner_name}
                                </Link>
                              </h4>
                              <div className="location">
                                <i className="ri-map-pin-line" />
                                <div className="name text-capitalize">
                                  {city.find(
                                    (c) =>
                                      c.type === "city" && c.id === item.city_id
                                  )?.name || "Unknown"}
                                </div>
                              </div>

                              <div className="cart-footer d-flex flex-wrap justify-content-between">
                                <div className="d-flex gap-6 align-items-center">
                                  <p className="pera">
                                    ${item.price_range || "Contact for price"}
                                  </p>
                                  <p className="sub-pera text-12 text-capitalize">
                                    /person
                                  </p>
                                </div>
                                <Link
                                  to="/categorydetail"
                                  className="browse-btn"
                                  state={{
                                    vendor: item,
                                    category: displayCategory,
                                    cities: city,
                                  }}
                                >
                                  book now
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <h5 className="text-danger">
                          {effectiveCategoryId || effectiveCityId
                            ? "No vendors found for the selected criteria"
                            : "Please select a category or city to view vendors"}
                        </h5>
                        {/* <p className="text-muted">
                          {effectiveCategoryId &&
                            `Category: ${displayCategory.name}`}
                          {effectiveCategoryId && effectiveCityId && " | "}
                          {effectiveCityId &&
                            `City: ${selectedCityName || "Selected City"}`}
                        </p>
                        <div className="mt-3">
                          <p className="small text-info">
                            Debug Info: CategoryID:{" "}
                            {effectiveCategoryId || "None"}, CityID:{" "}
                            {effectiveCityId || "None"}
                          </p>
                          <p className="small text-warning">
                            Check console for API call details
                          </p>
                        </div> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
