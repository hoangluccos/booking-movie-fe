import React from "react";
// import "./CouponsPage.scss";
import CouponItem from "../../components/CouponItem";

function CouponsPage() {
  const img =
    "https://bhdstar.vn/wp-content/uploads/2024/10/poster-labubu-web-1.jpg";
  return (
    <div className="content mt-4">
      <p className="text-3xl font-bold text-center mt-3">Ưu đãi hiện có</p>
      <div className="flex flex-wrap gap-[10px]">
        <CouponItem
          img={img}
          title="Cơ hội sở hữu LABUBU FLIP WITH ME 40cm tại HL-Theaters !"
          detail="Đến 3HL Movies mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
        ></CouponItem>
        <CouponItem
          img="https://bhdstar.vn/wp-content/uploads/2024/11/466793530_1003149731851513_661564586689858699_n.jpg"
          title="Siêu bão miễn phí vé"
          detail="Đến 3HL Movies mua combo để có cơ hội sở hữu LABUBU miễn phí ngay nhéee"
        ></CouponItem>
        <CouponItem
          img="https://bhdstar.vn/wp-content/uploads/2024/11/bap-free-vui-het-y.jpg"
          title="Bắp Free tại HL-Theaters !"
          detail="Tặng ngay bắp miễn phí KHÔNG phụ thu đổi vị dành cho 2 người khi xem phim."
        ></CouponItem>
      </div>
    </div>
  );
}

export default CouponsPage;
