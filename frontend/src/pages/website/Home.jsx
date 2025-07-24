import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetStateCity } from "../../Services/webService/Web";
import select from "react-select";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetCategories } from "../../Services/webService/Web";

const Home = () => {
  const [statecity, setStateCity] = useState([]);
  const [categories, setCategories] = useState([]);
 
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // State for storing selected IDs
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const navigate = useNavigate();

  const handleCitySelect = (cityName, cityId) => {
    console.log("City selected:", cityName, "ID:", cityId);
    setSearch(cityName);
    setSelectedCityId(cityId);
    setShowDropdown(false);
  };

  const handleCategorySelect = (categoryValue) => {
    console.log("=== Category Selection Debug ===");
    console.log("Category dropdown value:", categoryValue);

    // Find the actual category object to get the correct ID
    const selectedCategory = categories.find(
      (cat) =>
        cat._id === categoryValue ||
        cat.id === categoryValue ||
        cat.name === categoryValue
    );

    console.log("Found category object:", selectedCategory);

    // Try to get the actual ID from the category object
    let actualCategoryId = categoryValue;

    if (selectedCategory) {
      // Try different possible ID fields
      actualCategoryId =
        selectedCategory.id ||
        selectedCategory._id ||
        selectedCategory.categoryId ||
        categoryValue;
      console.log("Using category ID:", actualCategoryId);
    }

    setSelectedCategoryId(actualCategoryId);
  };

  const handleFindNow = () => {
    console.log("=== Find Now Debug ===");
    console.log("Selected Category ID:", selectedCategoryId);
    console.log("Selected City ID:", selectedCityId);

    // Validate that we have at least one selection
    if (!selectedCategoryId && !selectedCityId) {
      alert("Please select at least a city or category");
      return;
    }

    // Navigate to category page with appropriate parameters
    const queryParams = new URLSearchParams();

    if (selectedCategoryId) {
      console.log("Adding categoryId to URL:", selectedCategoryId);
      queryParams.append("categoryId", selectedCategoryId);
    }

    if (selectedCityId) {
      console.log("Adding cityId to URL:", selectedCityId);
      queryParams.append("cityId", selectedCityId);
    }

    const url = `/category?${queryParams.toString()}`;
    console.log("Final navigation URL:", url);
    navigate(url);
  };

  const token = localStorage.getItem("token");

  const fetchstatecity = async () => {
    try {
      const response = await GetStateCity();
      setStateCity(response.data);
      console.log("Cities loaded:", response.data?.length || 0);
    } catch (error) {
      console.log("Error fetching cities", error);
    }
  };

  const fetchcategories = async () => {
    try {
      const response = await GetCategories(token);
      setCategories(response.data);
      console.log("=== Categories Debug ===");
      console.log("Categories loaded:", response.data?.length || 0);
      console.log("Sample category:", response.data?.[0]);

      // Detailed analysis of category structure
      if (response.data && response.data.length > 0) {
        const sampleCat = response.data[0];
        console.log("Category structure analysis:");
        console.log(
          "- _id:",
          sampleCat._id,
          "(type:",
          typeof sampleCat._id,
          ")"
        );
        console.log("- id:", sampleCat.id, "(type:", typeof sampleCat.id, ")");
        console.log(
          "- name:",
          sampleCat.name,
          "(type:",
          typeof sampleCat.name,
          ")"
        );
        console.log(
          "- categoryId:",
          sampleCat.categoryId,
          "(type:",
          typeof sampleCat.categoryId,
          ")"
        );
        console.log("Full object keys:", Object.keys(sampleCat));
      }
    } catch (error) {
      console.log("Error fetching services", error);
    }
  };

  function groupedFilteredData(data, search = "") {
    const searchLower = search.toLowerCase();
    const groups = [];

    let currentGroup = null;

    data.forEach((item) => {
      if (item.type === "state") {
        currentGroup = {
          state: item,
          cities: [],
        };
        groups.push(currentGroup);
      } else if (item.type === "city" && currentGroup) {
        currentGroup.cities.push(item);
      }
    });

    if (search.trim()) {
      return groups
        .map((group) => {
          const stateMatch = group.state.name
            .toLowerCase()
            .includes(searchLower);
          const matchedCities = group.cities.filter((city) =>
            city.name.toLowerCase().includes(searchLower)
          );

          if (stateMatch) return group;
          if (matchedCities.length > 0)
            return { state: group.state, cities: matchedCities };
          return null;
        })
        .filter(Boolean);
    }

    return groups;
  }

  useEffect(() => {
    fetchstatecity();
    fetchcategories();
  }, []);

  const testimonials = [
    {
      name: "Jacob Jones",
      title: "CEO, Traveller",
      quote:
        "Lorem ipsum dolor sit amet amet early ameeny consectetur adipiscing elit. Ipsum dolor consectetur.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      name: "Sarah Lee",
      title: "Manager, Explorer",
      quote:
        "Lorem ipsum dolor sit amet amet early ameeny consectetur adipiscing elit. Ipsum dolor consectetur.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
    },
    {
      name: "Michael Smith",
      title: "CTO, TravelX",
      quote:
        "Lorem ipsum dolor sit amet amet early ameeny consectetur adipiscing elit. Ipsum dolor consectetur.",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <section className="hero-padding-for-three video-overlay position-relative hero-area">
        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-xl-12">
              <div className="hero-caption-three position-relative z-3">
                <h4
                  className="title wow fadeInUp text-center"
                  data-wow-delay="0.0s"
                >
                  Platform for home creators
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="plan-area-three">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto col-sm-12">
              <div className="plan-section-three plan-shadow">
                <div className="choose-plan-nav">
                  <div className="">
                    <div className="row g-4 justify-content-end">
                      <div className="col-xl-5 col-lg-12 position-relative destination-flex">
                        <input
                          type="text"
                          className="form-control form-select"
                          placeholder="Search City"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onFocus={() => setShowDropdown(true)}
                          onBlur={() =>
                            setTimeout(() => setShowDropdown(false), 200)
                          }
                        />

                        {showDropdown && (
                          <div
                            className="border bg-white p-3 pt-3 shadow position-absolute w-100"
                            style={{
                              maxHeight: "300px",
                              overflowY: "auto",
                              zIndex: 10,
                              minWidth: "500px",
                              marginTop: "55px",
                            }}
                          >
                            <ul
                              className="list-unstyled"
                              style={{ columnCount: 3 }}
                            >
                              {groupedFilteredData(statecity, search).map(
                                (group) => (
                                  <li key={`group-${group.state.id}`}>
                                    <h6 className="text-danger mb-1 mt-2">
                                      {group.state.name}{" "}
                                    </h6>
                                    <ul className="list-unstyled ms-3 ps-0">
                                      {group.cities.map((city) => (
                                        <li key={`city-${city.id}`}>
                                          <button
                                            type="button"
                                            className="dropdown-item py-1 text-nowrap"
                                            onClick={() =>
                                              handleCitySelect(
                                                city.name,
                                                city.id
                                              )
                                            }
                                          >
                                            * {city.name}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="col-xl-5 col-lg-12">
                        <div className="destination-flex">
                          <select
                            className="form-select"
                            value={selectedCategoryId}
                            onChange={(e) =>
                              handleCategorySelect(e.target.value)
                            }
                          >
                            <option value="">Select Category</option>
                            {Array.isArray(categories) &&
                              categories.map((cat) => {
                                // Try to determine the correct ID field to use
                                const categoryId =
                                  cat.id || cat._id || cat.categoryId;
                                console.log(
                                  "Rendering option - ID:",
                                  categoryId,
                                  "Name:",
                                  cat.name
                                );

                                return (
                                  <option
                                    key={cat._id || cat.id}
                                    value={categoryId}
                                  >
                                    {cat.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-xl-2 col-lg-3">
                        <div className="sign-btn text-right">
                          <button
                            style={{ height: "54px", lineHeight: "30px" }}
                            onClick={handleFindNow}
                            className="btn-primary w-100 text-center"
                            type="button"
                          >
                            Find Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-area ">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-auto position-relative">
                <h4 className="blue-title">Explore top vendors by category</h4>
                <span className="highlights">
                  from wedding lawns and marriage gardens to photographers,
                  bridal wear, makeup artists, and more — all with HomeTalent4u.
                </span>
              </div>
            </div>
          </div>
          <div className="grid5-container">
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Fabric Painting</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-1.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Canvas Painting</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-2.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Mehandi Art</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-3.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Catering</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-4.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15 py-3">
                    <div className="category-name">
                      <p className="pera">Cook/Chef on call</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-5.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Bakery item</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-6.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-6">
                    <div className="category-name">
                      <p className="pera mb-0">Food </p>
                      <p
                        className="small-text mt-0 text-black"
                        style={{ fontSize: "11px" }}
                      >
                        (Namkeen,Sweets, snacks)
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-7.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Gift & Packaging</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-8.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Jewellery</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img
                  src="../assets/images//category/image-9.png"
                  alt="travello"
                />
                <div className="category-content">
                  <div className="category-info py-15 py-3">
                    <div className="category-name">
                      <p className="pera">Cosmetics</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <button className="btn-primary mx-auto d-block mt-4">
            View All Categories{" "}
          </button>
        </div>
      </section>
      <section className="platform-area platform-area-bg">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-8">
              <div className="app-section-padding  ">
                <div className="hero-caption-one  bg-white radius-10 p-30">
                  <h4 className="blue-title pb-4">Why HomeTalent4u?</h4>
                  <p className="pera mb-1">
                    HomeTalent4U is a digital Platform dedicated to supporting
                    homegrown talent. Whether you make artisanal crafts, bake
                    delicious treats, offer tutoring, or provide any service
                    from home, we give you the tools and exposure you need to
                    grow. For customers, we make it easy to discover and support
                    local makers and service providers.
                  </p>
                  <Link to="">Read More...</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
      </section>

      <section className="testimonial-area testimonial-bg section-padding2 pb-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-auto position-relative">
                <h4 className="blue-title pb-3">
                  See Those Lovely Words From Clients
                </h4>
                <span className="highlights">
                  HomeTalent4U is a digital Platform dedicated to supporting
                  homegrown talent. Whether you make artisanal crafts, bake
                  delicious treats, offer tutoring,
                </span>
              </div>
            </div>
          </div>
          <Slider {...settings}>
            {testimonials.map((item, index) => (
              <div className="testimonial-card" key={index}>
                <div className="quote-icon">
                  <img
                    src="../assets/images//testimonial/iconoir_quote.png"
                    alt="quote"
                  />
                </div>
                <div className="user-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p className="title">{item.title}</p>
                  </div>
                </div>
                <p className="message pt-2">{item.quote}</p>
                <div className="rating pt-3">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`ri-star-fill ${
                        i < item.rating ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="news-area section-padding2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-605 mx-auto position-relative mb-60">
                <h4 className="blue-title pb-2">Blog & Articles</h4>
                <span className="highlights">
                  HomeTalent4U is a digital Platform dedicated to supporting
                  homegrown talent. Whether you make artisanal crafts, bake
                  delicious treats, offer tutoring,
                </span>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <article className="news-card-two">
                <figure className="news-banner-two imgEffect">
                  <Link to="news-details.html">
                    <img
                      src="../assets/images//news/image-1.png"
                      alt="travello"
                    />
                  </Link>
                </figure>
                <div className="news-content">
                  <div className="date d-lg-flex ">
                    <div className="news-info">
                      <p className="date-time">12 Jan 2023</p>
                    </div>
                    <span className="px-15">|</span>
                    <div className="category-name">
                      <span className=" text-primary">Home Talent</span>
                    </div>
                  </div>
                  <h4 className="title mb-2">
                    <Link to="news-details.html">Wedding arrangements</Link>
                  </h4>

                  <div className="news-description">
                    <p className="pera">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                  <div className="">
                    <Link
                      to=""
                      className=" btn-primary-sm btn-primary"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <article className="news-card-two">
                <figure className="news-banner-two imgEffect">
                  <Link to="news-details.html">
                    <img
                      src="../assets/images//news/image-2.png"
                      alt="travello"
                    />
                  </Link>
                </figure>
                <div className="news-content">
                  <div className="date d-lg-flex ">
                    <div className="news-info">
                      <p className="date-time">12 Jan 2023</p>
                    </div>
                    <span className="px-15">|</span>
                    <div className="category-name">
                      <span className=" text-primary">Home Talent</span>
                    </div>
                  </div>
                  <h4 className="title mb-2">
                    <Link to="news-details.html">Wedding arrangements</Link>
                  </h4>

                  <div className="news-description">
                    <p className="pera">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                  <div className="">
                    <Link
                      to=""
                      className=" btn-primary-sm btn-primary"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <article className="news-card-two">
                <figure className="news-banner-two imgEffect">
                  <Link to="news-details.html">
                    <img
                      src="../assets/images//news/image-3.png"
                      alt="travello"
                    />
                  </Link>
                </figure>
                <div className="news-content">
                  <div className="date d-lg-flex ">
                    <div className="news-info">
                      <p className="date-time">12 Jan 2023</p>
                    </div>
                    <span className="px-15">|</span>
                    <div className="category-name">
                      <span className=" text-primary">Home Talent</span>
                    </div>
                  </div>
                  <h4 className="title mb-2">
                    <Link to="news-details.html">Wedding arrangements</Link>
                  </h4>

                  <div className="news-description">
                    <p className="pera">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                  <div className="">
                    <Link
                      to=""
                      className=" btn-primary-sm btn-primary"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
