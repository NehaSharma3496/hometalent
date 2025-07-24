import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetCategories } from "../../Services/webService/Web";

const Header = () => {
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchcategories = async () => {
    try {
      const response = await GetCategories(token);

      if (Array.isArray(response.data)) {
        setCategory(response.data);
        console.log("Categories loaded in Header:", response.data);
        // Debug: Check the structure of first category
        if (response.data.length > 0) {
          console.log("Sample category structure:", response.data[0]);
          console.log("Available ID fields:", {
            _id: response.data[0]._id,
            id: response.data[0].id,
            categoryId: response.data[0].categoryId
          });
        }
      } else {
        console.error("Expected array but got:", response.data);
        setCategory([]); // fallback
      }
    } catch (error) {
      console.log("Error fetching categories", error);
      setCategory([]); // fallback on error
    }
  };

  useEffect(() => {
    fetchcategories();
  }, []);

  const handleHeaderCategorySelect = (cat) => {
    console.log("Header category selected:", cat);
    
    // Try to get the correct ID field - check multiple possible fields
    const categoryId = cat._id || cat.id || cat.categoryId;
    
    console.log("Using category ID:", categoryId);
    
    if (categoryId) {
      // Navigate to the category page with the selected category ID as a query parameter
      navigate(`/category?categoryId=${categoryId}`);
    } else {
      console.error("No valid category ID found in:", cat);
    }
  };

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
                      <a href="">
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
                              <Link to="/" className="single link-active">
                                Home{" "}
                              </Link>
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
                                {Array.from({ length: 2 }, (_, colIndex) => (
                                  <div className="col-lg-6" key={colIndex}>
                                    <ul className="single-list">
                                      {category
                                        .filter((_, idx) =>
                                          colIndex === 0
                                            ? idx <
                                              Math.ceil(category.length / 2)
                                            : idx >=
                                              Math.ceil(category.length / 2)
                                        )
                                        .map((cat) => (
                                          <li
                                            className="single-list"
                                            key={cat._id || cat.id}
                                          >
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleHeaderCategorySelect(cat);
                                              }}
                                              className="single"
                                            >
                                              {cat.name}
                                            </a>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                              </ul>
                            </li>
                            <li className="single-list">
                              <a href="#" className="single">
                                Wedding Vogue
                                <i className="ri-arrow-down-s-line" />
                              </a>
                              <ul className="submenu">
                                <li className="single-list">
                                  <Link to="/blog" className="single">
                                    Blogs/Articles
                                  </Link>
                                </li>
                              </ul>
                            </li>
                            <li className="single-list">
                              <Link to="/gallery" className="single">
                                Gallery
                              </Link>
                            </li>
                            <li className="single-list">
                              <Link to="/contact" className="single">
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
                                    Free sign up
                                  </Link>
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
                      <Link to="/login" className="btn-primary ">
                        Log In
                      </Link>
                    </div>
                    <div className="freesign-btn">
                      <Link to="/registration" className="text-secondary">
                        Free sign up
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

