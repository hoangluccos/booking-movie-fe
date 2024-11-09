import React from "react";
import { FaUserCircle, FaTimes, FaFilm } from "react-icons/fa";
import "./Header.scss";

function Header() {
  return (
    <div className="contain">
      <header className="header">
        <div className="header__left mt-1">
          <FaFilm className="header__logo" />
          <div className="header__search">
            <input type="text" placeholder="Search" />
            <FaTimes className="header__search-clear" />
          </div>
          <FaUserCircle className="header__icon" />
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
