import React from "react";
import "./CouponItem.scss";
function CouponItem({ img, title, detail }) {
  return (
    <div className="banner-coupon m-3">
      <img src={img} alt="" />
      <h4 className="fw-bold mt-3">{title}</h4>
      <p className="fw-light">{detail}</p>
    </div>
  );
}

export default CouponItem;
