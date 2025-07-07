import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetStateCity } from "../../Services/webService/Web";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetCategories, getcitiesplan } from "../../Services/webService/Web";

const Home = () => {

  const [categories, setCategories] = useState([])

  const [statecity, setStateCity] = React.useState([]);


  const token = localStorage.getItem('token');

  const fetchcategories = async () => {
    try {
      const response = await GetCategories(token);
      setCategories(response.data);
    } catch (error) {
      console.log("Error fetching services", error);
    }
  }

  // const fetchstatecity = async () => {
  //   try {
  //     const response = await GetStateCity();
  //     setStateCity(response.data);
  //     console.log("City", response.data[1].name);
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    // fetchstatecity();
    fetchcategories();
  }, [])












  const testimonials = [
    {
      name: "Jacob Jones",
      title: "CEO, Traveller",
      quote:
        "Lorem ipsum dolor sit amet amet early ameeny consectetur adipiscing elit. Ipsum dolor consectetur.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      name: "Sarah Lee",
      title: "Manager, Explorer",
      quote:
        "Lorem ipsum dolor sit amet amet early ameeny consectetur adipiscing elit. Ipsum dolor consectetur.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
    },
    {
      name: "Michael Smith",
      title: "CTO, TravelX",
      quote:
        "Lorem ipsum dolor sit amet amet early ameeny consectetur adipiscing elit. Ipsum dolor consectetur.",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200, // below 1200px
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992, // below 992px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // below 768px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // below 480px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div>
      <section className="hero-padding-for-three video-overlay position-relative hero-area">
        {/* Video */}

        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-xl-12">
              <div className="hero-caption-three position-relative z-3">
                <h4
                  className="title wow fadeInUp text-center"
                  data-wow-delay="0.0s"
                >
                  Platform for home creators
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="plan-area-three">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto col-sm-12">
              <div className="plan-section-three plan-shadow">
                <div className="choose-plan-nav">
                  <div className="">
                    <div className="row g-4 justify-content-end">
                      <div className="col-xl-5 col-lg-12">
                        <select className="form-select ">
                          <option value="">Search City</option>
                          {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-xl-5 col-lg-12">
                        <div className="destination-flex">
                          <select className="form-select" >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-xl-2 col-lg-3">
                        <div className="sign-btn text-right">
                          <a
                            style={{ height: "54px", lineHeight: "30px" }}
                            href="tour-list.html"
                            className="btn-primary w-100 text-center"
                          >
                            Find Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-area ">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-auto position-relative">
                <h4 className="blue-title">Explore top vendors by category</h4>
                <span className="highlights">
                  from wedding lawns and marriage gardens to photographers,
                  bridal wear, makeup artists, and more — all with HomeTalent4u.
                </span>
              </div>
            </div>
          </div>
          <div className="grid5-container">
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">

                <img src='../assets/images//category/image.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Fabric Painting</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-1.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Canvas Painting</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-2.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Mehandi Art</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-3.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Catering</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-4.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15 py-3">
                    <div className="category-name">
                      <p className="pera">Cook/Chef on call</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-5.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Bakery item</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-6.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-6">
                    <div className="category-name">
                      <p className="pera mb-0">Food </p>
                      <p className="small-text mt-0 text-black" style={{ fontSize: "11px" }}>(Namkeen,Sweets, snacks)</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to='/categorydetail' className="category-banner">
                <img src='../assets/images//category/image-7.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Gift & Packaging</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-8.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15">
                    <div className="category-name">
                      <p className="pera">Jewellery</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="grid-item ">
              <Link to="/categorydetail" className="category-banner">
                <img src='../assets/images//category/image-9.png' alt="travello" />
                <div className="category-content">
                  <div className="category-info py-15 py-3">
                    <div className="category-name">
                      <p className="pera">Cosmetics</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <button className="btn-primary mx-auto d-block mt-4">
            View All Categories{" "}
          </button>
        </div>
      </section>
      <section className="platform-area platform-area-bg">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-8">
              <div className="app-section-padding  ">
                <div className="hero-caption-one  bg-white radius-10 p-30">
                  <h4 className="blue-title pb-4">Why HomeTalent4u?</h4>
                  <p className="pera mb-1">
                    HomeTalent4U is a digital Platform dedicated to supporting
                    homegrown talent. Whether you make artisanal crafts, bake
                    delicious treats, offer tutoring, or provide any service
                    from home, we give you the tools and exposure you need to
                    grow. For customers, we make it easy to discover and support
                    local makers and service providers.
                  </p>
                  <Link to="about.html">Read More...</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
      </section>

      <section className="testimonial-area testimonial-bg section-padding2 pb-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-auto position-relative">
                <h4 className="blue-title pb-3">
                  See Those Lovely Words From Clients
                </h4>
                <span className="highlights">
                  HomeTalent4U is a digital Platform dedicated to supporting
                  homegrown talent. Whether you make artisanal crafts, bake
                  delicious treats, offer tutoring,
                </span>
              </div>
            </div>
          </div>
          <Slider {...settings}>
            {testimonials.map((item, index) => (
              <div className="testimonial-card" key={index}>
                <div className="quote-icon">
                  <img src=
                    '../assets/images//testimonial/iconoir_quote.png'
                    alt="quote"
                  />
                </div>
                <div className="user-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p className="title">{item.title}</p>
                  </div>
                </div>
                <p className="message pt-2">{item.quote}</p>
                <div className="rating pt-3">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`ri-star-fill ${i < item.rating ? "active" : ""
                        }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="news-area section-padding2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-7">
              <div className="section-title text-center mx-605 mx-auto position-relative mb-60">
                <h4 className="blue-title pb-2">Blog & Articles</h4>
                <span className="highlights">
                  HomeTalent4U is a digital Platform dedicated to supporting
                  homegrown talent. Whether you make artisanal crafts, bake
                  delicious treats, offer tutoring,
                </span>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <article className="news-card-two">
                <figure className="news-banner-two imgEffect">
                  <Link to="news-details.html">
                    <img src='../assets/images//news/image-1.png' alt="travello" />
                  </Link>
                </figure>
                <div className="news-content">
                  <div className="date d-lg-flex ">
                    <div className="news-info">
                      <p className="date-time">12 Jan 2023</p>
                    </div>
                    <span className="px-15">|</span>
                    <div className="category-name">
                      <span className=" text-primary">Home Talent</span>
                    </div>
                  </div>
                  <h4 className="title mb-2">
                    <Link to="news-details.html">Wedding arrangements</Link>
                  </h4>

                  <div className="news-description">
                    <p className="pera">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                  <div className="">
                    <Link to="news.html" className=" btn-primary-sm btn-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <article className="news-card-two">
                <figure className="news-banner-two imgEffect">
                  <Link to="news-details.html">
                    <img src='../assets/images//news/image-2.png' alt="travello" />
                  </Link>
                </figure>
                <div className="news-content">
                  <div className="date d-lg-flex ">
                    <div className="news-info">
                      <p className="date-time">12 Jan 2023</p>
                    </div>
                    <span className="px-15">|</span>
                    <div className="category-name">
                      <span className=" text-primary">Home Talent</span>
                    </div>
                  </div>
                  <h4 className="title mb-2">
                    <Link to="news-details.html">Wedding arrangements</Link>
                  </h4>

                  <div className="news-description">
                    <p className="pera">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                  <div className="">
                    <Link to="news.html" className=" btn-primary-sm btn-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-6">
              <article className="news-card-two">
                <figure className="news-banner-two imgEffect">
                  <Link to="news-details.html">
                    <img src='../assets/images//news/image-3.png' alt="travello" />
                  </Link>
                </figure>
                <div className="news-content">
                  <div className="date d-lg-flex ">
                    <div className="news-info">
                      <p className="date-time">12 Jan 2023</p>
                    </div>
                    <span className="px-15">|</span>
                    <div className="category-name">
                      <span className=" text-primary">Home Talent</span>
                    </div>
                  </div>
                  <h4 className="title mb-2">
                    <Link to="news-details.html">Wedding arrangements</Link>
                  </h4>

                  <div className="news-description">
                    <p className="pera">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                  <div className="">
                    <Link to="news.html" className=" btn-primary-sm btn-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
