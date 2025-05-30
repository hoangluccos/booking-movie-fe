import React, { useEffect, useState } from "react";
import instance from "../../api/instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectCoupon from "./SelectCoupon";

function CouponComponent({ totalPrice, onApplyCoupon }) {
  const [coupons, setCoupons] = useState("");
  const [listCoupons, setListCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isSelect, setIsSelect] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await instance.get("/coupons/");
        console.log("Danh sách mã giảm giá: ", res.data.result);
        setListCoupons(res.data.result);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách mã giảm giá: ", error);
      }
    };
    fetchCoupons();
  }, []);

  const handleApplyCoupon = () => {
    const matchedCoupon = listCoupons.find(
      (coupon) => coupon.code.toLowerCase() === coupons.trim().toLowerCase()
    );

    if (matchedCoupon) {
      if (totalPrice < matchedCoupon.minValue) {
        toast.error(
          `Mã giảm giá chỉ áp dụng cho hóa đơn tối thiểu ${matchedCoupon.minValue.toLocaleString()} VND.`
        );
        setAppliedCoupon(null);
        onApplyCoupon(null);
        return;
      }

      toast.success("Áp mã thành công");
      setAppliedCoupon(matchedCoupon);
      onApplyCoupon(matchedCoupon.id);
    } else {
      toast.error("Mã giảm giá không hợp lệ!");
      setAppliedCoupon(null);
      onApplyCoupon(null);
    }
  };

  const calculateFinalPrice = () => {
    if (!appliedCoupon) return totalPrice;

    if (appliedCoupon.discountType === "Fixed") {
      return Math.max(totalPrice - appliedCoupon.discountValue, 0);
    }

    if (appliedCoupon.discountType === "Percentage") {
      return Math.max(totalPrice * (1 - appliedCoupon.discountValue / 100), 0);
    }
    if (appliedCoupon.discountType === "Other") {
      return appliedCoupon.discountValue;
    }

    return totalPrice;
  };

  const calculateDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    return totalPrice - calculateFinalPrice();
  };

  const formatCurrency = (value) => {
    return value.toLocaleString();
  };

  const handleSelectCoupon = (id, code) => {
    setCoupons(code);
    onApplyCoupon(id);
    setIsSelect(id);
  };

  return (
    <div className="p-3 border rounded">
      <ToastContainer />
      <h1 className="text-xl text-center font-bold mb-4">
        Tổng hóa đơn{" "}
        <strong className="text-green-400">
          {formatCurrency(totalPrice)} VND
        </strong>
      </h1>
      <div className="coupons">
        <input
          placeholder="Mã giảm giá"
          type="text"
          value={coupons}
          onChange={(e) => setCoupons(e.target.value)}
          className="border w-full rounded p-1"
        />
        {listCoupons.map((c, id) => (
          <SelectCoupon
            key={id}
            image={c.image}
            name={c.code}
            handleSelect={() => handleSelectCoupon(c.id, c.code)}
            isSelect={isSelect === c.id}
          />
        ))}
        <button
          onClick={handleApplyCoupon}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        >
          Xác nhận
        </button>
      </div>
      <hr className="border-t-2 border-gray-200 my-4" />
      {appliedCoupon ? (
        <div className="text-green-500">
          <p>Giá ban đầu: {formatCurrency(totalPrice)} VND</p>
          <p className="text-red-400">
            Số tiền được giảm: {formatCurrency(calculateDiscountAmount())} VND
          </p>
        </div>
      ) : (
        <p className="text-red-500">Chưa áp dụng mã giảm giá nào</p>
      )}
      <hr className="border-t-2 border-gray-200 my-4" />
      <h1 className="text-xl text-center font-bold mb-4">
        Cần thanh toán{" "}
        <strong className="text-green-400">
          {formatCurrency(calculateFinalPrice())} VND
        </strong>
      </h1>
    </div>
  );
}

export default CouponComponent;
