import React, { useEffect, useState } from "react";
import hand_love from "../../assets/hand_love.jpg";
import { Select } from "antd";
import instance from "../../api/instance";
import { useNavigate } from "react-router-dom";
import { transferStringToDate } from "../../utils/common";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const onChangeSelect = (value, storeAt) => {
  console.log(`selected ${value}`);
  storeAt(value); //useState set
};

const onSearchSelect = (value) => {
  console.log("search:", value);
};

const MatchingPage = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [userId, setUserId] = useState("");
  //useWebsocket
  const { connect, isConnected, disconnect, isLoading } = useWebSocket();
  const [notifications, setNotifications] = useState([]);

  const [listMovies, setListMovies] = useState([]);
  const [listTheaters, setListTheaters] = useState([]);
  const [selectMovieId, setSelectMovie] = useState(""); //id
  const [selectTheaterName, setSelectTheaterName] = useState(""); //name theaters
  const [selectShowtime, setSelectShowtime] = useState(""); //id showtime
  const [selectGender, setSelectGender] = useState(0); //gender number
  const [minAge, setMinAge] = useState(0); //age number
  const [maxAge, setMaxAge] = useState(0); //age number
  const [allShowtimesAccessible, setAllShowtimesAccessible] = useState([]);
  const [showtimesCanPick, setShowtimesCanPick] = useState([]);
  console.log("List movies API", listMovies);
  console.log("Selected Movies: ", selectMovieId);
  console.log("showtime can pick final ", showtimesCanPick);
  console.log("MyId bio ", userId);

  const genderOptions = [
    { name: "Nam", id: 1 },
    { name: "Nữ", id: 0 },
  ];

  const ageOptions = Array.from({ length: 83 }, (_, i) => {
    const age = i + 18;
    return { label: `${age} tuổi`, value: age };
  });
  const handleNotificationSocket = (data) => {
    setNotifications((prev) => [...prev, data]);
  };
  useEffect(() => {
    //authenticate
    if (token === null) {
      navigate("/login");
    } else {
      const fetchAPI = async () => {
        const [resMovies, resTheaters, resMybio] = await Promise.all([
          instance.get("/movies/"),
          instance.get("/theaters/"),
          instance.get("/users/bio"),
        ]);
        if (resMovies && resTheaters && resMybio) {
          setListMovies(resMovies.data.result);
          setListTheaters(resTheaters.data.result);
          setUserId(resMybio.data.result.id);
        }
      };
      fetchAPI();
    }
  }, []);
  useEffect(() => {
    if (selectMovieId) {
      const fetchShowtime = async () => {
        try {
          const res = await instance.get(`/showtimes/${selectMovieId}/all`);
          console.log("showtimes all of ", res);
          const temp = [];
          res.data.result.forEach((data) => {
            if (transferStringToDate(data.date)) {
              temp.push(data);
            }
          });
          console.log("list Showtime accessible: ", temp);
          setAllShowtimesAccessible(temp);
        } catch (error) {
          console.log("error fetch showtimes ", error);
        }
      };
      fetchShowtime();
    }
  }, [selectMovieId]);
  useEffect(() => {
    if (allShowtimesAccessible.length > 0) {
      const temp = [];
      allShowtimesAccessible.forEach((data) => {
        console.log("data.theater.name: ", data.theater.name);
        console.log("selectTheaterName: ", selectTheaterName);
        if (data.theater.name === selectTheaterName) temp.push(data);
      });
      setShowtimesCanPick(temp);
    }
  }, [allShowtimesAccessible, selectTheaterName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await connect(userId, handleNotificationSocket); // chờ kết nối thật sự

      await instance.post("/matching/", {
        movieName: listMovies.find((movieObj) => movieObj.id === selectMovieId)
          .name,
        theaterName: selectTheaterName,
        showtimeId: selectShowtime,
        gender: selectGender,
        minAge,
        maxAge,
      });

      console.log("🎉 Matching request sent!");
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };
  if (isLoading) {
    console.log("Loading");
    return (
      <>
        <Spin
          size="large"
          // style={{ fontSize: "100px" }}
          indicator={
            <LoadingOutlined style={{ fontSize: 100, color: "pink" }} spin />
          }
        />
        <p className="flex justify-center mt-10 font-bold">
          Hệ thống đang tìm người phù hợp với bạn
        </p>
        <div className="flex justify-center">
          <button
            className="bg-slate-500 text-white p-2 max-w-[100px] rounded-lg"
            onClick={() => handleDisconnect()}
          >
            Hủy tìm
          </button>
        </div>
        <div className="flex justify-center">
          {notifications.length > 0 ? <></> : ""}
        </div>
      </>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-300">
      <div
        className="bg-white/80 border rounded shadow-md w-[550px] p-6"
        style={{
          backgroundImage: { hand_love },
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
              Send
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
        placeholder="Select"
        optionFilterProp="label"
        onChange={(value) => onChangeSelect(value, storeAt)}
        onSearch={onSearchSelect}
        className=" text-white font-bold mr-3 rounded-full appearance-none w-[200px]"
        options={listData.map((data, i) => ({
          label:
            name === "showtimes"
              ? `Ngày: ${data.date}
                Giờ: ${data.startTime}`
              : data.name,
          value: name === "theater" ? data.name : data.id,
        }))}
      />
    </div>
  );
};

export default MatchingPage;
