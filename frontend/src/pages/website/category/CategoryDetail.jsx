import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { useLocation } from "react-router-dom";
import { SubmitLead ,GetStateCity} from "../../../Services/webService/Web";
import { GetGallery } from "../../../Services/vendor/Vendor";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CategoryDetail = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const location = useLocation();
  const vendor = location.state?.vendor?.id;
  const vendors = location.state?.vendor;
  const category = location.state?.category;
  const cityId = location.state?.vendor?.city_id;
  const [cityName, setCityName] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
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
          text: "Lead submitted successfully! Vendor details sent to your email",
        });
        console.log("Lead Data:", res);
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

  const imageSlides = galleryImages
    .filter((item) => item.file_type === "image")
    .map((item) => ({ src: item.file_path }));

  const handleImageClick = (clickedIndex) => {
    const imageOnlyIndex = galleryImages
      .filter((item) => item.file_type === "image")
      .findIndex(
        (img) => img.file_path === galleryImages[clickedIndex].file_path
      );

    setIndex(imageOnlyIndex);
    setOpen(true);
  };
  const imageItems = galleryImages.filter((item) => item.file_type === "image");

  const visibleItems = showAll ? galleryImages : galleryImages.slice(0, 4);

  const socialLinks = [
    {
      key: "facebook_link",
      icon: "fab fa-facebook-f",
      color: "#1877f2",
    },
    {
      key: "instagram_link",
      icon: "fab fa-instagram",
      color: "#e4405f",
    },
    {
      key: "twitter_link",
      icon: "fab fa-twitter",
      color: "#1da1f2",
    },
    {
      key: "linkedin_link",
      icon: "fab fa-linkedin-in",
      color: "#0077b5",
    },
    {
      key: "youtube_link",
      icon: "fab fa-youtube",
      color: "#ff0000",
    },
  ];

  const availableLinks = socialLinks.filter(
    (item) => vendors?.[item.key] && vendors[item.key].trim() !== ""
  );

  return (
    <div>
      <Breadcrumbs title={vendors?.category_names} links={breadcrumbLinks} />
      <section className="tour-details-section section-padding">
        <div className="tour-details-area">
          {/* Details Banner Slider */}
          {/* / Slider*/}
          <div className="tour-details-container">
            <div className="container">
              {/* Details Heading */}

              <div className="mt-30">
                <div className="row g-4">
                  {/* Left content */}
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
                          {/* <div className="d-flex align-items-center flex-wrap gap-20">
                            <div className="count">
                              <i className="ri-time-line" />
                              <p className="pera">3 Days 2 Night</p>
                            </div>
                            <div className="count">
                              <i className="ri-user-line" />
                              <p className="pera">2 Person</p>
                            </div>
                          </div> */}
                        </div>
                        <div>
                          <h4 className="title text-capitalize mt-2">
                            {vendors?.category_names}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* One line description */}
                    <div class="tour-details-content mt-15">
                      <p class="pera ">{vendors?.short_description}</p>
                    </div>

                    {/* price range */}
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

                    {/* Large description */}
                    <div className="tour-details-content mt-10">
                      <h4 className="title">About</h4>

                      <p class="pera ">{vendors?.long_description}</p>

                      {/* <p className="pera">
                        {vendor?.long_description}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum."
                      </p>
                      <p className="pera">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Neque porro
                        quisquam est, qui dolorem ipsum quia dolor sit amet,
                        consectetur, adipisci velit, sed quia non numquam eius
                        modi tempora incidunt ut labore et dolore magnam aliquam
                        quaerat voluptatem. Ut enim ad minima veniam, quis
                        nostrum exercitationem ullam corporis suscipit
                        laboriosam, nisi ut aliquid ex ea commodi consequatur?
                        Quis autem vel eum iure reprehenderit qui in ea
                        voluptate velit esse quam nihil molestiae consequatur,
                        vel illum qui dolorem eum fugiat quo voluptas nulla
                        pariatur?"
                      </p> */}
                    </div>

                    {/* images and video  */}

                    <div className="row g-4">
                      {visibleItems.map((item, i) => (
                        <div className="col-lg-3 col-sm-6" key={i}>
                          <div
                            className="shadow-sm"
                            style={{
                              height: "200px",
                              overflow: "hidden",
                              borderRadius: "8px",
                              cursor:
                                item.file_type === "image"
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() => {
                              if (item.file_type === "image")
                                handleImageClick(i);
                            }}
                          >
                            {item?.file_type === "video" ? (
                              <video
                                autoPlay
                                muted
                                loop
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
                            ) : (
                              <img
                                src={item?.file_path}
                                alt={`Gallery ${i}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All button */}
                    {!showAll && galleryImages.length > 3 && (
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowAll(true)}
                        >
                          View All
                        </button>
                      </div>
                    )}

                    {open && (
                      <Lightbox
                        open={open}
                        close={() => setOpen(false)}
                        slides={imageSlides}
                        index={index}
                      />
                    )}

                    {/* social media icons  */}

                    <div className="tour-details-content mt-10">
                      <h4 className="title ">Social Media & Links</h4>

                      <div className="d-flex flex-wrap">
                        {socialLinks.map(({ key, icon, color }) => {
                          const link = vendors?.[key];
                          if (!link) return null;

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

                      {socialLinks.every(({ key }) => !vendors?.[key]) && (
                        <div className="text-center py-4">
                          <i className="fas fa-link text-muted mb-2 fs-4"></i>
                          <p className="text-muted mb-0">
                            No social links added yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Right content */}

                  <div className="col-xl-4 col-lg-5">
                    <div className="date-travel-card position-sticky top-0">
                      <div className="price-review">
                        <div className="d-flex gap-10 align-items-end">
                          <p className="light-pera">From</p>
                          {/* <p className="pera">${vendor.price_range}</p> */}
                        </div>
                        <div className="rating">
                          {/* <p className="pera">Price varies by group size</p> */}
                        </div>
                      </div>

                      <h4 className="heading-card">Get In Touch</h4>

                      <div className="date-time-dropdown d-flex align-items-center gap-2">
                        <i className="ri-user-line fs-8" />
                        <input
                          type="text"
                          name="name"
                          value={leadData.name}
                          placeholder="Enter your name"
                          className="form-control form-control-m border-0 shadow-none"
                          onChange={(e) =>
                            setLeadData((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }))
                          }
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

                      <div className="footer bg-transparent">
                        <h4 className="title">Free Cancellation</h4>
                        <p className="pera">Up to 24 hours in advance</p>
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
