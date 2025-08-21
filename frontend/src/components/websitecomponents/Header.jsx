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

  return (
    <header className="header-area-three">
      <div className="main-header">
        {/* Header Top */}
        <div className="header-top header-sticky sticky-bar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="top-menu-wrapper d-flex align-items-center justify-content-between">
                  <div className="top-header-right">
                    <div className="logo">
                      <a href="/">
                        <img
                          src="../assets/images//logo/logo.png"
                          width="100"
                          alt="logo"
                          className="changeLogo"
                        />
                      </a>
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
                              <Link
                                to="/"
                                className={`single ${location.pathname === "/" ? "link-active" : ""
                                  }`}
                              >
                                Home
                              </Link>
                            </li>
                            <li className="single-list">
                              <Link
                                to="/about"
                                className={`single ${location.pathname === "/about"
                                    ? "link-active"
                                    : ""
                                  }`}
                              >
                                About
                              </Link>
                            </li>
                            <li className={`single-list ${open ? "submenu-open" : ""}`}>
                              <Link
                                to="#"
                                className={`single ${location.pathname.startsWith("/category") ? "link-active" : ""
                                  }`}
                                onClick={(e) => {
                                  e.preventDefault(); // link default disable
                                  setOpen(!open);     // click par toggle
                                }}
                              >
                                Category
                                <i className="ri-arrow-down-s-line" />
                              </Link>

                              <ul className="row submenu">
                                {Array.from({ length: 2 }, (_, colIndex) => (
                                  <div className="col-lg-6" key={colIndex}>
                                    <ul>
                                      {category
                                        ?.filter((_, idx) =>
                                          colIndex === 0
                                            ? idx < Math.ceil(category.length / 2)
                                            : idx >= Math.ceil(category.length / 2)
                                        )
                                        ?.map((cat) => (
                                          <li key={cat._id || cat.id} className="mb-2">
                                            <Link
                                              to="/category"
                                              state={{ categoryId: cat.id }}
                                              className="single"
                                            >
                                              {cat.name}
                                            </Link>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                              </ul>
                            </li>
                            <li className="single-list">
                              <Link
                                to="/blog"
                                className={`single ${location.pathname.startsWith("/blog")
                                    ? "link-active"
                                    : ""
                                  }`}
                              >
                                Blog
                              </Link>
                            </li>
                            <li className="single-list">
                              <Link
                                to="/gallery"
                                className={`single ${location.pathname === "/gallery"
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
                                className={`single ${location.pathname === "/contact"
                                    ? "link-active"
                                    : ""
                                  }`}
                              >
                                Contact us
                              </Link>
                            </li>

                            <li className="d-block d-lg-none">
                              <div className="header-right-three pl-15 mt-10">
                                <div className="sign-btn">
                                  <a
                                    href="login.html"
                                    className="btn-primary m-0"
                                  >
                                    Log In
                                  </a>
                                </div>
                                <div className="freesign-btn">
                                  <Link
                                    to="/contact"
                                    className="text-secondary"
                                  >
                                    Sign Up
                                  </Link>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </nav>
                    </div>
                  </div>
                  <div className="gap-10  d-none d-lg-flex">
                    <div className="sign-btn">
                      <Link to="/login" className="btn-primary ">
                        Log In
                      </Link>
                    </div>
                    <div className="sign-btn">
                      <Link to="/registration" className="btn-primary ">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-bottom header-sticky sticky-bar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="div">
                  <div className=" d-block d-lg-none">
                    <div className="logo mt-3">
                      <a href="index.html">
                        <img
                          src="../assets/images//logo/logo.png"
                          width="100"
                          alt="logo"
                          className="changeLogo"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="mobile_menu d-block d-lg-none" />
                </div>
              </div>
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
  );
};

export default Header;
