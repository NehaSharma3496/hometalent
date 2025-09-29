import React from "react";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";

const TermsCondition = () => {
  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Terms and Conditions", to: "#" }, // current page
  ];

  return (
    <div>
      <Breadcrumbs title="Terms and Conditions" links={breadcrumbLinks} />
      <div className="terms-condition area section-padding2">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              {/* Section 1 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  1. Introduction and Acceptance
                </h5>
                <p className="pera">
                  HomeTalent4u (“Platform”) is owned and operated by Cegano
                  Technology (“Company,” “we,” “us,” or “our”), a company
                  registered in India. These Terms and Conditions (“Terms”)
                  govern your use of the platform accessible at{" "}
                  <b>hometalent4u.in</b>. By accessing or using the Platform,
                  you agree to comply with and be legally bound by these Terms.
                  If you do not agree, please do not use the Platform.
                </p>
                <p className="pera">
                  We reserve the right to amend or update these Terms at any
                  time without prior notice. Continued Platform use after
                  changes constitutes acceptance of the revised Terms.
                </p>
              </div>

              {/* Section 2 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">2. User Eligibility</h5>
                <p className="pera">
                  The Platform is available to individuals and entities who are
                  at least 18 years old or of legal contracting age in their
                  jurisdiction. Vendors and customers must provide truthful,
                  accurate, and current information upon registration or use.
                </p>
                <p className="pera">
                  By registering as a vendor, you confirm you have the right to
                  showcase your products or services and that such offerings
                  comply with applicable laws.
                </p>
              </div>

              {/* Section 3 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  3. User Categories and Platform Use
                </h5>
                <p className="pera">
                  <b>Vendors:</b> Individuals or businesses who register
                  accounts to showcase products or services. Vendors are
                  responsible for maintaining accurate profile and content
                  information.
                </p>
                <p className="pera">
                  <b>Customers/Users:</b> Individuals who browse the Platform
                  freely to explore vendor offerings and make contact via the
                  Platform’s messaging system.
                </p>
                <p className="pera">
                  Customers do not need to register an account to browse or
                  contact vendors, but vendors must register to display their
                  offerings.
                </p>
              </div>

              {/* Section 4 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  4. Account Registration, Security & Responsibilities
                </h5>
                <p className="pera">Vendors must:</p>
                <ul className="pera">
                  <li>
                    Provide accurate registration and profile information.
                  </li>
                  <li>Keep account credentials confidential.</li>
                  <li>
                    Notify Cegano Technology promptly of any unauthorized
                    account use or security breaches.
                  </li>
                </ul>
                <p className="pera">
                  All account activity is the responsibility of the registered
                  user (vendor).
                </p>
              </div>

              {/* Section 5 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  5. User Content, Ownership, Rights & License
                </h5>
                <p className="pera">
                  Vendors retain ownership of all uploaded content, including
                  product/service descriptions, photos, and other materials
                  (“User Content”).
                </p>
                <p className="pera">
                  By uploading User Content, vendors grant Cegano Technology a
                  worldwide, non-exclusive, royalty-free, sublicensable, and
                  transferable license to use, reproduce, publicly display,
                  modify, distribute, and promote the content for Platform
                  operation, marketing, and promotional purposes.
                </p>
                <p className="pera">
                  Cegano Technology reserves the right to modify, edit, update,
                  or remove User Content or vendor details as necessary for
                  accuracy, legal compliance, Platform integrity, or to optimize
                  marketing and user experience. Such modifications may be made
                  without prior notice.
                </p>
                <p className="pera">
                  Vendors guarantee that their User Content is lawful, does not
                  infringe on third-party rights, and meets community standards.
                </p>
                <p className="pera">
                  The Platform does not endorse or warrant any products or
                  services offered by vendors.
                </p>
              </div>

              {/* Section 6 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">6. Intellectual Property</h5>
                <p className="pera">
                  All Platform content not uploaded by users—including logos,
                  software, text, graphics—is owned by Cegano Technology and
                  protected under Indian copyright and trademark laws. Users
                  must not use this content beyond permitted personal,
                  non-commercial use without explicit permission.
                </p>
              </div>

              {/* Section 7 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">7. Acceptable Use</h5>
                <p className="pera">
                  Users (vendors and customers) agree not to:
                </p>
                <ul className="pera">
                  <li>
                    Upload, transmit, or share unlawful, offensive, fraudulent,
                    or infringing content.
                  </li>
                  <li>
                    Use the Platform for unauthorized commercial activities or
                    illegal conduct.
                  </li>
                  <li>
                    Interfere with Platform security, introduce harmful code, or
                    attempt unauthorized access.
                  </li>
                </ul>
                <p className="pera">
                  Violations may result in account suspension, content removal,
                  or legal action.
                </p>
              </div>

              {/* Section 8 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  8. Messaging and Communication
                </h5>
                <p className="pera">
                  The Platform facilitates communication between customers and
                  vendors through a message box feature. Cegano Technology:
                </p>
                <ul className="pera">
                  <li>Does not guarantee receipt or response to messages.</li>
                  <li>
                    Is not responsible for disputes arising from communications
                    or transactions.
                  </li>
                  <li>
                    All dealings are strictly between customers and vendors.
                  </li>
                </ul>
              </div>

              {/* Section 9 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  9. Digital Marketing and Promotional Use
                </h5>
                <p className="pera">
                  By using the Platform, vendors and users consent to the use of
                  their User Content (including photos and descriptions) and
                  communicated information by Cegano Technology for digital
                  marketing campaigns, promotions, newsletters, social media
                  posts, and other promotional activities to support vendor
                  exposure and Platform growth.
                </p>
                <p className="pera">
                  Users may opt out of certain marketing communications as
                  outlined in the Privacy Policy.
                </p>
              </div>

              {/* Section 10 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  10. Payments and Transactions
                </h5>
                <p className="pera">
                  The Platform is a facilitator for connections and does not
                  process payments. Any sales, bookings, or payments are
                  directly between vendors and customers. Cegano Technology is
                  not responsible for disputes, warranties, or liabilities
                  arising from such transactions.
                </p>
              </div>

              {/* Section 11 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">11. Limitation of Liability</h5>
                <p className="pera">
                  The Platform is provided “as is” without warranties, express
                  or implied. Cegano Technology disclaims liability for damages
                  arising from Platform use or user transactions except as
                  required by law. Liability for gross negligence or willful
                  misconduct is not waived.
                </p>
              </div>

              {/* Section 12 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">12. Indemnification</h5>
                <p className="pera">
                  Users agree to indemnify, defend and hold harmless Cegano
                  Technology and its affiliates from any claims, damages,
                  losses, or liabilities arising from their conduct or breach of
                  the Terms.
                </p>
              </div>

              {/* Section 13 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  13. Termination and Suspension
                </h5>
                <p className="pera">
                  Cegano Technology reserves the right to suspend or terminate
                  any vendor or user account, without notice, for violation of
                  Terms or laws.
                </p>
              </div>

              {/* Section 14 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  14. Privacy and Data Protection
                </h5>
                <p className="pera">
                  Personal data usage and protection are governed by the
                  Platform’s Privacy Policy, which is incorporated herein.
                </p>
              </div>

              {/* Section 15 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  15. Governing Law and Dispute Resolution
                </h5>
                <p className="pera">
                  These Terms are governed by Indian law, with exclusive
                  jurisdiction and venue in courts located in Indore, Madhya
                  Pradesh.
                </p>
              </div>

              {/* Section 16 */}
              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  16. Severability and Entire Agreement
                </h5>
                <p className="pera">
                  If any provision is invalid or unenforceable, the rest shall
                  remain in force. These Terms constitute the entire agreement
                  between users and Cegano Technology regarding Platform use.
                </p>
              </div>

              <div className="single-terms mb-30">
                <h5 className="title font-600">
                  17. Refund, Return & Cancellation Policy
                </h5>
                <p className="pera">
                  All fees paid for profile listing or registration on
                  HomeTalent4u.in are non-refundable and non-cancellable. There
                  is no return, refund, or cancellation policy applicable to
                  vendor registrations or profile listings on this platform.
                </p>
              </div>

              {/* Section 17 */}
              <div className="single-terms mb-0">
                <h5 className="title font-600">18. Contact</h5>
                <p className="pera">
                  For support or inquiries:
                  <br />
                  <b>Cegano Technology</b>
                  <br />
                  Indore, Madhya Pradesh, India
                  <br />
                  Email:{" "}
                  <a href="mailto:support@hometalent4u.in">
                    contact@hometalent4u.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
