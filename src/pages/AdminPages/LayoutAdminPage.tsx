import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SlidebarItem from "./SlidebarItem.tsx";
import {
  MdDashboard,
  MdMenu,
  MdClose,
  MdCategory,
  MdQuestionAnswer,
} from "react-icons/md";
import { Avatar, Dropdown } from "antd";
import { RiSlideshow3Fill, RiCoupon2Fill } from "react-icons/ri";
import { FaUsers, FaFileInvoice } from "react-icons/fa";
import { TbMovie } from "react-icons/tb";
import { IoPersonSharp, IoFastFood } from "react-icons/io5";
import { GiTheater } from "react-icons/gi";
import instance from "../../api/instance.js";
import { toast } from "react-toastify";

const LayoutAdminPage = () => {
  const nav = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      console.log("Toggling sidebar, new state:", !prev);
      return !prev;
    });
  };

  const handleLogout = async () => {
    try {
      const tokenString = localStorage.getItem("token");
      if (!tokenString) {
        toast.error("Token không tồn tại");
        return;
      }
      const token = JSON.parse(tokenString);

      await instance.post("/auth/logout", token);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Bạn đã logout");
      setTimeout(() => {
        nav("/login");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  const items = [
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#1B2431]">
      {/* Sidebar */}
      <aside
        className={`bg-[#273142] transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[240px]" : "w-[60px]"
        }`}
      >
        <nav className="h-full flex flex-col p-4">
          <div className={`mb-12 ${isSidebarOpen ? "w-full" : "w-[40px]"}`}>
            {/* <img src={logo} alt="Logo" className="max-w-full" /> */}
          </div>
          <ul>
            <SlidebarItem
              icon={<MdDashboard />}
              text="Dashboard"
              to="/admin/dashboard"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<TbMovie />}
              text="Movies"
              to="/admin/movies"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<RiSlideshow3Fill />}
              text="Showtimes"
              to="/admin/showtimes"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<FaFileInvoice />}
              text="Invoices"
              to="/admin/invoices"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<FaUsers />}
              text="Users"
              to="/admin/users"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<MdCategory />}
              text="Genres"
              to="/admin/genres"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<IoPersonSharp />}
              text="Persons"
              to="/admin/persons"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<GiTheater />}
              text="Theaters"
              to="/admin/theaters"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<RiCoupon2Fill />}
              text="Coupons"
              to="/admin/coupons"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<IoFastFood />}
              text="Foods"
              to="/admin/foods"
              isSidebarOpen={isSidebarOpen}
            />
            <SlidebarItem
              icon={<MdQuestionAnswer />}
              text="Feedbacks"
              to="/admin/feedbacks"
              isSidebarOpen={isSidebarOpen}
            />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#273142] h-[70px] flex items-center justify-between px-4">
          <button onClick={toggleSidebar} className="text-white text-2xl">
            {isSidebarOpen ? <MdClose /> : <MdMenu />}
          </button>
          {/* <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full max-w-md px-4 py-2 rounded-lg bg-[#1B2431] text-white placeholder-gray-400 focus:outline-none font-saira"
            />
          </div> */}
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            placement="bottomRight"
            arrow
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-white hidden md:inline font-saira">
                Admin
              </span>
              <Avatar src="https://i.pravatar.cc/150?img=12" size={40} />
            </div>
          </Dropdown>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdminPage;
