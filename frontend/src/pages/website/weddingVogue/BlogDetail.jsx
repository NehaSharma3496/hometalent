import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  GetSingleAdminBlog,
  GetAllAdminBlog,
} from "../../../Services/admin/Admin";
import Breadcrumbs from "../../../components/websitecomponents/Breadcrumbs";

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherBlogs, setOtherBlogs] = useState([]);

  const fetchBlogDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await GetSingleAdminBlog(token, blogId);
      setBlog(res?.data || null);
    } catch (err) {
      console.error("Error fetching blog detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await GetAllAdminBlog(token, 1, 2); // get 2 blogs
      if (res?.data?.length > 0) {
        // Exclude current blog from right-side suggestions
        const filtered = res.data.filter(
          (b) => b.id.toString() !== blogId.toString()
        );
        setOtherBlogs(filtered.slice(0, 2)); // only show 2
      }
    } catch (err) {
      console.error("Error fetching other blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
    fetchOtherBlogs();
  }, [blogId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!blog) return <p className="text-center">Blog not found.</p>;

  const breadcrumbLinks = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "#" },
  ];

  return (
    <div>
      <Breadcrumbs title="Blog" links={breadcrumbLinks} />

      <section className="destination-details-section top-bottom-padding2">
        <div className="container">
          <div className="row g-4">
            {/* LEFT SIDE: Main Blog Content */}
            <div className="col-xl-8 col-lg-7">
              <div className="news-details-banner imgEffect">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="news-details-content">
                <h2 className="title">{blog.title}</h2>
                <p className="short-desc">{blog.short_description}</p>
                <div
                  className="pera mt-3"
                  dangerouslySetInnerHTML={{ __html: blog.long_description }}
                />
              </div>
            </div>

            {/* RIGHT SIDE: Other Blogs */}
            <div className="col-xl-4 col-lg-5">
              <div className="search-filter-section">
                <div className="heading">
                  <h4 className="title">You May Also Like</h4>
                </div>
                {otherBlogs.length > 0 ? (
                  otherBlogs.map((b) => (
                    <div
                      key={b.id}
                      className="snippet-blog mb-3"
                      onClick={() => navigate(`/blogdetail/${b.id}`)}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #eee",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={b.image}
                        alt={b.title}
                        style={{ width: "100%", borderRadius: "6px" }}
                      />
                      <h5 className="mt-3">{b.title}</h5>
                      <p className="line-clamp-2 mt-3">{b.short_description}</p>
                    </div>
                  ))
                ) : (
                  <p>No related blogs found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
