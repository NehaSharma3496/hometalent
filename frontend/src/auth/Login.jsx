import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/websiteAssets/images/logo/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

 if (username === 'admin' && password === '123456') {
  setErrorMsg('');
  localStorage.setItem('role', 'admin');
  navigate('/admin/dashboard');
} else if (username === 'vendor' && password === '123456') {
  setErrorMsg('');
  localStorage.setItem('role', 'vendor'); 
  navigate('/vendor/dashboard');
}else {
  setErrorMsg('Invalid username or password.');
}
  };


  return (
    <div><div className="login-area section-padding">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10">
        <div className="login-card">
          {/* Logo */}
          <div className="logo mb-40">
            <a href="index.html" className="mb-30 d-block">
              <img src={logo} alt="logo" className="changeLogo w-25" />
            </a>
          </div>
          {/* Form */}
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <div className="position-relative contact-form mb-24">
              <label className="contact-label">Email </label>
              <input className="form-control contact-input" 
              type="text" 
              placeholder="Enter Your Email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="contact-form mb-24">
              <div className="position-relative ">
                <div className="d-flex justify-content-between aligin-items-center">
                  <label className="contact-label">Password</label>
                  <a href="forgot-pass.html"><span className="text-primary text-15"> Forgot
                      password? </span></a>
                </div>
                <input type="password"
             className="form-control contact-input password-input" 
             id="txtPasswordLogin"
              placeholder="Enter Password"
             value={password}
                        onChange={(e) => setPassword(e.target.value)}
               />
                <i className="toggle-password ri-eye-line" />
              </div>
            </div>
          
            <button className="btn-primary-fill justify-content-center w-100" type="submit">
                    <span className="d-flex justify-content-center gap-6">
                <span>Login</span>
              </span>
                      </button>
          </form>
          <div className="login-footer">
            <div className="create-account">
              <p>
                Don’t have an account?
                <a href="register.html">
                  <span className="text-primary">Register</span>
                </a>
              </p>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  )
}

export default Login