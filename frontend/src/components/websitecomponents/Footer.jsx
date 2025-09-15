import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrapper footer-bg">
        <div className="container">
          <div className="footer-area">
            <div className="row g-4">
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="single-footer-caption">
                  <div className="footer-tittle">
                    <h4 className="title">GET IN TOUCH</h4>
                    <ul className="listing">
                      <li className="single-lsit">
                        <a href="#">
                          <div className="d-flex gap-12 align-items-center">
                            <img
                              src="../assets/images/footer/map.png"
                              alt="location"
                              width="20"
                              height="20"
                            />
                            Indore (M.P.), India
                          </div>
                        </a>
                      </li>
                      <li className="single-lsit">
                        <a href="#">
                          <div className="d-flex gap-12 align-items-center">
                            <img
                              src="../assets/images/footer/phone.png"
                              alt="phone"
                              width="20"
                              height="20"
                            />
                           (+91) 9893545348
                          </div>
                        </a>
                      </li>
                      <li className="single-lsit">
                        <a href="#">
                          <div className="d-flex gap-12 align-items-center">
                            <img
                              src="../assets/images/footer/email.png"
                              alt="email"
                              width="20"
                              height="20"
                            />
                           info@hometalent4u.com
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="single-footer-caption">
                  <div className="footer-tittle">
                    <h4 className="title">HELP & SUPPORT</h4>
                    <ul className="listing">
                      <li className="single-lsit">
                        <Link to="/about">About</Link>
                      </li>
                      {/* <li className="single-lsit">
                        <a href="news.html">Company</a>
                      </li> */}
                      <li className="single-lsit">
                        <Link to="/contact">Contact</Link>
                      </li>
                      {/* <li className="single-lsit">
                        <a href="contact.html">Feedback</a>
                      </li> */}
                      <li className="single-lsit">
                        <Link to="/faq">FAQs</Link>
                      </li>
                      <li className="single-lsit">
                        <Link to="/gallery">Gallery</Link>
                      </li>
                      <li className="single-lsit">
                        <Link to="/feedback">Feedback</Link>
                      </li>
                        <li className="single-lsit">
                        <Link to="/registration">Vendor Registration</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-sm-6">
                <div className="single-footer-caption">
                  <div className="footer-tittle">
                    <h4 className="title">FOLLOW US ON</h4>
                    <ul className="listing d-flex gap-8">
                      <li className="single-lsit">
                        <a href="https://www.facebook.com/share/1CkQq5n3t9/">
                          <img
                            src="../assets/images/footer/facebook.png"
                            alt="facebook"
                          />
                        </a>
                      </li>
                      <li className="single-lsit">
                        <a href="https://x.com/hometalent4u">
                          <img
                            src="../assets/images/footer/twitter.png"
                            alt="twitter"
                          />
                        </a>
                      </li>
                      <li className="single-lsit">
                        <a href="https://www.youtube.com/@hometalent4u">
                          <img
                            src="../assets/images/footer/youtube.png"
                            alt="youtube"
                          />
                        </a>
                      </li>
                      <li className="single-lsit">
                        <a href="https://www.instagram.com/hometalent4u/">
                          <img
                            src="../assets/images/footer/instagram.png"
                            alt="instagram"
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-image float-lg-end mt-3 ">
                  <img
                    src="../assets/images/footer/footer-img.png"
                    alt="footer"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
        {/* footer-bottom area */}

        <div className="footer-bottom-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between gap-14 flex-wrap">
                  <p className="pera">
                    Copyright © <span className="current-year">2025</span>{" "}
                    HomeTalent4u All Rights Reserved
                  </p>
                  <div className="footer-menu d-flex gap-20">
                    <Link to="/termscondition">
                      <p className="pera">Terms and conditions</p>
                    </Link>
                    <Link to="/privacypolicy">
                      <p className="pera">Privacy policy</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
