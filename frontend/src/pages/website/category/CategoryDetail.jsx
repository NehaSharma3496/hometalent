import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { useLocation } from "react-router-dom";
import { SubmitLead } from "../../../Services/webService/Web";
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
  const cities = location.state?.cities;

  // console.log(location.state?.cities);
  console.log("Vendor", vendors);

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
    console.log("Submitting lead...");
    console.log("vendor_id:", vendor);
    console.log("name:", vendors.name);
    console.log("phone:", vendors.phone);
    console.log("email:", vendors.email);

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
    { label: category?.name, to: "#" }, // or current route
  ];

  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (vendor) {
        try {
          const token = localStorage.getItem("token"); // or wherever you store the auth token
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
    // Map clicked index to image-only index
    const imageOnlyIndex = galleryImages
      .filter((item) => item.file_type === "image")
      .findIndex(
        (img) => img.file_path === galleryImages[clickedIndex].file_path
      );

    setIndex(imageOnlyIndex);
    setOpen(true);
  };

  // Filter only image paths for lightbox
  const imageItems = galleryImages.filter((item) => item.file_type === "image");
  // Show only first 3 items or all if toggled
  const visibleItems = showAll ? galleryImages : galleryImages.slice(0, 4);

  return (
    <div>
      <Breadcrumbs title={category?.name} links={breadcrumbLinks} />
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
                              {cities?.find(
                                (c) =>
                                  c.type === "city" &&
                                  String(c.id) === String(vendors?.city_id)
                              )?.name || "Unknown Location"}
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
                            {category?.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* One line description */}
                    <div class="tour-details-content mt-15">
                      <p class="pera ">{vendor?.short_description}</p>
                    </div>

                    {/* price range */}
                    <div className="price-review ">
                      <div className="d-flex  align-items-end">
                        <h3 className="title">Estimated Price Range -</h3>
                        <h3 className="title">${vendors?.price_range}</h3>
                      </div>
                      <div className="rating">
                        <p className="pera">Experience Since -</p>
                        <p className="pera">{vendor?.experience_since}2019</p>
                      </div>
                    </div>

                    {/* Large description */}
                    <div className="tour-details-content mt-10">
                      <h4 className="title">About</h4>
                      <p className="pera">
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
                      </p>
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

                    <div className="social-section mt-4">
                      <div className="d-flex gap-3 flex-wrap">
                        <a
                          href="javascript:void(0)"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            fontSize: "20px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s",
                          }}
                        >
                          <i className="ri-facebook-fill"></i>
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            fontSize: "20px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s",
                          }}
                        >
                          <i className="ri-twitter-fill"></i>
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            fontSize: "20px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s",
                          }}
                        >
                          <i className="ri-linkedin-fill"></i>
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            fontSize: "20px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s",
                          }}
                        >
                          <i className="ri-instagram-line"></i>
                        </a>
                      </div>
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
                          placeholder="Enter your mobile number"
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
                          type="number"
                          name="phone"
                          value={leadData.phone}
                          onChange={handleChange}
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
