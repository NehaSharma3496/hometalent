import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { useLocation } from "react-router-dom";
import {
  SubmitLead,
  GetStateCity,
  SubmitReview,
  SubmitReport,
  Submitotp,
  GetReviewCount,
} from "../../../Services/webService/Web";
import { GetGallery, GetVendorDetails } from "../../../Services/vendor/Vendor";
import { GetActiveVendors } from "../../../Services/admin/Admin";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CategoryDetail = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeTabs, setActiveTabs] = useState("images");
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const location = useLocation();
  const vendorId = location.state?.vendorId;
  const [cityName, setCityName] = useState("");
  const imageSectionRef = React.useRef(null);
  const [vendorData, setVendorData] = useState(null);
  const [vendorNotFound, setVendorNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [reviewcount, setReviewCount] = useState("");

  const fetchreviewcount = async () => {
    try {
      const res = await GetReviewCount(token, vendorId);
      setReviewCount(res?.averageRating);
      console.log("Review Count", res);
    } catch (error) {
      console.error("Error fetching review count", error);
    }
  };
  console.log("Review", reviewcount);

  const [activeTab, setActiveTab] = useState("review");
  const [reviewForm, setReviewForm] = useState({
    vendor_id: vendorId,
    name: "",
    email: "",
    phone: "",
    message: "",
    rating: 0,
  });
  const [reviewOtp, setReviewOtp] = useState("");
  const [isReviewOtpSent, setIsReviewOtpSent] = useState(false);
  const [isReviewOtpVerified, setIsReviewOtpVerified] = useState(false);
  const [reviewServerOtp, setReviewServerOtp] = useState("");

  const [reportOtp, setReportOtp] = useState("");
  const [isReportOtpSent, setIsReportOtpSent] = useState(false);
  const [isReportOtpVerified, setIsReportOtpVerified] = useState(false);
  const [reportServerOtp, setReportServerOtp] = useState("");

  const sendReviewOtp = async () => {
    try {
      if (!/^\d{10}$/.test(reviewForm.phone)) {
        Swal.fire("Invalid!", "Enter a valid 10-digit phone number.", "error");
        return;
      }
      const res = await Submitotp({ phone: reviewForm.phone, type: "review" });
      if (res?.status) {
        setIsReviewOtpSent(true);
        setReviewServerOtp(res.otp);
        setIsReviewOtpVerified(false);
        Swal.fire("Success", "Verification code sent via Cegano Technology Enter the OTP to continue.", "success");
      } else if (res?.msg?.toLowerCase().includes("already verify")) {
        setIsReviewOtpVerified(true);
        setIsReviewOtpSent(false);
        Swal.fire("Info", "Mobile already verified", "info");
      } else {
        Swal.fire("Failed!", res?.msg || "OTP not sent", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while sending OTP", "error");
    }
  };

  const sendReportOtp = async () => {
    try {
      if (!/^\d{10}$/.test(reportForm.phone)) {
        Swal.fire("Invalid!", "Enter a valid 10-digit phone number.", "error");
        return;
      }
      const res = await Submitotp({ phone: reportForm.phone, type: "report" });
      if (res?.status) {
        setIsReportOtpSent(true);
        setReportServerOtp(res.otp);
        setIsReportOtpVerified(false);
        Swal.fire("Success", "Verification code sent via Cegano Technology Enter the OTP to continue.", "success");
      } else if (res?.msg?.toLowerCase().includes("already verify")) {
        setIsReportOtpVerified(true);
        setIsReportOtpSent(false);
        Swal.fire("Info", "Mobile already verified", "info");
      } else {
        Swal.fire("Failed!", res?.msg || "OTP not sent", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while sending OTP", "error");
    }
  };

  const verifyReviewOtp = () => {
    if (reviewOtp == reviewServerOtp) {
      setIsReviewOtpVerified(true);
      Swal.fire("Verified!", "Mobile number verified successfully", "success");
    } else {
      Swal.fire("Invalid OTP", "Please enter correct OTP", "error");
    }
  };

  const verifyReportOtp = () => {
    if (reportOtp == reportServerOtp) {
      setIsReportOtpVerified(true);
      Swal.fire("Verified!", "Mobile number verified successfully", "success");
    } else {
      Swal.fire("Invalid OTP", "Please enter correct OTP", "error");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (
      !reviewForm.name.trim() ||
      !reviewForm.email.trim() ||
      !reviewForm.phone.trim() ||
      !reviewForm.message.trim() ||
      !reviewForm.rating
    ) {
      Swal.fire("Error", "All fields are mandatory", "warning");
      return;
    }

    if (!isReviewOtpVerified) {
      Swal.fire("OTP Required", "Please verify your mobile number", "warning");
      return;
    }

    try {
      const res = await SubmitReview(reviewForm);
      if (res?.status) {
        Swal.fire("Success!", "Review submitted successfully!", "success");
        setReviewForm({
          vendor_id: vendorId,
          name: "",
          email: "",
          phone: "",
          message: "",
          rating: 0,
        });
        setIsReviewOtpSent(false);
        setIsReviewOtpVerified(false);
        setReviewOtp("");
      } else {
        Swal.fire(
          "Failed!",
          res?.message || "Unable to submit review",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Something went wrong while submitting the review",
        "error"
      );
    }
  };

  const [reportForm, setReportForm] = useState({
    vendor_id: vendorId,
    name: "",
    phone: "",
    reason: "",
  });

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    if (!isReportOtpVerified) {
      Swal.fire("OTP Required", "Please verify your mobile number", "warning");
      return;
    }

    if (
      !reportForm.name.trim() ||
      !reportForm.phone.trim() ||
      !reportForm.reason.trim()
    ) {
      Swal.fire("Error", "All fields are mandatory", "warning");
      return;
    }

    try {
      const res = await SubmitReport(reportForm);
      if (res?.status) {
        Swal.fire("Success!", "Report submitted successfully!", "success");
        setReportForm({
          vendor_id: vendorId,
          name: "",
          phone: "",
          reason: "",
        });
        setIsReportOtpSent(false);
        setIsReportOtpVerified(false);
        setReportOtp("");
      } else {
        Swal.fire(
          "Failed!",
          res?.message || "Unable to submit report",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Something went wrong while submitting the report",
        "error"
      );
    }
  };

  const fetchVendorDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await GetVendorDetails(token, vendorId);

      // Check if vendor exists and is active
      if (res?.data && res?.data?.user) {
        // Check vendor status - adjust these conditions based on your API response
        const isVendorActive = res.data.user.is_active === 1 ||
          res.data.user.is_active === true ||
          res.data.user.status === 'active' ||
          res.data.user.status === 1 ||
          res.data.user.active === 1 ||
          res.data.user.active === true;

        if (isVendorActive) {
          setVendorData(res.data);
          setVendorNotFound(false);
        } else {
          setVendorData(null);
          setVendorNotFound(true);
        }
      } else {
        setVendorData(null);
        setVendorNotFound(true);
      }
    } catch (error) {
      console.error("Vendor details fetch error", error);
      setVendorData(null);
      setVendorNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Vendor data ", vendorData);

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    } else {
      setVendorNotFound(true);
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorData && !vendorNotFound) {
      fetchreviewcount();
    }
  }, [vendorData, vendorNotFound]);

  console.log("Vendor Data:", vendorData);

  useEffect(() => {
    const fetchCityName = async () => {
      try {
        const res = await GetStateCity();
        if (res?.status && Array.isArray(res?.data)) {
          const citiesList = res.data.filter((c) => c.type === "city");
          const matchedCity = citiesList.find(
            (city) => String(city.id) === String(vendorData?.user?.city_id)
          );
          setCityName(matchedCity?.name || "");
        }
      } catch (error) {
        console.error("Error fetching city name", error);
      }
    };

    if (vendorData?.user?.city_id) {
      fetchCityName();
    }
  }, [vendorData]);

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !leadData.name ||
      !leadData.phone ||
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
      vendor_id: vendorData?.user?.id || "",
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
    { label: vendorData?.user?.category_name || "Category", to: "#" },
  ];

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await GetGallery(token, vendorId);
        if (res?.status) {
          setGalleryImages(res?.data);
        }
      } catch (error) {
        console.error("Gallery Fetch Error", error);
      }
    };

    if (vendorId && !vendorNotFound) fetchGalleryImages();
  }, [vendorId, vendorNotFound]);

  const imageItems = galleryImages.filter((item) => item.file_type === "image");
  const videoItems = galleryImages.filter((item) => item.file_type === "video");

  const imageSlides = imageItems.map((item) => ({ src: item.file_path }));

  const handleImageClick = (clickedIndex) => {
    setIndex(clickedIndex);
    setOpen(true);
  };

  const visibleImages = showAllImages ? imageItems : imageItems.slice(0, 4);
  const visibleVideos = showAllVideos ? videoItems : videoItems.slice(0, 4);

  const socialLinks = [
    { key: "facebook_link", icon: "fab fa-facebook-f", color: "#1877f2" },
    { key: "instagram_link", icon: "fab fa-instagram", color: "#e4405f" },
    { key: "twitter_link", icon: "fab fa-twitter", color: "#1da1f2" },
    { key: "linkedin_link", icon: "fab fa-linkedin-in", color: "#0077b5" },
    { key: "youtube_link", icon: "fab fa-youtube", color: "#ff0000" },
  ];

  const availableLinks = socialLinks?.filter(
    (item) =>
      vendorData?.user?.[item.key] && vendorData.user[item.key].trim() !== ""
  );

  // Show loading state
  if (isLoading) {
    return (
      <div>
        <Breadcrumbs
          title="Loading..."
          links={[{ label: "Home", to: "/" }, { label: "Loading...", to: "#" }]}
        />
        <section className="tour-details-section section-padding section-padding1">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                  <div>
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="text-muted">Loading vendor details...</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Show "No vendor found" message if vendor doesn't exist or is inactive
  if (vendorNotFound || !vendorData) {
    return (
      <div>
        <Breadcrumbs
          title="Vendor Not Found"
          links={[{ label: "Home", to: "/" }, { label: "Vendor Not Found", to: "#" }]}
        />
        <section className="tour-details-section section-padding">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="text-center" style={{ minHeight: "500px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="mb-4">
                    <i className="ri-error-warning-line" style={{ fontSize: "120px", color: "#ff6b6b" }}></i>
                  </div>
                  <h2 className="text-danger mb-3 fw-bold">Vendor Not Found</h2>
                  <p className="text-muted mb-4 lead">
                    Sorry, the vendor you're looking for is not available or has been deactivated.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center align-items-center mt-4">
                    <a
                      href="/"
                      className="btn btn-primary d-flex align-items-center gap-4 py-3 px-4 "
                    >
                      <i className="ri-home-line fs-5"></i>
                      <span>Back to Home</span>
                    </a>

                    <button
                      onClick={() => window.history.back()}
                      className="btn btn-outline-secondary d-flex align-items-center gap-2 py-2 px-4"
                    >
                      <i className="ri-arrow-left-line fs-5"></i>
                      <span>Go Back</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        title={vendorData?.user?.category_name}
        links={breadcrumbLinks}
      />
      <section className="tour-details-section section-padding">
        <div className="tour-details-area">
          <div className="tour-details-container">
            <div className="container">
              <div className="mt-30">
                <div className="row g-4">
                  <div className="col-xl-8 col-lg-7">
                    <div className="details-heading d-block">
                      <div className="d-flex flex-column">
                        {vendorData?.user?.image && (
                          <div
                            style={{
                              width: "100%",
                              height: "400px",
                              overflow: "hidden",
                              borderRadius: "10px",
                            }}
                          >
                            <img
                              src={vendorData?.user?.image}
                              alt="Vendor Image"
                              style={{
                                width: "100%",
                                height: "100%",
                                // objectFit: "cover",
                              }}
                            />
                          </div>
                        )}

                        <h4 className="title text-capitalize mt-4 d-flex align-items-center">
                          {vendorData?.user?.owner_name}

                          {reviewcount && (
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: "#2278b6",
                                padding: "4px 10px",
                                marginLeft: "190px",
                                fontSize: "14px",
                                color: "#fff",
                                fontWeight: "600",
                              }}
                            >
                              <i
                                className="ri-star-fill"
                                style={{
                                  color: "#FFD700",
                                  fontSize: "18px",
                                  marginRight: "6px",
                                }}
                              />
                              {parseFloat(reviewcount).toFixed(1)}{" "}
                              <span
                                style={{ fontWeight: "400", marginLeft: "2px" }}
                              ></span>
                            </div>
                          )}
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
                            {vendorData?.user?.category_name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* <div className="tour-details-content mt-15">
                      <p className="detail-text">
                        {vendorData?.user?.short_description}
                      </p>
                    </div> */}

                    <div className="price-review ">
                      <div className="d-flex align-items-end">
                        <h3 className="title">Estimated Price Range -</h3>
                        <h3 className="title fw-bold">
                          {vendorData?.user?.price_range
                            ? `₹${vendorData.user.price_range}`
                            : "Please contact for price"}
                        </h3>
                      </div>
                      <div className="rating">
                        <p className="detail-text">Experience Since -</p>
                        <p className="detail-text">
                          {vendorData?.user?.experience_since || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="tour-details-content mt-10">
                      <h4 className="title">About</h4>
                      <p className="detail-text">
                        {vendorData?.user?.long_description}
                      </p>
                    </div>

                    {(imageItems?.length > 0 || videoItems?.length > 0) && (
                      <div
                        className="tour-details-content mt-4"
                        ref={imageSectionRef}
                      >
                        <h4 className="title mb-3">Gallery</h4>

                        <div className="d-flex gap-3 mb-3 mt-4">
                          {imageItems?.length > 0 && (
                            <button
                              className={`btn ${activeTabs === "images"
                                ? "btn-primary"
                                : "btn-outline-primary"
                                } mb-4`}
                              onClick={() => setActiveTabs("images")}
                            >
                              Images
                            </button>
                          )}
                          {videoItems?.length > 0 && (
                            <button
                              className={`btn ${activeTabs === "videos"
                                ? "btn-primary"
                                : "btn-outline-primary"
                                } mb-4`}
                              onClick={() => setActiveTabs("videos")}
                            >
                              Videos
                            </button>
                          )}
                        </div>

                        {activeTabs === "images" && imageItems?.length > 0 && (
                          <>
                            <div className="row g-4">
                              {visibleImages?.map((item, i) => (
                                <div className="col-lg-3 col-sm-6 mb-2" key={i}>
                                  <div
                                    className="shadow-sm mt-2"
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

                            {imageItems?.length > 4 && (
                              <div className="text-center mt-3 mb-3 pt-1">
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

                        {activeTabs === "videos" && videoItems?.length > 0 && (
                          <>
                            <div className="row g-4">
                              {visibleVideos?.map((item, i) => (
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

                            {videoItems?.length > 4 && (
                              <div className="text-center mt-3">
                                <button
                                  className="btn btn-primary "
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

                    {availableLinks?.length > 0 && (
                      <div className="tour-details-content mt-10">
                        <h4 className="title">Social Media & Links</h4>

                        <div className="d-flex flex-wrap">
                          {availableLinks?.map(({ key, icon, color }) => {
                            const link = vendorData?.user?.[key];
                            const fullUrl = link.startsWith("http")
                              ? link
                              : `https://${link}`;

                            return (
                              <div key={key} className=" mb-2">
                                <a
                                  href={fullUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-outline-secondary w-100  rounded-3 p-2 text-decoration-none d-flex align-items-center gap-3 hover-lift"
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

                  <div className="col-xl-4 col-lg-5">
                    <div className="date-travel-card ">
                      <h4 className="heading-card">Get In Touch</h4>

                      <div className="date-time-dropdown d-flex align-items-center gap-2">
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

                      <div className="custom-terms mt-3">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={leadData.terms || false}
                          onChange={(e) =>
                            setLeadData((prev) => ({
                              ...prev,
                              terms: e.target.checked,
                            }))
                          }
                        />
                        <label htmlFor="terms">
                          I agree to the{" "}
                          <a
                            href="/termscondition"
                            target="_self"
                            rel="noopener noreferrer"
                            className="terms-link"
                          >
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacypolicy"
                            target="_self"
                            rel="noopener noreferrer"
                            className="terms-link"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      <div className="mt-30">
                        <button
                          type="button"
                          className="send-btn w-100"
                          onClick={() => {
                            if (!leadData.terms) {
                              Swal.fire({
                                icon: "warning",
                                title: "Terms Required",
                                text: "Please agree to the Terms and Conditions before submitting.",
                              });
                              return;
                            }
                            handleSubmit();
                          }}
                        >
                          Contact Vendor
                        </button>
                      </div>
                    </div>

                    <div className="date-travel-card mt-4">
                      <div className="tabs d-flex gap-2 mb-3 gap-10">
                        <button
                          className={`btn ${activeTab === "review"
                            ? "btn-primary"
                            : "btn-outline-primary"
                            }`}
                          onClick={() => setActiveTab("review")}
                        >
                          Review
                        </button>
                        <button
                          className={`btn ${activeTab === "report"
                            ? "btn-primary"
                            : "btn-outline-primary"
                            }`}
                          onClick={() => setActiveTab("report")}
                        >
                          Report
                        </button>
                      </div>

                      {activeTab === "review" && (
                        <form onSubmit={handleSubmitReview}>
                          <div className="mb-3 required">
                            <label className="fw-bold d-block">Rating:</label>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                style={{
                                  cursor: "pointer",
                                  color:
                                    reviewForm.rating >= star ? "gold" : "gray",
                                  fontSize: "40px",
                                }}
                                onClick={() =>
                                  setReviewForm({ ...reviewForm, rating: star })
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                            <i className="ri-user-line fs-8" />
                            <input
                              type="text"
                              placeholder="Enter your name"
                              value={reviewForm.name}
                              className="form-control form-control-m border-0 shadow-none"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z\s]*$/.test(value)) {
                                  setReviewForm({
                                    ...reviewForm,
                                    name: value,
                                  });
                                }
                              }}
                              required
                            />
                          </div>

                          <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                            <i className="ri-mail-line fs-8" />
                            <input
                              type="email"
                              placeholder="Enter your email"
                              value={reviewForm.email}
                              className="form-control form-control-m border-0 shadow-none"
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                            <i className="ri-phone-line fs-8" />
                            <input
                              type="text"
                              placeholder="Enter your mobile number"
                              value={reviewForm.phone}
                              maxLength={10}
                              className="form-control form-control-m border-0 shadow-none"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setReviewForm({
                                  ...reviewForm,
                                  phone: value,
                                });
                              }}
                              required
                              disabled={isReviewOtpVerified}
                            />
                          </div>

                          <div className="mt-3">
                            {isReviewOtpVerified ? (
                              <p className="text-success fw-bold">
                                ✅ Mobile Verified
                              </p>
                            ) : !isReviewOtpSent ? (
                              <button
                                type="button"
                                className="btn btn-outline-primary w-100"
                                onClick={sendReviewOtp}
                              >
                                Send OTP
                              </button>
                            ) : (
                              <div className="d-flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter OTP"
                                  value={reviewOtp}
                                  className="form-control"
                                  onChange={(e) => setReviewOtp(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={verifyReviewOtp}
                                >
                                  Verify
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="date-time-dropdown d-flex align-items-start gap-2 mt-3">
                            <i className="ri-chat-3-line fs-8 mt-1" />
                            <textarea
                              placeholder="Enter your message or query"
                              value={reviewForm.message}
                              className="form-control form-control-m border-0 shadow-none"
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  message: e.target.value,
                                })
                              }
                              rows="3"
                            />
                          </div>

                          <div className="mt-3">
                            <button type="submit" className="send-btn w-100">
                              Submit Review
                            </button>
                          </div>
                        </form>
                      )}

                      {activeTab === "report" && (
                        <form onSubmit={handleSubmitReport}>
                          <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                            <i className="ri-user-line fs-8" />
                            <input
                              type="text"
                              placeholder="Enter your name"
                              value={reportForm.name}
                              className="form-control form-control-m border-0 shadow-none"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z\s]*$/.test(value)) {
                                  setReportForm({
                                    ...reportForm,
                                    name: value,
                                  });
                                }
                              }}
                              required
                            />
                          </div>

                          <div className="date-time-dropdown d-flex align-items-center gap-2 mt-2">
                            <i className="ri-phone-line fs-8" />
                            <input
                              type="text"
                              placeholder="Enter your mobile number"
                              value={reportForm.phone}
                              maxLength={10}
                              className="form-control form-control-m border-0 shadow-none"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setReportForm({
                                  ...reportForm,
                                  phone: value,
                                });
                              }}
                              required
                              disabled={isReportOtpVerified}
                            />
                          </div>

                          <div className="mt-3">
                            {isReportOtpVerified ? (
                              <p className="text-success fw-bold">
                                ✅ Mobile Verified
                              </p>
                            ) : !isReportOtpSent ? (
                              <button
                                type="button"
                                className="btn btn-outline-primary w-100"
                                onClick={sendReportOtp}
                              >
                                Send OTP
                              </button>
                            ) : (
                              <div className="d-flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter OTP"
                                  value={reportOtp}
                                  className="form-control"
                                  onChange={(e) => setReportOtp(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={verifyReportOtp}
                                >
                                  Verify
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            <select
                              value={reportForm.reason}
                              onChange={(e) =>
                                setReportForm({
                                  ...reportForm,
                                  reason: e.target.value,
                                })
                              }
                              className="form-select"
                              required
                            >
                              <option value="">Select Issue</option>
                              <option value="Fake / Misleading Vendor Information">
                                Fake / Misleading Vendor Information
                              </option>
                              <option value="Poor Service Quality">
                                Poor Service Quality
                              </option>
                              <option value="Unresponsive Vendor">
                                Unresponsive Vendor
                              </option>
                              <option value="Wrong / Misleading Pricing">
                                Wrong / Misleading Pricing
                              </option>
                              <option value="Inappropriate / Restricted Category">
                                Inappropriate / Restricted Category
                              </option>
                              <option value="Counterfeit / Fake Product">
                                Counterfeit / Fake Product
                              </option>
                            </select>
                          </div>

                          <div className="mt-3">
                            <button
                              type="submit"
                              className="send-btn w-100"
                            >
                              Submit Report
                            </button>
                          </div>
                        </form>
                      )}
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