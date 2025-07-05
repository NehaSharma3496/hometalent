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
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
     <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
   <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
    <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
      <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
     <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
     <div className="col-xl-4 col-lg-4 col-sm-6">
        <article className="news-card-two">
          <figure className="news-banner-two imgEffect">
            <Link to="/blogdetail">
              <img src='../assets/images//news/banner-1.png' alt="travello" />
            </Link>
          </figure>
          <div className="news-content">
            <div className="heading">
              <span className="heading-pera">Tour Guide</span>
            </div>
            <h4 className="title line-clamp-2">
               <Link to="/blogdetail">The World is a Book and Those Who do not Travel Read
                Only
                One Page.</Link>
            </h4>
          
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

</div>
  )
}

export default Blog