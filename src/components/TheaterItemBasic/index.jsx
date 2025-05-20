import React from "react";
import { Link } from "react-router-dom";
function TheaterItemBasic({ img, title, detail }) {
  return (
    <Link to={"#"} className="item m-3 w-[28%] h-[300px] select-none">
      <img src={img} alt="" className="w-full rounded-md" />
      <h4 className="font-bold mt-3">{title}</h4>
      <p className="font-light text-[17px]">{detail}</p>
    </Link>
  );
}

export default TheaterItemBasic;
