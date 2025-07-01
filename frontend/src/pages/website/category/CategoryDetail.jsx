import React from 'react'

const CategoryDetail = () => {
  return (
    <div>       <section className="tour-details-section section-padding2">
    <div className="tour-details-area">
      {/* Details Banner Slider */}
      <div className="tour-details-banner">
        <div className="swiper tourSwiper-active">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src="assets/images/gallery/tour-details-banner-three.png" alt="travello" />
            </div>
            <div className="swiper-slide">
              <img src="assets/images/gallery/tour-details-banner.png" alt="travello" />
            </div>
            <div className="swiper-slide">
              <img src="assets/images/gallery/tour-details-banner-two.png" alt="travello" />
            </div>
            <div className="swiper-slide">
              <img src="assets/images/gallery/tour-details-banner-three.png" alt="travello" />
            </div>
            <div className="swiper-slide">
              <img src="assets/images/gallery/tour-details-banner.png" alt="travello" />
            </div>
            <div className="swiper-slide">
              <img src="assets/images/gallery/tour-details-banner-two.png" alt="travello" />
            </div>
          </div>
          <div className="swiper-button-next"><i className="ri-arrow-right-s-line" /></div>
          <div className="swiper-button-prev"><i className="ri-arrow-left-s-line" /></div>
        </div>
      </div>
      {/* / Slider*/}
      <div className="tour-details-container">
        <div className="container">
          {/* Details Heading */}
          <div className="details-heading">
            <div className="d-flex flex-column">
              <h4 className="title text-capitalize">Travello Tour - Best of Samyan Bangkok</h4>
              <div className="d-flex flex-wrap align-items-center gap-30 mt-16">
                <div className="location">
                  <i className="ri-map-pin-line" />
                  <div className="name">Bangkok, Thailand</div>
                </div>
                <div className="divider" />
                <div className="d-flex align-items-center flex-wrap gap-20">
                  <div className="count">
                    <i className="ri-time-line" />
                    <p className="pera">3 Days 2 Night</p>
                  </div>
                  <div className="count">
                    <i className="ri-user-line" />
                    <p className="pera">2 Person</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="price-review">
              <div className="d-flex gap-10 align-items-end">
                <p className="light-pera">From</p>
                <p className="pera">$451</p>
              </div>
              <div className="rating">
                <i className="ri-star-s-fill" />
                <p className="pera">4.7 (20 Reviews)</p>
              </div>
            </div>
          </div>
          {/* / Details Heading */}
          <div className="mt-30">
            <div className="row g-4">
              {/* Left content */}
              <div className="col-xl-8 col-lg-7">
                {/* About tour */}
                <div className="tour-details-content">
                  <h4 className="title">About</h4>
                  <p className="pera">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor
                    incididunt
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco
                    laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit
                    esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non proident, sunt in
                    culpa
                    qui officia deserunt mollit anim id est laborum."</p>
                  <p className="pera">Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium
                    doloremque
                    laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                    et quasi architecto
                    beatae
                    vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                    aspernatur aut odit aut
                    fugit,
                    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
                    nesciunt. Neque porro
                    quisquam est,
                    qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                    non numquam eius modi
                    tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
                    enim ad minima veniam,
                    quis
                    nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
                    ex ea commodi
                    consequatur?
                    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
                    nihil molestiae
                    consequatur,
                    vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
                </div>
                {/* / About tour */}
                {/* Tour Include Exclude */}
                <div className="tour-include-exclude radius-6">
                  <div className="includ-exclude-point">
                    <h4 className="title">Included</h4>
                    <ul className="expect-list">
                      <li className="list">Welcome Breakfast</li>
                      <li className="list">All Entry Tickets of Hopping Destinations</li>
                      <li className="list">Lunch Platter</li>
                      <li className="list">Evening Snacks</li>
                      <li className="list">First Aid Kit (In case of emergency)</li>
                    </ul>
                  </div>
                  <div className="divider" />
                  <div className="includ-exclude-point">
                    <h4 className="title">Exclude</h4>
                    <ul className="expect-list">
                      <li className="list">Personal expenses</li>
                      <li className="list">Anything else that isn't mentioned on Inclusions</li>
                      <li className="list">Additional Service</li>
                    </ul>
                  </div>
                </div>
                {/* / Tour Include Exclude */}
                {/* Tour Plan accordion*/}
                <div className="tour-details-content mb-30">
                  <h4 className="title">Tour Plan</h4>
                  <div className="destination-accordion">
                    <div className="accordion" id="accordionPanelsStayOpenExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                            Day 1 - Samyan Bangkok
                          </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                          <div className="accordion-body">
                            <p className="pera mb-16">Lorem ipsum dolor sit amet,
                              consectetur adipiscing elit, sed do
                              eiusmod tempor incididunt ut labore et dolore magna
                              aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat. Duis
                              aute irure dolor in reprehenderit in voluptate velit
                              esse cillum dolore eu fugiat nulla
                              pariatur. Excepteur sint occaecat cupidatat non
                              proident, sunt in culpa qui officia
                              deserunt mollit anim id est laborum."</p>
                            <ul className="listing">
                              <li className="list">
                                “Life is either a daring adventure or nothing at
                                all.” ...
                              </li>
                              <li className="list">
                                “Travel far enough, you meet yourself.” ...
                              </li>
                              <li className="list">
                                “Wherever you go becomes a part of you somehow.” ...
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
                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            Day 2 - Samyan Bangkok
                          </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                          <div className="accordion-body">
                            <p className="pera mb-16">Lorem ipsum dolor sit amet,
                              consectetur adipiscing elit, sed do
                              eiusmod tempor incididunt ut labore et dolore magna
                              aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat. Duis
                              aute irure dolor in reprehenderit in voluptate velit
                              esse cillum dolore eu fugiat nulla
                              pariatur. Excepteur sint occaecat cupidatat non
                              proident, sunt in culpa qui officia
                              deserunt mollit anim id est laborum."</p>
                            <ul className="listing">
                              <li className="list">
                                “Life is either a daring adventure or nothing at
                                all.” ...
                              </li>
                              <li className="list">
                                “Travel far enough, you meet yourself.” ...
                              </li>
                              <li className="list">
                                “Wherever you go becomes a part of you somehow.” ...
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
                        <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                            Day 3 - Samyan Bangkok
                          </button>
                        </h2>
                        <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                          <div className="accordion-body">
                            <p className="pera mb-16">Lorem ipsum dolor sit amet,
                              consectetur adipiscing elit, sed do
                              eiusmod tempor incididunt ut labore et dolore magna
                              aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat. Duis
                              aute irure dolor in reprehenderit in voluptate velit
                              esse cillum dolore eu fugiat nulla
                              pariatur. Excepteur sint occaecat cupidatat non
                              proident, sunt in culpa qui officia
                              deserunt mollit anim id est laborum."</p>
                            <ul className="listing">
                              <li className="list">
                                “Life is either a daring adventure or nothing at
                                all.” ...
                              </li>
                              <li className="list">
                                “Travel far enough, you meet yourself.” ...
                              </li>
                              <li className="list">
                                “Wherever you go becomes a part of you somehow.” ...
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
                </div>
                {/* / Tour Plan accordion*/}
                {/* Tour Privacy Policy */}
                <div className="tour-details-content">
                  <h4 className="title">Policy</h4>
                  <p className="pera">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor
                    incididunt
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco
                    laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit
                    esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non proident, sunt in
                    culpa
                    qui officia deserunt mollit anim id est laborum."</p>
                  <p className="pera">Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium
                    doloremque
                    laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                    et quasi architecto
                    beatae
                    vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                    aspernatur aut odit aut
                    fugit,
                    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
                    nesciunt. Neque porro
                    quisquam est,
                    qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                    non numquam eius modi
                    tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
                    enim ad minima veniam,
                    quis
                    nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
                    ex ea commodi
                    consequatur?
                    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
                    nihil molestiae
                    consequatur,
                    vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
                  <ol className="policy-point">
                    <li className="list">Neque porro quisquam est, qui dolorem ipsum quia dolor sit
                      amet, consectetur,
                      adipisci velit.</li>
                    <li className="list">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                      odit aut fugit.</li>
                    <li className="list">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod.</li>
                  </ol>
                </div>
                {/* / Tour Privacy Policy */}
              </div>
              {/* Right content */}
              <div className="col-xl-4 col-lg-5">
                <div className="date-travel-card position-sticky top-0">
                  <div className="price-review">
                    <div className="d-flex gap-10 align-items-end">
                      <p className="light-pera">From</p>
                      <p className="pera">$95</p>
                    </div>
                    <div className="rating">
                      <p className="pera">Price varies by group size</p>
                    </div>
                  </div>
                  <h4 className="heading-card">Select Date and Travelers</h4>
                  <div className="date-time-dropdown">
                    <i className="ri-time-line" />
                    <p className="date-time-result">Wednesday, Jan 17, 2025</p>
                  </div>
                  <div className="dropdown-section position-relative user-picker-dropdown">
                    <div className="d-flex gap-12 align-items-center">
                      <i className="dropdown-icon ri-user-line" />
                      <div className="custom-dropdown">
                        <h4 className="title">Guests</h4>
                        <div className="arrow">
                          <i className="ri-arrow-down-s-line" />
                        </div>
                      </div>
                    </div>
                    <div className="user-result" />
                    <div className="user-picker dropdown-shadow">
                      <div className="user-category">
                        <div className="category-name">
                          <h4 className="title">Adults</h4>
                          <p className="pera">12years and above</p>
                        </div>
                        <div className="qty-container">
                          <button className="qty-btn-minus mr-1" type="button">
                            <i className="ri-subtract-fill" />
                          </button>
                          <input type="text" name="qty" defaultValue={0} className="input-qty input-rounded" />
                          <button className="qty-btn-plus ml-1" type="button">
                            <i className="ri-add-fill" />
                          </button>
                        </div>
                      </div>
                      <div className="user-category">
                        <div className="category-name">
                          <h4 className="title">Children</h4>
                          <p className="pera">2-11 years</p>
                        </div>
                        <div className="qty-container">
                          <button className="qty-btn-minus mr-1" type="button">
                            <i className="ri-subtract-fill" />
                          </button>
                          <input type="text" name="qty" defaultValue={0} className="input-qty input-rounded" />
                          <button className="qty-btn-plus ml-1" type="button">
                            <i className="ri-add-fill" />
                          </button>
                        </div>
                      </div>
                      <div className="user-category">
                        <div className="category-name">
                          <h4 className="title">infant</h4>
                          <p className="pera">belwo 2 years</p>
                        </div>
                        <div className="qty-container">
                          <button className="qty-btn-minus mr-1" type="button">
                            <i className="ri-subtract-fill" />
                          </button>
                          <input type="text" name="qty" defaultValue={0} className="input-qty input-rounded" />
                          <button className="qty-btn-plus ml-1" type="button">
                            <i className="ri-add-fill" />
                          </button>
                        </div>
                      </div>
                      <div className="btn-section">
                        <a href="javascript:void(0)" className="done-btn">Done</a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-30">
                    <button type="submit" className="send-btn w-100">Check Availability</button>
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
  </section></div>

  )
}

export default CategoryDetail