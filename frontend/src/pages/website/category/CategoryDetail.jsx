import React, { useState, useEffect } from "react";

import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { useLocation } from "react-router-dom";
import { SubmitLead } from "../../../Services/webService/Web";
import Swal from "sweetalert2";


const CategoryDetail = () => {
  const location = useLocation();
  const vendor = location.state?.vendor;
  const category = location.state?.category;
  const cities = location.state?.cities;

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
  if (!leadData.name || !leadData.phone || !leadData.email|| !leadData.query) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all required fields.",
    });
    return;
  }

  const payload = {
    ...leadData,
    vendor_id: vendor?.id || "", // optional: use if needed
  };

  try {
    const res = await SubmitLead(payload);
    if (res?.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Lead submitted successfully!",
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
    { label: category?.name, to: "#" }, // or current route
  ];

  console.log("Vendor", vendor);
  console.log("Category", category);

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

              {/* / Details Heading */}

              <div className="mt-30">
                <div className="row g-4">
                  {/* Left content */}
                  <div className="col-xl-8 col-lg-7">
                    <div className="details-heading">
                      <div className="d-flex flex-column">
                        <div
                          style={{
                            width: "100%",
                            height: "400px",
                            overflow: "hidden",
                            borderRadius: "10px",
                          }}
                        >
                          <img
                            src={vendor?.image}
                            alt="Vendor Image"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <h4 className="title text-capitalize mt-5">
                          {vendor?.owner_name}
                        </h4>
                        <div className="d-flex flex-wrap align-items-center gap-30 mt-16">
                          <div className="location">
                            <i className="ri-map-pin-line" />
                            <div className="name">
                              {cities?.find(
                                (c) =>
                                  c.type === "city" && c.id === vendor?.city_id
                              )?.name || "Unknown"}
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
                          <h4 className="title text-capitalize mt-3">
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
                        <h3 className="title">${vendor?.price_range}</h3>
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
                      <div className="col-lg-3 col-sm-6">
                        <div
                          style={{
                            height: "200px",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src={vendor?.image}
                            alt="Vendor"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div
                          style={{
                            height: "200px",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src={vendor?.image}
                            alt="Vendor"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div
                          style={{
                            height: "200px",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src={vendor?.image}
                            alt="Vendor"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div
                          style={{
                            height: "200px",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
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
                            <source src={vendor?.video} type="video/mp4" />
                          </video>
                        </div>
                      </div>
                    </div>

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

                    {/* review section */}
                    <div class="comment-section">
                      <h4 class="comment-count">( 3 ) Reviews</h4>

                      <div class="main-profile-two d-block pb-15 border-bottom mb-20">
                        <div class="d-flex justify-content-between align-items-center mb-15">
                          <div class="user d-flex align-items-center flex-wrap gap-15">
                            <div class="user-img-sm">
                              <img
                                src="assets/images/news/news-user-1.png"
                                alt="travello"
                              />
                            </div>
                            <h4 class="text-18 font-600">David Warner</h4>
                          </div>
                          <div class="user-info p-0 border-0">
                            <p class="date">Jan 12, 2025</p>
                          </div>
                        </div>
                        <p class="pera">
                          Chris Jordan is a technical content writer at
                          Travello. he’s a tech enthusiast, writer by day,
                          programmer by night, and always a foodie at heart!
                        </p>
                      </div>

                      <div class="main-profile-two d-block pb-15 border-bottom mb-20">
                        <div class="d-flex justify-content-between align-items-center mb-15">
                          <div class="user d-flex align-items-center flex-wrap gap-15">
                            <div class="user-img-sm">
                              <img
                                src="assets/images/news/news-user-2.png"
                                alt="travello"
                              />
                            </div>
                            <h4 class="text-18 font-600">David Warner</h4>
                          </div>
                          <div class="user-info p-0 border-0">
                            <p class="date">Jan 12, 2025</p>
                          </div>
                        </div>
                        <p class="pera">
                          Chris Jordan is a technical content writer at
                          Travello. he’s a tech enthusiast, writer by day,
                          programmer by night, and always a foodie at heart!
                        </p>
                      </div>

                      <div class="main-profile-two d-block pb-15 border-bottom mb-20">
                        <div class="d-flex justify-content-between align-items-center mb-15">
                          <div class="user d-flex align-items-center flex-wrap gap-15">
                            <div class="user-img-sm">
                              <img
                                src="assets/images/news/news-user-3.png"
                                alt="travello"
                              />
                            </div>
                            <h4 class="text-18 font-600">David Warner</h4>
                          </div>
                          <div class="user-info p-0 border-0">
                            <p class="date">Jan 12, 2025</p>
                          </div>
                        </div>
                        <p class="pera">
                          Chris Jordan is a technical content writer at
                          Travello. he’s a tech enthusiast, writer by day,
                          programmer by night, and always a foodie at heart!
                        </p>
                      </div>
                    </div>

                    {/* / About tour */}
                    {/* Tour Include Exclude */}
                    {/* <div className="tour-include-exclude radius-6">
                      <div className="includ-exclude-point">
                        <h4 className="title">Included</h4>
                        <ul className="expect-list">
                          <li className="list">Welcome Breakfast</li>
                          <li className="list">
                            All Entry Tickets of Hopping Destinations
                          </li>
                          <li className="list">Lunch Platter</li>
                          <li className="list">Evening Snacks</li>
                          <li className="list">
                            First Aid Kit (In case of emergency)
                          </li>
                        </ul>
                      </div>
                      <div className="divider" />
                      <div className="includ-exclude-point">
                        <h4 className="title">Exclude</h4>
                        <ul className="expect-list">
                          <li className="list">Personal expenses</li>
                          <li className="list">
                            Anything else that isn't mentioned on Inclusions
                          </li>
                          <li className="list">Additional Service</li>
                        </ul>
                      </div>
                    </div> */}
                    {/* / Tour Include Exclude */}
                    {/* Tour Plan accordion*/}
                    {/* <div className="tour-details-content mb-30">
                      <h4 className="title">Tour Plan</h4>
                      <div className="destination-accordion">
                        <div
                          className="accordion"
                          id="accordionPanelsStayOpenExample"
                        >
                          <div className="accordion-item">
                            <h2
                              className="accordion-header"
                              id="panelsStayOpen-headingOne"
                            >
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseOne"
                                aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne"
                              >
                                Day 1 - Samyan Bangkok
                              </button>
                            </h2>
                            <div
                              id="panelsStayOpen-collapseOne"
                              className="accordion-collapse collapse show"
                              aria-labelledby="panelsStayOpen-headingOne"
                            >
                              <div className="accordion-body">
                                <p className="pera mb-16">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum."
                                </p>
                                <ul className="listing">
                                  <li className="list">
                                    “Life is either a daring adventure or
                                    nothing at all.” ...
                                  </li>
                                  <li className="list">
                                    “Travel far enough, you meet yourself.” ...
                                  </li>
                                  <li className="list">
                                    “Wherever you go becomes a part of you
                                    somehow.” ...
                                  </li>
                                  <li className="list">
                                    “Once a year, go someplace you've never been
                                    before.”
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item">
                            <h2
                              className="accordion-header"
                              id="panelsStayOpen-headingTwo"
                            >
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseTwo"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseTwo"
                              >
                                Day 2 - Samyan Bangkok
                              </button>
                            </h2>
                            <div
                              id="panelsStayOpen-collapseTwo"
                              className="accordion-collapse collapse"
                              aria-labelledby="panelsStayOpen-headingTwo"
                            >
                              <div className="accordion-body">
                                <p className="pera mb-16">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum."
                                </p>
                                <ul className="listing">
                                  <li className="list">
                                    “Life is either a daring adventure or
                                    nothing at all.” ...
                                  </li>
                                  <li className="list">
                                    “Travel far enough, you meet yourself.” ...
                                  </li>
                                  <li className="list">
                                    “Wherever you go becomes a part of you
                                    somehow.” ...
                                  </li>
                                  <li className="list">
                                    “Once a year, go someplace you've never been
                                    before.”
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item">
                            <h2
                              className="accordion-header"
                              id="panelsStayOpen-headingThree"
                            >
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseThree"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseThree"
                              >
                                Day 3 - Samyan Bangkok
                              </button>
                            </h2>
                            <div
                              id="panelsStayOpen-collapseThree"
                              className="accordion-collapse collapse"
                              aria-labelledby="panelsStayOpen-headingThree"
                            >
                              <div className="accordion-body">
                                <p className="pera mb-16">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum."
                                </p>
                                <ul className="listing">
                                  <li className="list">
                                    “Life is either a daring adventure or
                                    nothing at all.” ...
                                  </li>
                                  <li className="list">
                                    “Travel far enough, you meet yourself.” ...
                                  </li>
                                  <li className="list">
                                    “Wherever you go becomes a part of you
                                    somehow.” ...
                                  </li>
                                  <li className="list">
                                    “Once a year, go someplace you've never been
                                    before.”
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* / Tour Plan accordion*/}
                    {/* Tour Privacy Policy */}
                    {/* <div className="tour-details-content">
                      <h4 className="title">Policy</h4>
                      <p className="pera">
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
                      <ol className="policy-point">
                        <li className="list">
                          Neque porro quisquam est, qui dolorem ipsum quia dolor
                          sit amet, consectetur, adipisci velit.
                        </li>
                        <li className="list">
                          Nemo enim ipsam voluptatem quia voluptas sit
                          aspernatur aut odit aut fugit.
                        </li>
                        <li className="list">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod.
                        </li>
                      </ol>
                    </div> */}
                    {/* / Tour Privacy Policy */}
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
  onChange={handleChange}
  placeholder="Enter your name"
  className="form-control form-control-m border-0 shadow-none"
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
                        <button type="button" className="send-btn w-100" onClick={handleSubmit}>
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
