import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-64 bg-gray-100 h-screen flex flex-col justify-between p-5 shadow-md">
      <div className="sidebar-header text-2xl font-bold text-gray-800 ">
        <h2>HL Movies</h2>
      </div>
      <ul className="sidebar-menu list-none flex flex-col gap-4 mt-auto mb-auto">
        <li className="menu-item flex items-center pl-4 text-lg text-gray-600 hover:text-blue-500 transition-colors">
          <i className="fa-solid fa-square-poll-vertical mr-3"></i>
          <span>Dashboard</span>
        </li>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `menu-item flex items-center pl-4 text-lg transition-colors ${
              isActive ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
            }`
          }
        >
          <i className="fa-solid fa-clapperboard mr-3"></i>
          <span>Movies</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `menu-item flex items-center pl-4 text-lg transition-colors ${
              isActive ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
            }`
          }
        >
          <i className="fa-solid fa-users mr-3"></i>
          <span>Users</span>
        </NavLink>
        <li className="menu-item flex items-center pl-4 text-lg text-gray-600 hover:text-blue-500 transition-colors">
          <i className="fa-solid fa-money-bill-wave mr-3"></i>
          <span>Payment</span>
        </li>
      </ul>
      <div className="sidebar-footer text-sm text-gray-600 text-center">
        Help
      </div>
    </div>
  );
}

export default Sidebar;
