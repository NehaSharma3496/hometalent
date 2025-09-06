import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { useLocation, useParams } from "react-router-dom";
import {
  SubmitLead,
  GetStateCity,
  SubmitReview,
} from "../../../Services/webService/Web";
import { GetGallery, GetVendorDetails } from "../../../Services/vendor/Vendor";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CategoryDetail = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("images");
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [vendors, setVendors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cityName, setCityName] = useState("");

  const location = useLocation();
  const params = useParams();
  
  // Get vendor ID from multiple possible sources
  const vendorId = params.id || location.state?.vendorId || location.state?.vendor?.id;
  
  console.log("=== CategoryDetail Debug ===");
  console.log("URL params:", params);
  console.log("location.state:", location.state);
  console.log("Computed vendorId:", vendorId);

  const imageSectionRef = React.useRef(null);

  // Fetch vendor details
  const fetchVendorDetails = async (id) => {
    if (!id) {
      console.warn("No vendor ID provided to fetchVendorDetails");
      return;
    }

    console.log("fetchVendorDetails called with ID:", id);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      console.log("Making API call to GetVendorDetails with token:", !!token);
      
      const res = await GetVendorDetails(token, id);
      console.log("GetVendorDetails API response:", res);
      
      if (res?.status && res?.data) {
        console.log("Setting vendors state with data:", res.data);
        setVendors(res.data);
      } else {
        console.error("API returned invalid response:", res);
        // Show error message to user
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load vendor details. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while loading vendor details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Main useEffect for loading vendor data
  useEffect(() => {
    console.log("Main useEffect triggered with vendorId:", vendorId);
    
    // If vendor data is already in location.state, use it
    if (location.state?.vendor && Object.keys(location.state.vendor).length > 0) {
      console.log("Using vendor data from location.state");
      setVendors(location.state.vendor);
    } 
    // Otherwise, fetch vendor details using the ID
    else if (vendorId) {
      console.log("Fetching vendor details for ID:", vendorId);
      fetchVendorDetails(vendorId);
    } 
    else {
      console.warn("No vendor data or ID found");
      // Redirect to home or show error
      Swal.fire({
        icon: "warning",
        title: "No Vendor Selected",
        text: "Please select a vendor to view details.",
      }).then(() => {
        // Optionally redirect to vendors list
        // navigate('/categories');
      });
    }
  }, [vendorId, location.state?.vendor]);

  // Fetch city name
  useEffect(() => {
    const fetchCityName = async () => {
      const cityId = vendors?.city_id;
      if (!cityId) return;

      try {
        console.log("Fetching city name for cityId:", cityId);
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

    if (vendors?.city_id) {
      fetchCityName();
    }
  }, [vendors?.city_id]);

  // Fetch gallery images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      const vendorIdForGallery = vendors?.id || vendorId;
      if (!vendorIdForGallery) return;

      try {
        console.log("Fetching gallery for vendor ID:", vendorIdForGallery);
        const token = localStorage.getItem("token");
        const res = await GetGallery(token, vendorIdForGallery);
        console.log("Gallery API response:", res);
        
        if (res?.status && res?.data) {
          setGalleryImages(res.data);
        }
      } catch (error) {
        console.error("Gallery Fetch Error", error);
      }
    };

    if (vendors?.id || vendorId) {
      fetchGalleryImages();
    }
  }, [vendors?.id, vendorId]);

  // Form states and handlers remain the same...
  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
    terms: false,
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
      vendor_id: vendors?.id || vendorId,
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
    if (!leadData.name || !leadData.phone || !leadData.email || !leadData.query) {
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
    
    if (!leadData.terms) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please agree to the Terms and Conditions before submitting.",
      });
      return;
    }

    const payload = {
      ...leadData,
      vendor_id: vendors?.id || vendorId,
    };
    
    try {
      const res = await SubmitLead(payload);
      if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your Enquiry submitted successfully!",
        });
        setLeadData({ name: "", phone: "", email: "", query: "", terms: false });
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

  // Gallery handling
  const imageItems = galleryImages.filter((item) => item.file_type === "image");
  const videoItems = galleryImages.filter((item) => item.file_type === "video");
  const imageSlides = imageItems.map((item) => ({ src: item.file_path }));

  const handleImageClick = (clickedIndex) => {
    setIndex(clickedIndex);
    setOpen(true);
  };

  const visibleImages = showAllImages ? imageItems : imageItems.slice(0, 4);
  const visibleVideos = showAllVideos ? videoItems : videoItems.slice(0, 4);

  // Social links
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

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: vendors?.category_names || "Category", to: "#" },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3">Loading vendor details...</p>
      </div>
    );
  }

  // Show error state if no vendor data
  if (!vendors?.id && !isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h4>Vendor Not Found</h4>
          <p>The requested vendor could not be found.</p>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs title={vendors?.category_names || "Category"} links={breadcrumbLinks} />
      <section className="tour-details-section section-padding">
        <div className="tour-details-area">
          <div className="tour-details-container">
            <div className="container">
              <div className="mt-30">
                <div className="row g-4">
                  {/* Main Content */}
                  <div className="col-xl-8 col-lg-7">
                    {/* Debug Info - Remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="alert alert-info">
                        <h6>Debug Info:</h6>
                        <p>Vendors ID: {vendors?.id || 'Not found'}</p>
                        <p>Owner Name: {vendors?.owner_name || 'Not found'}</p>
                        <p>Has Image: {vendors?.image ? 'Yes' : 'No'}</p>
                        <p>City ID: {vendors?.city_id || 'Not found'}</p>
                        <p>From Gallery: {location.state?.fromGallery ? 'Yes' : 'No'}</p>
                        <p>URL Param ID: {params.id || 'None'}</p>
                      </div>
                    )}

                    {/* Vendor Header */}
                    <div className="details-heading">
                      <div className="d-flex flex-column">
                        {vendors?.image && (
                          <div
                            style={{
                              width: "100%",
                              height: "400px",
                              overflow: "hidden",
                              borderRadius: "10px",
                            }}
                          >
                            <img
                              src={vendors.image}
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
                          {vendors?.owner_name || "Unknown Vendor"}
                        </h4>
                        <div className="d-flex flex-wrap align-items-center gap-20 mt-8">
                          <div className="location d-flex align-items-center ">
                            <i
                              className="ri-map-pin-line"
                              style={{ color: "#ff5e14" }}
                            />
                            <div className="name text-capitalize">
                              {cityName || "Unknown City"}
                            </div>
                          </div>
                          <div className="divider" />
                        </div>
                        <div>
                          <h4 className="title text-capitalize mt-2">
                            {vendors?.category_names || "Category"}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="tour-details-content mt-15">
                      <p className="detail-text">
                        {vendors?.short_description || "No description available"}
                      </p>
                    </div>

                    {/* Price & Experience */}
                    <div className="price-review ">
                      <div className="d-flex align-items-end">
                        <h3 className="title">Estimated Price Range -</h3>
                        <h3 className="title fw-bold">
                          ₹{vendors?.price_range || "Contact for price"}
                        </h3>
                      </div>
                      <div className="rating">
                        <p className="detail-text">Experience Since -</p>
                        <p className="detail-text">
                          {vendors?.experience_since || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* About */}
                    <div className="tour-details-content mt-10">
                      <h4 className="title">About</h4>
                      <p className="detail-text">{vendors?.long_description || "No detailed description available"}</p>
                    </div>

                    {/* Gallery Section */}
                    {(imageItems.length > 0 || videoItems.length > 0) && (
                      <div
                        className="tour-details-content mt-4"
                        ref={imageSectionRef}
                      >
                        <h4 className="title mb-3">Gallery</h4>
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
                              Images ({imageItems.length})
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
                              Videos ({videoItems.length})
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
                                  {showAllImages 
                                    ? "View Less" 
                                    : `View All ${imageItems.length} Images`}
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
                                  {showAllVideos 
                                    ? "View Less" 
                                    : `View All ${videoItems.length} Videos`}
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

                    {/* Social Links */}
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

                  {/* Sidebar */}
                  <div className="col-xl-4 col-lg-5">
                    {/* Lead Form */}
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
                          onClick={handleSubmit}
                        >
                          Contact Vendor
                        </button>
                      </div>
                    </div>

                    {/* Review Form */}
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
                          onChange={handleReviewChange}
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
                  {/* End Sidebar */}
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