import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { checkShowtime } from "../../../redux/slices/ShowtimeSlice.tsx";
import { ShowTimeCheckType } from "../Data/Data";

function CheckShowtimePage() {
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, checkShowtimeInfo } = useAppSelector(
    (state) => state.showtime
  );

  useEffect(() => {
    if (param.id) {
      dispatch(checkShowtime({ showtimeId: param.id }));
    }
  }, [dispatch, param.id]);

  const sortedSeats = useMemo(() => {
    if (!checkShowtimeInfo) return [];
    return [...checkShowtimeInfo.seats].sort((a, b) => {
      if (a.locateRow < b.locateRow) return -1;
      if (a.locateRow > b.locateRow) return 1;
      return a.locateColumn - b.locateColumn;
    });
  }, [checkShowtimeInfo]);

  if (isLoading || checkShowtimeInfo === null) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    );
  }

  const { date, startTime, endTime, totalSeat, emptySeat, bookedSeat } =
    checkShowtimeInfo as ShowTimeCheckType;
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const columns = [1, 2, 3, 4, 5];

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suất chiếu
      </h1>

      <div className="text-center mb-6 flex flex-row">
        <p className="text-lg">
          Ngày: <span className="font-semibold">{date}</span>
        </p>
        <p className="text-lg">
          Giờ bắt đầu: <span className="font-semibold">{startTime}</span>
        </p>
        <p className="text-lg">
          Giờ kết thúc: <span className="font-semibold">{endTime}</span>
        </p>
        <p className="text-lg">
          Tổng số ghế: <span className="font-semibold">{totalSeat}</span>
        </p>
        <p className="text-lg">
          Ghế đã đặt: <span className="font-semibold">{bookedSeat}</span>
        </p>
        <p className="text-lg">
          Ghế trống: <span className="font-semibold">{emptySeat}</span>
        </p>
      </div>
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Sơ đồ ghế
      </h2>
      <div className="grid gap-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center">
            <div className="w-10 font-bold text-gray-700">{row}</div>
            <div className="grid grid-cols-5 gap-2 flex-1">
              {columns.map((col) => {
                const seat = sortedSeats.find(
                  (s) => s.locateRow === row && s.locateColumn === col
                );
                const isBooked = seat ? seat.isBooked : false;
                return (
                  <div
                    key={`${row}${col}`}
                    className={`w-12 h-12 flex items-center justify-center rounded-md text-white font-semibold cursor-pointer ${
                      isBooked ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {`${row}${col}`}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckShowtimePage;
