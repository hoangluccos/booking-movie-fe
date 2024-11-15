import React from "react";
import certificate from "../../assets/certificate.png";

function Footer() {
  return (
    <div className="bg-gray-900 text-white pt-3">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          <div className="certi">
            <img
              className="w-36 h-36"
              src={certificate}
              alt="Giay chung nhan"
            />
          </div>
          <div className="theaters">
            <ul>
              <h3 className="text-xl font-semibold mb-2">Hệ thống rạp</h3>
              <li>Rạp Thống Nhất</li>
              <li>Rạp Hồng Bàng</li>
              <li>Rạp Tây Sơn</li>
              <li>Rạp Bạch Đằng</li>
            </ul>
          </div>
          <div className="info">
            <ul>
              <h3 className="text-xl font-semibold mb-2">Châm ngôn</h3>
              <li>Chất lượng</li>
              <li>Tin cậy</li>
              <li>Bảo mật</li>
              <li>Nhanh chóng</li>
            </ul>
          </div>
          <div className="download self-start">
            <h3 className="text-xl font-semibold mb-2">Download</h3>
            <img
              src="https://cdn.getyourguide.com/tf/assets/static/badges/google-play-badge-en-us.svg"
              alt="CHplay"
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
