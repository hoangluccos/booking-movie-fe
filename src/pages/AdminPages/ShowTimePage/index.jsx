import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../../api/instance";
import ProfileImg from "../../../assets/profile.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ShowTimePage() {
  const param = useParams();
  const movieId = param.id;
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMovie, setInfoMovie] = useState({});
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    roomId: "",
  });
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    startTime: "",
    roomId: "",
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await instance.get(`/movies/${movieId}`);
        setInfoMovie(res.data.result);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchShowtimes = async () => {
      try {
        const response = await instance.get(`/showtimes/${movieId}/all`);
        setShowtimes(response.data.result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await instance.get("/theaters/getAll");
        setRooms(res.data.result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMovieDetails();
    fetchShowtimes();
    fetchRooms();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        ...formData,
        movieId,
      };
      const res = await instance.post("/showtimes/", requestBody);
      toast.success("Tạo lịch chiếu thành công!");
      setShowtimes((prev) => [
        ...prev,
        {
          ...res.data.result,
          theater: rooms.find((room) => room.id === formData.roomId) || {},
        },
      ]);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const handleEdit = (showtime) => {
    setEditingShowtime(showtime);
    setEditFormData({
      date: showtime.date,
      startTime: showtime.startTime,
      roomId: showtime.theater.id,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedShowtime = { ...editFormData };
      const res = await instance.put(
        `/showtimes/${editingShowtime.id}`,
        updatedShowtime
      );
      toast.success("Cập nhật lịch chiếu thành công!");
      setShowtimes((prev) =>
        prev.map((st) =>
          st.id === editingShowtime.id
            ? {
                ...st,
                ...res.data.result,
                theater:
                  rooms.find((room) => room.id === updatedShowtime.roomId) ||
                  {},
              }
            : st
        )
      );
      setEditingShowtime(null);
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  };

  const handleDelete = async (showtimeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch chiếu này không?")) {
      try {
        await instance.delete(`/showtimes/${showtimeId}`);
        toast.success("Xóa lịch chiếu thành công!");
        setShowtimes((prev) => prev.filter((st) => st.id !== showtimeId));
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <img
          src={infoMovie.image || ProfileImg}
          alt={infoMovie.name}
          className="w-32 h-48 object-cover mr-4 rounded"
        />
        <h1 className="text-2xl font-bold">{infoMovie.name}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tạo Lịch Chiếu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Ngày:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Giờ bắt đầu:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Phòng chiếu:</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="">Chọn phòng chiếu</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Tạo Lịch Chiếu
          </button>
        </form>
      </div>

      {editingShowtime && (
        <div className="p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Chỉnh Sửa Lịch Chiếu</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block font-medium">Ngày:</label>
              <input
                type="date"
                name="date"
                value={editFormData.date}
                onChange={handleEditChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-medium">Giờ bắt đầu:</label>
              <input
                type="time"
                name="startTime"
                value={editFormData.startTime}
                onChange={handleEditChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-medium">Phòng chiếu:</label>
              <select
                name="roomId"
                value={editFormData.roomId}
                onChange={handleEditChange}
                required
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Chọn phòng chiếu</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Cập Nhật
            </button>
            <button
              type="button"
              onClick={() => setEditingShowtime(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      <hr className="border-t-2 border-gray-200 my-4" />
      <div>
        <h2 className="text-xl font-semibold mb-2">Lịch Chiếu Phim</h2>
        {showtimes.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border border-gray-300">Ngày</th>
                <th className="p-2 border border-gray-300">Giờ</th>
                <th className="p-2 border border-gray-300">Phòng</th>
                <th className="p-2 border border-gray-300">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr key={showtime.id}>
                  <td className="p-2 border border-gray-300">
                    {showtime.date}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {showtime.startTime}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {showtime.theater.name}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      onClick={() => handleEdit(showtime)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(showtime.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có lịch chiếu nào.</p>
        )}
      </div>
    </div>
  );
}

export default ShowTimePage;
