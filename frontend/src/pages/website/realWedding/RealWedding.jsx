import React from 'react'
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import catImg1 from '../../.././assets/websiteAssets/images/category/image.png';
import { Link } from "react-router-dom";

const RealWedding = () => {
  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "#" }, // or current route
  ];


  return (
   <div>  
       <Breadcrumbs title="About Us" links={breadcrumbLinks} />
     <section className="tour-list-section top-bottom-padding">
    <div className="container">
      <div className="row g-4">
        <div className="col-xl-3">
          <div className="search-filter-section">
            {/* Mobile Device Menu open */}
            <div className="expand-icon close-btn block d-xl-none">
              <i className="ri-arrow-left-double-line" />
            </div>
            {/* Filter Search */}
            <div className="search-filter">
              <div className="heading">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M3 7H10M10 7C10 8.65685 11.3431 10 13 10H14C15.6569 10 17 8.65685 17 7C17 5.34315 15.6569 4 14 4H13C11.3431 4 10 5.34315 10 7ZM16 17H21M20 7H21M3 17H6M6 17C6 18.6569 7.34315 20 9 20H10C11.6569 20 13 18.6569 13 17C13 15.3431 11.6569 14 10 14H9C7.34315 14 6 15.3431 6 17Z" stroke="#071516" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h4 className="title">Search By Filter</h4>
              </div>
              <div className="tour-search">
                <div className="select-dropdown-section">
                  <div className="d-flex gap-10 align-items-center">
                    
                    <h4 className="select2-title mb-2">City</h4>
                  </div>
                  <select className="destination-dropdown form-select">
                    <option value={1}>Indore</option>
                    <option value={2}>Ujjain </option>
                    <option value={3}>Ratlam</option>
                  </select>
                </div>
                <div className="select-dropdown-section">
                  <div className="d-flex gap-10 align-items-center">
                   
                    <h4 className="select2-title mb-3">Category</h4>
                  </div>
                  <select className="destination-dropdown  form-select">
                    <option value={1}>Mehandi</option>
                    <option value={2}>Makeup Artist</option>
                    <option value={3}>Photographer</option>
                  </select>
                </div>
                <div className="dropdown-section">
                  <div className="d-flex gap-10 align-items-center">
                    <i className="dropdown-icon ri-time-line" />
                    <div className="custom-dropdown custom-date">
                      <h4 className="title">Date From</h4>
                      <div className="arrow">
                        <i className="ri-arrow-down-s-line" />
                      </div>
                    </div>
                  </div>
                  <div className="date-result">01/12/2025</div>
                </div>
               
              </div>
            </div>
            {/* / */}
          
       
        
          
          </div>
          <div className="cover" />
        </div>
        <div className="col-xl-9">
          <div className="showing-result">
            <h4 className="title">Showing 6 of 10 Results</h4>
            <div className="d-flex gap-10 align-items-center">
              <div className="expand-icon hamburger block d-xl-none" id="hamburger">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M3 7H10M10 7C10 8.65685 11.3431 10 13 10H14C15.6569 10 17 8.65685 17 7C17 5.34315 15.6569 4 14 4H13C11.3431 4 10 5.34315 10 7ZM16 17H21M20 7H21M3 17H6M6 17C6 18.6569 7.34315 20 9 20H10C11.6569 20 13 18.6569 13 17C13 15.3431 11.6569 14 10 14H9C7.34315 14 6 15.3431 6 17Z" stroke="#071516" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="sorting-dropdown">
                <select className="select2">
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
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                <img src={catImg1} alt="travello" />

                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="package-card">
                  <div className="package-img imgEffect4">
                    <a href="details-with-slider.html">
                      <img src={catImg1} alt="travello" />
                    </a>
                  
                  </div>
                  <div className="package-content">
                    <h4 className="area-name">
                      <a href="details-with-slider.html">Dusitd2 Samyan Bangkok</a>
                    </h4>
                   
                   
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
  </section></div>

  )
}

export default RealWedding