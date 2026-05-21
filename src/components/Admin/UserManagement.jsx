import { useEffect, useState } from "react";
import "./UserManagement.css";
import { useTranslation } from "react-i18next";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    // Lấy user đang đăng nhập từ localStorage
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const isAdmin = loggedUser?.user?.role === "admin";

    // Fetch danh sách user
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/`);
            if (!res.ok) throw new Error("Failed to fetch users");

            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
            setError("Cannot load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Xóa user
    const deleteUser = async (id) => {
        if (!isAdmin) return alert("Only admin can delete users!");
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}/`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete user");

            setUsers(users.filter((u) => u.user_id !== id));
        } catch (e) {
            console.error(e);
            alert("Delete failed!");
        }
    };

    // Thay đổi role user
    const toggleRole = async (user) => {
        if (!isAdmin) return alert("Only admin can change roles!");


        const newRole = user.role === "admin" ? "user" : "admin";

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.user_id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!res.ok) throw new Error("Failed to update role");

            const updated = await res.json();

            setUsers((prev) =>
                prev.map((u) => (u.user_id === user.user_id ? updated : u))
            );
        } catch (e) {
            console.error(e);
            alert("Role update failed!");
        }
    };

    return (
        <div className="user-man">
            <h2>{t("admin-page.user-manage")}</h2>

            {!isAdmin && (
                <p className="text-danger mt-2">
                    You do not have permission to manage users.
                </p>
            )}

            {isLoading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t("admin-page.username")}</th>
                            <th>{t("admin-page.email")}</th>
                            <th>{t("admin-page.role")}</th>
                            <th>{t("admin-page.created")}</th>
                            {isAdmin && <th>{t("admin-page.action")}</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {new Date(user.created_at).toLocaleString(
                                        "vi-VN"
                                    )}
                                </td>

                                {isAdmin && (
                                    <td className="action-cell">
                                        <button
                                            className="btn btn-role btn-warning mb-1"
                                            onClick={() => toggleRole(user)}
                                        >
                                            {user.role === "admin"
                                                ? `${t("admin-page.demote")}`
                                                : `${t("admin-page.promote")}`}
                                        </button>

                                        <button
                                            className="btn btn-delete btn-danger"
                                            onClick={() => deleteUser(user.user_id)}
                                        >
                                            {t("admin-page.delete")}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManagement;
