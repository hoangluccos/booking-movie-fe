import React from "react";
function CouponItem({ img, title, detail }) {
  return (
    <div className="m-3 w-[360px] h-[440px]">
      <img src={img} alt="" className="w-full" />
      <h4 className="font-bold mt-3">{title}</h4>
      <p className="font-light text-[17px]">{detail}</p>
    </div>
  );
}

export default CouponItem;
