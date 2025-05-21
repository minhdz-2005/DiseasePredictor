import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

import "./Navbar.css";

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;


function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang); // <== thay đổi ngôn ngữ
  };

  const navRef = useRef();

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

  // Đóng menu khi bấm vào link
  const handleNavLinkClick = () => {
    const collapseEl = document.getElementById("navbarNav");
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
    if (bsCollapse) {
      bsCollapse.hide();
    }
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
              <Link className="nav-link navLink" to="/about" onClick={handleNavLinkClick}>
                {t("about")}
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
          </ul>
        </div>
      </div>
    </nav>
  );

}

export default Navbar;
