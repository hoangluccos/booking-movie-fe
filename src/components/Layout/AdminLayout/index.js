import React from "react";
import SideBar from "../../Admin/Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex">
      <SideBar />
      <div style={{ marginLeft: "250px", width: "100%" }}>{children}</div>
    </div>
  );
}

export default AdminLayout;
