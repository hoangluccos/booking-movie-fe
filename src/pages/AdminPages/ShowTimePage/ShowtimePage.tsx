import {
  Button,
  ConfigProvider,
  Popconfirm,
  Tooltip,
  DatePicker,
  Popover,
  Empty,
  Skeleton,
} from "antd";
import { useEffect, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaRegEdit,
  FaFilter,
  FaAngleDown,
} from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { ShowtimeType } from "../Data/Data.tsx";
import {
  deleteShowtime,
  getAllShowtimes,
} from "../../../redux/slices/ShowtimeSlice.tsx";
import { toast } from "react-toastify";

const ShowtimePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { listShowtimes, isLoading } = useAppSelector(
    (state) => state.showtime
  );
  const [currentPage, setCurrentPage] = useState(1);

  interface Filters {
    movie: string[];
    theater: string[];
    date: string;
  }

  const [filters, setFilters] = useState<Filters>({
    movie: [],
    theater: [],
    date: "",
  });
  const [tempFilters, setTempFilters] = useState<Filters>({
    movie: [],
    theater: [],
    date: "",
  });

  const [moviePopoverOpen, setMoviePopoverOpen] = useState(false);
  const [theaterPopoverOpen, setTheaterPopoverOpen] = useState(false);

  const moviesPerPage = 4;

  const movieOptions = Array.from(
    new Set(listShowtimes.map((item) => item.movie.name))
  ).map((name) => ({
    label: name,
    value: name,
  }));

  const theaterOptions = Array.from(
    new Set(listShowtimes.map((item) => item.theater.name))
  ).map((name) => ({
    label: name,
    value: name,
  }));

  useEffect(() => {
    dispatch(getAllShowtimes());
  }, [dispatch]);

  const filteredShowtimes = listShowtimes.filter((item) => {
    const matchMovie =
      !filters.movie.length || filters.movie.includes(item.movie.name);
    const matchTheater =
      !filters.theater.length || filters.theater.includes(item.theater.name);
    const matchDate = !filters.date || item.date === filters.date;
    return matchMovie && matchTheater && matchDate;
  });

  const totalItems = filteredShowtimes.length;
  const totalPages = Math.ceil(totalItems / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentShowtimes = filteredShowtimes.slice(startIndex, endIndex);

  const handleClickEditShowtime = (item: ShowtimeType) => {
    navigate(`/admin/showtimes/edit/${item.id}`);
  };

  const handleClickDeleteShowtime = async (item: ShowtimeType) => {
    dispatch(deleteShowtime({ showtimeId: item.id }));
    toast.success("Showtime deleted successfully!");
  };

  const resetFilters = () => {
    setFilters({ movie: [], theater: [], date: "" });
    setTempFilters({ movie: [], theater: [], date: "" });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setMoviePopoverOpen(false);
    setTheaterPopoverOpen(false);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format("DD-MM-YYYY") : "";
    setTempFilters((prev) => ({ ...prev, date: formattedDate }));
    setFilters((prev) => ({ ...prev, date: formattedDate }));
    setCurrentPage(1);
  };

  const showShowtimeCus = (
    item: ShowtimeType,
    isLastRow: boolean,
    onEdit: (item: ShowtimeType) => void,
    onDelete: (item: ShowtimeType) => void
  ) => (
    <div
      className={`grid grid-cols-7 bg-[#273142] text-white min-h-[136px] ${
        isLastRow ? "rounded-b-xl" : "border-b border-[#979797]"
      }`}
    >
      <div className="flex justify-center items-center p-2">
        <img
          src={item.movie.image}
          alt={item.id}
          className="w-20 h-[120px] rounded object-cover"
        />
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        <div className="truncate max-w-[150px]">{item.movie.name}</div>
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.date}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.startTime.slice(0, 5) + " - " + item.endTime.slice(0, 5)}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.theater.name}
      </div>
      <div className="flex justify-center items-center p-2 font-saira">
        {item.room.name}
      </div>
      <div className="flex justify-center items-center">
        <Tooltip title="Edit">
          <button
            onClick={() => onEdit(item)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797]"
          >
            <FaRegEdit />
          </button>
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title={
              <span className="font-saira text-sm text-white">
                Are you sure to delete this showtime?
              </span>
            }
            onConfirm={() => onDelete(item)}
            onCancel={() => {}}
            okText={<span className="font-saira">Yes</span>}
            cancelText={<span className="font-saira">No</span>}
            okType="danger"
          >
            <button className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg">
              <FaRegTrashCan color="red" />
            </button>
          </Popconfirm>
        </Tooltip>
      </div>
    </div>
  );

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

  const renderSkeleton = () => (
    <div>
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-7 bg-[#273142] text-white min-h-[136px] ${
            idx === 3 ? "rounded-b-xl" : "border-b border-[#979797]"
          }`}
        >
          <div className="flex justify-center items-center">
            <Skeleton.Image
              active
              style={{ width: 80, height: 120, borderRadius: 8 }}
            />
          </div>
          {[...Array(5)].map((_, colIdx) => (
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
                style={{ width: "100%" }}
              />
            </div>
          ))}
          <div
            className={`flex justify-center items-center${
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
            paddingXS: 8,
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
            colorBgElevated: "#323D4E",
            colorText: "#FFFFFF",
            borderRadius: 8,
            colorPrimary: "#ff4d4f",
            colorError: "#ff4d4f",
          },
          Button: {
            colorText: "#FFFFFF",
            colorBgContainer: "#323D4E",
            colorBorder: "transparent",
            borderRadius: 8,
            defaultColor: "#FFFFFF",
            defaultBorderColor: "#3b82f6",
          },
          Empty: {
            colorTextDescription: "#FFFFFF",
            fontFamily: '"Saira Semi Condensed", sans-serif',
          },
        },
      }}
    >
      <div className="relative min-h-[770px]">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <span className="text-white text-3xl font-saira">Showtimes</span>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              type="primary"
              className="w-[147px] h-[48px] rounded-lg font-saira text-white bg-[#3b82f6] hover:!bg-[#2563eb] hover:!border-[#2563eb] transition-colors duration-300"
              style={{
                borderColor: "#3b82f6",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/admin/showtimes/create")}
            >
              Add Showtime
            </Button>
          </div>
        </div>
        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-6 text-white font-saira text-sm">
          <FaFilter size={25} />
          <span className="font-saira">Filter By</span>
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
                : "Movie Name"}
              <FaAngleDown />
            </Button>
          </Popover>
          <DatePicker
            allowClear
            placeholder="Date"
            className="w-[180px] h-[48px] rounded-md font-saira"
            format="DD-MM-YYYY"
            onChange={handleDateChange}
            value={filters.date ? dayjs(filters.date, "DD-MM-YYYY") : null}
            style={{ backgroundColor: "#323D4E" }}
          />
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
        {/* Table Header */}
        <div className="grid grid-cols-7">
          {[
            "Movie Image",
            "Movie Name",
            "Date",
            "Time",
            "Theater",
            "Room",
            "Action",
          ].map((title, idx) => (
            <div
              key={idx}
              className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                idx === 0 ? "rounded-tl-xl" : ""
              } ${idx === 6 ? "rounded-tr-xl" : ""}`}
            >
              {title}
            </div>
          ))}
        </div>
        {/* Content Table */}
        <div className="bg-[#273142] rounded-b-xl">
          {isLoading ? (
            renderSkeleton()
          ) : currentShowtimes.length > 0 ? (
            <>
              {currentShowtimes.map((item, index) => (
                <div key={item.id}>
                  {showShowtimeCus(
                    item,
                    index === currentShowtimes.length - 1,
                    handleClickEditShowtime,
                    handleClickDeleteShowtime
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center min-h-[136px]">
              <Empty
                description={
                  <span className="text-white font-saira">
                    No showtimes found
                  </span>
                }
              />
            </div>
          )}
        </div>
        {/* Pagination */}
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

export default ShowtimePage;
