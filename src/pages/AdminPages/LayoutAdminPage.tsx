import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SlidebarItem from "./SlidebarItem.tsx";
import {
  MdDashboard,
  MdMenu,
  MdClose,
  MdCategory,
  MdQuestionAnswer,
} from "react-icons/md";
import { Avatar, Dropdown, Menu } from "antd";
import { RiSlideshow3Fill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { TbMovie } from "react-icons/tb";
import { IoPersonSharp } from "react-icons/io5";
import { GiTheater } from "react-icons/gi";

const LayoutAdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      // Logic đăng xuất ở đây
      console.log("User logged out");
    }
  };

  const items = [
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  return (
    <div className="bg-[#1B2431] min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-[240px]" : "w-[60px]"
        } transition-all duration-300 overflow-hidden`}
      >
        <nav className="h-full flex flex-col bg-[#273142] p-4">
          {/* Logo */}
          <div className={`${isSidebarOpen ? "w-[100px]" : "w-[40px]"} mb-8`}>
            {/* <img src={logo} alt="Logo" /> */}
          </div>

          {/* Menu items */}
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
              icon={<MdQuestionAnswer />}
              text="Feedbacks"
              to="/admin/feedbacks"
              isSidebarOpen={isSidebarOpen}
            />
          </ul>
        </nav>
      </aside>

      {/* Navbar */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-[#273142] h-[70px] flex items-center justify-between px-4">
          <button onClick={toggleSidebar} className="text-white text-2xl">
            {isSidebarOpen ? <MdClose /> : <MdMenu />}
          </button>

          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full max-w-md px-4 py-2 rounded-lg bg-[#1B2431] text-white placeholder-gray-400 focus:outline-none font-saira"
            />
          </div>

          {/* Avatar + Logout Menu */}
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

        {/* Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdminPage;
