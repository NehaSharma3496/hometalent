import React, { useEffect, useState } from "react";
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

import { GetAdminGallery } from "../../Services/webService/Web";

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [gallery, setGallery] = useState([]);
  const token = localStorage.getItem("token");
  const userId = 1;

  const fetchGallery = async () => {
    try {
      const response = await GetAdminGallery(token, userId);
      console.log("Gallery API response:", response.data);

      const formatted = response.data.map((item, i) => ({
        src: item.file_path, // ✅ use correct field
        title: `Image ${i + 1}`, // dummy title
        description: "Beautiful gallery image", // dummy description
      }));

      console.log("Formatted gallery:", formatted);
      setGallery(formatted);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };


  useEffect(() => {
    fetchGallery();
  }, []);

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Gallery", to: "#" },
  ];

  return (
    <div className="gallery-container">
      <Breadcrumbs title="Gallery" links={breadcrumbLinks} />

      <section className="destination-section-two section-padding package-area">
        <div className="container">
          <div className="row g-4">
            {gallery.map((slide, i) => (
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
                      alt={`Gallery ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
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
      </section>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={gallery}
          plugins={[
            Captions,
            Fullscreen,
            Slideshow,
            Thumbnails,
            Video,
            Zoom,
            Share,
          ]}
          captions={{
            descriptionTextAlign: "center",
            descriptionMaxLines: 2,
          }}
          share={{
            url: gallery[index]?.src,
            title: gallery[index]?.title,
            description: gallery[index]?.description,
          }}
        />
      )}
    </div>
  );
};

export default Gallery;
