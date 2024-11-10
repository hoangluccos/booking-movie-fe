import React from "react";
import "./Footer.scss";
import certificate from "../../assets/certificate.png";
function Footer() {
  return (
    <div className="contain pt-3">
      <div className="footer-info content">
        <div className="certi">
          <img className="certi-img" src={certificate} alt="Giay chung nhan" />
        </div>
        <div className="theaters">
          <ul>
            <h3>Hệ thống rạp</h3>
            <li>Rạp Thống Nhất</li>
            <li>Rạp Hồng Bàng</li>
            <li>Rạp Tây Sơn</li>
            <li>Rạp Bạch Đằng</li>
          </ul>
        </div>
        <div className="info">
          <ul>
            <h3>Châm ngôn</h3>
            <li>Chất lượng</li>
            <li>Tin cậy</li>
            <li>Bảo mật</li>
            <li>Nhanh chóng</li>
          </ul>
        </div>
        <div className="download">
          <h3>Download</h3>
          <img
            src="https://cdn.getyourguide.com/tf/assets/static/badges/google-play-badge-en-us.svg"
            alt="CHplay"
          />
        </div>
      </div>
    </div>
  );
}

export default Footer;
