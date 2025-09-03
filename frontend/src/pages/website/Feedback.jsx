import React, { useState } from "react";
import Swal from "sweetalert2";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";
import { SubmitFeedback } from "../../Services/webService/Web";

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = feedbackData;

    // Validation
    if (!name || !email || !phone || !message) {
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

    // Submit
    try {
      const res = await SubmitFeedback(feedbackData);
      if (res?.status === true) {
        Swal.fire({
          icon: "success",
          title: "Feedback Sent",
          text: "Thank you for your feedback!",
        });
        setFeedbackData({ name: "", email: "", phone: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.data?.message || "Failed to send feedback.",
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
    { label: "Feedback", to: "#" },
  ];

  return (
    <div>
      <Breadcrumbs title="Feedback" links={breadcrumbLinks} />
      <section className="contact-area section-padding2">
        <div className="position-relative contact-bg-before">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-9">
                <div className="contact-card">
                  <h4 className="contact-heading">
                    We Value Your Feedback
                  </h4>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="row g-4">
                      <div className="col-sm-6">
                        <input
                          name="name"
                          value={feedbackData.name}
                          onChange={handleChange}
                          className="custom-form"
                          type="text"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          name="email"
                          value={feedbackData.email}
                          onChange={handleChange}
                          className="custom-form"
                          type="email"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          name="phone"
                          value={feedbackData.phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              setFeedbackData((prev) => ({ ...prev, phone: value }));
                            }
                          }}
                          className="custom-form"
                          type="text"
                          placeholder="Your Phone"
                        />
                      </div>
                      <div className="col-sm-12">
                        <textarea
                          name="message"
                          value={feedbackData.message}
                          onChange={handleChange}
                          className="custom-form-textarea"
                          rows={5}
                          placeholder="Enter your feedback..."
                        />
                      </div>
                    </div>
                    <div className="mt-40">
                      <button type="submit" className="send-btn">
                        Submit Feedback
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

export default Feedback;
