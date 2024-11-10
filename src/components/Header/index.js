import React from "react";
import { FaUserCircle, FaTimes, FaFilm } from "react-icons/fa";
import "./Header.scss";
import instance from "../../api/instance";

function Header() {
  const handleLogout = () => {
    (async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await instance.post("/auth/logout", token);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.confirm("Login Successfully - Redirect to Home Page")) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };
  return (
    <div className="contain">
      <header className="header">
        <div className="header__left mt-1">
          <FaFilm className="header__logo" />
          <div className="header__search">
            <input type="text" placeholder="Search" />
            <FaTimes className="header__search-clear" />
          </div>
          <div className="header__user">
            <FaUserCircle className="header__icon" />
            <div className="header__user-menu">
              <button className="header__user-item">Thông tin cá nhân</button>
              <button className="header__user-item">Lịch sử thanh toán</button>
              <button
                onClick={() => handleLogout()}
                className="header__user-item d-inline-block"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <button className="header__button">Ưu đãi</button>
        </div>
        <div className="header__right mt-2">
          <button className="header__button">Trang chủ</button>
          <button className="header__button">Rạp phim</button>
          <button className="header__button">Lịch chiếu</button>
          <button className="header__button">Liên hệ</button>
        </div>
      </header>
    </div>
  );
}

export default Header;
