import React from "react";
import certificate from "../../assets/certificate.png";

function Footer() {
  return (
    <div className="bg-gray-900 text-white pt-3 ">
      {/* mt-[64px]  */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="footer-css flex justify-around items-center">
          <div className="certi flex-col items-start">
            <img
              className="w-36 h-36"
              src={certificate}
              alt="Giay chung nhan"
            />
            <div className=""></div>
          </div>
          <div className="theaters">
            <ul className="">
              <p className="text-2xl font-semibold mb-2 underline">
                Hệ thống rạp
              </p>
              <li>Rạp Thống Nhất</li>
              <li>Rạp Hồng Bàng</li>
              <li>Rạp Tây Sơn</li>
              <li>Rạp Bạch Đằng</li>
            </ul>
          </div>
          <div className="info">
            <ul className="">
              <p className="text-2xl font-semibold mb-2 underline">Châm ngôn</p>
              <li>Chất lượng</li>
              <li>Tin cậy</li>
              <li>Bảo mật</li>
              <li>Nhanh chóng</li>
            </ul>
          </div>
          <div className="take_care_client">
            <ul className="">
              <p className="text-2xl font-semibold mb-2 underline">
                Chăm sóc khách hàng
              </p>
              <li>Hotline: 19002099</li>
              <li>Giờ làm việc: 9:00 - 22:00</li>
              <li>Email hỗ trợ: client@hltheaters.vn</li>
              <li>Nhanh chóng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
