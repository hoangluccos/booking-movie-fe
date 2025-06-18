import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { useEffect, useMemo, useState } from "react";
import {
  getAllInvoices,
  sortInvoiceByTime,
} from "../../../redux/slices/InvoiceSlice.tsx";
import { InvoiceType } from "../Data/Data";
import dayjs from "dayjs";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Popover,
  Skeleton,
  Tooltip,
  Empty,
  MenuProps,
  Dropdown,
  Space,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaFilter,
} from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import ScanQR from "../ScanQR/ScanQR.jsx";
import { IoScanOutline } from "react-icons/io5";

const InvoicePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { listInvoices, error, isLoading } = useAppSelector(
    (state) => state.invoice
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllInvoices());
  }, [dispatch]);

  useEffect(() => {
    console.log("Invoices from Redux store:", listInvoices);
  }, [listInvoices]);

  interface Filters {
    movie: string[];
    theater: string[];
    startDate: string;
    endDate: string;
  }

  const [filters, setFilters] = useState<Filters>({
    movie: [],
    theater: [],
    startDate: "",
    endDate: "",
  });
  const [tempFilters, setTempFilters] = useState<Filters>({
    movie: [],
    theater: [],
    startDate: "",
    endDate: "",
  });

  const [moviePopoverOpen, setMoviePopoverOpen] = useState(false);
  const [theaterPopoverOpen, setTheaterPopoverOpen] = useState(false);

  const movieOptions = Array.from(
    new Set(listInvoices.map((item) => item.showtime?.movie?.name))
  ).map((name) => ({
    label: name,
    value: name,
  }));

  const theaterOptions = Array.from(
    new Set(listInvoices.map((item) => item.showtime?.theater?.name))
  ).map((name) => ({
    label: name,
    value: name,
  }));

  const filteredInvoice = listInvoices.filter((item) => {
    const matchMovie =
      !filters.movie.length || filters.movie.includes(item.showtime.movie.name);
    const matchTheater =
      !filters.theater.length ||
      filters.theater.includes(item.showtime.theater.name);

    const invoiceDate = dayjs(item.date, "DD-MM-YYYY");
    if (!invoiceDate.isValid()) return false;

    let matchDate = true;
    if (filters.startDate && filters.endDate) {
      const start = dayjs(filters.startDate, "DD-MM-YYYY");
      const end = dayjs(filters.endDate, "DD-MM-YYYY");
      matchDate =
        invoiceDate.isSame(start, "day") ||
        invoiceDate.isSame(end, "day") ||
        (invoiceDate.isAfter(start, "day") && invoiceDate.isBefore(end, "day"));
    } else if (filters.startDate) {
      const start = dayjs(filters.startDate, "DD-MM-YYYY");
      matchDate =
        invoiceDate.isSame(start, "day") || invoiceDate.isAfter(start, "day");
    } else if (filters.endDate) {
      const end = dayjs(filters.endDate, "DD-MM-YYYY");
      matchDate =
        invoiceDate.isSame(end, "day") || invoiceDate.isBefore(end, "day");
    }

    return matchMovie && matchTheater && matchDate;
  });

  const totalAmount = useMemo(() => {
    return filteredInvoice.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredInvoice]);

  useEffect(() => {
    if (filteredInvoice.length === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredInvoice.length, currentPage]);

  const invoicesPerPage = 13;
  const totalItems = filteredInvoice.length;
  const totalPages = Math.ceil(totalItems / invoicesPerPage);
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const endIndex = startIndex + invoicesPerPage;
  const currentShowtimes = filteredInvoice.slice(startIndex, endIndex);

  const resetFilters = () => {
    setFilters({ movie: [], theater: [], startDate: "", endDate: "" });
    setTempFilters({ movie: [], theater: [], startDate: "", endDate: "" });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setMoviePopoverOpen(false);
    setTheaterPopoverOpen(false);
  };

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format("DD-MM-YYYY") : "";
    if (
      filters.endDate &&
      date &&
      date.isAfter(dayjs(filters.endDate, "DD-MM-YYYY"), "day")
    ) {
      console.warn("Start date cannot be after end date");
      return;
    }
    setTempFilters((prev) => ({ ...prev, startDate: formattedDate }));
    setFilters((prev) => ({ ...prev, startDate: formattedDate }));
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format("DD-MM-YYYY") : "";
    if (
      filters.startDate &&
      date &&
      date.isBefore(dayjs(filters.startDate, "DD-MM-YYYY"), "day")
    ) {
      console.warn("End date cannot be before start date");
      return;
    }
    setTempFilters((prev) => ({ ...prev, endDate: formattedDate }));
    setFilters((prev) => ({ ...prev, endDate: formattedDate }));
    setCurrentPage(1);
  };

  const showInvoiceCus = (
    item: InvoiceType,
    isLastRow: boolean,
    onShowDetail: (item: InvoiceType) => void
  ) => (
    <div
      className={`grid grid-cols-8 bg-[#273142] text-white ${
        isLastRow ? "rounded-b-xl" : "border-b border-[#979797]"
      }`}
    >
      <div className="flex justify-center items-center p-2 font-saira">
        <div className="truncate max-w-[150px]">{item.date}</div>
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.time.slice(0, 5)}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.amount.toLocaleString("vi-VN")}đ
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.showtime?.movie.name}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.showtime?.theater.name}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.showtime?.room.name}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.user.firstName} {item.user.lastName}
      </div>
      <div className="flex justify-center items-center">
        <Tooltip title="Show Invoice Detail">
          <button
            onClick={() => onShowDetail(item)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 rounded"
          >
            <BiDetail />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div>
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-8 bg-[#273142] text-white min-h-[48px] ${
            idx === 3 ? "rounded-b-xl" : "border-b border-[#979797]"
          }`}
        >
          {[...Array(7)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="flex justify-center items-center font-saira"
            >
              <Skeleton
                active
                title={{
                  width: colIdx === 0 ? "80%" : "60%",
                }}
                paragraph={false}
                style={{ width: "90%" }}
              />
            </div>
          ))}
          <div
            className={`flex justify-center items-center ${
              idx === 3 ? "rounded-br-xl" : ""
            }`}
          >
            <Skeleton.Button
              active
              size="small"
              style={{ width: 64, height: 32, borderRadius: 8 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
  const [stateFilterTime, setStateFilterTime] = useState<number>(1);
  const handleSortTime = (id: number) => {
    console.log("test");
    dispatch(sortInvoiceByTime(id as 0 | 1));
    console.log("Đã dispatch sortShowtimesByTime với:", id);
    setStateFilterTime(id);
  };
  const items: MenuProps["items"] = [
    {
      label: (
        <button onClick={() => handleSortTime(1)}>Thời gian gần nhất</button>
      ),
      key: "0",
    },
    {
      label: (
        <button onClick={() => handleSortTime(0)}>Thời gian xa nhất</button>
      ),
      key: "1",
    },
  ];
  const renderPaginationInfo = () => {
    if (isLoading) {
      return (
        <Skeleton
          active
          title={{ width: "120px" }}
          paragraph={false}
          style={{ marginTop: 8 }}
        />
      );
    }
    if (totalItems === 0) {
      return <span className="text-white font-saira">Showing 0-0 of 0</span>;
    }
    return (
      <span className="text-white font-saira">
        Showing {Math.min(startIndex + 1, totalItems)}-
        {Math.min(endIndex, totalItems)} of {totalItems}
      </span>
    );
  };

  const renderPaginationButtons = () => {
    if (isLoading) {
      return (
        <div className="flex">
          <Skeleton.Button
            active
            size="small"
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px 0 0 8px",
              marginRight: 1,
            }}
          />
          <Skeleton.Button
            active
            size="small"
            style={{ width: 32, height: 32, borderRadius: "0 8px 8px 0" }}
          />
        </div>
      );
    }
    return (
      <div className="flex">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797] ${
            currentPage === 1 || totalItems === 0 ? "opacity-50" : ""
          }`}
          disabled={currentPage === 1 || totalItems === 0}
        >
          <FaAngleLeft color="white" />
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg ${
            currentPage === totalPages || totalItems === 0 ? "opacity-50" : ""
          }`}
          disabled={currentPage === totalPages || totalItems === 0}
        >
          <FaAngleRight color="white" />
        </button>
      </div>
    );
  };

  const SelectablePopover = (
    options: { label: string; value: string }[],
    selected: string[],
    setSelected: (value: string[]) => void,
    setOpen: (val: boolean) => void,
    type: "movie" | "theater" | "status"
  ) => {
    const title =
      type === "theater"
        ? "Theater"
        : type === "status"
        ? "Order Status"
        : "Movie";

    return (
      <div className="w-[400px] p-4 bg-[#323D4E] rounded-lg text-white font-saira">
        <div className="mb-4 text-lg">Select {title}</div>
        <div className="grid grid-cols-3 gap-2">
          {options.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <div
                key={item.value}
                className={`px-2 py-1 justify-center items-center flex text-center cursor-pointer border rounded text-sm ${
                  isSelected
                    ? "bg-[#4880FF] text-white border-[#4880FF]"
                    : "bg-transparent text-white border-gray-400"
                }`}
                onClick={() => {
                  setSelected(
                    isSelected
                      ? selected.filter((val) => val !== item.value)
                      : [...selected, item.value]
                  );
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mt-3 italic">
          *You can choose multiple {title.toUpperCase()}
        </div>
        <div className="flex justify-center items-center">
          <Button
            type="primary"
            className="mt-4 w-[129px] h-[36px] text-sm"
            onClick={applyFilters}
          >
            Apply Now
          </Button>
        </div>
      </div>
    );
  };

  const onClickShowDetailInvoice = (item: InvoiceType) => {
    navigate(`${item.id}`, { state: item });
  };

  if (error) {
    console.log(error);
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Saira Semi Condensed", sans-serif',
        },
        components: {
          Tooltip: {
            colorBgSpotlight: "#1F2937",
            colorTextLightSolid: "#FFFFFF",
            borderRadius: 6,
            fontSize: 13,
            padding: 8,
          },
          DatePicker: {
            controlHeight: 48,
            colorBgContainer: "#323D4E",
            colorText: "#FFFFFF",
            colorTextPlaceholder: "#FFFFFF",
            colorTextDisabled: "#FFFFFF",
            colorBorder: "transparent",
            borderRadius: 8,
            colorBgElevated: "#323D4E",
            fontSize: 14,
            colorIcon: "#FFFFFF",
          },
          Popover: {
            colorBgElevated: "#323D4E",
            colorText: "#FFFFFF",
            borderRadius: 8,
          },
          Popconfirm: {
            colorBgElevated: "#ffffff",
            colorText: "#000000",
            colorPrimary: "#ff4d4f",
            borderRadius: 8,
          },
          Button: {
            colorText: "#FFFFFF",
            colorBgContainer: "#323D4E",
            colorBorder: "transparent",
            borderRadius: 8,
          },
          Skeleton: {
            color: "#3A4657",
            colorGradientEnd: "#2A3444",
          },
          Empty: {
            colorText: "#FFFFFF",
            colorTextDescription: "#FFFFFF",
          },
        },
      }}
    >
      <div className="relative min-h-[750px] ">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <span className="text-white text-3xl font-saira">Invoices</span>
          <div className="flex flex-wrap gap-2 items-center"></div>
        </div>

        <div className="flex items-center justify-between text-white ">
          <div className="flex items-center gap-4 mb-6 font-saira text-sm max-w-[70%]">
            <FaFilter size={25} />
            <span className="font-saira">Filter By</span>

            <DatePicker
              allowClear
              placeholder="Start Date"
              className="w-[180px] h-[48px] rounded-md font-saira"
              format="DD-MM-YYYY"
              onChange={handleStartDateChange}
              value={
                filters.startDate
                  ? dayjs(filters.startDate, "DD-MM-YYYY")
                  : null
              }
              style={{ backgroundColor: "#323D4E" }}
            />

            <DatePicker
              allowClear
              placeholder="End Date"
              className="w-[180px] h-[48px] rounded-md font-saira"
              format="DD-MM-YYYY"
              onChange={handleEndDateChange}
              value={
                filters.endDate ? dayjs(filters.endDate, "DD-MM-YYYY") : null
              }
              style={{ backgroundColor: "#323D4E" }}
            />

            <Popover
              title={null}
              trigger="click"
              open={moviePopoverOpen}
              onOpenChange={(open) => setMoviePopoverOpen(open)}
              content={SelectablePopover(
                movieOptions,
                tempFilters.movie,
                (val) => setTempFilters((prev) => ({ ...prev, movie: val })),
                setMoviePopoverOpen,
                "movie"
              )}
              placement="bottomLeft"
            >
              <Button
                className="w-[180px] h-[48px] rounded-md font-saira flex items-center justify-between px-3 bg-[#323D4E] text-white"
                style={{ border: "transparent" }}
              >
                {filters.movie.length > 0
                  ? `${filters.movie.length} Movies`
                  : "Movie"}
                <FaAngleDown />
              </Button>
            </Popover>

            <Popover
              title={null}
              trigger="click"
              open={theaterPopoverOpen}
              onOpenChange={(open) => setTheaterPopoverOpen(open)}
              content={SelectablePopover(
                theaterOptions,
                tempFilters.theater,
                (val) => setTempFilters((prev) => ({ ...prev, theater: val })),
                setTheaterPopoverOpen,
                "theater"
              )}
              placement="bottomLeft"
            >
              <Button
                className="w-[180px] h-[48px] rounded-md font-saira flex items-center justify-between px-3 bg-[#323D4E] text-white"
                style={{ border: "transparent" }}
              >
                {filters.theater.length > 0
                  ? `${filters.theater.length} Theaters`
                  : "Theater"}
                <FaAngleDown />
              </Button>
            </Popover>

            <Button
              onClick={resetFilters}
              className="w-[147px] h-[48px] rounded-md font-saira flex items-center px-3 bg-[#323D4E] text-white"
              style={{ border: "transparent" }}
            >
              <span className="text-xl">↺</span> Reset Filter
            </Button>
          </div>

          <span className="font-saira text-3xl mr-8">
            Total : {totalAmount.toLocaleString("vi-VN")}đ
          </span>
        </div>
        {/* bar qrscan and filter */}
        <div className="flex justify-between items-center">
          <div className="">
            <Link className="matching-feature mt-1" to={"/admin/uploadQR"}>
              <p className="text-black font-bold text-xl flex justify-center gap-2 items-center py-2 px-3 transition-colors ease-in-out duration-100 bg-gray-300 rounded-sm border border-black hover:bg-gray-500 hover:text-white">
                <IoScanOutline />
                Scan Ticket
              </p>
            </Link>
            {/*               <Link
                className="matching-feature mt-1 w-[150px] h-[60px]"
                style={{
                  background: `url(${IMG_TICKET})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                }}
                to={"/matching"}
              ></Link> */}
          </div>
          <div className="flex justify-end items-center text-white">
            <p className="text-xl my-0">Filter</p>
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              className="p-4 border-spacing-1 border-white"
            >
              <Space>
                {stateFilterTime === 1 ? "Gần nhất" : "Xa nhất"}
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        </div>
        <div className="grid grid-cols-8">
          {[
            "Date",
            "Time",
            "Amount",
            "Movie",
            "Theater",
            "Room",
            "User",
            "Action",
          ].map((title, idx) => (
            <div
              key={idx}
              className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                idx === 0 ? "rounded-tl-xl" : ""
              } ${idx === 7 ? "rounded-tr-xl" : ""}`}
            >
              {title}
            </div>
          ))}
        </div>

        <div className="min-h-[136px] bg-[#273142] rounded-b-xl">
          {isLoading ? (
            renderSkeleton()
          ) : currentShowtimes.length > 0 ? (
            currentShowtimes.map((item, index) => (
              <div key={item.id}>
                {showInvoiceCus(
                  item,
                  index === currentShowtimes.length - 1,
                  onClickShowDetailInvoice
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center min-h-[136px] rounded-b">
              <Empty
                description={
                  <span className="text-white font-saira">
                    No invoices found
                  </span>
                }
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center pt-4 space-x-4">
          {renderPaginationInfo()}
          <div className="flex items-center space-x-4">
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default InvoicePage;
