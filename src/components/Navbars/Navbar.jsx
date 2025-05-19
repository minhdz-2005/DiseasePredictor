import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import "./Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang); // <== thay đổi ngôn ngữ
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top myNavbar">
      <div className="container-fluid">
        <Link className="navbar-brand navBrand" to="/">
          <img src="/logo1.png" alt="Disease Prediction" className="logo-img" />
        </Link>
        <button className="navbar-toggler customToggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon toggleIcon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav navMenu ms-auto">
            <li className="nav-item">
              <Link className="nav-link navLink" to="/">{t("predict")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/treatment">{t("treatments")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/statistics">{t("statistics")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/about">{t("about")}</Link>
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
