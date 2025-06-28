import React from 'react'
import Breadcrumbs from '../components/websitecomponents/Breadcrumbs';


const Registration = () => {
   const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Register", to: "#" }, // or current route
  ];
  return (
   <div>
       <Breadcrumbs title="Register" links={breadcrumbLinks} /> 
       <section className="contact-area section-padding2">
    <form className="container mt-4">
      <div className="contact-card">
    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="ownerName" className="form-label">Owner Name*</label>
        <input type="text" className="custom-form" id="ownerName" required />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="profileName" className="form-label">Profile Name</label>
        <input type="text" className="custom-form" id="profileName" />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="state" className="form-label">State*</label>
        <input type="text" className="custom-form" id="state" required />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="city" className="form-label">City*</label>
        <input type="text" className="custom-form" id="city" required />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="pin" className="form-label">Pin Code*</label>
        <input type="text" className="custom-form" id="pin" required />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="phone" className="form-label">Phone* (Hidden in profile)</label>
        <input type="tel" className="custom-form" id="phone" required />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="form-label">Email*</label>
        <input type="email" className="custom-form" id="email" required />
      </div>
     
        <div className="col-md-6 mb-3">
        <label htmlFor="priceRange" className="form-label">Estimated Price Range</label>
        <input type="text" className="custom-form" id="priceRange" />
      </div>
      <div className="col-md-12 mb-3">
        <label htmlFor="shortDesc" className="form-label">One Line Description</label>
        <input type="text" className="custom-form" id="shortDesc" />
      </div>
     <div className="col-md-6 mb-3">
        <label htmlFor="category" className="form-label">Category Select* (max 2)</label>
        <select className="form-select" id="category" multiple required>
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
          <option value="grocery">Grocery</option>
          <option value="services">Services</option>
          <option value="others">Others</option>
        </select>
        <small className="text-muted">Hold Ctrl or Cmd to select multiple</small>
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="experience" className="form-label">Experience Since</label>
        <input type="text" className="custom-form" id="experience" />
      </div>
      <div className="col-12 mb-3">
        <label htmlFor="longDesc" className="form-label">Large Description (About shop or product)</label>
        <textarea className="custom-form-textarea" id="longDesc" rows={4} defaultValue={""} />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="images" className="form-label">Images (Max 30)</label>
        <input type="file" className="custom-form" id="images" multiple accept="image/*" />
        <small className="text-muted">Max 30 images allowed</small>
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="videos" className="form-label">Videos (Max 3)</label>
        <input type="file" className="custom-form" id="videos" multiple accept="video/*" />
        <small className="text-muted">Max 3 videos allowed</small>
      </div>
      <div className="col-12 mb-3">
        <label htmlFor="socialLinks" className="form-label">Social Media Links</label>
        <input type="text" className="custom-form" id="socialLinks" placeholder="Facebook, Instagram, etc." />
      </div>
      <div className="col-12 mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="terms" required />
        <label className="form-check-label" htmlFor="terms">
          I accept the <a href="#">Terms and Conditions</a> and have read the <a href="#">Privacy Policy</a>.
        </label>
      </div>
      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary">Submit Registration</button>
      </div>
    </div>
     </div>
  </form>
 </section>
</div>

  )
}

export default Registration