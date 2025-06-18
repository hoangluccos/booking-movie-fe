import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import instance from "../../api/instance";
import { toast } from "react-toastify";

const SeatSelection = () => {
  const param = useParams();
  const showtimeId = param.id;
  const location = useLocation();
  const movieID = location.state;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatsID, setSelectedSeatsID] = useState([]);
  const [seats, setSeats] = useState([]);
  const [movie, setMovie] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/movies/${movieID}`);
        setMovie(response.data.result);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchData();
  }, [movieID]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await instance.get(`/showtimes/${showtimeId}`);
        console.log("api seat: ", response.data.result);
        setSeats(response.data.result);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, [showtimeId]);

  const getSeatKey = (row, column) => `${row}-${column}`;

  const toggleSeatSelection = (seat) => {
    const seatKey = getSeatKey(seat.locateRow, seat.locateColumn);

    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatKey)
        ? prevSelected.filter((s) => s !== seatKey)
        : [...prevSelected, seatKey]
    );

    setSelectedSeatsID((prevIDs) =>
      prevIDs.includes(seat.id)
        ? prevIDs.filter((id) => id !== seat.id)
        : [...prevIDs, seat.id]
    );
  };

  const rows = [...new Set(seats.map((seat) => seat.locateRow))];
  const columns = Math.max(...seats.map((seat) => seat.locateColumn));

  rows.sort();

  const handleSubmitSelectSeats = async () => {
    try {
      //call api toggle status seat
      const res = await instance.put(`/showtimes/${showtimeId}/updateStatus`, {
        seatIds: selectedSeatsID,
        status: 2,
      });
      if (res) {
        console.log("toggle seat: ", res.data);
        nav(`/paymentMethod/${showtimeId}`, {
          state: { showtimeId: showtimeId, seatId: selectedSeatsID },
        });
      }
    } catch (error) {
      toast.error(
        error.data?.message || "Ghế đã được người khác đặt trước bạn"
      );
    }
  };
  return (
    <div className="content p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Chọn ghế</h1>

      {/* Hướng dẫn màu sắc */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button className="w-6 h-6 bg-gray-300 border rounded"></button>
            <span className="ml-2 text-sm">Có thể chọn</span>
          </div>
          <div className="flex items-center">
            <button className="w-6 h-6 bg-green-500 border rounded"></button>
            <span className="ml-2 text-sm">Đang chọn</span>
          </div>
          <div className="flex items-center">
            <button className="w-6 h-6 bg-blue-400 border rounded"></button>
            <span className="ml-2 text-sm">Nguời khác đã chọn</span>
          </div>
          <div className="flex items-center">
            <button className="w-6 h-6 bg-red-500 border rounded"></button>
            <span className="ml-2 text-sm">Đã đặt</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-2/3 p-4 border rounded">
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row} className="flex justify-center space-x-2">
                {Array.from({ length: columns }, (_, colIndex) => {
                  const col = colIndex + 1;
                  const seat = seats.find(
                    (s) => s.locateRow === row && s.locateColumn === col
                  );

                  if (!seat) return null;

                  const seatKey = getSeatKey(seat.locateRow, seat.locateColumn);
                  const isSelected = selectedSeats.includes(seatKey);

                  return (
                    <button
                      key={seatKey}
                      className={`p-2 border rounded h-[40px] w-[40px] ${
                        seat.status === 1
                          ? "bg-red-500 cursor-not-allowed"
                          : seat.status === 2
                          ? "bg-blue-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                      onClick={() => !seat.status && toggleSeatSelection(seat)}
                      disabled={seat.status === 1 || seat.status === 2}
                    >
                      {seat.locateRow}
                      {seat.locateColumn}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleSubmitSelectSeats}
              className={`p-2  text-white rounded ${
                selectedSeatsID.length === 0
                  ? "bg-blue-200 cursor-not-allowed pointer-events-none select-none"
                  : "bg-blue-500"
              }`}
            >
              Xác nhận
            </button>
            {/* <Link
              to={`/paymentMethod/${showtimeId}`}
              state={{ showtimeId: showtimeId, seatId: selectedSeatsID }}
              className={`p-2  text-white rounded ${
                selectedSeatsID.length === 0
                  ? "bg-blue-200 cursor-not-allowed pointer-events-none select-none"
                  : "bg-blue-500"
              }`}
            >
              Xác nhận
            </Link> */}
          </div>
        </div>

        <div className="w-1/3 p-4 border rounded flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold">{movie.name}</h2>
            <p className="mt-2">- Thời gian: {movie.duration} phút</p>
          </div>
          <img
            src={movie.image}
            alt={movie.name}
            className="max-h-[200px] w-full object-contain"
          />
          <button className="mt-2 text-blue-500 underline">← Trở lại</button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
