import React, { useEffect, useState } from "react";
// import "./CouponsPage.scss";
import CouponItem from "../../components/CouponItem";
import instance from "../../api/instance";
function CouponsPage() {
  const [listCoupons, setListCoupons] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await instance.get("/coupons/");
        console.log("coupons: ", res.data.result);
        setListCoupons(res.data.result);
      } catch (error) {
        console.log("Error when fetchApi: ", error);
      }
    };
    fetchApi();
  }, []);
  const imgDefault =
    "https://bhdstar.vn/wp-content/uploads/2024/10/poster-labubu-web-1.jpg";
  return (
    <div className="content mt-4">
      <p className="text-3xl font-bold text-center mt-2">Ưu đãi hiện có</p>
      <div className="flex flex-wrap gap-[10px]">
        {listCoupons.map((coupon, index) => (
          <CouponItem
            key={index}
            img={coupon.image}
            title={`Voucher discount ${coupon.discountValue.toLocaleString()}${
              coupon.discountType === "Other"
                ? " Chỉ 88k"
                : coupon.discountType === "Fixed"
                ? "K"
                : "%"
            }`}
            detail={coupon.description}
            couponData={coupon}
          />
        ))}
      </div>
    </div>
  );
}

export default CouponsPage;
