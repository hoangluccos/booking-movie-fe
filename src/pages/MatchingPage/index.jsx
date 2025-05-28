import React, { useEffect, useState, useCallback } from "react";
import { Select, Spin } from "antd";
import instance from "../../api/instance";
import { useNavigate } from "react-router-dom";
import { transferStringToDateCheckToDay } from "../../utils/common";
import { useWebSocket } from "../../hooks/useWebSocket";
import { LoadingOutlined } from "@ant-design/icons";
import couple_bg from "../../assets/couple_gemini.jpg";
import { toast } from "react-toastify";

const onChangeSelect = (value, storeAt) => {
  console.log(`selected ${value}`);
  storeAt(value);
};

const onSearchSelect = (value) => {
  console.log("search:", value);
};

const MatchingPage = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const { connect, isConnected, disconnect, isLoading } = useWebSocket();
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [hasMatchingRequest, setHasMatchingRequest] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [listMovies, setListMovies] = useState([]);
  const [listTheaters, setListTheaters] = useState([]);
  const [selectMovieId, setSelectMovie] = useState("");
  const [selectTheaterName, setSelectTheaterName] = useState("");
  const [selectShowtime, setSelectShowtime] = useState("");
  const [selectGender, setSelectGender] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [allShowtimesAccessible, setAllShowtimesAccessible] = useState([]);
  const [showtimesCanPick, setShowtimesCanPick] = useState([]);

  const genderOptions = [
    { name: "Nam", id: 1 },
    { name: "Nữ", id: 0 },
  ];

  const ageOptions = Array.from({ length: 83 }, (_, i) => {
    const age = i + 18;
    return { label: `${age} tuổi`, value: age };
  });

  const handleNotificationSocket = useCallback((data) => {
    setNotifications((prev) => [...prev, data]);
  }, []);

  const checkIsHavingRqMatching = async () => {
    try {
      const res = await instance.get("/matching/check");
      console.log("Kết quả kiểm tra: ", res.data.result.isSendMatchingRequest);
      return res.data.result.isSendMatchingRequest;
    } catch (error) {
      console.error("Lỗi khi kiểm tra yêu cầu ghép đôi: ", error);
      toast.error("Không thể kiểm tra trạng thái ghép đôi. Vui lòng thử lại!");
      return false;
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserId = async () => {
      try {
        const resMybio = await instance.get("/users/bio");
        setUserId(resMybio.data.result.id || "");
      } catch (error) {
        console.error("Lỗi khi lấy userId: ", error);
        toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại!");
        setIsChecking(false);
      }
    };

    fetchUserId();
  }, [token, navigate]);

  useEffect(() => {
    if (!userId) return;

    const initialize = async () => {
      setIsChecking(true);
      try {
        const hasRequest = await checkIsHavingRqMatching();
        // setHasMatchingRequest(hasRequest);

        if (hasRequest) {
          console.log("Có yêu cầu ghép đôi, kết nối socket...");
          connect(userId, handleNotificationSocket);
          //change
          setHasMatchingRequest(hasRequest);
        } else {
          console.log("Không có yêu cầu ghép đôi, lấy dữ liệu phim/rạp...");
          try {
            const [resMovies, resTheaters] = await Promise.all([
              instance.get("/movies/"),
              instance.get("/theaters/"),
            ]);
            setListMovies(resMovies.data.result || []);
            setListTheaters(resTheaters.data.result || []);
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phim/rạp: ", error);
            toast.error("Không thể tải dữ liệu phim/rạp. Vui lòng thử lại!");
          }
        }
      } catch (error) {
        console.error("Lỗi trong quá trình khởi tạo: ", error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      } finally {
        setIsChecking(false);
      }
    };

    initialize();
  }, [userId, navigate, connect, handleNotificationSocket]);

  //fetch all showtime when select movie
  useEffect(() => {
    if (!selectMovieId) return;

    const fetchShowtime = async () => {
      try {
        const res = await instance.get(`/showtimes/${selectMovieId}/all`);
        const temp = res.data.result.filter((data) =>
          transferStringToDateCheckToDay(data.date)
        );
        console.log("Danh sách lịch chiếu khả dụng: ", temp);
        setAllShowtimesAccessible(temp);
      } catch (error) {
        console.error("Lỗi khi lấy lịch chiếu: ", error);
        toast.error("Không thể tải lịch chiếu. Vui lòng thử lại!");
      }
    };
    fetchShowtime();
  }, [selectMovieId]);

  //fetch showtime can pick
  useEffect(() => {
    if (allShowtimesAccessible.length > 0 && selectTheaterName) {
      const temp = allShowtimesAccessible.filter(
        (data) => data.theater.name === selectTheaterName
      );
      console.log("Lịch chiếu có thể chọn: ", temp);
      setShowtimesCanPick(temp);
    }
  }, [allShowtimesAccessible, selectTheaterName]);

  //handle get notifications from socket
  useEffect(() => {
    const isCreateTicket = notifications.find(
      (noti) => noti.message === "Tạo vé thành công"
    );
    if (isCreateTicket) {
      const props = {
        dataPartner: null,
        dataTicket: null,
        dataMovie: null,
        showTime: null,
      };
      const isMatched = notifications.find(
        (noti) => noti.message === "Ghép đôi thành công"
      );
      if (isMatched) {
        props.dataPartner = isMatched.result;
        props.dataTicket = isCreateTicket.result;
        props.dataRequestMatching = listMovies.find(
          (movieObj) => movieObj.id === selectMovieId
        );
        props.showTime = showtimesCanPick.find((s) => s.id === selectShowtime);
      }
      toast.success("Hệ thống đã tìm được partner cho bạn!");
      setTimeout(() => {
        disconnect();
        navigate("/matching_success", { state: props });
      }, 1000);
    }
  }, [notifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movie = listMovies.find(
        (movieObj) => movieObj.id === selectMovieId
      );
      if (!movie) {
        toast.error("Vui lòng chọn phim hợp lệ!");
        return;
      }
      const requestData = {
        movieName: movie.name,
        theaterName: selectTheaterName,
        showtimeId: selectShowtime,
        gender: selectGender,
        minAge,
        maxAge,
      };
      console.log("Dữ liệu gửi: ", requestData);

      await instance.post("/matching/", requestData);
      toast.success("Yêu cầu ghép đôi đã được gửi!");

      if (userId) {
        connect(userId, handleNotificationSocket);
        setHasMatchingRequest(true);
      } else {
        console.error("Không có userId để kết nối socket");
        toast.error("Không thể kết nối socket. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu ghép đôi: ", err);
      toast.error("Không thể gửi yêu cầu ghép đôi. Vui lòng thử lại!");
    }
  };

  const handleDisconnect = async () => {
    try {
      await instance.delete("/matching/");
      toast.success("Đã hủy yêu cầu ghép đôi!");
      disconnect();
      setHasMatchingRequest(false);
      setNotifications([]);
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu ghép đôi: ", error);
      toast.error("Không thể hủy yêu cầu ghép đôi. Vui lòng thử lại!");
    }
  };

  //checking whether user have send request_matching before?
  if (isChecking) {
    return (
      <div
        className="flex flex-col justify-center pt-5 min-h-screen"
        style={{
          backgroundImage: `url(${couple_bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Spin
          size="large"
          indicator={
            <LoadingOutlined style={{ fontSize: 100, color: "pink" }} spin />
          }
        />
        <p className="flex justify-center mt-10 font-bold text-2xl text-white p-2 rounded-md bg-pink-400">
          Đang kiểm tra trạng thái ghép đôi...
        </p>
      </div>
    );
  }

  //
  if (hasMatchingRequest || isLoading) {
    return (
      <div
        className="flex flex-col justify-center pt-5 min-h-screen"
        style={{
          backgroundImage: `url(${couple_bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Spin
          size="large"
          indicator={
            <LoadingOutlined style={{ fontSize: 100, color: "pink" }} spin />
          }
        />
        <p className="flex justify-center mt-10 font-bold text-2xl text-white p-2 rounded-md bg-pink-400">
          Hệ thống đang tìm người phù hợp với bạn
        </p>
        <div className="flex justify-center">
          <button
            className="bg-slate-500 text-white p-2 max-w-[100px] rounded-lg"
            onClick={handleDisconnect}
          >
            Hủy tìm
          </button>
        </div>
        <div className="mt-3 justify-center">
          {notifications.length > 0 && (
            <div className="bg-pink-400 flex flex-col justify-center">
              {notifications.map((noti, i) => (
                <p
                  key={i}
                  className="text-md text-center text-pink-50 font-bold"
                >
                  {noti.message}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black"
      style={{
        backgroundImage: `url(${couple_bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/80 border rounded shadow-md w-[550px] p-6">
        <div className="bg-black/40 text-white text-center py-2 font-semibold rounded mb-4">
          Đăng ký ghép đôi "Tìm bạn xem phim chung" dành cho các thành viên F.A
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormRow
            label="Phim bạn muốn xem"
            name="movie"
            listData={listMovies}
            storeAt={setSelectMovie}
          />
          <FormRow
            label="Rạp bạn muốn xem"
            name="theater"
            listData={listTheaters}
            storeAt={setSelectTheaterName}
          />
          <FormRow
            label="Lịch chiếu mà bạn muốn"
            name="showtimes"
            listData={showtimesCanPick}
            storeAt={setSelectShowtime}
          />
          <FormRow
            label="Giới tính của partner"
            name="gender"
            listData={genderOptions}
            storeAt={setSelectGender}
          />
          <div className="flex justify-between items-center">
            <label className="text-black font-semibold">
              Khoảng tuổi mong muốn
            </label>
            <div className="flex gap-2">
              <Select
                placeholder="Từ"
                onChange={setMinAge}
                options={ageOptions}
                className="w-[95px]"
              />
              <Select
                placeholder="Đến"
                onChange={setMaxAge}
                options={ageOptions}
                className="w-[95px]"
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={
                !selectMovieId ||
                !selectTheaterName ||
                !selectShowtime ||
                selectGender === null ||
                selectGender === undefined ||
                !minAge ||
                !maxAge
              }
              className="bg-gradient-to-r from-fuchsia-800 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormRow = ({ label, name, listData, storeAt }) => {
  return (
    <div className="flex justify-between items-center">
      <label className="text-black font-semibold">{label}</label>
      <Select
        showSearch
        placeholder="Chọn"
        optionFilterProp="label"
        onChange={(value) => onChangeSelect(value, storeAt)}
        onSearch={onSearchSelect}
        className="text-white font-bold mr-3 rounded-full appearance-none w-[200px]"
        options={listData.map((data) => ({
          label:
            name === "showtimes"
              ? `Ngày: ${data.date} Giờ: ${data.startTime}`
              : data.name,
          value: name === "theater" ? data.name : data.id,
        }))}
      />
    </div>
  );
};

export default MatchingPage;
