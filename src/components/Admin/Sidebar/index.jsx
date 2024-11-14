import React from "react";
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="left">
      <div className="sidebar-header">
        <h2>HL Movies</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item">
          <i className="fa-solid fa-square-poll-vertical"></i>
          <span>Dashboard</span>
        </li>
        <NavLink to="/admin" end className="menu-item" activeClassName="active">
          <i className="fa-solid fa-clapperboard"></i>
          <span>Movies</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className="menu-item"
          activeClassName="active"
        >
          <i className="fa-solid fa-users"></i>
          <span>Users</span>
        </NavLink>
        <li className="menu-item">
          <i className="fa-solid fa-money-bill-wave"></i>
          <span>Payment</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <span>Help</span>
      </div>
    </div>
  );
}

export default Sidebar;
