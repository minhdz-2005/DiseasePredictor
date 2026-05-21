import './Community.css';
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

const API_BASE = "http://127.0.0.1:8000"; // backend Django

const Community = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});

  const [showCreateBox, setShowCreateBox] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
  });

  const handleCreateBlog = async () => {
    if (!user) {
      alert("You must login to create a post!");
      return;
    }

    if (!newBlog.title.trim() || !newBlog.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    const payload = {
      author_id: user.user.id,
      title: newBlog.title,
      content: newBlog.content,
    };

    try {
      const res = await fetch(`${API_BASE}/blogs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create blog");

      //const created = await res.json();
      alert("Bài viết đang chờ được phê duyệt!");
      

      // 🟦 Thêm blog mới vào đầu danh sách
      //setBlogs((prev) => [created, ...prev]);

      // Reset form
      setNewBlog({ title: "", content: "" });
      setShowCreateBox(false);

    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Failed to create blog. Try again.");
    }
  };



  // 🔹 Lấy user đăng nhập từ localStorage
  const user = JSON.parse(localStorage.getItem("userDP")) || null;

  // Gọi API lấy blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs/`);
        const data = await res.json();
        const filteredData = data.filter((blog) => blog.status === "approved");
        const sorted = filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setBlogs(sorted);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Lấy comment theo blog_id
  const fetchComments = async (blogId) => {
    try {
      const res = await fetch(`${API_BASE}/comments/?blog=${blogId}`);
      const data = await res.json();
      setComments((prev) => ({
        ...prev,
        [blogId]: data,
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Toggle comment box
  const handleToggleComment = (blogId) => {
    const isShown = showCommentBox[blogId];
    setShowCommentBox((prev) => ({
      ...prev,
      [blogId]: !isShown,
    }));

    if (!isShown) fetchComments(blogId);
  };

  // Gửi comment
  const handleSendComment = async (blogId) => {
    // ⚠️ Kiểm tra đăng nhập
    if (!user) {
      alert("You must login to comment!");
      return;
    }

    const commentText = newComment[blogId]?.trim();
    if (!commentText) return;

    const payload = {
        author_id: user.user.id,
        blog_id: blogId,
        content: commentText,
    };

    try {
      const res = await fetch(`${API_BASE}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(user);

      if (!res.ok) throw new Error("Failed to send comment");
      const newCmt = await res.json();

      // ✅ Cập nhật danh sách comment
      setComments((prev) => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), newCmt],
      }));

      // Reset input
      setNewComment((prev) => ({ ...prev, [blogId]: "" }));
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to send comment. Please try again.");
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    
    const today = new Date();
    
    const dayDif = today.getDate() - date.getDate();

    if (dayDif == 0) return `${t("community-page.today")}`;
    else if (dayDif == 1) return `${t("community-page.yesterday")}`;
    else if (dayDif >= 2 && dayDif < 7) return `${today.getDate() - date.getDate()} ${t("community-page.daysago")}`;
    else if (dayDif == 7) return `${t("community-page.weekago")}`;
    else return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <div className="com-page text-center mt-5">{t("loading")}...</div>;
  }

  return (
    <div className="com-page d-flex flex-column justify-content-start align-items-center mt-5">
      <div className="w-100 px-3 d-flex flex-column">
        <button
          className="btn create-btn mb-3"
          onClick={() => setShowCreateBox(!showCreateBox)}
        >
          {showCreateBox ? `${t("community-page.close")}` : `${t("community-page.create")}`}
        </button>

        {showCreateBox && (
          <div className="create-box p-3">
            <input
              type="text"
              className="post-content mb-2"
              placeholder={`${t("community-page.post-title")}`}
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            />

            <textarea
              className="post-content mb-2"
              rows="3"
              placeholder={`${t("community-page.post-content")}`}
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            />

            <button className="btn btn-primary" onClick={handleCreateBlog}>
              {`${t("community-page.publish")}`}
            </button>
          </div>
        )}
      </div>

      
      
      {blogs.length === 0 ? (
        <h5 className="text-muted mt-4">
          {t("community-page.no-post") || "No blogs yet."}
        </h5>
      ) : (
        blogs.map((blog) => (
          <div key={blog.blog_id} className="blog d-flex flex-column">
            <span className="author">
              {blog.author?.username || "Anonymous"}
              <span className="time-created">{formatDate(blog.created_at)}</span>
            </span>

            <span className="title">{blog.title}</span>
            <span className="content">{blog.content}</span>

            <button
              onClick={() => handleToggleComment(blog.blog_id)}
              className="comment-btn"
            >
              {showCommentBox[blog.blog_id]
                ? `${t("community-page.close")}`
                : `${t("community-page.comment")}`}
            </button>

            <div className={`comment-section ${showCommentBox[blog.blog_id] ? "show" : ""}`}>
              <div className="comment-input-container d-flex">
                <input
                  type="text"
                  className="comment-input flex-grow-1"
                  placeholder={`${t("community-page.comment-content")}`}
                  value={newComment[blog.blog_id] || ""}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      [blog.blog_id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="send-btn ms-2"
                  onClick={() => handleSendComment(blog.blog_id)}
                >
                  {`${t("community-page.send")}`}
                </button>
              </div>

              <h5 className="comment-section-title mt-3">
                {t("community-page.comment")}
              </h5>

              <div className="comment-box">
                {comments[blog.blog_id]?.length > 0 ? (
                    comments[blog.blog_id].map((cmt) => (
                    <div key={cmt.comment_id} className="comment-item d-flex flex-column align-items-start">
                        <span className="comment-author mb-1">
                        {cmt.author?.username || "User"}
                        <span className="comment-time">{formatDate(cmt.created_at)}</span>
                        </span>
                        <span className="comment-content mb-2 ms-3">{cmt.content}</span>
                    </div>
                    ))
                ) : (
                    <p className="text-muted small">No comments yet.</p>
                )}
               </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Community;
