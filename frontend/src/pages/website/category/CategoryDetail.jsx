import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { useLocation } from "react-router-dom";
import {
  SubmitLead,
  GetStateCity,
  SubmitReview,
} from "../../../Services/webService/Web";
import { GetGallery } from "../../../Services/vendor/Vendor";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CategoryDetail = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("images"); // 👈 Tabs state
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const location = useLocation();
  const vendor = location.state?.vendor?.id;
  const vendors = location.state?.vendor;
  const category = location.state?.category;
  const cityId = location.state?.vendor?.city_id;
  const [cityName, setCityName] = useState("");
  const imageSectionRef = React.useRef(null);

  useEffect(() => {
    const fetchCityName = async () => {
      try {
        const res = await GetStateCity();
        if (res?.status && Array.isArray(res?.data)) {
          const citiesList = res.data.filter((c) => c.type === "city");
          const matchedCity = citiesList.find(
            (city) => String(city.id) === String(cityId)
          );
          setCityName(matchedCity?.name || "Unknown City");
        }
      } catch (error) {
        console.error("Error fetching city name", error);
      }
    };

    if (cityId) {
      fetchCityName();
    }
  }, [cityId]);

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
  });

  const [reviewData, setReviewData] = useState({
    name: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async () => {
    if (!reviewData.name || !reviewData.message) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const payload = {
      ...reviewData,
      vendor_id: vendors?.id || "",
    };

    try {
      const res = await SubmitReview(payload);

      if (res?.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.message || "Review submitted!",
        });
        setReviewData({ name: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.message || "Failed to submit review.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !leadData.name ||
      !leadData.phone ||
      !leadData.email ||
      !leadData.query
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (!/^\d{10}$/.test(leadData.phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Mobile number must be exactly 10 digits.",
      });
      return;
    }

    const payload = {
      ...leadData,
      vendor_id: vendors?.id || "",
    };

    try {
      const res = await SubmitLead(payload);
      if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your Enquiry submitted successfully! ",
        });
        setLeadData({ name: "", phone: "", email: "", query: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.data?.message || "Failed to submit lead.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: vendors?.category_names, to: "#" },
  ];

  // fetch gallery
  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (vendor) {
        try {
          const token = localStorage.getItem("token");
          const res = await GetGallery(token, vendor);

          if (res?.status) {
            setGalleryImages(res?.data);
          }
        } catch (error) {
          console.error("Gallery Fetch Error", error);
        }
      }
    };

    fetchGalleryImages();
  }, [vendor]);

  // separate images & videos
  const imageItems = galleryImages.filter((item) => item.file_type === "image");
  const videoItems = galleryImages.filter((item) => item.file_type === "video");

  const imageSlides = imageItems.map((item) => ({ src: item.file_path }));

  const handleImageClick = (clickedIndex) => {
    setIndex(clickedIndex);
    setOpen(true);
  };

  // visible items with View More
  const visibleImages = showAllImages ? imageItems : imageItems.slice(0, 4);
  const visibleVideos = showAllVideos ? videoItems : videoItems.slice(0, 4);

  const socialLinks = [
    { key: "facebook_link", icon: "fab fa-facebook-f", color: "#1877f2" },
    { key: "instagram_link", icon: "fab fa-instagram", color: "#e4405f" },
    { key: "twitter_link", icon: "fab fa-twitter", color: "#1da1f2" },
    { key: "linkedin_link", icon: "fab fa-linkedin-in", color: "#0077b5" },
    { key: "youtube_link", icon: "fab fa-youtube", color: "#ff0000" },
  ];

  const availableLinks = socialLinks.filter(
    (item) => vendors?.[item.key] && vendors[item.key].trim() !== ""
  );

  return (
    <div>
      <Breadcrumbs title={vendors?.category_names} links={breadcrumbLinks} />
      <section className="tour-details-section section-padding">
        <div className="tour-details-area">
          <div className="tour-details-container">
            <div className="container">
              <div className="mt-30">
                <div className="row g-4">
                  <div className="col-xl-8 col-lg-7">
                    <div className="details-heading">
                      <div className="d-flex flex-column">
                        {location.state?.vendor?.image && (
                          <div
                            style={{
                              width: "100%",
                              height: "400px",
                              overflow: "hidden",
                              borderRadius: "10px",
                            }}
                          >
                            <img
                              src={location.state.vendor.image}
                              alt="Vendor Image"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}

                        <h4 className="title text-capitalize mt-4">
                          {location.state?.vendor?.owner_name ||
                            "Unknown Vendor"}
                        </h4>

                        <div className="d-flex flex-wrap align-items-center gap-20 mt-8">
                          <div className="location d-flex align-items-center ">
                            <i
                              className="ri-map-pin-line"
                              style={{ color: "#ff5e14" }}
                            />
                            <div className="name text-capitalize">
                              {cityName}
                            </div>
                          </div>

                          <div className="divider" />
                        </div>
                        <div>
                          <h4 className="title text-capitalize mt-2">
                            {vendors?.category_names}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="tour-details-content mt-15">
                      <p className="pera ">{vendors?.short_description}</p>
                    </div>

                    <div className="price-review ">
                      <div className="d-flex  align-items-end">
                        <h3 className="title">Estimated Price Range -</h3>
                        <h3 className="title">₹{vendors?.price_range}</h3>
                      </div>
                      <div className="rating">
                        <p className="pera">Experience Since -</p>
                        <p className="pera">{vendors?.experience_since}</p>
                      </div>
                    </div>

                    <div className="tour-details-content mt-10">
                      <h4 className="title">About</h4>
                      <p className="pera ">{vendors?.long_description}</p>
                    </div>

                    {/* GALLERY SECTION WITH TABS */}
                    {/* GALLERY SECTION WITH TABS */}
                    {(imageItems.length > 0 || videoItems.length > 0) && (
                      <div
                        className="tour-details-content mt-4"
                        ref={imageSectionRef}
                      >
                        <h4 className="title mb-3">Gallery</h4>

                        {/* Tabs - Agar sirf ek hi type ka content hai to ek hi tab show hoga */}
                        <div className="d-flex gap-3 mb-3">
                          {imageItems.length > 0 && (
                            <button
                              className={`btn ${
                                activeTab === "images"
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => setActiveTab("images")}
                            >
                              Images
                            </button>
                          )}
                          {videoItems.length > 0 && (
                            <button
                              className={`btn ${
                                activeTab === "videos"
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => setActiveTab("videos")}
                            >
                              Videos
                            </button>
                          )}
                        </div>

                        {/* Images Tab */}
                        {activeTab === "images" && imageItems.length > 0 && (
                          <>
                            <div className="row g-4">
                              {visibleImages.map((item, i) => (
                                <div className="col-lg-3 col-sm-6" key={i}>
                                  <div
                                    className="shadow-sm"
                                    style={{
                                      height: "200px",
                                      overflow: "hidden",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleImageClick(i)}
                                  >
                                    <img
                                      src={item?.file_path}
                                      alt={`Gallery ${i}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {imageItems.length > 4 && (
                              <div className="text-center mt-3">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (showAllImages) {
                                      setShowAllImages(false);
                                      setTimeout(() => {
                                        imageSectionRef.current?.scrollIntoView(
                                          {
                                            behavior: "smooth",
                                          }
                                        );
                                      }, 100);
                                    } else {
                                      setShowAllImages(true);
                                    }
                                  }}
                                >
                                  {showAllImages ? "View Less" : "View All"}
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        {/* Videos Tab */}
                        {activeTab === "videos" && videoItems.length > 0 && (
                          <>
                            <div className="row g-4">
                              {visibleVideos.map((item, i) => (
                                <div className="col-lg-3 col-sm-6" key={i}>
                                  <div
                                    className="shadow-sm"
                                    style={{
                                      height: "200px",
                                      overflow: "hidden",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <video
                                      controls
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    >
                                      <source
                                        src={item?.file_path}
                                        type="video/mp4"
                                      />
                                    </video>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {videoItems.length > 4 && (
                              <div className="text-center mt-3">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (showAllVideos) {
                                      setShowAllVideos(false);
                                      setTimeout(() => {
                                        imageSectionRef.current?.scrollIntoView(
                                          {
                                            behavior: "smooth",
                                          }
                                        );
                                      }, 100);
                                    } else {
                                      setShowAllVideos(true);
                                    }
                                  }}
                                >
                                  {showAllVideos ? "View Less" : "View All"}
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        {/* Lightbox for Images */}
                        {open && (
                          <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            slides={imageSlides}
                            index={index}
                          />
                        )}
                      </div>
                    )}

                    {availableLinks.length > 0 && (
                      <div className="tour-details-content mt-10">
                        <h4 className="title">Social Media & Links</h4>

                        <div className="d-flex flex-wrap">
                          {availableLinks.map(({ key, icon, color }) => {
                            const link = vendors?.[key];
                            const fullUrl = link.startsWith("http")
                              ? link
                              : `https://${link}`;

                            return (
                              <div key={key} className="me-3 mb-2">
                                <a
                                  href={fullUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-outline-secondary w-100 rounded-3 p-3 text-decoration-none d-flex align-items-center gap-3 hover-lift"
                                  style={{
                                    borderColor: color + "30",
                                    transition: "all 0.3s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      color + "10";
                                    e.currentTarget.style.borderColor = color;
                                    e.currentTarget.style.color = color;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.borderColor =
                                      color + "30";
                                    e.currentTarget.style.color = "";
                                  }}
                                >
                                  <i className={icon} style={{ color }}></i>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SIDEBAR - Lead Form & Review Form */}
                  <div className="col-xl-4 col-lg-5">
                    <div className="date-travel-card ">
                      <h4 className="heading-card">Get In Touch</h4>

                      <div className="date-time-dropdown d-flex align-items-center gap  -2">
                        <i className="ri-user-line fs-8" />
                        <input
                          type="text"
                          name="name"
                          value={leadData.name}
                          placeholder="Enter your name"
                          className="form-control form-control-m border-0 shadow-none"
                          onChange={(e) => {
                            const { name, value } = e.target;
                            if (/^[a-zA-Z\s]*$/.test(value)) {
                              setLeadData((prev) => ({
                                ...prev,
                                [name]: value,
                              }));
                            }
                          }}
                        />
                      </div>

                      <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                        <i className="ri-phone-line fs-8" />
                        <input
                          type="text"
                          name="phone"
                          value={leadData.phone}
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setLeadData((prev) => ({
                              ...prev,
                              phone: value,
                            }));
                          }}
                          placeholder="Enter your mobile number"
                          className="form-control form-control-m border-0 shadow-none"
                        />
                      </div>

                      <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                        <i className="ri-mail-line fs-8" />
                        <input
                          type="email"
                          name="email"
                          value={leadData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="form-control form-control-m border-0 shadow-none"
                        />
                      </div>

                      <div className="date-time-dropdown d-flex align-items-start gap-2 mt-2">
                        <i className="ri-chat-3-line fs-8 mt-1" />
                        <textarea
                          name="query"
                          value={leadData.query}
                          onChange={handleChange}
                          placeholder="Enter your message or query"
                          className="form-control form-control-m border-0 shadow-none"
                          rows="3"
                        />
                      </div>

                      <div className="mt-30">
                        <button
                          type="button"
                          className="send-btn w-100"
                          onClick={handleSubmit}
                        >
                          Check Availability
                        </button>
                      </div>
                    </div>

                    <div className="date-travel-card mt-5">
                      <h4 className="heading-card">Your Review</h4>

                      <div className="date-time-dropdown d-flex align-items-center gap-2">
                        <i className="ri-user-line fs-8" />
                        <input
                          type="text"
                          name="name"
                          value={reviewData.name}
                          placeholder="Enter your name"
                          className="form-control form-control-m border-0 shadow-none"
                          onChange={(e) =>
                            setReviewData((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="date-time-dropdown d-flex align-items-start gap-2 mt-2">
                        <i className="ri-chat-3-line fs-8 mt-1" />
                        <textarea
                          name="message"
                          value={reviewData.message}
                          onChange={handleReviewChange}
                          placeholder="Enter your review"
                          className="form-control form-control-m border-0 shadow-none"
                          rows="3"
                        />
                      </div>

                      <div className="mt-30">
                        <button
                          type="button"
                          className="send-btn w-100"
                          onClick={handleSubmitReview}
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
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

export default CategoryDetail;
