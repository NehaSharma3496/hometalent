import React from "react";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";

const Contact = () => {
  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Contact", to: "#" }, // or current route
  ];

  return (
    <div>
      <Breadcrumbs title="Contact" links={breadcrumbLinks} />
      <section className="contact-area section-padding2">
        <div className="position-relative contact-bg-before">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-9">
                <div className="contact-card">
                  <h4 className="contact-heading">
                    Feel Free to Write us Anytime
                  </h4>
                  <form method="post" className="contact-form">
                    <div className="row g-4">
                      <div className="col-sm-6">
                        <input
                          className="custom-form"
                          type="text"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="custom-form"
                          type="text"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="custom-form"
                          type="text"
                          placeholder="Your Phone"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          className="custom-form"
                          type="text"
                          placeholder="Select subject"
                        />
                      </div>
                      <div className="col-sm-12">
                        <textarea
                          className="custom-form-textarea"
                          id="exampleFormControlTextarea1"
                          rows={5}
                          placeholder="Enter your message..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="mt-40">
                      <button type="submit" className="send-btn">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
