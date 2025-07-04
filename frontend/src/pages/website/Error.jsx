import React from 'react'

import { Link } from 'react-router-dom';



const Error = () => {
  return (
  <div><div className="error-container">
    <div className="main-content">
      <div className="left-content lg-none">
        <img src='../assets/images//404_page-not-found.png' alt="img" className="error-image" />
      </div>
      <div className="right-content lg-w-100">
        <h1 className="error-sign">404</h1>
        <h2 className="error-message">something's missing</h2>
        <p className="para">This page is missing or you assembled the link incorrectly.The requested resource could not be found but may be available in the future.</p>
        <Link to="/" className="btn-outline mt-30">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
          <span> back to home</span>
        </Link>
      </div>
    </div>
  </div></div>

  )
}

export default Error