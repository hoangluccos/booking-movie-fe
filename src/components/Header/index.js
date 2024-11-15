import React from "react";
import { FaUserCircle, FaTimes, FaFilm } from "react-icons/fa";
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
    <div className="bg-[#0f172a] select-none">
      <ToastContainer />
      <header className="w-full max-w-[1200px] mx-auto flex flex-col bg-[#0f172a] p-2.5 items-center">
        <div className="flex items-center justify-between mb-2 w-full">
          <FaFilm className="text-white text-xl mr-2" />
          <div className="flex items-center bg-[#f5f5f5] rounded-full p-1.5 mr-2 flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="Search"
              className="outline-none border-none bg-transparent px-2 py-1 text-[#333] text-sm w-full"
            />
            <FaTimes className="text-[#666] text-xl cursor-pointer ml-1" />
          </div>

          <div className="relative inline-block group">
            <div className="pb-2 mt-2">
              <FaUserCircle className="text-white text-3xl cursor-pointer mr-2" />
            </div>
            <div className="absolute top-full right-0 bg-[#333] rounded-lg py-1 shadow-lg min-w-[160px] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <Link
                to="/profile"
                className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
              >
                Thông tin cá nhân
              </Link>
              <Link
                to="/history-payment"
                className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
              >
                Lịch sử thanh toán
              </Link>
              <button
                onClick={() => handleLogout()}
                className="block px-5 py-2 text-white text-left w-full cursor-pointer text-sm hover:bg-[#555]"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </button>
            </div>
          </div>

          <Link
            to="/coupons"
            className="inline-block bg-[#d1d5db] rounded-full py-1 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            Ưu đãi
          </Link>
        </div>

        <div className="flex justify-evenly gap-10 w-full mt-2 mb-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            TRANG CHỦ
          </Link>
          <Link
            to="/theaters"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            RẠP PHIM
          </Link>
          <Link
            to="/showtime"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            LỊCH CHIẾU
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-[#d1d5db] rounded-full py-2 px-4 text-sm cursor-pointer transition duration-300 text-black hover:bg-[#e2e8f0]"
          >
            LIÊN HỆ
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Header;
