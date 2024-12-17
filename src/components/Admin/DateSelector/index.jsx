import React, { useState } from "react";
import instance from "../../../api/instance";

function DateSelector() {
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tickets, setTickets] = useState([]);

  const fetchRevenueByDate = async () => {
    if (!date) {
      alert("Vui lòng chọn một ngày!");
      return;
    }

    try {
      const res = await instance.get("/revenues/ticket", {
        params: { date },
      });
      setTickets(res.data.result.ticketDetails || []);
      console.log(res.data.result);
      alert(res.data.message);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi lấy dữ liệu.");
    }
  };

  const fetchRevenueByDateRange = async () => {
    try {
      const res = await instance.get("/revenues/ticket/range", {
        params: { startDate, endDate },
      });
      setTickets(res.data.result.ticketDetails || []);
      console.log(res.data.result);
      alert(res.data.message);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi lấy dữ liệu.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thống Kê Doanh Thu</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Thống kê theo khoảng ngày</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={fetchRevenueByDateRange}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Lấy dữ liệu
        </button>
      </div>

      <div className="bg-gray-200 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Kết quả:</h2>
        {tickets.length > 0 ? (
          <ul>
            {tickets.map((ticket, index) => (
              <li key={index} className="border-b py-2 text-blue-950">
                {ticket.movieName} - {ticket.date} - {ticket.totalPrice} VND
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
