import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ title, links }) => {
  return (
    <section className="breadcrumbs-area breadcrumb-bg">
      <div className="container">
        <h1
          className="title wow fadeInUp"
          data-wow-delay="0.0s"
          style={{ visibility: 'visible', animationDelay: '0s', animationName: 'fadeInUp' }}
        >
          {title}
        </h1>
        <div className="breadcrumb-text">
          <nav
            aria-label="breadcrumb"
            className="breadcrumb-nav wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ visibility: 'visible', animationDelay: '0.1s', animationName: 'fadeInUp' }}
          >
            <ul className="breadcrumb listing">
              {links.map((link, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item single-list ${
                    index === links.length - 1 ? 'active' : ''
                  }`}
                  aria-current={index === links.length - 1 ? 'page' : undefined}
                >
                  {index === links.length - 1 ? (
                    <span className="single active">{link.label}</span>
                  ) : (
                    <Link to={link.href} className="single">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumbs;
