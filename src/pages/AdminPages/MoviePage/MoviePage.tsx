import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../Data/Data.tsx";
import {
  deleteMovie,
  getAllMovies,
} from "../../../redux/slices/MovieSlice.tsx";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";
import { Button, ConfigProvider, Popconfirm, Spin, Tooltip } from "antd";
import { toast } from "react-toastify";

const MoviePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { listMovie, isLoading, error } = useAppSelector(
    (state) => state.movie
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 4;

  useEffect(() => {
    console.log("Render Movie Page");
    dispatch(getAllMovies());
    console.log("List movie: ", listMovie);
  }, [dispatch]);

  const filteredData = listMovie.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / moviesPerPage);

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = filteredData.slice(startIndex, endIndex);

  const handleEditMovie = (item: MovieType) => {
    navigate(`/admin/movies/edit/${item.id}`);
  };

  const handleDeleteMovie = async (item: MovieType) => {
    try {
      console.log("Xoá phim: ", item.name);
      await dispatch(deleteMovie(item.id));
      toast.success("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie: ", error);
      toast.error("Failed to delete movie!");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const showMovieCus = (
    item: MovieType,
    isLastRow: boolean,
    index: number,
    onEdit: (item: MovieType) => void,
    onDelete: (item: MovieType) => void
  ) => {
    return (
      <div
        className={`grid grid-cols-9 bg-[#273142] text-white ${
          isLastRow ? "rounded-b-xl" : "border-b border-[#979797]"
        }`}
      >
        <div className="flex justify-center items-center p-2">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-32 rounded object-cover"
          />
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.name}
        </div>
        <div
          className="flex items-center p-2 truncate font-saira"
          title={item.content}
        >
          {item.content}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.premiere}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.duration} phút
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.language}
        </div>
        <div className="flex justify-center items-center p-2 font-saira">
          {item.rate}
        </div>
        <div
          className={`flex justify-center items-center font-saira p-2 ${
            isLastRow ? "rounded-br-xl" : ""
          }`}
        >
          {item.genres.map((g) => g.name).join(", ")}
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
                  Are you sure to delete this movie?
                </span>
              }
              description={
                <span className="font-saira text-sm">
                  {`Movie: "${item.name}"`}
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

  if (error) return <div className="text-red-500">Error: {error}</div>;

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
          <span className="text-white text-3xl font-saira">Movies</span>
          <div className="flex items-center space-x-4">
            <div className="flex-row flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
              <IoIosSearch size={20} color="gray" />
              <input
                className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400 font-saira"
                type="text"
                placeholder="Search movie name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
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
              onClick={() => navigate("/admin/movies/create")}
            >
              Add New Movie
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="pt-8">
          {/* Title Table */}
          <div className="grid grid-cols-9">
            {[
              "Image",
              "Name",
              "Content",
              "Premiere Day",
              "Duration",
              "Language",
              "Rate",
              "Genres",
              "Action",
            ].map((title, idx) => (
              <div
                key={idx}
                className={`bg-[#313D4F] font-saira text-white h-[48px] flex justify-center items-center p-4 w-full ${
                  idx === 0 ? "rounded-tl-xl" : ""
                } ${idx === 8 ? "rounded-tr-xl" : ""}`}
              >
                {title}
              </div>
            ))}
          </div>

          {/* Content Table */}
          <div className="min-h-[448px]">
            {currentMovies.length > 0 ? (
              currentMovies.map((item, index) => (
                <div key={item.id}>
                  {showMovieCus(
                    item,
                    index === currentMovies.length - 1,
                    index,
                    handleEditMovie,
                    handleDeleteMovie
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

export default MoviePage;
