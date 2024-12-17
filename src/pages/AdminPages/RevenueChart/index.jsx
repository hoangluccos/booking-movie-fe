import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import instance from "../../../api/instance";

// Tạo danh sách 7 ngày gần nhất
const getLast7Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split("T")[0]); // Format: yyyy-mm-dd
  }

  return days;
};

// Hàm chuyển đổi định dạng ngày từ API
const convertToISODate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`; // Format lại thành yyyy-mm-dd
};

// Kết hợp dữ liệu từ API với các ngày không có hóa đơn
const mapRevenueToLast7Days = (tickets, last7Days) => {
  // Tổng hợp doanh thu theo ngày từ tickets
  const revenueMap = tickets.reduce((acc, ticket) => {
    const isoDate = convertToISODate(ticket.date);
    acc[isoDate] = (acc[isoDate] || 0) + ticket.totalPrice;
    return acc;
  }, {});

  // Ghép với danh sách 7 ngày gần nhất
  return last7Days.map((date) => ({
    date,
    total: revenueMap[date] || 0, // Giá trị mặc định là 0 nếu không có dữ liệu
  }));
};

const RevenueChart = () => {
  const [data, setData] = useState([]);

  // Fetch dữ liệu từ API
  const fetchRevenueByDateRange = async () => {
    const last7Days = getLast7Days();
    const startDate = last7Days[0];
    const endDate = last7Days[last7Days.length - 1];

    try {
      const res = await instance.get("/revenues/ticket/range", {
        params: { startDate, endDate },
      });

      const ticketDetails = res.data.result.ticketDetails || [];
      const formattedData = mapRevenueToLast7Days(ticketDetails, last7Days);

      setData(formattedData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchRevenueByDateRange();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#10b981" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
