import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../../api/instance";
import ProfileImg from "../../../assets/profile.png";

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
        console.log(response.data.result);
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
        console.log("All room");
        console.log(res.data.result);
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
      console.log("Lịch chiếu mới:", res.data.result);
      alert("Tạo lịch chiếu thành công!");

      // Thêm lịch chiếu mới vào danh sách
      setShowtimes((prev) => [
        ...prev,
        {
          ...res.data.result,
          theater: rooms.find((room) => room.id === formData.roomId) || {},
        },
      ]);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra");
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
      <div className="flex items-center mb-4 ">
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có lịch chiếu</p>
        )}
      </div>
    </div>
  );
}

export default ShowTimePage;
