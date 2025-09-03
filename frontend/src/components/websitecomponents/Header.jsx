import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetCategories } from "../../Services/webService/Web";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchcategories = async () => {
    try {
      const res = await GetCategories(token);
      setCategory(res?.data);
    } catch (err) {
      console.log("Error in fetchig categories");
    }
  };

  useEffect(() => {
    fetchcategories();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileOpen &&
        !event.target.closest(".mobile-sidebar") &&
        !event.target.closest(".hamburger-btn")
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpen(false);
  };

  return (
    <>
      <header className="header-area-three">
        <div className="main-header">
          {/* Desktop Header */}
          <div className="header-top header-sticky sticky-bar d-none d-lg-block">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="top-menu-wrapper d-flex align-items-center justify-content-between">
                    <div className="top-header-right">
                      <div className="logo">
                        <Link to="/">
                          <img
                            src="../assets/images//logo/logo.png"
                            width="100"
                            alt="logo"
                            className="changeLogo"
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="menu-wrapper">
                      {/* Main-menu for desktop */}
                      <div className="main-menu">
                        <nav>
                          <div className="d-flex justify-content-between align-items-center">
                            <ul className="listing" id="navigation">
                              <li className="single-list">
                                <Link
                                  to="/"
                                  className={`single ${
                                    location.pathname === "/"
                                      ? "link-active"
                                      : ""
                                  }`}
                                >
                                  Home
                                </Link>
                              </li>

                              <li className="single-list">
                                <Link
                                  to="/about"
                                  className={`single ${
                                    location.pathname === "/about"
                                      ? "link-active"
                                      : ""
                                  }`}
                                >
                                  About
                                </Link>
                              </li>

                              <li
                                className={`single-list dropdown-container ${
                                  open ? "submenu-open" : ""
                                }`}
                                tabIndex={0}
                                onBlur={() => setOpen(false)}
                              >
                                <div
                                  className={`single dropdown-trigger font-normal ${
                                    location.pathname.startsWith("/category")
                                      ? "link-active"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(!open);
                                  }}
                                >
                                  Category
                                  <i
                                    className={`ri-arrow-down-s-line ${
                                      open ? "rotate" : ""
                                    }`}
                                  />
                                </div>

                                <ul className="desktop-dropdown">
                                  <div className="dropdown-content">
                                    <div className="dropdown-columns">
                                      {Array.from(
                                        { length: 3 },
                                        (_, colIndex) => (
                                          <div
                                            className="dropdown-column Anuj"
                                            key={colIndex}
                                          >
                                            <ul>
                                              {category
                                                ?.filter(
                                                  (_, idx) =>
                                                    idx % 3 === colIndex
                                                )
                                                ?.map((cat) => (
                                                  <li key={cat._id || cat.id}>
                                                    <Link
                                                      to="/category"
                                                      state={{
                                                        categoryId: cat.id,
                                                      }}
                                                      className="dropdown-link "
                                                      onClick={() =>
                                                        setOpen(false)
                                                      }
                                                    >
                                                      {cat.name}
                                                    </Link>
                                                  </li>
                                                ))}
                                            </ul>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </ul>
                              </li>

                              <li className="single-list">
                                <Link
                                  to="/blog"
                                  className={`single ${
                                    location.pathname.startsWith("/blog")
                                      ? "link-active"
                                      : ""
                                  }`}
                                >
                                  Blogs
                                </Link>
                              </li>

                              <li className="single-list">
                                <Link
                                  to="/gallery"
                                  className={`single ${
                                    location.pathname === "/gallery"
                                      ? "link-active"
                                      : ""
                                  }`}
                                >
                                  Gallery
                                </Link>
                              </li>

                              <li className="single-list">
                                <Link
                                  to="/contact"
                                  className={`single ${
                                    location.pathname === "/contact"
                                      ? "link-active"
                                      : ""
                                  }`}
                                >
                                  Contact us
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </nav>
                      </div>
                    </div>

                    <div className="gap-10 d-flex">
                      <div className="sign-btn">
                        <Link to="/login" className="btn-primary">
                          Log In
                        </Link>
                      </div>
                      <div className="sign-btn">
                        <Link to="/registration" className="btn-primary">
                         Vendor Register
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="mobile-header d-block d-lg-none">
            <div className="container-fluid">
              <div className="mobile-header-content d-flex align-items-center justify-content-between py-3 px-3">
                <div className="logo">
                  <Link to="/" onClick={closeMobileMenu}>
                    <img
                      src="../assets/images//logo/logo.png"
                      width="80"
                      alt="logo"
                      className="changeLogo"
                    />
                  </Link>
                </div>

                <button
                  className={`hamburger-btn ${mobileOpen ? "active" : ""}`}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="search-container">
          <div className="top-section">
            <div className="search-icon">
              <i className="ri-search-line" />
            </div>
            <div className="modal-search-box">
              <input
                type="text"
                id="searchField"
                className="search-field"
                placeholder="Destination, Agency, Country"
              />
              <button id="closeSearch" className="close-search-btn">
                <kbd className="light-text"> ESC </kbd>
              </button>
            </div>
          </div>
        </div>
      </header>

    
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${mobileOpen ? "open" : ""}`}>
        <nav className="sidebar-nav mt-5">
          <ul className="mobile-menu-list">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                <i className="ri-home-line"></i>
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className={location.pathname === "/about" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                <i className="ri-information-line"></i>
                About
              </Link>
            </li>

            <li className="has-submenu">
              <div className="menu-item-header" onClick={() => setOpen(!open)}>
                <span>
                  <i className="ri-grid-line"></i>
                  Category
                </span>
                <i
                  className={`ri-arrow-down-s-line ${open ? "rotate" : ""}`}
                ></i>
              </div>

              <ul className={`submenu ${open ? "open" : ""}`}>
                {category?.length > 0 ? (
                  category.map((cat) => (
                    <li key={cat._id || cat.id}>
                      <Link
                        to="/category"
                        state={{ categoryId: cat.id }}
                        onClick={closeMobileMenu}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="no-categories">
                      No categories available
                    </span>
                  </li>
                )}
              </ul>
            </li>

            <li>
              <Link
                to="/blog"
                className={
                  location.pathname.startsWith("/blog") ? "active" : ""
                }
                onClick={closeMobileMenu}
              >
                <i className="ri-article-line"></i>
                Blog
              </Link>
            </li>

            <li>
              <Link
                to="/gallery"
                className={location.pathname === "/gallery" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                <i className="ri-gallery-line"></i>
                Gallery
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className={location.pathname === "/contact" ? "active" : ""}
                onClick={closeMobileMenu}
              >
                <i className="ri-mail-line"></i>
                Contact Us
              </Link>
            </li>
          </ul>

          <div className="sidebar-footer">
            <div className="auth-buttons">
              <Link to="/login" className="btn-login" onClick={closeMobileMenu}>
                <i className="ri-login-box-line"></i>
                Log In
              </Link>
              <Link
                to="/registration"
                className="btn-signup"
                onClick={closeMobileMenu}
              >
                <i className="ri-user-add-line"></i>
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        /* Desktop Category Dropdown Styles */
        .dropdown-container {
          position: relative;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 10px 15px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
        }

        .dropdown-trigger:hover {
          color: #007bff;
        }

        .dropdown-trigger i {
          margin-left: 8px;
          transition: transform 0.3s ease;
        }

        .dropdown-trigger i.rotate {
          transform: rotate(180deg);
        }

        .desktop-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          padding: 0;
          min-width: 650px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
          margin-top: 15px;
          border: 1px solid #e9ecef;
        }

        .dropdown-container.submenu-open .desktop-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-content {
          padding: 25px;
        }

        .dropdown-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .dropdown-column ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .dropdown-column li {
          margin-bottom: 8px;
        }

        .dropdown-link {
          display: block;
          padding: 8px 12px;
          color: #666;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-size: 13px;
          font-weight: 500;
          position: relative;
        }

        .dropdown-link:hover {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: #fff;
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        .dropdown-link::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 0;
          background: #007bff;
          border-radius: 2px;
          transition: height 0.3s ease;
        }

        .dropdown-link:hover::before {
          height: 100%;
        }

        /* Mobile Header Styles */
        .mobile-header {
          position: sticky;
          top: 0;
          background: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          height: 60px;
        }

        /* Hamburger Button */
        .hamburger-btn {
          display: flex;
          flex-direction: column;
          width: 25px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          justify-content: space-between;
          align-items: center;
          z-index: 1001;
        }

        .hamburger-btn span {
          display: block;
          width: 25px;
          height: 3px;
          background: #333;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger-btn.active span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .hamburger-btn.active span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger-btn.active span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* Mobile Sidebar */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: -350px;
          width: 320px;
          height: 100vh;
          background: #fff;
          box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 999;
          transition: right 0.3s ease;
          overflow-y: auto;
        }

        .mobile-sidebar.open {
          right: 0;
        }

        /* Sidebar Header */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }

        /* Sidebar Navigation */
        .sidebar-nav {
          padding: 20px 0;
        }

        .mobile-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-menu-list > li {
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-menu-list a,
        .menu-item-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .mobile-menu-list a:hover,
        .menu-item-header:hover {
          background: #f8f9fa;
          color: #007bff;
        }

        .mobile-menu-list a.active {
          background: #007bff;
          color: #fff;
        }

        .mobile-menu-list i {
          margin-right: 12px;
          font-size: 18px;
          width: 20px;
        }

        .has-submenu .menu-item-header {
          justify-content: space-between;
        }

        .menu-item-header .ri-arrow-down-s-line {
          margin-right: 0;
          transition: transform 0.3s ease;
        }

        .menu-item-header .ri-arrow-down-s-line.rotate {
          transform: rotate(180deg);
        }
        .submenu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: #f8f9fa;
          list-style: none;
          margin: 0;
          padding: 0;

          display: grid;
          grid-template-columns: repeat(2, 1fr); /* 2 items per row */
          gap: 5px; /* Less space between items for smaller look */
         
          font-size: 13px; /* Smaller text */
        }

        padding: 4px 6px; /* Smaller padding for each item */
        .submenu li {
          text-align: center; /* Center text if needed */
        }
        .submenu a {
          display: block;

          text-decoration: none;
          color: #333;
          font-size: 13px; /* Make link text smaller */
          padding: 4px 6px;
        }

        .submenu.open {
          max-height: 500px; /* Ensure it expands when open */
        }

        .submenu a:hover {
          color: #007bff;
          background: #f8f9fa;
          padding-left: 55px;
        }

        .no-categories {
          padding: 12px 20px 12px 50px;
          font-size: 14px;
          color: #999;
          font-style: italic;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          position: relative;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          border-top: 1px solid #eee;
          background: #fff;
        }

        .auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-login,
        .btn-signup {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-login {
          background: #fff;
          color: #007bff;
          border: 2px solid #007bff;
        }

        .btn-login:hover {
          background: #007bff;
          color: #fff;
        }

        .btn-signup {
          background: #007bff;
          color: #fff;
          border: 2px solid #007bff;
        }

        .btn-signup:hover {
          background: #0056b3;
          border-color: #0056b3;
        }

        .btn-login i,
        .btn-signup i {
          margin-right: 8px;
          font-size: 16px;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .mobile-sidebar {
            width: 100%;
            right: -100%;
          }
        }

        @media (max-width: 375px) {
          .mobile-sidebar {
            width: 100vw;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
