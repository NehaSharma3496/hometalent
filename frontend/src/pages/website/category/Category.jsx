import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";

import { useParams, Navigate } from "react-router-dom";
import {
  GetStateCity,
  GetVendorsByCategory,
} from "../../../Services/webService/Web";

const Category = () => {
  const location = useLocation();

  const [vendor, setVendor] = useState([]);
  const [city, setCity] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);

  const token = localStorage.getItem("token");

  const category = location?.state?.category;

  const fetchvendorsbycategories = async () => {
    try {
      const response = await GetVendorsByCategory(token, category?.id);
      console.log("Vendors in this category:", response);
      setVendor(response.data);
    } catch (error) {
      console.log("Error fetching vendor by categories", error);
    }
  };

  const fetchvendorcity = async () => {
    try {
      const response = await GetStateCity();
      console.log("City ", response);
      setCity(response.data);
    } catch (error) {
      console.log("Error in fetching cities", error);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVendors(vendor);
    } else {
      const filtered = vendor.filter((v) =>
        v.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVendors(filtered);
    }
  }, [searchQuery, vendor]);

  useEffect(() => {
    fetchvendorcity();
  }, []);

  useEffect(() => {
    if (category?.id) {
      fetchvendorsbycategories();
    }
  }, [category]);

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: category?.name, to: "#" }, // or current route
  ];

  return (
    <div>
      <Breadcrumbs title={category?.name} links={breadcrumbLinks} />
      <section className="tour-list-section top-bottom-padding2">
        <div className="container">
          <div className="row g-4">
            <div className="col-xl-12">
              <div className="showing-result">
                <h4 className="title">Showing 6 of 10 Results</h4>
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

                        if (value === "low") {
                          sorted.sort((a, b) => a.price_range - b.price_range);
                        } else if (value === "high") {
                          sorted.sort((a, b) => b.price_range - a.price_range);
                        } else if (value === "new") {
                          sorted.sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          );
                        } else if (value === "popular") {
                          // Placeholder for future "popular" logic
                          sorted = [...vendor]; // Keep as-is
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
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((item, index) => (
                        <div className="col-xl-4 col-lg-4 col-sm-6" key={index}>
                          <div className="hotel-card">
                            <div className="hotel-img imgEffect4">
                              <Link
                                to="/categorydetail"
                                state={{
                                  vendor: item,
                                  category: category,
                                  cities: city,
                                }}
                              >
                                <img src={item.image} alt={item.name} />
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
                                    category: category,
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

                              {/* <div className="hotel-person">
                                <div className="count">
                                  <div className="icon text-primary">
                                    <i className="ri-speed-up-line" />
                                  </div>
                                  <p className="pera">
                                    {item.pools || "2 Pools"}
                                  </p>
                                </div>
                                <div className="count">
                                  <div className="icon text-primary">
                                    <i className="ri-tools-fill" />
                                  </div>
                                  <p className="pera text-capitalize">
                                    {item.bathrooms || "2 Bathrooms"}
                                  </p>
                                </div>
                                <div className="count">
                                  <div className="icon text-primary">
                                    <i className="ri-bus-2-line" />
                                  </div>
                                  <p className="pera text-capitalize">
                                    {item.beds || "3 Beds"}
                                  </p>
                                </div>
                                <div className="count">
                                  <div className="icon text-primary">
                                    <i className="ri-run-line" />
                                  </div>
                                  <p className="pera text-capitalize">
                                    {item.capacity || "4-6 Persons"}
                                  </p>
                                </div>
                              </div> */}

                              <div className="cart-footer d-flex flex-wrap justify-content-between">
                                <div className="d-flex gap-6 align-items-center">
                                  <p className="pera">${item.price_range}</p>
                                  <p className="sub-pera text-12 text-capitalize">
                                    /person
                                  </p>
                                </div>
                                <Link
                                  to="/categorydetail"
                                  className="browse-btn"
                                  state={{
                                    vendor: item,
                                    category: category,
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
                        <h5 className="text-danger">No user found</h5>
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
