import React, { useEffect, useState } from "react";
import StatsCard from "../../../components/Admin/StatsCard";
import DateSelector from "../../../components/Admin/DateSelector";
import instance from "../../../api/instance";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [date, setDate] = useState("");
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [profit, setProfit] = useState(0);

  console.log(users);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dữ liệu từ ba API
        const [usersRes, moviesRes, profitRes] = await Promise.all([
          instance.get("/users/"),
          instance.get("/movies/"),
          instance.get("/revenues/ticket/all"),
        ]);

        // Xử lý dữ liệu users
        const allUsers = usersRes.data.result;
        const usersWithRoleUser = allUsers.filter((user) =>
          user.roles.some((role) => role.name === "USER")
        );
        setUsers(usersWithRoleUser);

        setMovies(moviesRes.data.result);

        setProfit(profitRes.data.result.amount);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const totalUsers = users.length;
  const totalMovies = movies.length;
  const totalRevenue = profit;

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setTickets([
      { id: 1, name: "Ticket 1", date: selectedDate },
      { id: 2, name: "Ticket 2", date: selectedDate },
    ]);
  };

  return (
    <div className="p-6">
      <h2 className="text-[40px] font-bold">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatsCard title="Tổng User" value={totalUsers} color="bg-red-400" />
        <StatsCard title="Tổng Phim" value={totalMovies} color="bg-green-400" />
        <StatsCard
          title="Tổng Doanh Thu"
          value={`${totalRevenue} VND`}
          color="bg-blue-400"
        />
      </div>
      <DateSelector
        date={date}
        onDateChange={handleDateChange}
        tickets={tickets}
      />
    </div>
  );
}

export default Dashboard;
