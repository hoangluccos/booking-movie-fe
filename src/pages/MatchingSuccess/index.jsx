import React, { useEffect } from "react";
import matching_congra from "../../assets/matching_success.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import instance from "../../api/instance";
import { handleRedirect } from "../../utils/common";

function MatchingSuccess(props) {
  const location = useLocation();
  console.log("data receive", location.state);
  const nav = useNavigate();

  const dataMovie = location.state.dataRequestMatching;
  const dataTicket = location.state.dataTicket;
  const ticketId = location.state.dataTicket.id;
  const dataPartner = location.state.dataPartner;

  const movie = {
    id: "000ce205-71a0-4b0a-a14a-6cf7f83c2a75",
    name: "Mai",
    premiere: "15-11-2024",
    language: "Vietnamese",
    content:
      'MAI là câu chuyện về cuộc đời của người phụ nữ cùng tên, với ánh nhìn tĩnh lặng, xuyên thấu " Quá khứ chưa ngủ yên, ngày mai liệu sẽ đến?.."',
    duration: 120,
    rate: 5.0,
    image:
      "https://res.cloudinary.com/ddwbopzwt/image/upload/v1732207762/MovieImage/t9rax2ryriomf74bs1yt.jpg",
    canComment: false,
    genres: [
      {
        id: "3a6e1ea3-282c-4ac8-9ca0-61ddcbdadc30",
        name: "Lãng Mạn",
      },
      {
        id: "bbfb97ac-d6e8-4513-a155-168646a4aaf1",
        name: "Chính Kịch",
      },
    ],
  };

  const handlePayment = () => {
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
  };
  return (
    <div
      className="min-h-[500px] flex select-none justify-between px-[180px]"
      style={{
        backgroundImage: `linear-gradient(to bottom right, #FA9F9E, #7BD5F0), url(${matching_congra})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "color-burn",
      }}
    >
      <div className="flex flex-col items-center justify-center pt-3 gap-y-2">
        <div className="flex flex-col items-center w-[300px] py-2 bg-white rounded-md">
          <p>Thông tin phim đã chọn</p>
          <div className="w-[100px] ">
            <img src={dataMovie.image} alt="" />
          </div>
          <p>{dataMovie.name}</p>
          <p>Ngày xuất chiếu - giờ</p>
        </div>
        <div className="flex flex-col items-center w-[300px] py-2 bg-white rounded-md">
          <p>Thông tin partner</p>
          <p>Tên: {dataPartner.name}</p>
          <p>DOB: {dataPartner.dateOfBirth}</p>
        </div>
      </div>
      <div className="info-btn_payment flex flex-col items-center justify-center">
        <div className="flex gap-2" onClick={handlePayment}>
          <p className="relative px-9 py-6 bg-[#2eb440] text-white rounded-md overflow-hidden group">
            <span className="absolute inset-0 bg-yellow-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
            <span className="relative z-10">THANH TOÁN NGAY</span>
          </p>
          <Tooltip
            className="mb-14"
            title="Bạn phải thanh toán để hoàn thành việc đặt vé "
          >
            <QuestionCircleOutlined
              style={{ fontSize: 20, color: "black", cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default MatchingSuccess;
