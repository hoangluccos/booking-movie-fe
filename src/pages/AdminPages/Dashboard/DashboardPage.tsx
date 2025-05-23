import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "../../../redux/Slices/UserSlice.tsx";
import { FaUserFriends } from "react-icons/fa";
import StatisticComponent from "./StatisticComponent.tsx";
import { getAllMovies } from "../../../redux/Slices/MovieSlice.tsx";
import { MdMovieFilter } from "react-icons/md";
import { getAllInvoices } from "../../../redux/Slices/InvoiceSlice.tsx";
import { FaDongSign } from "react-icons/fa6";
import { getAllShowtimes } from "../../../redux/Slices/ShowtimeSlice.tsx";
import { BiSolidSlideshow } from "react-icons/bi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { ConfigProvider, Cascader } from "antd";

// Utility function to get the number of days in a month
const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

// Define monthNames outside the component
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ChartData {
  dayOrMonth: string;
  amount: number;
}

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { listUser } = useAppSelector((state) => state.user);
  const { listMovie } = useAppSelector((state) => state.movie);
  const { listInvoices } = useAppSelector((state) => state.invoice);
  const { listShowtimes } = useAppSelector((state) => state.showtime);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(getAllUsers()),
          dispatch(getAllMovies()),
          dispatch(getAllInvoices()),
          dispatch(getAllShowtimes()),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const totalRevenue =
    listInvoices?.reduce(
      (sum, invoice) =>
        sum + (typeof invoice.amount === "number" ? invoice.amount : 0),
      0
    ) ?? 0;

  const getUniqueYearsAndMonths = useMemo(() => {
    const years: string[] = Array.from(
      new Set(listInvoices?.map((invoice) => invoice.date?.split("-")[2]) || [])
    ).sort((a, b) => parseInt(a) - parseInt(b));

    const allMonths = [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ];

    const options = years.map((year) => ({
      value: year,
      label: year,
      children: allMonths,
    }));

    return options;
  }, [listInvoices]);

  const safeSelectedYearMonth = Array.isArray(selectedYearMonth)
    ? selectedYearMonth
    : [];
  const [year, month] =
    safeSelectedYearMonth.length > 0 ? safeSelectedYearMonth : [];

  const processedChartData: ChartData[] = useMemo(() => {
    let labels: string[];

    if (month && year) {
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);
      const daysInMonth = getDaysInMonth(monthNumber, yearNumber);
      labels = Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString()
      );
    } else if (year && !month) {
      labels = monthNames;
    } else {
      labels = Array.from(
        new Set(
          listInvoices?.map((invoice) => invoice.date?.split("-")[2]) || []
        )
      ).sort((a, b) => parseInt(a) - parseInt(b));
    }

    const dailyOrMonthlyData: { [key: string]: ChartData } = labels.reduce(
      (acc, label) => {
        acc[label] = { dayOrMonth: label, amount: 0 };
        return acc;
      },
      {} as { [key: string]: ChartData }
    );

    const filtered =
      listInvoices?.filter((invoice) => {
        if (!invoice || !invoice.date) return false;
        const [d, m, y] = invoice.date.split("-");
        const matchYear = year ? y === year : true;
        const matchMonth = month ? m === month : true;
        return matchYear && matchMonth;
      }) ?? [];

    filtered.forEach((invoice) => {
      if (!invoice) return;
      const [day, monthStr, yearStr] = invoice.date.split("-");
      const value = typeof invoice.amount === "number" ? invoice.amount : 0;

      if (month && year && yearStr === year && monthStr === month) {
        const normalizedDay = parseInt(day, 10).toString();
        const monthNumber = parseInt(month, 10);
        const yearNumber = parseInt(year, 10);
        const daysInMonth = getDaysInMonth(monthNumber, yearNumber);

        if (
          normalizedDay &&
          parseInt(normalizedDay, 10) >= 1 &&
          parseInt(normalizedDay, 10) <= daysInMonth &&
          dailyOrMonthlyData[normalizedDay]
        ) {
          dailyOrMonthlyData[normalizedDay].amount += value;
        }
      } else if (year && !month && yearStr === year) {
        const monthIndex = parseInt(monthStr, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          dailyOrMonthlyData[monthNames[monthIndex]].amount += value;
        }
      } else if (!year) {
        dailyOrMonthlyData[yearStr].amount += value;
      }
    });

    return Object.values(dailyOrMonthlyData);
  }, [listInvoices, selectedYearMonth, year, month]);

  const chartData = {
    labels: processedChartData.map((d) => d.dayOrMonth),
    datasets: [
      {
        label: "Revenue",
        data: processedChartData.map((d) => d.amount),
        borderColor: "#3DA9FC",
        backgroundColor: "#3DA9FC",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3DA9FC",
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            family: "Saira",
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Revenue: $${context.parsed.y?.toLocaleString("en-US") || 0}`,
          title: (context) =>
            context?.[0]?.label ? `Day/Month: ${context[0].label}` : "",
        },
        backgroundColor: "#1F2A44",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            family: "Saira",
            size: 12,
          },
        },
        grid: {
          color: "#444",
        },
        border: {
          color: "#ffffff",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          font: {
            family: "Saira",
            size: 12,
          },
        },
        grid: {
          color: "#444",
        },
        border: {
          color: "#ffffff",
        },
        min: 0,
      },
    },
  };

  const handleCascaderChange = (value: string[]) => {
    setSelectedYearMonth(value || []);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#2D3F5E",
          colorText: "#ffffff",
          colorTextPlaceholder: "#a0a0a0",
          colorBgElevated: "#273142",
          colorBorder: "#2D3F5E", // màu trùng background => như không thấy border
          colorPrimaryBorder: "#2D3F5E",
          colorPrimaryBorderHover: "#2D3F5E",
          fontFamily: "Saira",
          controlHeight: 40,
        },
        components: {
          Cascader: {
            colorText: "#ffffff",
            colorTextPlaceholder: "#a0a0a0",
            colorBgContainer: "#2D3F5E",
            controlItemBgHover: "#3A4A6B",
            controlItemBgActive: "#3A4A6B",
            colorBorder: "#2D3F5E",
            colorPrimaryBorder: "#2D3F5E",
            colorPrimaryBorderHover: "#2D3F5E",
            controlHeight: 40,
          },
        },
      }}
    >
      <div className="space-y-6">
        <span className="text-white text-3xl font-saira">Dashboard</span>

        <div className="flex justify-between items-center">
          <StatisticComponent
            total={listUser?.length || 0}
            title="Total Users"
            icon={<FaUserFriends className="text-white text-2xl" />}
            iconBgColor="#7474E1"
            percentageChange={8.5}
            isUp={true}
          />
          <StatisticComponent
            total={listMovie?.length || 0}
            title="Total Movies"
            icon={<MdMovieFilter className="text-white text-2xl" />}
            iconBgColor="#DEAF3E"
            percentageChange={1.3}
            isUp={true}
          />
          <StatisticComponent
            total={totalRevenue}
            title="Total Revenue"
            icon={<FaDongSign className="text-white text-2xl" />}
            iconBgColor="#44BE84"
            isCurrency={true}
            percentageChange={4.3}
            isUp={false}
          />
          <StatisticComponent
            total={listShowtimes?.length || 0}
            title="Total Showtimes"
            icon={<BiSolidSlideshow className="text-white text-2xl" />}
            iconBgColor="#DE8160"
            isCurrency={false}
            percentageChange={1.1}
            isUp={true}
          />
        </div>

        <div className="bg-[#273142] p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white text-xl font-saira font-semibold">
              Revenue by {month && year ? "Day" : year ? "Month" : "Year"} (
              {month && year
                ? `${monthNames[parseInt(month) - 1]} ${year}`
                : year
                ? year
                : "All Years"}
              )
            </span>
            <Cascader
              options={getUniqueYearsAndMonths}
              onChange={handleCascaderChange}
              value={selectedYearMonth}
              placeholder="Select Year and Month"
              className="bg-[#2D3F5E] text-white rounded-lg px-3 py-2 font-saira focus:outline-none w-64"
              changeOnSelect
              allowClear
            />
          </div>
          {isLoading ? (
            <div className="text-white text-center text-lg font-saira">
              Loading...
            </div>
          ) : chartData.datasets[0].data.some((d) => d > 0) ? (
            <div style={{ height: 300 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-white text-center text-lg font-saira">
              No revenue data for selected period
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DashboardPage;
