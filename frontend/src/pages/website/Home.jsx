import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GetAllApprovedReview,
  GetStateCity,
} from "../../Services/webService/Web";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetCategories } from "../../Services/webService/Web";
import { GetAllAdminBlog } from "../../Services/admin/Admin";
import Swal from "sweetalert2";

const Home = () => {
  const token = localStorage.getItem("token");
  const [statecity, setStateCity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const categorySectionRef = useRef(null);
  const blogSectionRef = useRef(null);
  const [review, setReview] = useState([]);
  const [blog, setBlog] = useState([]);
  const [showAllBlog, setShowAllBlog] = useState(false);
  const [blogdata, setBlogData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const dropdownRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchstatecity = async () => {
    try {
      const response = await GetStateCity();
      setStateCity(response?.data);
    } catch (error) {
      console.log("Error fetching cities", error);
    }
  };

  const fetchcategories = async () => {
    try {
      const response = await GetCategories(token);
      setCategories(response?.data);
      setCategoryData(response?.data);
    } catch (error) {
      console.log("Error fetching services", error);
    }
  };

  const navigate = useNavigate();

  const handleFindNow = () => {
    const selectedCityObj = statecity.find(
      (item) =>
        item.type === "city" &&
        item.name.toLowerCase() === search.trim().toLowerCase()
    );

    const cityId = selectedCityObj ? selectedCityObj.id : null;

    if (!selectedCategory && !cityId) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please select at least a category or a city before proceeding!",
        confirmButtonText: "OK",
      });
      return;
    }

    navigate("/category", {
      state: {
        categoryId: selectedCategory ? Number(selectedCategory) : null,
        cityId: cityId,
      },
    });
  };

  const fetchReview = async () => {
    try {
      const response = await GetAllApprovedReview(token);
      setReview(response?.data);
    } catch (error) {
      console.log("Error fetching review");
    }
  };

  const fetchblog = async () => {
    try {
      const res = await GetAllAdminBlog(token);
      const activeBlogs = res?.data?.filter((blog) => blog.status === 1);
      setBlog(activeBlogs);
      setBlogData(activeBlogs);
    } catch (error) {
      console.log("Error in fetching blogs", error);
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  function groupedFilteredData(data, search = "") {
    const searchLower = search.toLowerCase();
    const groups = [];

    let currentGroup = null;

    data?.forEach((item) => {
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
        ?.map((group) => {
          const stateMatch = group.state.name
            .toLowerCase()
            .includes(searchLower);
          const matchedCities = group.cities?.filter((city) =>
            city?.name.toLowerCase().includes(searchLower)
          );

          if (stateMatch) return group;
          if (matchedCities.length > 0)
            return { state: group.state, cities: matchedCities };
          return null;
        })
        ?.filter(Boolean);
    }

    return groups;
  }

  useEffect(() => {
    fetchstatecity();
    fetchcategories();
    fetchblog();
    fetchReview();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: review?.length > 3,
    speed: 800,
    slidesToShow: Math.min(3, review?.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    swipeToSlide: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    appendDots: (dots) => (
      <ul style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        {dots.slice(0, 3)}
      </ul>
    ),
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
                <div className="choose-plan-nav mt-4">
                  <div className="">
                    <div className="row g-4 justify-content-center">
                      <div className="col-xl-5 col-lg-6 col-md-6 col-sm-12 ">
                        <div
                          className="position-relative"
                          style={{ width: "100%" }}
                          ref={dropdownRef}
                        >
                          <input
                            type="text"
                            className="form-control custom-input-select cursor-pointer"
                            placeholder="Search City"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                          />

                          {showDropdown && (
                            <div
                              className="border bg-white p-3 pt-3 shadow position-absolute"
                              style={{
                                maxHeight: "400px",
                                overflowY: "auto",
                                zIndex: 10,
                                width: "600px", // only matches the input width
                                marginTop: "2px", // small gap below input
                                left: 0,
                              }}
                            >
                              <ul
                                className="list-unstyled"
                                style={{ columnCount: 3 }}
                              >
                                {groupedFilteredData(statecity, search)?.map(
                                  (group) => (
                                    <li key={`group-${group.state.id}`}>
                                      <h6 className="text-danger mb-1 mt-2">
                                        {group.state.name}
                                      </h6>
                                      <ul className="list-unstyled ms-3 ps-0">
                                        {group.cities?.map((city) => (
                                          <li key={`city-${city.id}`}>
                                            <button
                                              type="button"
                                              className="dropdown-item py-1 text-nowrap"
                                              onMouseDown={() => {
                                                setSearch(city.name);
                                                setShowDropdown(false);
                                              }}
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
                      </div>

                      <div className="col-xl-5 col-lg-12">
                        <div className="destination-flex">
                          <select
                            className="form-select custom-input-select"
                            value={selectedCategory}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                          >
                            <option value="">Select Category</option>
                            {Array.isArray(categories) &&
                              categories?.map((cat) => {
                                const categoryId =
                                  cat.id || cat._id || cat.categoryId;
                                return (
                                  <option key={categoryId} value={categoryId}>
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
                            className="btn-primary w-100 text-center d-block"
                            style={{ height: "54px", lineHeight: "30px" }}
                            onClick={handleFindNow}
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

      <section className="category-area " ref={categorySectionRef}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-auto position-relative">
                <h4 className="blue-title">Explore Talented Home Creators by Category</h4>
                <span className="highlights">
                  From handmade crafts and artisanal products to personalized services and home-based skills—discover authentic local makers and providers
                </span>
              </div>
            </div>
          </div>

          <div className="grid5-container">
            {(showAllCategories
              ? categoryData
              : categoryData?.slice(0, 10)
            )?.map((category) => {
              return (
                <div
                  className="grid-item"
                  key={category.id || category._id || category.name}
                >
                  <Link
                    to="/category"
                    state={{ categoryId: category.id || category._id }}
                    className="category-banner"
                  >
                    <img
                      loading="lazy"
                      src={category.image_url} // directly from API
                      alt={category.name}
                      className="your-class-name"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/default-category.png"; // fallback image
                      }}
                    />

                    <div className="category-content">
                      <div className="category-info p-15">
                        <div className="category-name">
                          <p className="pera mb-0">{category.name}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {categoryData?.length > 10 && (
            <div className="text-center mt-3">
              <button
                onClick={() => {
                  setShowAllCategories((prev) => {
                    const newState = !prev;
                    if (!newState) scrollToSection(categorySectionRef);
                    return newState;
                  });
                }}
                className="btn btn-primary"
              >
                {showAllCategories ? "View Less" : "View All Categories"}
              </button>
            </div>
          )}
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
                  <Link to="/about">Read More...</Link>
                </div>
              </div>
            </div>
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
                  Connecting Through Stories and Reviews Join the conversation
                  and see the impact of HomeTalent4u through the eyes of our
                  users.
                </span>
              </div>
            </div>
          </div>
          <Slider {...settings}>
            {review?.map((item, index) => (
              <div
                key={item.id || item._id || `${item.name}-${index}`}
                className="p-2"
              >
                <div
                  className="testimonial-card"
                  style={{
                    background: "#f9f9f9",
                    borderRadius: "16px",
                    padding: "35px 25px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    minHeight: "230px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Floating Quote Icon */}
                  <img
                    src="/assets/images/testimonial/iconoir_quote.png"
                    alt="quote"
                    style={{
                      width: "40px",
                      opacity: 0.08,
                      position: "absolute",
                      top: "25px",
                      right: "25px",
                    }}
                  />

                  {/* User Info */}
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center text-white"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #007BFF, #00C6FF)",
                        fontSize: "26px",
                        flexShrink: 0,
                      }}
                    >
                      <i className="ri-user-line"></i>
                    </div>
                    <div className="ms-3">
                      <h5
                        className="mb-1"
                        style={{
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          color: "#333",
                        }}
                      >
                        {item.name}
                      </h5>

                      {/* Star Rating After Name */}
                      <div>
                        {[...Array(5)].map((_, starIndex) => (
                          <i
                            key={starIndex}
                            className={`ri-star-${starIndex < item.rating ? "fill" : "line"}`}
                            style={{
                              color: "#FFC107",
                              fontSize: "1rem",
                              marginRight: "2px",
                            }}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <p
                      className="text-muted"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.8",
                        color: "#555",
                        marginBottom: 0,
                      }}
                    >
                      {isExpanded || item.message?.length <= 200
                        ? item.message
                        : `${item.message.slice(0, 140)}...`}
                    </p>
                    {item.message?.length > 200 && (
                      <button
                        onClick={toggleReadMore}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#007bff",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: "0.9rem",
                        }}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>

        </div>
      </section>

      <section className="news-area section-padding2 mt-4" ref={blogSectionRef}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-605 mx-auto position-relative mb-60">
                <h4 className="blue-title pb-2 mt-4">Blog & Articles</h4>
                <span className="highlights">
                  At HomeTalent4U, we share tips, stories, and insights to help
                  you grow your creativity into success.
                </span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {(showAllBlog ? blogdata : blogdata?.slice(0, 3))?.map(
              (item, index) => (
                <div
                  className="col-xl-4 col-lg-4 col-sm-6 pb-3"
                  key={item.id || item._id || index}
                >
                  <article className="news-card-two">
                    <figure className="news-banner-two imgEffect">
                      <Link to={`/blogdetail/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "230px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </figure>
                    <div className="news-content">
                      <div className="date d-flex ">
                        <div className="news-info">
                          <p className="date-time">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <span className="px-5">|</span>
                        <div className="category-name">
                          <span className=" text-primary">Home Talent</span>
                        </div>
                      </div>
                      <h4 className="title mb-2">
                        <Link
                          to={`/blogdetail/${item.id}`}
                          className="clamp-title"
                        >
                          {item.title}
                        </Link>
                      </h4>
                      <div className="news-description">
                        <p className="pera clamp-description ">
                          {item.short_description?.slice(0, 100)}...
                        </p>
                      </div>
                      <div className="">
                        <Link
                          to={`/blogdetail/${item.id}`}
                          className=" btn-primary-sm btn-primary"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )
            )}
          </div>

          {blogdata?.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => {
                  setShowAllBlog((prev) => {
                    const newState = !prev;
                    if (!newState) scrollToSection(blogSectionRef);
                    return newState;
                  });
                }}
                className="btn btn-primary test12"
              >
                {showAllBlog ? "View Less" : "View All Blogs"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
