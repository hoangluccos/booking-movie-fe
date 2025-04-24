import React from "react";
function CouponItem({ img, title, detail }) {
  return (
    <div className="item m-3 w-[28%] h-[300px] select-none">
      <img src={img} alt="" className="w-full" />
      <h4 className="font-bold mt-3">{title}</h4>
      <p className="font-light text-[17px]">{detail}</p>
    </div>
  );
}

export default CouponItem;
