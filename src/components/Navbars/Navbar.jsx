import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");
  const [isShowForm, setShowForm] = useState(false);
  const [toggleLogin, setToggleLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const [showLayer, setShowLayer] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem("userDP");
  if (storedUser) {
    setIsLoggedIn(true);
    setUsername(JSON.parse(storedUser).user.username);

    if (JSON.parse(storedUser).user.role == 'admin') {
      setAdmin(true);
    }
  }
}, []);


  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const navRef = useRef();
  const loginRef = useRef();

  // Ẩn form khi click ra ngoài
  useEffect(() => {
    const handleClickOutLoginForm = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutLoginForm);
    return () => document.removeEventListener("mousedown", handleClickOutLoginForm);
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        const collapseEl = document.getElementById("navbarNav");
        const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavLinkClick = () => {
    const collapseEl = document.getElementById("navbarNav");
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  };

  // Bắt sự kiện thay đổi input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (toggleLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("Login success:", data);

      localStorage.setItem("userDP", JSON.stringify(data));
      localStorage.setItem("usernameDP", JSON.stringify(data.user.username));

      if (data.user.role === "admin") {
        setAdmin(true);
      }
      else setAdmin(false);
      
      window.location.reload();

      setIsLoggedIn(true);
      setUsername(formData.username);
      setShowForm(false);
      setFormData({ username: "", password: "", email: "" });
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Invalid username or password");
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.email) {
      setErrorMsg("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Register failed");

      const data = await res.json();
      console.log("Register success:", data);

      alert("Register successfully! Please login.");
      setToggleLogin(true);

      setFormData({ username: "", password: "", email: "" });
    } catch (err) {
      console.error("Register error:", err);
      setErrorMsg("Registration failed. Username or email may be taken.");
    }
  };


  // Hàm đăng xuất
  const handleLogout = () => {
    window.location.reload();

    setAdmin(false);
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("userDP");
    localStorage.removeItem("usernameDP");
  };


  return (
    <nav ref={navRef} className="navbar navbar-expand-lg fixed-top myNavbar">
      <div className="container-fluid">
        <Link className="navbar-brand navBrand" to="/">
          <img src="/logo1.png" alt="Disease Prediction" className="logo-img" />
        </Link>

        <button
          className="navbar-toggler customToggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon toggleIcon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav navMenu ms-auto">
            <li className="nav-item">
              <Link className="nav-link navLink" to="/" onClick={handleNavLinkClick}>
                {t("predict")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/treatment" onClick={handleNavLinkClick}>
                {t("treatments")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/statistics" onClick={handleNavLinkClick}>
                {t("statistics")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/community" onClick={handleNavLinkClick}>
                {t("community")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/history" onClick={handleNavLinkClick}>
                {t("history")}
              </Link>
            </li>
            <li className={`nav-item ${isAdmin ? '': 'user'}`}>
              <Link className="nav-link navLink" to="/admin" onClick={handleNavLinkClick}>
                {t("admin")}
              </Link>
            </li>

            <li className="nav-item language">
              <select
                className="form-select ms-3 language-select"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">EN</option>
                <option value="vi">VI</option>
                <option value="ja">JA</option>
              </select>
            </li>

            {!isLoggedIn ? (
              <button
                className="login-btn btn bg-primary text-white"
                onClick={() => setShowForm(!isShowForm)}
              >
                {t("login")}
              </button>
            ) : (
              <div className="d-flex align-items-center ms-3">
                <span className="me-3 text-black">{username}</span>
                <button className="btn btn-danger" onClick={handleLogout}>
                  {t("logout")}
                </button>
              </div>
            )}

            <div className={`layer-blur ${isShowForm ? "show" : ""}`}></div>

            <div className={`login-form-box ${isShowForm ? "show" : ""}`}>
              <form
                ref={loginRef}
                onSubmit={handleSubmit}
                className="login-form d-flex flex-column align-items-center"
              >
                <span
                  className={`${
                    toggleLogin ? "login-form-title" : "register-form-title"
                  }`}
                >
                  {toggleLogin ? (
                    <span>
                      {t("login")}
                      <span
                        onClick={() => setToggleLogin(!toggleLogin)}
                        className="form-small-title fs-6"
                      >
                        ____{t("register")}
                      </span>
                    </span>
                  ) : (
                    <span>
                      {t("register")}
                      <span
                        onClick={() => setToggleLogin(!toggleLogin)}
                        className="form-small-title fs-6"
                      >
                        ____{t("login")}
                      </span>
                    </span>
                  )}
                </span>

                <label htmlFor="username" className="input-label">
                  {t("username")}
                </label>
                <input
                  type="text"
                  className="input-field bg-white text-dark "
                  id="username"
                  placeholder={t("username-placeholder")}
                  value={formData.username}
                  onChange={handleChange}
                />

                <label
                  htmlFor="email"
                  className={`input-label ${toggleLogin ? "login" : "register"}`}
                >
                  {t("email")}
                </label>
                <input
                  type="email"
                  className={`bg-white text-dark input-field ${toggleLogin ? "login" : "register"}`}
                  id="email"
                  placeholder={t("email-placeholder")}
                  value={formData.email}
                  onChange={handleChange}
                />

                <label htmlFor="password" className="input-label">
                  {t("password")}
                </label>
                <input
                  type="password"
                  className="bg-white text-dark input-field"
                  id="password"
                  placeholder={t("password-placeholder")}
                  value={formData.password}
                  onChange={handleChange}
                />

                {errorMsg && <p className="text-danger mt-2">{errorMsg}</p>}

                <button onClick={() => {
                  setShowLayer(true)
                  setTimeout(() => {
                    setShowLayer(false)}, 1500)
                }}
                   type="submit" className="form-login-btn text-white btn mt-3">
                  {toggleLogin ? `${t("login")}` : `${t("register")}`}
                </button>
              </form>
            </div>
          </ul>
        </div>
      </div>
      <div className={`layer-blurrrr ${showLayer ? 'on' : 'off'}`}>
        <div className="spinner" aria-label="Loading..."></div> 
      </div>
    </nav>
  );
}

export default Navbar;
