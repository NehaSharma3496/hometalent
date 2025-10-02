import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { GetAllAdminBlog } from "../../../Services/admin/Admin";
import Loader from "../../../Utils/Loader"
import { image_baseurl } from "../../../Utils/config";


const Blog = () => {
  const [blog, setBlog] = useState([]);
  // const [loading, setLoading] = useState(true)

  const fetchBlog = async () => {
    try {
      const res = await GetAllAdminBlog();
      const activeBlogs = res?.data?.filter((blog) => blog.status === 1);
      setBlog(activeBlogs);
    } catch (error) {
      console.log("Error in fetching blogs", error);
    }
  };

  useEffect(() => {
      fetchBlog();
  }, []);

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Blogs", to: "#" },
  ];

  return (
    <div>
      {/* {loading} */}
      <Breadcrumbs title="Blogs" links={breadcrumbLinks} />
      <section className="news-area top-bottom-padding2 fix-section">
        <div className="container ">
          <div className="row g-4">
            {blog?.length > 0 ? (
              blog.map((item, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-sm-6 mb-4 ">
                  <article className="news-card-two">
                    <figure className="news-banner-two imgEffect">
                      <Link to={`/blogdetail/${item.id}`}>
                        <img
                          src={`${image_baseurl}${item.image}`}
                          alt={item?.title || "Blog"}
                          style={{
                            width: "100%",
                            height: "250px",  
                            objectFit: "contain",
                            borderRadius: "8px",
                            backgroundColor: "#e9e4e4ff",
                          }}
                        />
                      </Link>
                    </figure>
                    <div className="news-content">
                      <div className="heading">
                        <span className="heading-pera">{item?.category}</span>
                      </div>
                      <h4 className="title line-clamp-2">
                        <Link to={`/blogdetail/${item.id}`}>{item?.title}</Link>
                      </h4>
                      <Link
                        to={`/blogdetail/${item.id}`}
                        className="btn-primary-sm btn-primary"
                        style={{ width: "120px" }}
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <img
                  src="/assets/images/NoBlog.jpg"
                  alt="No Blogs"
                  style={{
                    width: "250px",
                    height: "auto",
                    marginBottom: "15px",
                  }}
                />
                <p className="text-danger fs-5">No blogs found</p>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
