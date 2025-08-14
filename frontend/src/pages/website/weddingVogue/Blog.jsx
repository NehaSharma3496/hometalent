import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";
import { GetAllAdminBlog } from "../../../Services/admin/Admin";

const Blog = () => {
  const [blog, setBlog] = useState([]);

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
    { label: "Blog", to: "#" },
  ];

  return (
    <div>
      <Breadcrumbs title="Blog" links={breadcrumbLinks} />
      <section className="news-area top-bottom-padding2">
        <div className="container ">
          <div className="row g-4">
            {blog?.length > 0 ? (
              blog.map((item, index) => (
                <div className="col-xl-4 col-lg-4 col-sm-6">
                  <article className="news-card-two">
                    <figure className="news-banner-two imgEffect">
                      <Link to={`/blogdetail/${item.id}`}>
                        <img src={item?.image} alt={item?.title} />
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
                        className=" btn-primary-sm btn-primary "
                         style={{ width: "120px" }}
                      >
                        Read More
                      </Link>
                    </div>
                  
                  </article>
                </div>
              ))
            ) : (
              <p>No blogs found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
