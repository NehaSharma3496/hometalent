import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Share from "yet-another-react-lightbox/plugins/share";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Gallery", to: "#" },
  ];

  const slides = [
    {
      src: "https://images.yet-another-react-lightbox.com/image01.0800ee93.3840x5760.640w.jpg",
      title: "Beautiful View",
      description: "Perfect sunset and serene waves",
    },
    {
      src: "https://images.yet-another-react-lightbox.com/image01.0800ee93.3840x5760.640w.jpg",
      title: "Mountain Peak",
      description: "Snow-covered mountain during sunrise.",
    },
    {
      src: "https://images.yet-another-react-lightbox.com/image01.0800ee93.3840x5760.640w.jpg",
      title: "Forest Walk",
      description: "A serene trail in the forest.",
    },
  ];

  const tabLabels = ["Themes", "Vendors", "Events"];

  return (
    <div className="gallery-container">
      <Breadcrumbs title="Gallery" links={breadcrumbLinks} />

      <section className="destination-section-two section-padding package-area">
        <div className="container">
          <ul className="nav nav-pills package-pills mb-4" id="gallery-tabs">
            {tabLabels.map((label, idx) => (
              <li className="nav-item" key={label}>
                <button
                  className={`nav-link package-nav ${idx === 0 ? "active" : ""}`}
                  id={`tab-${label}`}
                  data-bs-toggle="pill"
                  data-bs-target={`#pane-${label}`}
                  type="button"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content">
            {tabLabels.map((label, idx) => (
              <div
                key={label}
                className={`tab-pane fade ${idx === 0 ? "show active" : ""}`}
                id={`pane-${label}`}
              >
                <div className="row g-4">
                  {slides.map((slide, i) => (
                    <div key={i} className="col-xl-3 col-lg-4 col-sm-6">
                      <div className="package-card h-calc">
                        <div
                          className="package-img imgEffect4 thumbnail"
                          onClick={() => {
                            setIndex(i);
                            setOpen(true);
                          }}
                        >
                          <img
                            src={slide.src}
                            alt={slide.title}
                            style={{ width: "100%", cursor: "pointer" }}
                          />
                          <div className="image-badge">
                            <p className="pera">{slide.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={slides}
          plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom, Share]}
          captions={{
  descriptionTextAlign: "center",
  descriptionMaxLines: 2,
}}

          share={{
            url: slides[index]?.src,
            title: slides[index]?.title,
            description: slides[index]?.description,
          }}
        />
      )}
    </div>
  );
};

export default Gallery;
