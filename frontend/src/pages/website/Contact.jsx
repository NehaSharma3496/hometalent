import React, { useState } from "react";
import Swal from "sweetalert2";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";
import { SubmitContactData } from "../../Services/webService/Web";

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, subject, message } = contactData;

    if (!name || !email || !phone || !subject || !message) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Name",
        text: "Name must contain only alphabets.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 10 digits.",
      });
      return;
    }

    try {
      const res = await SubmitContactData(contactData);
      if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "Thank you for contacting us!",
        });
        setContactData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.data?.message || "Failed to send message.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Contact", to: "#" },
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
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="row g-4">
                      <div className="col-sm-6 mt-4">
                        <input
                          name="name"
                          value={contactData.name}
                          onChange={handleChange}
                          className="custom-form"
                          type="text"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="col-sm-6 mt-4">
                        <input
                          name="email"
                          value={contactData.email}
                          onChange={handleChange}
                          className="custom-form"
                          type="email"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="col-sm-6 mt-2">
                        <input
                          name="phone"
                          value={contactData.phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              setContactData((prev) => ({
                                ...prev,
                                phone: value,
                              }));
                            }
                          }}
                          className="custom-form"
                          type="text"
                          placeholder="Your Phone"
                        />
                      </div>
                      <div className="col-sm-6 mt-2">
                        <input
                          name="subject"
                          value={contactData.subject}
                          onChange={handleChange}
                          className="custom-form"
                          type="text"
                          placeholder="Select subject"
                        />
                      </div>
                      <div className="col-sm-12 mt-2">
                        <textarea
                          name="message"
                          value={contactData.message}
                          onChange={handleChange}
                          className="custom-form-textarea"
                          rows={5}
                          placeholder="Enter your message..."
                        />
                      </div>
                    </div>
                    <div className="mt-4">
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
