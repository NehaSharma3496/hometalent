import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import {
  GetStateCity,
  GetCategories,
  GetVendorsByCategory,
} from "../../../Services/webService/Web";

const Category = () => {
  const location = useLocation();
  const [vendor, setVendor] = useState([]);
  const [city, setCity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [sortOption, setSortOption] = useState("");

  const categoryId = location?.state?.categoryId;
  const cityId = location?.state?.cityId;
  const categoryName = categories?.find((cat) => cat.id === categoryId)?.name;
  const cityName =
    city?.find((c) => c.type === "city" && c.id === cityId)?.name || "";

  console.log("Category Id", categoryId);
  console.log("City Id ", cityId);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchCategories();
      fetchStateCity();
      fetchVendors();
    }, 200);
  }, [categoryId, cityId]);

  useEffect(() => {
    let filtered = vendor?.filter((v) => {
      const cityName =
        city?.find((c) => c.type === "city" && c.id === v.city_id)?.name || "";
      return (
        v.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cityName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    const getMinPrice = (range) => {
      if (!range) return 0;
      const match = range.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    if (sortOption === "low") {
      filtered.sort(
        (a, b) => getMinPrice(a.price_range) - getMinPrice(b.price_range)
      );
    } else if (sortOption === "high") {
      filtered.sort(
        (a, b) => getMinPrice(b.price_range) - getMinPrice(a.price_range)
      );
    } else if (sortOption === "new") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredVendors(filtered);
  }, [searchQuery, vendor, city, sortOption]);

  const fetchStateCity = async () => {
    try {
      const res = await GetStateCity(token);
      setCity(res?.data);
    } catch (err) {
      console.log("Error in fetching city", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await GetCategories(token);
      setCategories(res?.data);
    } catch (err) {
      console.log("Error in fetching city", err);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await GetVendorsByCategory(token, categoryId, cityId);

      setVendor(res?.data);
    } catch (err) {
      console.log("Error in fetching vendors by categories", err);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbLinks = [
    { label: "Home" },
    ...(cityName
      ? [{ label: cityName, to: `/vendors-by-category?city_id=${cityId}` }]
      : []),
    {
      label: categoryName || "Category",
      to: `/vendors-by-category?category_id=${categoryId}${
        cityId ? `&city_id=${cityId}` : ""
      }`,
    },
  ];

  return (
    <div>
      {loading}
      <Breadcrumbs title={categoryName} links={breadcrumbLinks} />
      <section className="tour-list-section top-bottom-padding2">
        <div className="container">
          <div className="row g-4">
            <div className="col-xl-12">
              <div className="showing-result">
                <h4 className="title"></h4>

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
                    <i className="ri-search-line text-muted" />
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      placeholder="Search by city or name "
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

                  {/* <div className="sorting-dropdown">
                    <select
                      className="form-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="low">Price low to high</option>
                      <option value="high">Price high to low</option>
                      <option value="new">Sort by Newest</option>
                    </select>
                  </div> */}
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
                    ) : filteredVendors?.length > 0 ? (
                      filteredVendors?.map((item, index) => (
                        <div className="col-xl-4 col-lg-4 col-sm-6" key={index}>
                          <div className="hotel-card">
                            <div className="hotel-img imgEffect4">
                              <Link
                                to="/categorydetail"
                                state={{
                                  vendorId: item.id, 
                                }}
                              >
                                <img
                                  src={item.image || "/default-vendor.jpg"}
                                  alt={item.owner_name}
                                />
                              </Link>

                              {/* <div className="rating-badge-car">
                                <div className="rating">
                                  <i className="ri-star-s-fill" />
                                  <p className="pera">
                                    {item.rating || "4.8"} ({item.reviews || 15}{" "}
                                    Reviews)
                                  </p>
                                </div>
                              </div> */}
                            </div>

                            <div className="hotel-content">
                              <h4 className="area-name">
                                <Link
                                  to="/categorydetail"
                                  state={{ vendor: item }}
                                >
                                  {item.owner_name}
                                </Link>
                              </h4>
                              {/* <p className="category-name text-capitalize text-primary">
                                <i className="fa-solid fa-layer-group me-2"></i>
                                {categoryName || item.category_name}
                              </p> */}

                              <div className="location">
                                <i className="ri-map-pin-line" />
                                <div className="name text-capitalize">
                                  {city.find(
                                    (c) =>
                                      c.type === "city" && c.id === item.city_id
                                  )?.name || "Unknown"}
                                </div>
                              </div>

                              <h1 className="area-name">
                                <Link
                                  to="/categorydetail"
                                  state={{ vendorId: item.id }}
                                  className="truncate-2-lines mb-3"
                                >
                                  {item?.short_description}
                                </Link>
                              </h1>

                              <div className="cart-footer d-flex flex-wrap justify-content-between">
                                <div className="d-flex gap-6 align-items-center">
                                  <p className="pera">
                                    ₹{item.price_range || "Contact for price"}
                                  </p>
                                  {/* <p className="sub-pera text-12 text-capitalize">
                                    /person
                                  </p> */}
                                </div>
                                <Link
                                  to="/categorydetail"
                                  state={{
                                    vendorId: item.id,
                                  }}
                                  className="browse-btn"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <img
                          src="/assets/images/NoVendor.jpg"
                          alt="No vendors"
                          style={{ width: "180px", marginBottom: "20px" }}
                        />
                        <h4 className="text-muted">No vendors available</h4>
                        <p className="text-secondary">
                          We couldn’t find any vendors matching your search or
                          selection.
                        </p>
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
