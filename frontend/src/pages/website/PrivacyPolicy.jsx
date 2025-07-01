import React from 'react'
import Breadcrumbs from '../../components/websitecomponents/Breadcrumbs';

const PrivacyPolicy = () => {
     const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Privacy Policy" , to: "#" }, // or current route
  ];   
  return (
  <div>  <Breadcrumbs title="Privacy Policy" links={breadcrumbLinks} /><div className="privacy-policy-area section-padding2">
    <div className="container">
      <div className="row">
        <div className="col-xl-12">
          {/* Single */}
          <div className="single-terms mb-30">
            <h5 className="title font-600">Lorem ipsum dolor sit amet consectetur.</h5>
            {/* Single Listing */}
            <ul className="experience listing listing2">
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">amet consectetur. Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">dolor sit amet consectetur. Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">Lorem ipsum dolor Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">ipsum dolor sit amet consectetur. Nibh pellentesque</p>
              </li>
            </ul>
          </div>
          {/* Single */}
          <div className="single-terms mb-30">
            <h5 className="title font-600">dolor sit amet consectetur</h5>
            <p className="pera mb-20">Lorem ipsum dolor sit amet consectetur. Nibh pellentesque vel sed
              malesuada morbi
              lobortis habitant vel. Nisi auctor id fusce nulla leo adipiscing a eu. Quam facilisis
              senectus mi diam.
              Elementum euismod aliquet at elit. Commodo facilisi arcu tincidunt cras elit dapibus
              vestibulum. Ipsum
              ornare eleifend</p>
            {/* Single Listing */}
            <ul className="experience listing listing2">
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">amet consectetur. Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">dolor sit amet consectetur. Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">Lorem ipsum dolor Nibh pellentesque</p>
              </li>
              <li className="single-list">
                <i className="ri-shield-check-line" />
                <p className="pera">ipsum dolor sit amet consectetur. Nibh pellentesque</p>
              </li>
            </ul>
          </div>
          {/* Single */}
          <div className="single-terms mb-30">
            <h5 className="title font-600">Lorem ipsum dolor</h5>
            <p className="pera mb-20">Lorem ipsum dolor sit amet consectetur. Nibh pellentesque vel sed
              malesuada morbi
              lobortis habitant vel. Nisi auctor id fusce nulla leo adipiscing a eu. Quam facilisis
              senectus mi diam.
              Elementum euismod aliquet at elit. Commodo facilisi arcu tincidunt cras elit dapibus
              vestibulum. Ipsum
              ornare eleifend at orci vel turpis. Tincidunt massa sagittis est scelerisque risus vel
              urna. Fermentum
              molestie turpis sed pellentesque enim risus pellentesque enim. Aliquam amet pharetra
              massa</p>
            <p className="pera mb-20">Arcu et justo quis aenean sed. Sollicitudin eget mus semper vitae nibh
              eget tortor
              commodo. Cursus vel scelerisque ut at. Lacus orci vel dolor eget velit aliquet. Sagittis
              laoreet non sed
              mattis tristique a ut. Volutpat consequat.</p>
          </div>
          {/* Single */}
          <div className="single-terms mb-0">
            <h5 className="title font-600">Acknowledgement</h5>
            <p className="pera mb-20">BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE
              THAT YOU HAVE
              READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.</p>
          </div>
          {/* Single */}
          <div className="single-terms mb-0">
            <h5 className="title font-600">Contact Us</h5>
            <p className="pera mb-20 text-normal">Email: <a href="#">initTheme@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  </div></div>

  )
}

export default PrivacyPolicy