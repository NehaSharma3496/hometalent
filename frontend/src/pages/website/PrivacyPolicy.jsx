import React from "react";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";

const PrivacyPolicy = () => {
  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Privacy Policy", to: "#" }, // current page
  ];

  return (
    <div>
      <Breadcrumbs title="Privacy Policy" links={breadcrumbLinks} />
      <div className="privacy-policy-area section-padding2">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">

              {/* Section 1 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">1. Introduction</h5>
                <p className="pera">
                  HomeTalent4u is operated by Cegano Technology (“we,” “us”) and is committed
                  to protecting personal data privacy in compliance with Indian laws.
                </p>
              </div>

              {/* Section 2 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">2. Information We Collect</h5>
                <ul className="experience listing listing2">
                  <li className="single-list">
                    <i className="ri-shield-check-line" />
                    <p className="pera">Vendor registration details: name, contact, business information.</p>
                  </li>
                  <li className="single-list">
                    <i className="ri-shield-check-line" />
                    <p className="pera">User-generated content: photos, descriptions, messages.</p>
                  </li>
                  <li className="single-list">
                    <i className="ri-shield-check-line" />
                    <p className="pera">Technical data: IP addresses, cookies, device info.</p>
                  </li>
                  <li className="single-list">
                    <i className="ri-shield-check-line" />
                    <p className="pera">Interaction data: messages between customers and vendors.</p>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">3. How We Use Information</h5>
                <ul className="experience listing listing2">
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">To provide, maintain, and improve the Platform.</p></li>
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">To enable connection and communication between users and vendors.</p></li>
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">For digital marketing, promotional campaigns, and improving user experience.</p></li>
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">To comply with legal obligations and protect the Platform.</p></li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">4. Information Sharing</h5>
                <p className="pera">We do not sell personal data. We may share data:</p>
                <ul className="experience listing listing2">
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">With trusted service providers for Platform functioning.</p></li>
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">For promoting content with user consent.</p></li>
                  <li className="single-list"><i className="ri-shield-check-line" /><p className="pera">When legally required or to protect rights.</p></li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">5. User Control</h5>
                <p className="pera">
                  Users can access, correct, or request deletion of their data subject to legal conditions.
                  Marketing preferences can be managed via account settings or by contacting support.
                </p>
              </div>

              {/* Section 6 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">6. Data Security</h5>
                <p className="pera">
                  We use state-of-the-art security measures; however, no online method of transmission
                  is 100% secure.
                </p>
              </div>

              {/* Section 7 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">7. Cookies and Tracking</h5>
                <p className="pera">
                  Cookies help enhance service and marketing functionality. Users can manage preferences
                  in their browsers.
                </p>
              </div>

              {/* Section 8 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">8. Data Retention</h5>
                <p className="pera">
                  Data will be retained only as long as necessary for legitimate purposes and legal compliance.
                </p>
              </div>

              {/* Section 9 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">9. Children’s Privacy</h5>
                <p className="pera">
                  The Platform is not intended for children under 18. We do not knowingly collect data
                  from minors.
                </p>
              </div>

              {/* Section 10 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">10. Changes to Privacy Policy</h5>
                <p className="pera">
                  We may update this Policy; updates will be posted online. Continued use signifies acceptance.
                </p>
              </div>

              {/* Section 11 */}
              <div className="single-terms mb-0">
                <h5 className="title font-600">11. Contact</h5>
                <p className="pera">
                  Cegano Technology <br />
                  Indore, Madhya Pradesh, India <br />
                  Email: <a href="mailto:support@hometalent4u.in">support@hometalent4u.in</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
