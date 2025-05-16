import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

interface SlidebarItemProps {
  icon: ReactElement;
  text: string;
  to: string;
  isSidebarOpen: boolean;
}

const SlidebarItem = (props: SlidebarItemProps) => {
  const { icon, text, to, isSidebarOpen } = props;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex h-[50px] w-full items-center justify-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group text-white ${
          isActive ? (isSidebarOpen ? "bg-[#4880FF]" : "") : ""
        }`
      }
    >
      {/* Show icon when sidebar is closed, show text when sidebar is open */}
      {isSidebarOpen ? (
        <span className="overflow-hidden transition-all font-saira">
          {text}
        </span>
      ) : (
        <NavLink
          to={to}
          className={({ isActive }) =>
            `${isActive ? "text-[#4880FF]" : "text-white"}`
          }
        >
          <span className="text-2xl">{icon}</span>
        </NavLink>
      )}

      {/* Show tooltip when sidebar is closed */}
      {!isSidebarOpen && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </NavLink>
  );
};

export default SlidebarItem;
