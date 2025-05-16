import { Button, ConfigProvider, Popconfirm, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ShowimeType } from "../Data/Data";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../redux/Store/Store.tsx";
import {
  deleteShowtime,
  getAllShowtimes,
} from "../../../redux/Slices/ShowtimeSlice.tsx";
import { toast } from "react-toastify";

const ShowtimePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isLoading, listShowtimes } = useAppSelector(
    (state) => state.showtime
  );

  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 4;

  useEffect(() => {
    dispatch(getAllShowtimes());
  }, [dispatch]);

  const totalItems = listShowtimes.length;
  const totalPages = Math.ceil(totalItems / moviesPerPage);

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentShowtimes = listShowtimes.slice(startIndex, endIndex);

  const showShowtimeCus = (
    item: ShowimeType,
    isLastRow: boolean,
    index: number,
    onEdit: (item: ShowimeType) => void,
    onDelete: (item: ShowimeType) => void
  ) => {
    return (
      <div
        className={`grid grid-cols-7 bg-[#273142] text-white ${
          isLastRow ? "rounded-b-xl" : "border-b border-[#979797]"
        }`}
      >
        <div className="flex justify-center items-center p-2">
          <img
            src={item.movie.image}
            alt={item.id}
            className="w-20 h-32 rounded object-cover"
          />
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.movie.name}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.date}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
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
                <span className="font-saira text-sm">
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
  };

  const handleClickEditShowtime = (item: ShowimeType) => {
    navigate(`/admin/showtimes/edit/${item.id}`);
  };

  const handleClickDeleteShowtime = async (item: ShowimeType) => {
    dispatch(deleteShowtime({ showtimeId: item.id }));
    toast.success("Showtime deleted successfully!");
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tooltip: {
            colorBgSpotlight: "#1F2937", // Màu nền tối
            colorTextLightSolid: "#FFFFFF", // Màu chữ
            borderRadius: 6,
            fontSize: 13,
            padding: 8,
            fontFamily: "Saira, sans-serif", // Add font-family for Tooltip
          },
          Popconfirm: {
            fontFamily: "Saira, sans-serif", // Add font-family for Popconfirm
          },
        },
      }}
    >
      <div className="relative min-h-[750px]">
        {/* Title Page */}
        <div className="flex-row flex justify-between items-center">
          <span className="text-white text-3xl font-saira">Showtimes</span>
          <div className="flex items-center space-x-4">
            <Button
              type="primary"
              className="w-[147px] h-[48px] rounded-lg font-saira"
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                padding: "8px 48px",
                borderRadius: "8px",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onClick={() => navigate("/admin/showtimes/create")}
            >
              Add New Showtime
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="pt-8">
          {/* Title Table */}
          <div className="grid grid-cols-7">
            {["Image", "Name", "Date", "Time", "Theater", "Room", "Action"].map(
              (title, idx) => (
                <div
                  key={idx}
                  className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                    idx === 0 ? "rounded-tl-xl" : ""
                  } ${idx === 6 ? "rounded-tr-xl" : ""}`}
                >
                  {title}
                </div>
              )
            )}
          </div>

          {/* Content Table */}
          <div className="min-h-[448px]">
            {currentShowtimes.length > 0 ? (
              currentShowtimes.map((item, index) => (
                <div key={item.id}>
                  {showShowtimeCus(
                    item,
                    index === currentShowtimes.length - 1,
                    index,
                    handleClickEditShowtime,
                    handleClickDeleteShowtime
                  )}
                </div>
              ))
            ) : (
              <div className="text-white text-center py-4">No movies found</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center pt-8 space-x-4">
          <span className="text-white font-saira">
            Showing {Math.min(startIndex + 1, totalItems)}-
            {Math.min(endIndex, totalItems)} of {totalItems}
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797] ${
                  currentPage === 1 ? "opacity-50" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FaAngleLeft color="white" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg ${
                  currentPage === totalPages ? "opacity-50" : ""
                }`}
                disabled={currentPage === totalPages}
              >
                <FaAngleRight color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ShowtimePage;
