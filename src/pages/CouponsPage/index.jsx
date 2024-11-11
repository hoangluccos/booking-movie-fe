import React from "react";
import "./CouponsPage.scss";
import CouponItem from "../../components/CouponItem";

function CouponsPage() {
  const img =
    "https://bhdstar.vn/wp-content/uploads/2024/10/poster-labubu-web-1.jpg";
  return (
    <div className="content mt-4">
      <div className="d-flex flex-wrap gap-10">
        <CouponItem
          img={img}
          title="Cơ hội sở hữu LABUBU FLIP WITH ME 40cm tại HL-Theaters !"
          detail="Đến BHD Star mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
        ></CouponItem>
        <CouponItem
          img={img}
          title="Cơ hội sở hữu LABUBU FLIP WITH ME 40cm tại HL-Theaters !"
          detail="Đến BHD Star mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
        ></CouponItem>
        <CouponItem
          img={img}
          title="Cơ hội sở hữu LABUBU FLIP WITH ME 40cm tại HL-Theaters !"
          detail="Đến BHD Star mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
        ></CouponItem>
      </div>
    </div>
  );
}

export default CouponsPage;
