import React from "react";
import { FaUserCircle, FaTimes, FaFilm } from "react-icons/fa";
import "./Header.scss";
import instance from "../../api/instance";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Header() {
  const handleLogout = () => {
    (async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        await instance.post("/auth/logout", token);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Bạn đã logout");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    })();
  };
  return (
    <div className="contain">
      <ToastContainer />
      <header className="header">
        <div className="header__left mt-1">
          <FaFilm className="header__logo" />
          <div className="header__search">
            <input type="text" placeholder="Search" />
            <FaTimes className="header__search-clear" />
          </div>
          <div className="header__user">
            <div className="pb-2 mt-2">
              <FaUserCircle className="header__icon" />
            </div>
            <div className="header__user-menu">
              <Link to="/profile" className="header__user-item d-inline-block">
                Thông tin cá nhân
              </Link>
              <Link to="/history-payment" className="header__user-item">
                Lịch sử thanh toán
              </Link>
              <button
                onClick={() => handleLogout()}
                className="header__user-item d-inline-block"
              >
                <i class="fa-solid fa-right-from-bracket"></i>
                Đăng xuất
              </button>
            </div>
          </div>

          <Link to="/coupons" className="header__button d-inline-block">
            Ưu đãi
          </Link>
        </div>
        <div className="header__right mt-2 mb-3">
          <Link to="/" className="header__button">
            TRANG CHỦ
          </Link>
          <Link to="/theaters" className="header__button">
            RẠP PHIM
          </Link>
          <Link to="/showtime" className="header__button">
            LỊCH CHIẾU
          </Link>
          <Link to="/contact" className="header__button">
            LIÊN HỆ
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Header;
