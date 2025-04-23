import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import instance from "../../api/instance";
import { Link, useParams } from "react-router-dom";

Modal.setAppElement("#root");

const TicketModal = ({ isOpen, onRequestClose }) => {
  const param = useParams();
  const movieId = param.id;
  console.log(movieId);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("Hồ Chí Minh");
  const [showtimes, setShowtimes] = useState([]);

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const locations = ["Hồ Chí Minh", "Hà Nội", "Cần Thơ"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDateSelect = async (index) => {
    setSelectedDate(index);

    const selectedDateValue = days[index];
    const formattedDate = selectedDateValue.toISOString().split("T")[0]; // Format YYYY-MM-DD
    const request = {
      movieId,
      date: formattedDate,
      location: selectedLocation,
    };

    try {
      const response = await instance.post("/showtimes/all", request);
      console.log("list showtime by movies: ", response.data.result);
      setShowtimes(response.data.result);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      setShowtimes([]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-ticket bg-white p-6 rounded-md w-[75%] mx-auto mt-[140px] overflow-y-auto max-h-[80vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="flex justify-end mb-4">
        <button onClick={onRequestClose} className="text-xl font-bold">
          X
        </button>
      </div>
      <div className="modal-ticket-day grid grid-cols-7 gap-3 mb-4">
        {days.map((date, index) => (
          <button
            key={index}
            className={`p-2 border rounded-md ${
              selectedDate === index ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => handleDateSelect(index)}
          >
            {`${date.getMonth() + 1}/${date.getDate()}`}
          </button>
        ))}
      </div>
      <hr className="border-t-2 border-gray-200 my-4" />
      <div className="flex gap-2 mb-4">
        {locations.map((location) => (
          <button
            key={location}
            className={`p-2 border rounded-md ${
              selectedLocation === location ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setSelectedLocation(location)}
          >
            {location}
          </button>
        ))}
      </div>
      <hr className="border-t-2 border-gray-200 my-4" />
      <div>
        {showtimes.length > 0 ? (
          showtimes.map((showtime, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">
                {showtime.theater.name} - {showtime.theater.location}
              </h3>
              <p className="text-sm text-gray-500">
                Ngày: {showtime.date} | Thời gian: {showtime.startTime} -{" "}
                {showtime.endTime}
              </p>
              <p className="text-sm mb-3">
                Ghế trống: {showtime.emptySeat}/{showtime.totalSeat} | Trạng
                thái: <span className="font-bold">{showtime.status}</span>
              </p>
              <Link
                to={`/showtime/${showtime.id}/seat-selection`}
                state={movieId}
                className="p-2 border rounded-md bg-slate-500 text-white"
                onClick={() => console.log("Selected Showtime:", showtime.id)}
              >
                Đặt vé
              </Link>
              <hr className="border-t-2 border-gray-200 my-4" />
            </div>
          ))
        ) : (
          <p className="text-center text-red-500">Không có suất chiếu nào.</p>
        )}
      </div>
    </Modal>
  );
};

export default TicketModal;
