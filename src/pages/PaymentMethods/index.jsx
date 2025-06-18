import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import vnpay from "../../assets/vnpay.jpg";
import instance from "../../api/instance";
import CouponComponent from "../../components/CouponComponent";
import FoodComponent from "../../components/FoodComponent";
import { handleRedirect } from "../../utils/common";
import CountDownComponent from "../../components/CountDownComponent/CountDownComponent.jsx";
import { toast } from "react-toastify";
import { GiCancel } from "react-icons/gi";
const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState("null");
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [listFood, setListFood] = useState([1, 2]);
  const [selectFood, setSelectFood] = useState("");
  const [selectFood_Price, setSelectFood_Price] = useState(0);
  const location = useLocation();
  console.log("state: ", location.state);
  console.log(
    "seatPriceTotal: ",
    location.state.seatId.length * 100000 + selectFood_Price,
    "VND"
  );
  console.log(selectedMethod);
  const nav = useNavigate();
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (isTimeout) {
      toast.error("Quá trình thanh toán đã bị hủy");
      setTimeout(() => nav("/"), 1000);
    }
  }, [isTimeout]);
  // handle cancel selectSeat
  const cancelSelectSeat = async () => {
    try {
      const res = await instance.put(
        `/showtimes/${location.state.showtimeId}/updateStatus`,
        {
          seatIds: location.state.seatId,
          status: 0, //cancel -> 0, select -> 2
        }
      );
      if (res) {
        toast.error("Bạn đã hủy thanh toán");
        setTimeout(() => nav("/"), 1000);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await instance.get("/foods/");
        if (res) {
          console.log("food: ", res);
          setListFood(res.data.result);
        }
      } catch (error) {
        console.log("Error when fetchFoods", error);
      }
    };
    fetchFoods();
  }, []);

  const handleSelectFood = (id, price) => {
    console.log("select food ", id);
    setSelectFood_Price(price);
    setSelectFood(id);
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
    console.log("Selected Seat IDs:", location.state.seatId);
    console.log("CouponID");
    const bookTicket = async () => {
      const req = {
        showtimeId: location.state.showtimeId,
        seatId: location.state.seatId,
        couponId: selectedCouponId,
        orderRequests: [{ foodId: selectFood, quantity: 1 }],
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
            handleRedirect(response.data.result, nav);
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
    <div className="flex flex-col items-center gap-y-1 my-1">
      {/* component countdown */}
      <div className="flex justify-center">
        <CountDownComponent setIsTimeout={setIsTimeout} />
        <button
          onClick={cancelSelectSeat}
          className="flex justify-center items-center"
        >
          <GiCancel size={40} color="red" />
        </button>
      </div>
      <div className="content flex gap-x-1 justify-center">
        <div className="content border rounded">
          {/* buying food  */}
          <div className="p-3">
            <h1 className="text-center text-xl font-bold uppercase">
              Chọn combo đi cùng
            </h1>
            <div className="flex gap-x-5 my-3">
              {listFood.map((food, i) => (
                <FoodComponent
                  key={i}
                  image={food.image}
                  name={food.name}
                  price={food.price}
                  selectHandle={() => handleSelectFood(food.id, food.price)}
                  isSelect={selectFood === food.id}
                />
              ))}
            </div>
          </div>
          <hr className="mx-8" />
          {/* select type of payment */}
          <div className="p-4 ">
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
                  selectedMethod !== "null" && selectFood !== ""
                    ? "bg-blue-500 text-white cursor-pointer"
                    : "bg-white text-gray-500 border border-gray-300 cursor-not-allowed"
                }`}
                disabled={selectedMethod === "null" || selectFood === ""}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
        <CouponComponent
          totalPrice={location.state.seatId.length * 100000 + selectFood_Price}
          onApplyCoupon={(couponId) => setSelectedCouponId(couponId)}
        />
      </div>
    </div>
  );
};

export default PaymentMethods;
