import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import vnpay from "../../assets/vnpay.jpg";
import instance from "../../api/instance";
import CouponComponent from "../../components/CouponComponent";

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState("null");
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const location = useLocation();
  console.log("state: ", location.state);
  console.log("seatPriceTotal: ", location.state.seatId.length * 100000, "VND");
  console.log(selectedMethod);
  const nav = useNavigate();
  const handleRedirect = (url) => {
    const isInternalRoute = url.startsWith("/");
    if (isInternalRoute) {
      nav(url);
    } else {
      window.location.href = url;
    }
  };
  const paymentMethods = [
    {
      id: "VNPay",
      name: "Thanh toán qua VNPAY (Visa, Master, Amex, JCB,...)",
      logo: vnpay,
    },
  ];

  //handleBook
  const handleBook = () => {
    console.log("Selected Seat IDs:", location.state.seatId); // In ra danh sách ID ghế đã chọn
    const bookTicket = async () => {
      const req = {
        showtimeId: location.state.showtimeId,
        seatId: location.state.seatId,
        couponId: "2e7d46d1-4ca0-42bd-960e-a7dd91b6f2a9",
      };
      console.log(req);
      try {
        const response = await instance.post(`/book/`, req);
        console.log(response.data);
        console.log(response.data.result);
        //save id ticket
        const ticketId = response.data.result.id;
        const payment = async () => {
          try {
            const method = "VNPay";
            const response = await instance.post(`/payment/`, null, {
              params: {
                ticketId,
                method,
              },
            });
            console.log(response.data.result);
            handleRedirect(response.data.result);
          } catch (error) {
            console.error("Error payment", error);
          }
        };
        payment();
      } catch (error) {
        console.error("Error book ticket", error);
      }
    };
    bookTicket();
  };

  return (
    <div className="content flex gap-x-1 justify-center">
      <div className="content p-4 border rounded">
        <h1 className="text-xl text-center font-bold mb-4">
          HÌNH THỨC THANH TOÁN
        </h1>
        <ul>
          {paymentMethods.map((method) => (
            <li key={method.id} className="flex items-center mb-4">
              <input
                type="radio"
                name="paymentMethod"
                id={method.id}
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="mr-2"
              />
              <label
                htmlFor={method.id}
                className="flex items-center cursor-pointer"
              >
                <img
                  src={method.logo}
                  alt={method.name}
                  className="w-8 h-8 mr-2"
                />
                {method.name}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <button
            onClick={() => handleBook()}
            className={`p-2 rounded text-center ${
              selectedMethod !== "null"
                ? "bg-blue-500 text-white cursor-pointer"
                : "bg-white text-gray-500 border border-gray-300 cursor-not-allowed"
            }`}
            disabled={selectedMethod === "null"}
          >
            Thanh toán
          </button>
        </div>
      </div>
      <CouponComponent
        totalPrice={location.state.seatId.length * 100000}
        onApplyCoupon={(couponId) => setSelectedCouponId(couponId)}
      />
    </div>
  );
};

export default PaymentMethods;
