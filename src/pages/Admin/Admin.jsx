import './Admin.css';
import UserManagement from '../../components/Admin/UserManagement';
import BlogManagement from '../../components/Admin/BlogManagement';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useState } from 'react';

const Admin = () => {
    const [manageMode, setManageMode] = useState('user');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const user = localStorage.getItem("userDP");
        if(!user || (user && JSON.parse(user).user.role != "admin")) {
            navigate('/');
        }
    })

    return (
        <div className="ad-page">
            <div className="mode-btn">
                <button className='btn btn-primary me-3' onClick={() => setManageMode("user")}>
                    {t("admin-page.user-manage")}
                </button>

                <button className='btn btn-success' onClick={() => setManageMode("blog")}>
                    {t("admin-page.blog-manage")}
                </button>
            </div>

            {manageMode == "user" ? (
                <UserManagement></UserManagement>
            ) : (
                <BlogManagement></BlogManagement>
            )}
        </div>
    );
}

export default Admin;