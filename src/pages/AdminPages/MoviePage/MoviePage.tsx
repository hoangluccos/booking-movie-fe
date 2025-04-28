import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../Data/Data.tsx";
import { getAllMovies } from "../../../redux/slices/movieSlice.tsx";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store.tsx";

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
  }, [dispatch]);

  const filteredData = listMovie.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / moviesPerPage);

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = filteredData.slice(startIndex, endIndex);

  const showMovieCus = (
    item: MovieType,
    isLastRow: boolean,
    index: number,
    onEdit: (index: number) => void,
    onDelete: (index: number) => void
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
        <div className="flex justify-center items-center p-2">{item.name}</div>
        <div className="flex items-center p-2 truncate" title={item.content}>
          {item.content}
        </div>
        <div className="flex justify-center items-center p-2">
          {item.premiere}
        </div>
        <div className="flex justify-center items-center p-2">
          {item.duration} phút
        </div>
        <div className="flex justify-center items-center p-2">
          {item.language}
        </div>
        <div className="flex justify-center items-center p-2">{item.rate}</div>
        <div
          className={`flex justify-center items-center p-2 ${
            isLastRow ? "rounded-br-xl" : ""
          }`}
        >
          {item.genres.map((g) => g.name).join(", ")}
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => onEdit(index)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-l-lg border-r border-[#979797]"
          >
            <FaRegEdit />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="bg-[#323D4E] h-[32px] px-4 py-2 rounded-r-lg"
          >
            <FaRegTrashCan color="red" />
          </button>
        </div>
      </div>
    );
  };

  const handleEditMovie = (index: number): void => {
    navigate(`/admin/movies/edit/${currentMovies[index].id}`);
  };

  const handleDeleteMovie = (index: number): void => {
    console.log("Delete: ", currentMovies[index].name);
    // TODO: Thêm logic xoá phim Redux nếu cần
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="relative min-h-[750px]">
      {/* Title Page */}
      <div className="flex-row flex justify-between items-center">
        <span className="text-white text-3xl">Movies</span>
        <div className="flex items-center space-x-4">
          <div className="flex-row flex items-center bg-[#323D4E] px-4 rounded-full space-x-2">
            <IoIosSearch size={20} color="gray" />
            <input
              className="bg-[#323D4E] w-[253px] h-[38px] focus:outline-none text-white placeholder-gray-400"
              type="text"
              placeholder="Tìm kiếm theo tên"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={() => navigate("/admin/movies/create")}
            className="w-[147px] h-[48px] bg-[#4379EE] rounded-lg"
          >
            <span className="text-white">Thêm phim mới</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="pt-8">
        {/* Title Table */}
        <div className="grid grid-cols-9">
          {[
            "Hình ảnh",
            "Tên",
            "Nội dung",
            "Ngày khởi chiếu",
            "Thời lượng",
            "Ngôn ngữ",
            "Đánh giá",
            "Thể loại",
            "Hành động",
          ].map((title, idx) => (
            <div
              key={idx}
              className={`bg-[#313D4F] text-white h-[48px] flex justify-center items-center p-4 w-full ${
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
        <span className="text-white">
          Hiển thị {Math.min(startIndex + 1, totalItems)}-
          {Math.min(endIndex, totalItems)} của {totalItems}
        </span>
        <div className="flex items-center space-x-4">
          <span className="text-white">
            Trang {currentPage} / {totalPages}
          </span>
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
  );
};

export default MoviePage;
