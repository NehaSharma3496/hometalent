import React, { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Breadcrumbs from "../../components/websitecomponents/Breadcrumbs";
import { GetAdminGallery } from "../../Services/webService/Web";
import { useNavigate } from "react-router-dom";
import { image_baseurl } from "../../Utils/config";

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [gallery, setGallery] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = 1;

  const fetchGallery = async () => {
    try {
      const response = await GetAdminGallery(token, userId);
      if (response?.status) {
        setGallery(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const imageSlides = gallery
    .filter((item) => item.file_type === "image")
    .map((item) => ({ src: `${image_baseurl}${item.file_path}` }));

  const handleImageClick = (clickedIndex) => {
    const imageOnlyIndex = gallery
      .filter((item) => item.file_type === "image")
      .findIndex((img) => img.file_path === gallery[clickedIndex].file_path);

    setIndex(imageOnlyIndex);
    setOpen(true);
  };

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Gallery", to: "#" },
  ];

  return (
    <div className="gallery-container">
      <Breadcrumbs title="Gallery" links={breadcrumbLinks} />

      <section className="destination-section-two section-padding package-area">
        <div className="container">
          <div className="row g-4 mt-2">
            {gallery?.length === 0 ? (
              <div className="col-12 text-center">
                <img
                  src="/assets/images/NoGallery.jpg"
                  alt="No Gallery"
                  style={{
                    width: "250px",
                    height: "auto",
                    marginBottom: "15px",
                  }}
                />
                <p className="text-danger fs-5">No images or videos found</p>
              </div>
            ) : (
              gallery?.map((item, i) => (
                <div key={i} className="col-xl-3 col-lg-4 col-sm-6 mb-4">
                  <div className="package-card h-calc">
                    <div
                      className="package-img imgEffect4 thumbnail"
                      style={{
                        height: "250px",
                        overflow: "hidden",
                        borderRadius: "10px",
                        cursor:
                          item.file_type === "image" ? "pointer" : "default",
                      }}
                      onClick={() => {
                        try {
                          if (item.admin_remarks) {
                            const meta = JSON.parse(item.admin_remarks);
                            if (meta?.source_vendor_id) {
                              navigate(
                                `/categorydetail/${meta.source_vendor_id}`,
                                {
                                  state: { vendorId: meta.source_vendor_id },
                                }
                              );
                              return;
                            }
                          }
                        } catch (e) {
                          console.error("Error parsing admin_remarks:", e);
                        }

                        if (item.file_type === "image") {
                          handleImageClick(i);
                        }
                      }}
                    >
                      {item.file_type === "video" ? (
                        <video
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        >
                          <source
                            src={`${image_baseurl}${item.file_path}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          src={`${image_baseurl}${item.file_path}`}
                          alt={`Gallery ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={imageSlides}
          index={index}
        />
      )}
    </div>
  );
};

export default Gallery;
