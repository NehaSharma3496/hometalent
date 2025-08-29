import React from "react";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";

const Faq = () => {
  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "FAQ", to: "#" }, // or current route
  ];
  return (
    <div>
      {" "}
      <Breadcrumbs title="FAQ" links={breadcrumbLinks} />{" "}
      <div>
        <section className="question-area section-padding">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                {/* Section Tittle */}
                <div className="section-tittle mb-50">
                  <h2 className="title font-700">Any Questions</h2>
                  <p className="pera">
                    When deciding which charity to donate to, it's important to
                    do your search and find one that aligns with your values and
                    interests.
                  </p>
                </div>
                <div className="accordion" id="accordionExample">
                  {/* Single */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        What is HomeTalent4U?
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        HomeTalent4U is a digital platform that helps homegrown
                        talent showcase and sell their products or services,
                        such as handmade crafts, home-baked goods, tutoring, and
                        more.
                      </div>
                    </div>
                  </div>
                  {/* Single */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed additional-styles"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Who can join HomeTalent4U?
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Anyone who creates handmade products, provides
                        home-based services, or has unique talents to share can
                        join.
                      </div>
                    </div>
                  </div>
                  {/* Single */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed additional-styles"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Is there any registration fee to join HomeTalent4U?
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Basic registration is free, but we also offer premium
                        plans with extra features for better visibility and
                        marketing.
                      </div>
                    </div>
                  </div>
                  {/* Single */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <button
                        className="accordion-button collapsed additional-styles"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        How do I register as a seller on HomeTalent4U?
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Simply sign up on our platform, complete your profile,
                        and upload details of your products or services.
                      </div>
                    </div>
                  </div>
                  {/* Single */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                      <button
                        className="accordion-button collapsed additional-styles"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFive"
                        aria-expanded="false"
                        aria-controls="collapseFive"
                      >
                        What kind of products/services can I list?
                      </button>
                    </h2>
                    <div
                      id="collapseFive"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFive"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        You can list artisanal crafts, handmade jewelry,
                        home-baked food, art, tutoring services, and other
                        homegrown talents.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5">
                <img
                  className="w-100 d-none d-lg-block tilt-effect radius-10"
                  src="assets/images/gallery/faq.jpg"
                  alt="image"
                />
              </div>
            </div>
          </div>
        </section>
        {/*/ End-of Question Area */}
        {/* FAQs S t r t */}
        {/* <div className="faqs-area bottom-padding">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                
                <div className="single-terms mb-30">
                  <h5 className="title font-600">dolor sit amet consectetur</h5>
                  <p className="pera mb-20">
                    Lorem ipsum dolor sit amet consectetur. Nibh pellentesque
                    vel sed malesuada morbi lobortis habitant vel. Nisi auctor
                    id fusce nulla leo adipiscing a eu. Quam facilisis senectus
                    mi diam. Elementum euismod aliquet at elit. Commodo facilisi
                    arcu tincidunt cras elit dapibus vestibulum. Ipsum ornare
                    eleifend
                  </p>
                 
                  <ul className="experience listing listing2">
                    <li className="single-list">
                      <i className="ri-shield-check-line" />
                      <p className="pera">
                        amet consectetur. Nibh pellentesque
                      </p>
                    </li>
                    <li className="single-list">
                      <i className="ri-shield-check-line" />
                      <p className="pera">
                        dolor sit amet consectetur. Nibh pellentesque
                      </p>
                    </li>
                    <li className="single-list">
                      <i className="ri-shield-check-line" />
                      <p className="pera">Nibh pellentesque</p>
                    </li>
                    <li className="single-list">
                      <i className="ri-shield-check-line" />
                      <p className="pera">
                        Lorem ipsum dolor Nibh pellentesque
                      </p>
                    </li>
                    <li className="single-list">
                      <i className="ri-shield-check-line" />
                      <p className="pera">
                        ipsum dolor sit amet consectetur. Nibh pellentesque
                      </p>
                    </li>
                  </ul>
                </div>
              
                <div className="single-terms mb-30">
                  <h5 className="title font-600">Lorem ipsum dolor</h5>
                  <p className="pera mb-20">
                    Lorem ipsum dolor sit amet consectetur. Nibh pellentesque
                    vel sed malesuada morbi lobortis habitant vel. Nisi auctor
                    id fusce nulla leo adipiscing a eu. Quam facilisis senectus
                    mi diam. Elementum euismod aliquet at elit. Commodo facilisi
                    arcu tincidunt cras elit dapibus vestibulum. Ipsum ornare
                    eleifend at orci vel turpis. Tincidunt massa sagittis est
                    scelerisque risus vel urna. Fermentum molestie turpis sed
                    pellentesque enim risus pellentesque enim. Aliquam amet
                    pharetra massa
                  </p>
                  <p className="pera mb-20">
                    Arcu et justo quis aenean sed. Sollicitudin eget mus semper
                    vitae nibh eget tortor commodo. Cursus vel scelerisque ut
                    at. Lacus orci vel dolor eget velit aliquet. Sagittis
                    laoreet non sed mattis tristique a ut. Volutpat consequat.
                  </p>
                </div>
           
                <div className="single-terms mb-0">
                  <h5 className="title font-600">Acknowledgement</h5>
                  <p className="pera mb-20">
                    BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU
                    ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND
                    AGREE TO BE BOUND BY THEM.
                  </p>
                </div>
               
                <div className="single-terms mb-0">
                  <h5 className="title font-600">Contact Us</h5>
                  <p className="pera mb-20 text-normal">
                    Email: <a href="#">initTheme@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Faq;
