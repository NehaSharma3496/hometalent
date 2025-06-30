import React from 'react'
import {Link} from 'react-router-dom'
import Breadcrumbs from '../../../components/websitecomponents/Breadcrumbs'
 
const Blog = () => {
const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "#" }, // or current route
  ];


  return (
    <div>
       <Breadcrumbs title="Blog" links={breadcrumbLinks} />
    <section className="news-area top-bottom-padding2">
  <div className="container">
    
    <div className="row g-4">
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-4.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-5.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-6.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-7.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-8.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-9.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-10.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-11.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <a href="news-details.html">
              <img src="assets/images/news/news-12.png" alt="travello" />
            </a>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
              <a href="news-details.html">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</a>
            </h4>
          
          </div>
        </article>
      </div>
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
</section>

</div>
  )
}

export default Blog