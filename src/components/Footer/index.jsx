import React from "react";
import "./Footer.scss";
function Footer() {
  return (
    <div>
      <div className="certi">
        <img src="../../../assets/certificate.png" alt="Giay chung nhan" />
      </div>
      <div className="info">
        <ul>
          <li>Chất lượng</li>
          <li>Tin cậy</li>
          <li>Bảo mật</li>
          <li>Nhanh chóng</li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
