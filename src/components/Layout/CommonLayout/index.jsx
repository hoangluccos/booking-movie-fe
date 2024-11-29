import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import ImageSlider from "../../ImageSlider";
import { Link } from "react-router-dom";

function CommonLayout({ children }) {
  return (
    <div className="bg-[#0f172a]">
      <Header />
      <label for="nav-tablet-input" className="navigation hidden ">
        <i className="fa-solid fa-bars text-[28px] text-white ml-[8px] mt-[4px] text-center"></i>
      </label>
      <input hidden type="checkbox" id="nav-tablet-input" />
      <div className="navigation_overlay"></div>
      <nav className="navigation_tablet">
        <label
          for="nav-tablet-input"
          className="text-[36px] absolute top-2 right-7 w-4 h-4"
        >
          <i className="fa-solid fa-square-xmark"></i>
        </label>
        <ul className="list-navigation ">
          <Link
            className="flex items-center pt-[5px] m-5 font-bold text-[28px] hover:bg-gray-400 rounded"
            to={"/coupons"}
          >
            ƯU ĐÃI
          </Link>
          <Link
            className="flex items-center pt-[5px] m-5 font-bold text-[28px] hover:bg-gray-400 rounded"
            to={"/theaters"}
          >
            RẠP PHIM
          </Link>
          <Link
            className="flex items-center pt-[5px] m-5 font-bold text-[28px] hover:bg-gray-400 rounded"
            to={"/contact"}
          >
            LIÊN HỆ
          </Link>
        </ul>
      </nav>
      <div className="navigation_mobile"></div>
      <ImageSlider />

      {children}
      <Footer />
    </div>
  );
}

export default CommonLayout;
