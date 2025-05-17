import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  ConfigProvider,
  DatePicker,
  TimePicker,
  Cascader,
  Select,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import dayjs, { Dayjs } from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllMovies } from "../../../redux/Slices/MovieSlice.tsx";
import { getAllTheaters } from "../../../redux/Slices/TheaterSlice.tsx";
import { getAllRooms } from "../../../redux/Slices/RoomSlice.tsx";
import {
  createShowtime,
  getOneShowtime,
  updateShowtime,
} from "../../../redux/Slices/ShowtimeSlice.tsx";

const CreateUpdateShowtimePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { listMovie } = useAppSelector((state) => state.movie);
  const { listTheaters } = useAppSelector((state) => state.theater);
  const { showtimeInfo, isLoading } = useAppSelector((state) => state.showtime);

  const [options, setOptions] = useState<
    {
      value: string;
      label: string;
      isLeaf: boolean;
      children?: { label: string; value: string; isLeaf: boolean }[];
    }[]
  >([]);

  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const [form, setForm] = useState({
    date: null as Dayjs | null,
    startTime: null as Dayjs | null,
    movieId: undefined as string | undefined,
    roomId: undefined as string | undefined,
  });

  // Load danh sách theaters và movies khi mount
  useEffect(() => {
    dispatch(getAllTheaters());
    dispatch(getAllMovies());
  }, [dispatch]);

  // Cập nhật options khi listTheaters thay đổi
  useEffect(() => {
    const theaterOptions = listTheaters.map((theater) => ({
      value: theater.id,
      label: theater.name,
      isLeaf: false,
    }));
    setOptions(theaterOptions);
  }, [listTheaters]);

  // Load showtime khi edit
  useEffect(() => {
    if (id) {
      dispatch(getOneShowtime({ showtimeId: id }));
    }
  }, [id, dispatch]);

  // Set form và cascader khi có showtimeInfo (chế độ edit)
  useEffect(() => {
    if (showtimeInfo) {
      setForm({
        date: dayjs(showtimeInfo.date, "DD-MM-YYYY"),
        startTime: dayjs(showtimeInfo.startTime, "HH:mm"),
        movieId: showtimeInfo.movie.id,
        roomId: showtimeInfo.room.id,
      });

      const theaterId = showtimeInfo.theater.id || "";
      setSelectedValue([theaterId, showtimeInfo.room.id]);

      dispatch(getAllRooms({ theaterId })).then((res: any) => {
        const rooms = res.payload || [];
        setOptions((prevOptions) =>
          prevOptions.map((theater) =>
            theater.value === theaterId
              ? {
                  ...theater,
                  children: rooms.map((room: any) => ({
                    label: room.name,
                    value: room.id,
                    isLeaf: true,
                  })),
                }
              : theater
          )
        );
      });
    }
  }, [showtimeInfo, dispatch]);

  // Reset form khi thêm mới (id undefined)
  useEffect(() => {
    if (!id) {
      setForm({
        date: null,
        startTime: null,
        movieId: undefined,
        roomId: undefined,
      });
      setSelectedValue([]);
    }
  }, [id]);

  // Lazy load rooms trong cascader
  const loadData = async (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      const res = await dispatch(
        getAllRooms({ theaterId: targetOption.value })
      ).unwrap();
      targetOption.loading = false;

      targetOption.children = res.map((room: any) => ({
        label: room.name,
        value: room.id,
        isLeaf: true,
      }));

      setOptions([...options]);
    } catch (error) {
      targetOption.loading = false;
      setOptions([...options]);
      toast.error("Failed to load rooms");
    }
  };

  // Xử lý thay đổi chọn cascader (theater, room)
  const onCascaderChange = (value: string[]) => {
    setSelectedValue(value);
    if (value.length === 2) {
      setForm((prev) => ({ ...prev, roomId: value[1] }));
    } else {
      setForm((prev) => ({ ...prev, roomId: undefined }));
    }
  };

  // Thay đổi các trường khác trong form
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit form tạo hoặc cập nhật showtime
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
          Cascader: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "white",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
            optionSelectedBg: "#1e2632",
            colorBgElevated: "#323D4E",
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
                options={listMovie.map((movie) => ({
                  label: movie.name,
                  value: movie.id,
                }))}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-saira">Theater & Room</label>
              <Cascader
                options={options}
                loadData={loadData}
                onChange={onCascaderChange}
                value={selectedValue}
                changeOnSelect={false}
                placeholder="Select theater and room"
                style={{ width: "100%" }}
              />
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
        <ToastContainer />
      </div>
    </ConfigProvider>
  );
};

export default CreateUpdateShowtimePage;
