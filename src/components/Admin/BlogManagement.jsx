import { useEffect, useState } from "react";
import './BlogManagement.css';
import { useTranslation } from "react-i18next";

const BlogManagement = () => {
    const { t } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [expandedBlogs, setExpandedBlogs] = useState({});
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // 🔥 Thêm filter

    // Lấy blog + comment
    useEffect(() => {
        fetchBlogs();
        fetchComments();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/blogs/");
            const data = await res.json();
            setBlogs(data);
        } catch (err) {
            console.log("Error fetching blogs", err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/comments/");
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.log("Error fetching comments", err);
        }
    };

    const toggleExpand = (blogId) => {
        setExpandedBlogs((prev) => ({
            ...prev,
            [blogId]: !prev[blogId]
        }));
    };

    const updateBlogStatus = async (id, status) => {
        setLoading(true);
        try {
            await fetch(`http://127.0.0.1:8000/blogs/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            fetchBlogs();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa comment này?")) return;

        try {
            await fetch(`http://127.0.0.1:8000/comments/${id}/`, {
                method: "DELETE",
            });
            fetchComments();
        } catch (err) {
            console.log(err);
        }
    };

    // 🔥 Lọc blog theo status
    const filteredBlogs = blogs.filter((b) => {
        if (filterStatus === "all") return true;
        return b.status === filterStatus;
    });

    return (
        <div className="blog-man">
            <h2>{t("admin-page.blog-manage")}</h2>

            {/* 🔥 Bộ lọc status */}
            <div className="filter-section mb-3">
                <label className="me-2 fw-bold">{t("admin-page.filter")}:</label>
                <select
                    className="form-select w-auto d-inline-block bg-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">{t("admin-page.all")}</option>
                    <option value="pending">{t("admin-page.pending")}</option>
                    <option value="approved">{t("admin-page.approved")}</option>
                    <option value="rejected">{t("admin-page.rejected")}</option>
                </select>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t("admin-page.author")}</th>
                        <th>{t("admin-page.title")}</th>
                        <th>{t("admin-page.status")}</th>
                        <th>{t("admin-page.created")}</th>
                        <th>{t("admin-page.action")}</th>
                        <th>{t("admin-page.comment")}</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredBlogs.map((b) => {
                        const blogComments = comments.filter(c => c.blog.blog_id === b.blog_id);
                        const isExpanded = expandedBlogs[b.blog_id] || false;

                        return (
                            <>
                                <tr key={b.blog_id} className="blog-row">
                                    <td>{b.blog_id}</td>
                                    <td>{b.author.username}</td>
                                    <td>{b.title}</td>
                                    <td>
                                        <span className={`status ${b.status}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td>{new Date(b.created_at).toLocaleString()}</td>

                                    <td>
                                        <button
                                            className="approve btn btn-warning mb-1"
                                            disabled={loading}
                                            onClick={() => updateBlogStatus(b.blog_id, "approved")}
                                        >
                                            {t("admin-page.approve")}
                                        </button>

                                        <button
                                            className="reject btn btn-danger"
                                            disabled={loading}
                                            onClick={() => updateBlogStatus(b.blog_id, "rejected")}
                                        >
                                            {t("admin-page.reject")}
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="toggle-btn btn btn-primary"
                                            onClick={() => toggleExpand(b.blog_id)}
                                        >
                                            {isExpanded ? `${t("admin-page.hide")}` : `${t("admin-page.view")}`} ({blogComments.length})
                                        </button>
                                    </td>
                                </tr>

                                {isExpanded && (
                                    <tr className="comment-section">
                                        <td colSpan="7">
                                            {blogComments.length === 0 ? (
                                                <p className="no-comment">{t("admin-page.no-comment")}</p>
                                            ) : (
                                                <table className="comment-table">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>{t("admin-page.author")}</th>
                                                            <th>{t("admin-page.content")}</th>
                                                            <th>{t("admin-page.created")}</th>
                                                            <th>{t("admin-page.action")}</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {blogComments.map((c) => (
                                                            <tr key={c.comment_id}>
                                                                <td>{c.comment_id}</td>
                                                                <td>{c.author.username}</td>
                                                                <td>{c.content}</td>
                                                                <td>{new Date(c.created_at).toLocaleString()}</td>
                                                                <td>
                                                                    <button
                                                                        className="delete btn btn-danger"
                                                                        onClick={() => deleteComment(c.comment_id)}
                                                                    >
                                                                        {t("admin-page.delete")}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BlogManagement;
