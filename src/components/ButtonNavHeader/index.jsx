import { Link } from "react-router-dom";
import React from "react";

function ButtonNavHeader({ text, navTo }) {
  return (
    <Link
      to={navTo}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full py-2 px-4 text-sm text-black bg-gray-300 cursor-pointer group"
    >
      <span className="absolute inset-0 bg-[#fdf25c] transition-transform duration-500 scale-x-0 origin-left group-hover:scale-x-100 z-0"></span>
      <span className="relative z-10 font-bold">{text}</span>
    </Link>
  );
}

export default ButtonNavHeader;
