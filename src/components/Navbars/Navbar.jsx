import { Link } from "react-router-dom";
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top myNavbar">
      <div className="container-fluid">
        <Link className="navbar-brand navBrand" to="/">
          <img src="/logo1.png" alt="Disease Prediction" className="logo-img"></img>
        </Link>
        <button className="navbar-toggler customToggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon toggleIcon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav navMenu ms-auto">
            <li className="nav-item">
              <Link className="nav-link navLink" to="/">Dự đoán</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/treatment">Cách chữa</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/statistics">Thống kê</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" >Ngôn ngữ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link navLink" to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
