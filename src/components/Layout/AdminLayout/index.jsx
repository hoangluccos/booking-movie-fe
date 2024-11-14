import React from "react";
import SideBar from "../../Admin/Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <SideBar />
      <div style={{ marginLeft: "250px", width: "100%" }}>{children}</div>
    </div>
  );
}

export default AdminLayout;
