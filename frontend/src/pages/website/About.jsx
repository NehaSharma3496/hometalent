import React from "react";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";
import { Link ,useNavigate} from "react-router-dom";


const About = () => {

const navigate=useNavigate();

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "#" }, // or current route
  ];

  return (
    <div>
      <Breadcrumbs title="About Us" links={breadcrumbLinks} />
      <section className="about-area pb-0">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 mx-auto">
              <div className="section-title ">
                <h4 className="title">Our Story</h4>
                <span className="highlights">
                  HomeTalent4U was born from a simple belief: everyone deserves
                  a platform to showcase their skills and creativity, no matter
                  where they work from. We noticed that countless talented
                  individuals were crafting unique products or offering valuable
                  services from the comfort of their homes, but struggled to
                  reach customers beyond their immediate circles. Our mission is
                  to bridge that gap—helping home-based creators and service
                  providers connect with people seeking authentic, handmade
                  goods and personalized services, both locally and across the
                  nation
                </span>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-xl-6 col-lg-6" style={{marginBottom:"40px"}}>
              <div className="section-title mx-430 mb-30 w-md-100" >
                {/* <span className="highlights fancy-font font-400">About Us</span> */}
                {/* <h4 className="title">
             Empowering Local Talent, Connecting Communitie
            </h4> */}
                <div>
                  <h6 className="title fs-4">What We Do </h6>
                  <p className="pera ">
                    HomeTalent4U is a digital Platform dedicated to supporting
                    homegrown talent. Whether you make artisanal crafts, bake
                    delicious treats, offer tutoring, or provide any service
                    from home, we give you the tools and exposure you need to
                    grow. For customers, we make it easy to discover and support
                    local makers and service providers.
                  </p>
                </div>
                <div className="mt-4">
                  <h6 className="title fs-4">How It Works
</h6>
                  <p className="pera ">
                    Creators and service providers can easily set up their profiles, showcase their offerings, and connect with customers. Shoppers and clients can browse by category or location, read reviews, and make purchases or bookings directly through our platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="about-count-section about-count-before-bg">
                <div className="banner">
                  <img
                    src='../assets/images//gallery/about-banner-three.png'
                    alt="travello"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-xl-12">
               <div className="price-card ms-0 ps-0 shadow-none border-0">
                  <h6 className="title ms-2 fs-4">Who We Serve</h6>
                  <p className="pera mt-0">
                    <ul class="feature-points">
                      <li className="feature-point">
                        <div className="tick-icon">
                          <i className="ri-check-line curcle-Redius"></i>
                        </div>
                        <p className="pera mt-0">
                          Makers & Creators: Individuals who craft, bake, sew,
                          build, or create from home.
                        </p>
                      </li>
                      <li className="feature-point">
                        <div className="tick-icon">
                          <i className="ri-check-line curcle-Redius"></i>
                        </div>
                        <p className="pera mt-0">
                          Service Providers: Tutors, therapists, consultants,
                          and anyone offering a skill or service remotely or
                          locally.
                        </p>
                      </li>
                      <li className="feature-point">
                        <div className="tick-icon">
                          <i className="ri-check-line curcle-Redius"></i>
                        </div>
                        <p className="pera mt-0">
                          Customers: Shoppers and clients who value unique,
                          handmade goods and personalized services, and want to
                          support local talent.
                        </p>
                      </li>
                    </ul>
                  </p>
                </div>
              <div className="price-card ms-0 ps-0 shadow-none border-0">
                <h6 className="title fs-4">Our Mission & Values
</h6>
                <p className="pera mt-0">
                  <ul class="feature-points">
                    <li className="feature-point">
                      <div className="tick-icon">
                        <i className="ri-check-line curcle-Redius"></i>
                      </div>
                      <p className="pera mt-0">
                       Empowerment: We empower home-based entrepreneurs to reach new markets and realize their dreams.

                      </p>
                    </li>
                    <li className="feature-point">
                      <div className="tick-icon">
                        <i className="ri-check-line curcle-Redius"></i>
                      </div>
                      <p className="pera mt-0">
                        Community: We believe in the power of local connections and supporting small businesses.
                      </p>
                    </li>
                    <li className="feature-point">
                      <div className="tick-icon">
                        <i className="ri-check-line curcle-Redius"></i>
                      </div>
                      <p className="pera mt-0">
                        Trust: We foster a transparent, safe, and supportive environment for both sellers and buyers.
                      </p>
                    </li>
                     <li className="feature-point">
                      <div className="tick-icon">
                        <i className="ri-check-line curcle-Redius"></i>
                      </div>
                      <p className="pera mt-0">
                        Quality: We celebrate the craftsmanship and dedication behind every product and service showcased on our platform
                      </p>
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
         <section className="cta-area cta-bg">
        <div className="container"> 
          <div className="row">
            <div className="col-xl-12 col-lg-12 mx-auto"> 
            
            <div class="news-details-quote mt-0">
                            <h4 class="title">Ready to discover something unique or share your talent with the world?</h4>
                           <button   onClick={() => navigate("/contact")} class="btn-primary">Join HomeTalent4U Today</button>
                        </div>
          </div>
        </div>
        </div>
          </section>
         <section className="platform-area platform-area-bg">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-8">
              <div className="app-section-padding  ">
                <div className="hero-caption-one  bg-white radius-10 p-30">
                  <h4 className="blue-title pb-4">Join Us
</h4>
                  <p className="pera mb-1">
                  Whether you’re a maker, a service provider, or a supporter of local talent, HomeTalent4U invites you to be part of our growing community. Explore, connect, and help us celebrate the incredible skills found in homes across the country.

                  </p>
                
                </div>
              </div>
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
      </section>
   
    </div>
  );
};

export default About;
