import React from "react";
import SideBar from "../../Admin/Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex">
      <SideBar />
      <div className="ml-[250px] w-full">{children}</div>
    </div>
  );
}

export default AdminLayout;
