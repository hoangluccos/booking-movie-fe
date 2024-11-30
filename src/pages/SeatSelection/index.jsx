import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import instance from "../../api/instance";

const SeatSelection = () => {
  const param = useParams();
  const showtimeId = param.id;
  const location = useLocation();
  const movieID = location.state;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatsID, setSelectedSeatsID] = useState([]);
  const [seats, setSeats] = useState([]);
  const [movie, setMovie] = useState({});

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
                        isSelected ? "bg-green-500" : "bg-gray-300"
                      } ${seat.status ? "bg-red-500 cursor-not-allowed" : ""}`}
                      onClick={() => !seat.status && toggleSeatSelection(seat)}
                      disabled={seat.status}
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
            <Link
              to={`/paymentMethod/${showtimeId}`}
              state={{ showtimeId: showtimeId, seatId: selectedSeatsID }}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Xác nhận
            </Link>
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
