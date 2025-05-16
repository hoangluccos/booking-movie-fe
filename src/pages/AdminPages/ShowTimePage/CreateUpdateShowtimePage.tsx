// CreateUpdateShowtimePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ConfigProvider, DatePicker, Select, TimePicker } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import dayjs, { Dayjs } from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllMovies } from "../../../redux/Slices/MovieSlice.tsx";
import { getAllRooms } from "../../../redux/Slices/RoomSlice.tsx";
import {
  createShowtime,
  getAllShowtimes,
  getOneShowtime,
  updateShowtime,
} from "../../../redux/Slices/ShowtimeSlice.tsx";
// import { createShowtime, updateShowtime } from "../../../redux/Slices/ShowtimeSlice.tsx";

const { Option } = Select;

const CreateUpdateShowtimePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { listMovie } = useAppSelector((state) => state.movie);
  const { listRooms } = useAppSelector((state) => state.room);
  const { showtimeInfo, isLoading, error } = useAppSelector(
    (state) => state.showtime
  );

  useEffect(() => {
    dispatch(getAllMovies());
    dispatch(getAllRooms());
  }, []);

  const [form, setForm] = useState({
    date: null as Dayjs | null,
    startTime: null as Dayjs | null,
    movieId: undefined as string | undefined,
    roomId: undefined as string | undefined,
  });

  useEffect(() => {
    if (id) {
      dispatch(getOneShowtime({ showtimeId: id }));
      if (showtimeInfo) {
        setForm({
          date: dayjs(showtimeInfo.date, "DD-MM-YYYY"),
          startTime: dayjs(showtimeInfo.startTime, "HH:mm"),
          movieId: showtimeInfo.movie.id,
          roomId: showtimeInfo.room.id,
        });
      }
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.startTime || !form.movieId || !form.roomId) {
      toast.error("Please fill in all fields.");
      return;
    }

    const params = {
      date: form.date.format("YYYY-MM-DD"),
      startTime: form.startTime.format("HH:mm"),
      movieId: form.movieId,
      roomId: form.roomId,
    };

    try {
      if (id) {
        await dispatch(
          updateShowtime({ showtimeId: id, updateShowtimeRequest: params })
        ).unwrap();
        toast.success("Showtime updated successfully!");
      } else {
        await dispatch(
          createShowtime({ createShowtimeRequest: params })
        ).unwrap();
        toast.success("Showtime created successfully!");
      }
      setTimeout(() => navigate("/admin/showtimes"), 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to create/update showtime.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Select: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            optionSelectedBg: "#1e2632",
            selectorBg: "#323D4E",
            colorBgElevated: "#323D4E",
          },
          Input: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
          },
          DatePicker: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            colorBgElevated: "#323D4E",
          },
        },
      }}
    >
      <div className="text-white">
        <span className="text-3xl mb-8 flex font-saira">
          {id ? "Edit Showtime" : "Add New Showtime"}
        </span>
        <div className="w-full bg-[#273142] p-10 rounded-2xl shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-6 w-full"
          >
            <div className="flex flex-col">
              <label className="mb-2 font-saira">Date</label>
              <DatePicker
                value={form.date}
                onChange={(value) => handleChange("date", value)}
                format="DD-MM-YYYY"
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-saira">Start Time</label>
              <TimePicker
                value={form.startTime}
                onChange={(value) => handleChange("startTime", value)}
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-saira">Movie</label>
              <Select
                value={form.movieId}
                placeholder="Select movie"
                onChange={(value) => handleChange("movieId", value)}
                disabled={Boolean(id)}
              >
                {listMovie.map((movie) => (
                  <Option key={movie.id} value={movie.id}>
                    {movie.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-saira">Room</label>
              <Select
                value={form.roomId}
                placeholder="Select room"
                onChange={(value) => handleChange("roomId", value)}
              >
                {listRooms.map((room) => (
                  <Option key={room.id} value={room.id}>
                    {room.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-span-2 flex justify-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="h-[56px] w-[200px]"
                style={{
                  backgroundColor: "#3b82f6",
                  borderColor: "#3b82f6",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                  e.currentTarget.style.borderColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
              >
                {id ? "Update Showtime" : "Add Now"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreateUpdateShowtimePage;
