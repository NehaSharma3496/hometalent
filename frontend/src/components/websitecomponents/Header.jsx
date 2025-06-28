import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/websiteAssets/images/logo/logo.png';


const Header = () => {
  return (
    <header className="header-area-three">
  <div className="main-header">
    {/* Header Top */}
    <div className="header-top header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="top-menu-wrapper d-flex align-items-center justify-content-between">
              <div className="top-header-right">
                <div className="logo">
                <a href="index.html"><img src={logo}  width="100" alt="logo" className="changeLogo" /></a>
              </div>
              </div>
              {/* Top Left Side */}
              {/* Logo*/}
              

                <div className="menu-wrapper">
              {/* Main-menu for desktop */}
              <div className="main-menu d-none d-lg-block">
                <nav>
                  <div className="d-flex justify-content-between align-items-center">
                    <ul className="listing" id="navigation">
                      <li className="single-list">
                        <Link to="/" className="single link-active">Home </Link>
                  
                      </li>
                      <li className="single-list">
                        <Link to="/about" className="single">
                         About
                        </Link>
                  
                      </li>
                      <li className="single-list">
                        <a href="#" className="single">
                          Vendors 
                          <i className="ri-arrow-down-s-line" />
                        </a>
                        
        <ul className="row submenu">
  {/* Column 1 */}
  <div className="col-lg-6 col-md-6 col-sm-6">
    <ul className="single-list">
      {/* Vendor Pages */}
    

      {/* Categories - Column 1 (12 items) */}
      <li className="single-list"><Link to="/category/cutlery" className="single">Cutlery</Link></li>
      <li className="single-list"><Link to="/category/cosmetics" className="single">Cosmetics</Link></li>
      <li className="single-list"><Link to="/category/dance-tutor" className="single">Dance Tutor, Choreographer</Link></li>
      <li className="single-list"><Link to="/category/yoga-instructor" className="single">Yoga Instructor</Link></li>
      <li className="single-list"><Link to="/category/education-tutor" className="single">Education Tutor</Link></li>
      <li className="single-list"><Link to="/category/music-teacher" className="single">Music Teacher</Link></li>
      <li className="single-list"><Link to="/category/art-craft-teacher" className="single">Art & Craft Teacher</Link></li>
      <li className="single-list"><Link to="/category/nursery-pottery" className="single">Nursery & Pottery</Link></li>
      <li className="single-list"><Link to="/category/art-work" className="single">Art Work</Link></li>
      <li className="single-list"><Link to="/category/babysitter" className="single">Babysitter or Pet Care</Link></li>
      <li className="single-list"><Link to="/category/fabric-painting" className="single">Fabric Painting</Link></li>
      <li className="single-list"><Link to="/category/canvas-painting" className="single">Canvas Painting</Link></li>
    </ul>
  </div>

  {/* Column 2 */}
  <div className="col-lg-6 col-md-6 col-sm-6">
    <ul className="single-list">
      {/* Vendor Payment */}

      {/* Categories - Column 2 (12 items) */}
      <li className="single-list"><Link to="/category/mehandi-art" className="single">Mehandi Art</Link></li>
      <li className="single-list"><Link to="/category/catering" className="single">Catering</Link></li>
      <li className="single-list"><Link to="/category/cook-on-call" className="single">Cook/Chef on Call</Link></li>
      <li className="single-list"><Link to="/category/bakery-item" className="single">Bakery Item</Link></li>
      <li className="single-list"><Link to="/category/food" className="single">Food (Namkeen, Sweets, Snacks)</Link></li>
      <li className="single-list"><Link to="/category/gift-packaging" className="single">Gift & Packaging</Link></li>
      <li className="single-list"><Link to="/category/anchor" className="single">Anchor</Link></li>
      <li className="single-list"><Link to="/category/clothes" className="single">Clothes</Link></li>
      <li className="single-list"><Link to="/category/jewellery" className="single">Jewellery</Link></li>
      <li className="single-list"><Link to="/category/beauty-services" className="single">Beauty Services / Home Salon</Link></li>
      <li className="single-list"><Link to="/category/music-artist" className="single">Music Artist</Link></li>
    </ul>
  </div>
</ul>


                          {/* <li className="single-list">
                            <a href="hotel-list.html" className="single">hotel Category Page</a>
                          </li>
                          <li className="single-list">
                            <a href="top-filter-hotel-list.html" className="single">hotel Top Filter Category</a>
                          </li>
                          <li className="single-list">
                            <a href="hotel-details-with-slider.html" className="single">Details With slider</a>
                          </li>
                          <li className="single-list">
                            <a href="hotel-cart-page.html" className="single">Cart hotel Page</a>
                          </li>
                          <li className="single-list">
                            <a href="hotel-booking-payment.html" className="single">Payment hotel Page</a>
                          </li>
                          <li className="single-list">
                            <a href="hotel-booking-complite.html" className="single">Finish hotel Booking</a>
                          </li>
                          <li className="single-list">
                            <a href="invoice.html" className="single">View Invoice</a>
                          </li> */}
                        
                      </li>
                       <li className="single-list">
                        <a href="#" className="single">
                          Wedding Vogue  
                          <i className="ri-arrow-down-s-line" />
                        </a>
                        <ul className="submenu">
                          <li className="single-list">
                            <a href="hotel-list.html" className="single">Blogs/Articles</a>
                          </li>
                          
                        </ul>
                      </li>
                       <li className="single-list">
                        <a href="#" className="single">
                          Real Weddings
                        </a>
                       
                      </li>
                      <li className="single-list">
                        <Link to="/gallery"  className="single">
                          Gallery
                        </Link>
                       
                      </li>
                      <li className="single-list">
                       <Link to="/contact"  className="single">
                         Contact us
                        </Link>
                        
                      </li>
                  
                      <li className="d-block d-lg-none">
                        <div className="header-right-three pl-15 mt-10">
                          <div className="sign-btn">
                            <a href="login.html" className="btn-primary m-0">Log In</a>
                          </div>
                           <div className="freesign-btn">
                            <Link to="/contact"  className="text-secondary" >Free sign up</Link>
                          </div>
                        </div>
                      </li>
                    </ul>
                    
                
                  </div>
                </nav>
              </div>
            </div>
              <div className="header-right-three pl-15 d-none d-lg-flex">
                    <div className="sign-btn">
                    <Link href="/" className="btn-primary ">Log In</Link>
                  </div>
                <div className="freesign-btn">
                            <Link to="/registration"  className="text-secondary" >Free sign up</Link>
                          </div>
              
              </div>
              {/* Mobile Device Search & Theme Mode */}
             
              {/* / Mobile Device Search & Theme Mode*/}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Header Bottom */}
    <div className="header-bottom header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
          
            {/* Mobile Menu */}
            <div className="div">
               <div className=" d-block d-lg-none">
                 <div className="logo mt-3">
                <a href="index.html"><img src={logo}  width="100" alt="logo" className="changeLogo" /></a>
              </div>
              </div>
              <div className="mobile_menu d-block d-lg-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Search box */}
  <div className="search-container">
    <div className="top-section">
      <div className="search-icon">
        <i className="ri-search-line" />
      </div>
      <div className="modal-search-box">
        <input type="text" id="searchField" className="search-field" placeholder="Destination, Agency, Country" />
        <button id="closeSearch" className="close-search-btn">
          <kbd className="light-text"> ESC </kbd>
        </button>
      </div>
    </div>
  
  </div>
  {/* / End-Search */}
</header>
  )
}

export default Header