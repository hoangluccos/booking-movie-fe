import React from "react";
import matching_congra from "../../assets/matching_success.png";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

function MatchingSuccess(props) {
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
  const partner = {
    id: "a18dddc8-c890-4188-808e-da869bfe101b",
    username: "ghostnepo",
    firstName: "Luckily",
    lastName: "Nguyen",
    dateOfBirth: "14-06-2004",
    gender: true,
    email: "ghostnepo@gmail.com",
    avatar:
      "https://res.cloudinary.com/ddwbopzwt/image/upload/v1743056304/ghostnepo/ipjekmmxonjbifkq95og.jpg",
    hasPassword: true,
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
            <img src={movie.image} alt="" />
          </div>
          <p>{movie.name}</p>
          <p>Ngày xuất chiếu - giờ</p>
        </div>
        <div className="flex flex-col items-center w-[300px] py-2 bg-white rounded-md">
          <p>Thông tin partner</p>
          <p>
            Tên: {partner.firstName} {partner.lastName}
          </p>
          <p>DOB: {partner.dateOfBirth}</p>
        </div>
      </div>
      <div className="info-btn_payment flex flex-col items-center justify-center">
        <Link className="flex gap-2">
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
        </Link>
      </div>
    </div>
  );
}

export default MatchingSuccess;
