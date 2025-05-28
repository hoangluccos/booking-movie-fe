import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import instance from "../../api/instance";
import { handleRedirect } from "../../utils/common";
import { useEffect, useState } from "react";

function MatchingSuccess() {
  const location = useLocation();
  console.log("data receive", location.state);
  const nav = useNavigate();

  // const dataMovie = location.state.dataRequestMatching;
  // const showTime = location.state.showTime;
  const dataTicket = location.state.dataTicket;
  const ticketId = location.state.dataTicket.id;
  const dataPartner = location.state.dataPartner;
  const [dataMovie, setDataMovie] = useState({});
  const [showTime, setShowTime] = useState({});

  useEffect(() => {
    const fetchShowtime = async () => {
      try {
        const res = await instance.get(
          `/showtimes//info/${location.state.dataTicket.showtimeId}`
        );
        console.log("data response: ", res.data.result);
        setDataMovie(res.data.result.movie);
        setShowTime(res.data.result);
      } catch (error) {
        console.log("fail when fetch showtime api : ", error);
      }
    };
    fetchShowtime();
  }, []);

  const handleDeleteRQ = () => {
    const checkAndDeleteRQ = async () => {
      try {
        const res = await instance.get("/matching/check");
        if (res.data.result.isSendMatchingRequest) {
          const deleteRQ = async () => {
            try {
              const response = await instance.delete("/matching/");
              if (response.data.code === 200) {
                console.log("Delete Request matching successfully");
              }
            } catch (error) {
              console.log("error when delete", error);
            }
          };
          deleteRQ();
        }
      } catch (error) {
        console.log("error when checking: ", error);
      }
    };
    checkAndDeleteRQ();
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
        //delete request matching after paid successfully
        handleDeleteRQ();
        handleRedirect(response.data.result, nav);
      } catch (error) {
        console.error("Error payment", error);
      }
    };
    payment();
  };
  return (
    <div
      className="min-h-[600px] flex-col select-none justify-between px-[180px]"
      style={{
        backgroundImage: `linear-gradient(to bottom right, #FA9F9E, #7BD5F0)`,
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
          <p>
            Ngày xuất chiếu {showTime.date} - giờ {showTime.startTime}
          </p>
        </div>
        <div className="flex flex-col items-center w-[300px] py-2 bg-white rounded-md">
          <p>Thông tin partner</p>
          <p>Tên: {dataPartner.name}</p>
          <p>DOB: {dataPartner.dateOfBirth}</p>
        </div>
        <div className="flex justify-center items-center w-[300px] py-2 bg-white rounded-md">
          <p className="my-auto text-lg font-bold">
            Tổng tiền cần thanh toán: {dataTicket?.amount.toLocaleString()}VND
          </p>
        </div>
      </div>
      <div className="info-btn_payment flex flex-col items-center justify-center mt-5 ml-5">
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
