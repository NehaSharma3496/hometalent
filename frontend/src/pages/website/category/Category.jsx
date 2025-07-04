import React from 'react'
import {Link} from 'react-router-dom'

import Breadcrumbs from '../../../components/websitecomponents/Breadcrumbs';
import catImg1 from '../../.././assets/websiteAssets/images/category/image.png';
import catImg2 from '../../.././assets/websiteAssets/images/category/image-1.png';
import catImg3 from '../../.././assets/websiteAssets/images/category/image-2.png';
import catImg4 from '../../.././assets/websiteAssets/images/category/image-3.png';
import catImg5 from '../../.././assets/websiteAssets/images/category/image-4.png';
import catImg6 from '../../.././assets/websiteAssets/images/category/image-5.png';
import catImg7 from '../../.././assets/websiteAssets/images/category/image-6.png';
import catImg8 from '../../.././assets/websiteAssets/images/category/image-7.png';
import catImg9 from '../../.././assets/websiteAssets/images/category/image-9.png';
import catImg10 from '../../.././assets/websiteAssets/images/category/image-9.png';
import news1  from '../../.././assets/websiteAssets/images/news/image-1.png';
import news2  from '../../.././assets/websiteAssets/images/news/image-2.png';
import news3  from '../../.././assets/websiteAssets/images/news/image-3.png';  
import { useParams, Navigate } from 'react-router-dom';


const Category = ({ categories }) => {
const { slug } = useParams();

  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    return <Navigate to="*" />;
  }

const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: slug , to: "#" }, // or current route
  ];
 
  return (
    <div>
              <Breadcrumbs title={ slug } links={breadcrumbLinks} />
        <section className="tour-list-section top-bottom-padding2">
  <div className="container">
    <div className="row g-4">
    
      <div className="col-xl-12">
        <div className="showing-result">
          <h4 className="title">Showing 6 of 10 Results</h4>
          <div className="d-flex gap-10 align-items-center">
            <div className="expand-icon hamburger block d-xl-none" id="hamburger">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="M3 7H10M10 7C10 8.65685 11.3431 10 13 10H14C15.6569 10 17 8.65685 17 7C17 5.34315 15.6569 4 14 4H13C11.3431 4 10 5.34315 10 7ZM16 17H21M20 7H21M3 17H6M6 17C6 18.6569 7.34315 20 9 20H10C11.6569 20 13 18.6569 13 17C13 15.3431 11.6569 14 10 14H9C7.34315 14 6 15.3431 6 17Z" stroke="#071516" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="sorting-dropdown">
              <select className="form-select " tabIndex={-1} aria-hidden="true">
                <option value="popular"> Sort by Popular</option>
                <option value="low">Price low to high</option>
                <option value="high">Price high to low</option>
                <option value="new">Sort by Newset</option>
              </select>
            </div>
              <div className="sorting-dropdown">
              <select className="form-select " tabIndex={-1} aria-hidden="true">
                <option value="popular"> Sort by Popular</option>
                <option value="low">Price low to high</option>
                <option value="high">Price high to low</option>
                <option value="new">Sort by Newset</option>
              </select>
            </div>
          </div>
        </div>
        <div className="all-tour-list">
          <div className="row g-4">
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <Link to="/categorydetail">
                    <img src={catImg1} alt="travello" />
                  </Link>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.8 (15 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                     <Link to="/categorydetail">Sunny Sands | Miami Beach</Link>
                  
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Miami, USA</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">2 Pools</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">3 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">4-6 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$50</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                 <Link to="/categorydetail">
                    <img src={catImg2} alt="travello" />
                  </Link>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">5 (30 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                 <Link to="/categorydetail">Mountain Escape | Swiss Alps</Link>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Zermatt, Switzerland</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">4 Lifts</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">4 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">5-7 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$75</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg3} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.5 (18 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Paradise Bay Villas | Bora Bora</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Bora Bora, French Polynesia</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">Private Pool</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">1 Bathroom</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">2 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">2-4 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$95</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg5} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.9 (25 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Aurora Lodge | Northern Lights</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Reykjavik, Iceland</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">3 Hot Tubs</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">3 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">4-6 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$110</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg6} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.7 (20 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Ocean Breeze Inn | Maldives</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Male, Maldives</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">Bungalows</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">4 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">5-8 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$150</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg7} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.6 (12 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Desert Oasis Camp | Sahara</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Merzouga, Morocco</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">Camel Tours</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">1 Bathroom</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">2 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">2-4 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$80</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg8} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">5 (22 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Rainforest Retreat | Amazon</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Manaus, Brazil</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">Jungle Safaris</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">4 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">6-8 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$100</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg9} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.8 (18 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Cliffside Cabins | Santorini</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Santorini, Greece</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">Ocean View</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">3 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">4-6 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$120</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <div className="hotel-card">
                <div className="hotel-img imgEffect4">
                  <a href="hotel-details-with-slider.html">
                    <img src={catImg10} alt="travello" />
                  </a>
                  <div className="rating-badge-car">
                    <div className="rating">
                      <i className="ri-star-s-fill" />
                      <p className="pera">4.9 (25 Reviews)</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-content">
                  <h4 className="area-name">
                    <a href="hotel-details-with-slider.html">Aurora Lodge | Northern Lights</a>
                  </h4>
                  <div className="location">
                    <i className="ri-map-pin-line" />
                    <div className="name text-capitalize">Reykjavik, Iceland</div>
                  </div>
                  <div className="hotel-person">
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-speed-up-line" />
                      </div>
                      <p className="pera">3 Hot Tubs</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-tools-fill" />
                      </div>
                      <p className="pera text-capitalize">2 Bathrooms</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-bus-2-line" />
                      </div>
                      <p className="pera text-capitalize">3 Beds</p>
                    </div>
                    <div className="count">
                      <div className="icon text-primary">
                        <i className="ri-run-line" />
                      </div>
                      <p className="pera text-capitalize">4-6 Persons</p>
                    </div>
                  </div>
                  <div className="cart-footer d-flex flex-wrap justify-content-between">
                    <div className="d-flex gap-6 align-items-center">
                      <p className="pera">$110</p>
                      <p className="sub-pera text-12 text-capitalize">/person</p>
                    </div>
                    <a href="#" className="browse-btn">book now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <div className="section-button d-inline-block">
                <a href="javascript:void(0)">
                  <div className="btn-primary-icon-sm">
                    <i className="ri-loader-2-line" />
                    <p className="pera">Loading</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</div>
  )
}

export default Category